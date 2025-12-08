import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    console.log(`Fetching headers for: ${targetUrl}`);

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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Fetch headers error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to fetch headers'
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
