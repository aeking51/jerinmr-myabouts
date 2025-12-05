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
    console.log(`Checking SSL for: ${cleanHostname}`);

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
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter for the most recent, non-expired certificate
    const now = new Date();
    const validCerts = certificates
      .filter((cert: any) => {
        const notAfter = new Date(cert.not_after);
        return notAfter > now;
      })
      .sort((a: any, b: any) => {
        return new Date(b.not_after).getTime() - new Date(a.not_after).getTime();
      });

    // Get the certificate with the latest expiry (most likely the current one)
    const latestCert = validCerts[0] || certificates[0];
    
    if (!latestCert) {
      return new Response(
        JSON.stringify({ error: 'No valid certificates found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('SSL check error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to check SSL certificate',
        details: 'Could not retrieve certificate information. The domain may not have a valid SSL certificate.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});