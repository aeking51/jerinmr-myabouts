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
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...rateLimitHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let targetUrl = url.trim();
    
    // Validate URL length
    if (targetUrl.length > 2048) {
      return new Response(
        JSON.stringify({ error: 'URL too long (max 2048 characters)' }),
        { status: 400, headers: { ...rateLimitHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        { status: 400, headers: { ...rateLimitHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Block internal/private IP ranges to prevent SSRF
    const hostname = parsedUrl.hostname.toLowerCase();
    const blockedPatterns = [
      /^localhost$/,
      /^127\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^0\./,
      /^169\.254\./,
      /^::1$/,
      /^fc00:/,
      /^fe80:/,
    ];
    
    if (blockedPatterns.some(pattern => pattern.test(hostname))) {
      return new Response(
        JSON.stringify({ error: 'Cannot fetch headers for private/internal addresses' }),
        { status: 400, headers: { ...rateLimitHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching headers for: ${targetUrl} from IP: ${clientIP}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(targetUrl, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    // Convert headers to object
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Categorize headers
    const securityHeaders = [
      'strict-transport-security',
      'content-security-policy',
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection',
      'referrer-policy',
      'permissions-policy',
    ];

    const cacheHeaders = [
      'cache-control',
      'expires',
      'etag',
      'last-modified',
      'age',
      'vary',
    ];

    const categorized = {
      security: {} as Record<string, string>,
      cache: {} as Record<string, string>,
      other: {} as Record<string, string>,
    };

    for (const [key, value] of Object.entries(headers)) {
      const lowerKey = key.toLowerCase();
      if (securityHeaders.includes(lowerKey)) {
        categorized.security[key] = value;
      } else if (cacheHeaders.includes(lowerKey)) {
        categorized.cache[key] = value;
      } else {
        categorized.other[key] = value;
      }
    }

    // Calculate security score based on presence of security headers
    const securityScore = Object.keys(categorized.security).length;
    const maxSecurityScore = securityHeaders.length;

    return new Response(
      JSON.stringify({
        url: targetUrl,
        statusCode: response.status,
        statusText: response.statusText,
        headers,
        categorized,
        securityScore,
        maxSecurityScore,
        totalHeaders: Object.keys(headers).length,
      }),
      { headers: { ...rateLimitHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Fetch headers error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to fetch headers'
      }),
      { status: 400, headers: { ...rateLimitHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
