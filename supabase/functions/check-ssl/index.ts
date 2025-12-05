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

    // Clean hostname
    const cleanHostname = hostname.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

    // Connect via TLS to get certificate info
    const conn = await Deno.connectTls({
      hostname: cleanHostname,
      port: 443,
    });

    const cert = conn.peerCertificate;
    conn.close();

    if (!cert) {
      return new Response(
        JSON.stringify({ error: 'Could not retrieve certificate' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse certificate dates
    const notBefore = cert.notBefore ? new Date(cert.notBefore) : null;
    const notAfter = cert.notAfter ? new Date(cert.notAfter) : null;
    const now = new Date();

    // Calculate days until expiry
    const daysUntilExpiry = notAfter 
      ? Math.floor((notAfter.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    // Determine status
    let status = 'valid';
    if (daysUntilExpiry !== null) {
      if (daysUntilExpiry < 0) status = 'expired';
      else if (daysUntilExpiry <= 7) status = 'critical';
      else if (daysUntilExpiry <= 30) status = 'warning';
    }

    return new Response(
      JSON.stringify({
        hostname: cleanHostname,
        issuer: cert.issuer,
        subject: cert.subject,
        validFrom: notBefore?.toISOString(),
        validTo: notAfter?.toISOString(),
        daysUntilExpiry,
        status,
        serialNumber: cert.serialNumber,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('SSL check error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to check SSL certificate',
        details: 'The site may not support HTTPS or is unreachable'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});