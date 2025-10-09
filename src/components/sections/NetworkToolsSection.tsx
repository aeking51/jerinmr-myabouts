import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Globe, Search, Loader2 } from 'lucide-react';

export function NetworkToolsSection() {
  const [pingUrl, setPingUrl] = useState('');
  const [dnsQuery, setDnsQuery] = useState('');
  const [ipLookup, setIpLookup] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [pingResults, setPingResults] = useState<any[]>([]);
  const [dnsResults, setDnsResults] = useState<any>(null);
  const [ipResults, setIpResults] = useState<any>(null);

  const handlePing = async () => {
    if (!pingUrl.trim()) return;
    setLoading('ping');
    const startTime = Date.now();
    
    try {
      const testUrl = pingUrl.startsWith('http') ? pingUrl : `https://${pingUrl}`;
      await fetch(testUrl, { method: 'HEAD', mode: 'no-cors' });
      const endTime = Date.now();
      
      setPingResults(prev => [{
        url: testUrl,
        status: 'success',
        time: endTime - startTime,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 4)]);
    } catch (error) {
      const endTime = Date.now();
      setPingResults(prev => [{
        url: pingUrl.startsWith('http') ? pingUrl : `https://${pingUrl}`,
        status: 'error',
        time: endTime - startTime,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 4)]);
    } finally {
      setLoading(null);
    }
  };

  const handleDnsLookup = async () => {
    if (!dnsQuery.trim()) return;
    setLoading('dns');
    
    try {
      const response = await fetch(`https://dns.google/resolve?name=${dnsQuery}&type=A`);
      const data = await response.json();
      setDnsResults(data);
    } catch (error) {
      setDnsResults({ error: 'DNS lookup failed' });
    } finally {
      setLoading(null);
    }
  };

  const handleIpLookup = async () => {
    const query = ipLookup.trim() || undefined;
    setLoading('ip');
    
    try {
      const url = query ? `https://ipapi.co/${query}/json/` : 'https://ipapi.co/json/';
      const response = await fetch(url);
      const data = await response.json();
      setIpResults(data);
    } catch (error) {
      setIpResults({ error: 'IP lookup failed' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-terminal-green">$ network_tools</h2>
        <p className="text-terminal-gray">Network diagnostics and utilities</p>
      </div>

      <Tabs defaultValue="ping" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ping">Ping</TabsTrigger>
          <TabsTrigger value="dns">DNS Lookup</TabsTrigger>
          <TabsTrigger value="ip">IP Info</TabsTrigger>
        </TabsList>

        <TabsContent value="ping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Ping Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter URL (e.g., google.com)"
                  value={pingUrl}
                  onChange={(e) => setPingUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePing()}
                  disabled={loading === 'ping'}
                />
                <Button onClick={handlePing} disabled={loading === 'ping' || !pingUrl.trim()}>
                  {loading === 'ping' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ping'}
                </Button>
              </div>

              {pingResults.length > 0 && (
                <div className="space-y-2 font-mono text-xs">
                  {pingResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded border ${
                        result.status === 'success'
                          ? 'bg-terminal-green/10 border-terminal-green/30'
                          : 'bg-destructive/10 border-destructive/30'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-terminal-gray">{result.timestamp}</div>
                          <div className="mt-1 break-all">{result.url}</div>
                        </div>
                        <div className="text-right ml-2">
                          <div className={result.status === 'success' ? 'text-terminal-green' : 'text-destructive'}>
                            {result.status === 'success' ? '✓' : '✗'} {result.time}ms
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                DNS Lookup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter domain (e.g., google.com)"
                  value={dnsQuery}
                  onChange={(e) => setDnsQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleDnsLookup()}
                  disabled={loading === 'dns'}
                />
                <Button onClick={handleDnsLookup} disabled={loading === 'dns' || !dnsQuery.trim()}>
                  {loading === 'dns' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Lookup'}
                </Button>
              </div>

              {dnsResults && (
                <div className="p-4 rounded border bg-muted font-mono text-xs space-y-2">
                  {dnsResults.error ? (
                    <div className="text-destructive">{dnsResults.error}</div>
                  ) : (
                    <>
                      <div><span className="text-terminal-gray">Query:</span> {dnsResults.Question?.[0]?.name}</div>
                      {dnsResults.Answer?.map((answer: any, idx: number) => (
                        <div key={idx}>
                          <span className="text-terminal-green">IP:</span> {answer.data}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ip" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                IP Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter IP address (leave empty for your IP)"
                  value={ipLookup}
                  onChange={(e) => setIpLookup(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleIpLookup()}
                  disabled={loading === 'ip'}
                />
                <Button onClick={handleIpLookup} disabled={loading === 'ip'}>
                  {loading === 'ip' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Lookup'}
                </Button>
              </div>

              {ipResults && (
                <div className="p-4 rounded border bg-muted font-mono text-xs space-y-1">
                  {ipResults.error ? (
                    <div className="text-destructive">{ipResults.error}</div>
                  ) : (
                    <>
                      <div><span className="text-terminal-gray">IP:</span> {ipResults.ip}</div>
                      <div><span className="text-terminal-gray">Location:</span> {ipResults.city}, {ipResults.region}, {ipResults.country_name}</div>
                      <div><span className="text-terminal-gray">ISP:</span> {ipResults.org}</div>
                      <div><span className="text-terminal-gray">Timezone:</span> {ipResults.timezone}</div>
                      <div><span className="text-terminal-gray">Coordinates:</span> {ipResults.latitude}, {ipResults.longitude}</div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}