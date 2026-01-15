import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory rate limiting
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || (now - record.windowStart) > RATE_LIMIT_WINDOW_MS) {
    // New window
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const resetIn = RATE_LIMIT_WINDOW_MS - (now - record.windowStart);
    return { allowed: false, remaining: 0, resetIn };
  }
  
  record.count++;
  return { 
    allowed: true, 
    remaining: MAX_REQUESTS_PER_WINDOW - record.count,
    resetIn: RATE_LIMIT_WINDOW_MS - (now - record.windowStart)
  };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if ((now - record.windowStart) > RATE_LIMIT_WINDOW_MS * 2) {
      rateLimitMap.delete(ip);
    }
  }
}, 60000);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
  const clientIP = getClientIP(req);
  const rateLimit = checkRateLimit(clientIP);
  
  const rateLimitHeaders = {
    ...corsHeaders,
    'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
    'X-RateLimit-Remaining': rateLimit.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(rateLimit.resetIn / 1000).toString(),
  };
  
  if (!rateLimit.allowed) {
    console.log(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil(rateLimit.resetIn / 1000)
      }),
      { 
        status: 429, 
        headers: { ...rateLimitHeaders, 'Content-Type': 'application/json', 'Retry-After': Math.ceil(rateLimit.resetIn / 1000).toString() }
      }
    );
  }

  try {
    const { hostname } = await req.json();
    
    if (!hostname) {
      return new Response(
        JSON.stringify({ error: 'Hostname is required' }),
        { status: 400, headers: { ...rateLimitHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate hostname format
    const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const cleanHostname = hostname.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
    
    if (!hostnameRegex.test(cleanHostname) || cleanHostname.length > 253) {
      return new Response(
        JSON.stringify({ error: 'Invalid hostname format' }),
        { status: 400, headers: { ...rateLimitHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Checking SSL for: ${cleanHostname} from IP: ${clientIP}`);

    // Use crt.sh API to get certificate information
    const crtShUrl = `https://crt.sh/?q=${encodeURIComponent(cleanHostname)}&output=json`;
    
    const response = await fetch(crtShUrl, {
      headers: {
        'User-Agent': 'SSL-Checker/1.0'
      }
    });

    if (!response.ok) {
      console.error(`crt.sh API error: ${response.status}`);
      throw new Error('Failed to fetch certificate data');
    }

    const certificates = await response.json();
    console.log(`Found ${certificates.length} certificates`);

    if (!certificates || certificates.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No certificates found for this domain' }),
        { status: 400, headers: { ...rateLimitHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter for the most recent, non-expired certificate
    const now = new Date();
    const validCerts = certificates
      .filter((cert: { not_after: string }) => {
        const notAfter = new Date(cert.not_after);
        return notAfter > now;
      })
      .sort((a: { not_after: string }, b: { not_after: string }) => {
        return new Date(b.not_after).getTime() - new Date(a.not_after).getTime();
      });

    // Get the certificate with the latest expiry (most likely the current one)
    const latestCert = validCerts[0] || certificates[0];
    
    if (!latestCert) {
      return new Response(
        JSON.stringify({ error: 'No valid certificates found' }),
        { status: 400, headers: { ...rateLimitHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const notBefore = new Date(latestCert.not_before);
    const notAfter = new Date(latestCert.not_after);
    
    // Calculate days until expiry
    const daysUntilExpiry = Math.floor((notAfter.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Determine status
    let status = 'valid';
    if (daysUntilExpiry < 0) status = 'expired';
    else if (daysUntilExpiry <= 7) status = 'critical';
    else if (daysUntilExpiry <= 30) status = 'warning';

    console.log(`Certificate status: ${status}, expires in ${daysUntilExpiry} days`);

    return new Response(
      JSON.stringify({
        hostname: cleanHostname,
        issuer: latestCert.issuer_name || 'Unknown',
        subject: latestCert.common_name || cleanHostname,
        validFrom: notBefore.toISOString(),
        validTo: notAfter.toISOString(),
        daysUntilExpiry,
        status,
        serialNumber: latestCert.serial_number || 'N/A',
      }),
      { headers: { ...rateLimitHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('SSL check error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to check SSL certificate',
        details: 'Could not retrieve certificate information. The domain may not have a valid SSL certificate.'
      }),
      { status: 500, headers: { ...rateLimitHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
