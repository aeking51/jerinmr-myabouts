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

    // Validate hostname format (basic validation)
    const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const cleanHostname = hostname.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
    
    if (!hostnameRegex.test(cleanHostname) || cleanHostname.length > 253) {
      return new Response(
        JSON.stringify({ error: 'Invalid hostname format' }),
        { status: 400, headers: { ...rateLimitHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`DNS lookup for: ${cleanHostname} from IP: ${clientIP}`);
    const startTime = performance.now();

    // Use Deno's DNS resolution
    const addresses = await Deno.resolveDns(cleanHostname, "A");
    
    const endTime = performance.now();
    const dnsLookupTime = Math.round(endTime - startTime);

    // Try to get IPv6 addresses too
    let ipv6Addresses: string[] = [];
    try {
      ipv6Addresses = await Deno.resolveDns(cleanHostname, "AAAA");
    } catch {
      // IPv6 might not be available
    }

    // Try to get nameservers
    let nameservers: string[] = [];
    try {
      nameservers = await Deno.resolveDns(cleanHostname, "NS");
    } catch {
      // NS records might not be directly available
    }

    return new Response(
      JSON.stringify({
        hostname: cleanHostname,
        dnsLookupTime,
        ipv4Addresses: addresses,
        ipv6Addresses,
        nameservers,
        resolvedAt: new Date().toISOString(),
      }),
      { headers: { ...rateLimitHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('DNS lookup error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'DNS lookup failed',
        dnsLookupTime: null
      }),
      { status: 400, headers: { ...rateLimitHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
