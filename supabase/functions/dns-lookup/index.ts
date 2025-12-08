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
    const { hostname } = await req.json();

    if (!hostname) {
      return new Response(
        JSON.stringify({ error: 'Hostname is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean the hostname
    const cleanHostname = hostname.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('DNS lookup error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'DNS lookup failed',
        dnsLookupTime: null
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
