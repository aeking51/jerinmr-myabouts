import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Loader2 } from 'lucide-react';

interface PingResult {
  url: string;
  status: 'success' | 'error';
  time: number;
  timestamp: string;
}

export function PingSection() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PingResult[]>([]);

  const handlePing = async () => {
    if (!url.trim()) return;

    setLoading(true);
    const startTime = Date.now();
    
    try {
      const testUrl = url.startsWith('http') ? url : `https://${url}`;
      const response = await fetch(testUrl, { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      
      const endTime = Date.now();
      const result: PingResult = {
        url: testUrl,
        status: 'success',
        time: endTime - startTime,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setResults(prev => [result, ...prev.slice(0, 9)]);
    } catch (error) {
      const endTime = Date.now();
      const result: PingResult = {
        url: url.startsWith('http') ? url : `https://${url}`,
        status: 'error',
        time: endTime - startTime,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setResults(prev => [result, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-terminal-green">$ ping_tool</h2>
        <p className="text-terminal-gray">Network connectivity testing tool</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Ping URL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter URL (e.g., google.com or https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePing()}
              disabled={loading}
            />
            <Button 
              onClick={handlePing} 
              disabled={loading || !url.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Pinging...
                </>
              ) : (
                'Ping'
              )}
            </Button>
          </div>

          {results.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2 text-terminal-green">Results:</h3>
              <div className="space-y-2 font-mono text-xs">
                {results.map((result, index) => (
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
                          {result.status === 'success' ? '✓ Success' : '✗ Failed'}
                        </div>
                        <div className="text-terminal-gray">{result.time}ms</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-terminal-gray font-mono space-y-1">
        <p>• Due to CORS restrictions, some sites may show as failed even if they're online</p>
        <p>• Response time includes network latency and CORS overhead</p>
        <p>• This is a browser-based ping, not ICMP ping</p>
      </div>
    </div>
  );
}
