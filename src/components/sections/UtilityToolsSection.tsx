import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hash, FileCode, Code2, Copy, Info, Globe, Loader2, CheckCircle, XCircle, Clock, Shield, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface WebsiteStatus {
  url: string;
  isOnline: boolean;
  statusCode: number | null;
  statusText: string;
  responseTime: number;
  contentType: string | null;
  server: string | null;
  contentLength: string | null;
  redirected: boolean;
  finalUrl: string;
  timestamp: string;
}

export function UtilityToolsSection() {
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [hashInput, setHashInput] = useState('');
  const [hashOutputs, setHashOutputs] = useState<any>(null);
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [websiteStatus, setWebsiteStatus] = useState<WebsiteStatus | null>(null);
  const [isCheckingWebsite, setIsCheckingWebsite] = useState(false);
  const [websiteHistory, setWebsiteHistory] = useState<WebsiteStatus[]>([]);
  const handleBase64Encode = () => {
    try {
      const encoded = btoa(base64Input);
      setBase64Output(encoded);
    } catch (error) {
      setBase64Output('Error: Invalid input');
    }
  };

  const handleBase64Decode = () => {
    try {
      const decoded = atob(base64Input);
      setBase64Output(decoded);
    } catch (error) {
      setBase64Output('Error: Invalid base64 string');
    }
  };

  const handleHash = async () => {
    if (!hashInput.trim()) return;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(hashInput);
    
    const hashes: any = {};
    
    try {
      const sha256 = await crypto.subtle.digest('SHA-256', data);
      hashes.sha256 = Array.from(new Uint8Array(sha256))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
        
      const sha512 = await crypto.subtle.digest('SHA-512', data);
      hashes.sha512 = Array.from(new Uint8Array(sha512))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
        
      setHashOutputs(hashes);
    } catch (error) {
      setHashOutputs({ error: 'Hash generation failed' });
    }
  };

  const handleJsonFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonOutput(formatted);
    } catch (error) {
      setJsonOutput('Error: Invalid JSON');
    }
  };

  const handleJsonMinify = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setJsonOutput(minified);
    } catch (error) {
      setJsonOutput('Error: Invalid JSON');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleWebsiteCheck = async () => {
    if (!websiteUrl.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    let urlToCheck = websiteUrl.trim();
    if (!urlToCheck.startsWith('http://') && !urlToCheck.startsWith('https://')) {
      urlToCheck = 'https://' + urlToCheck;
    }

    setIsCheckingWebsite(true);
    const startTime = performance.now();

    try {
      const response = await fetch(urlToCheck, {
        method: 'HEAD',
        mode: 'no-cors',
      });

      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      // With no-cors, we can't read the response, but we know it reached
      const result: WebsiteStatus = {
        url: urlToCheck,
        isOnline: true,
        statusCode: response.type === 'opaque' ? null : response.status,
        statusText: response.type === 'opaque' ? 'Reachable (CORS restricted)' : response.statusText || 'OK',
        responseTime,
        contentType: response.headers.get('content-type'),
        server: response.headers.get('server'),
        contentLength: response.headers.get('content-length'),
        redirected: response.redirected,
        finalUrl: response.url || urlToCheck,
        timestamp: new Date().toLocaleTimeString(),
      };

      setWebsiteStatus(result);
      setWebsiteHistory(prev => [result, ...prev.slice(0, 9)]);
      toast.success('Website check complete!');
    } catch (error) {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      const result: WebsiteStatus = {
        url: urlToCheck,
        isOnline: false,
        statusCode: null,
        statusText: error instanceof Error ? error.message : 'Connection failed',
        responseTime,
        contentType: null,
        server: null,
        contentLength: null,
        redirected: false,
        finalUrl: urlToCheck,
        timestamp: new Date().toLocaleTimeString(),
      };

      setWebsiteStatus(result);
      setWebsiteHistory(prev => [result, ...prev.slice(0, 9)]);
      toast.error('Website appears to be down or unreachable');
    } finally {
      setIsCheckingWebsite(false);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-terminal-green">$ utility_tools</h2>
        <p className="text-terminal-gray">Developer utilities and converters</p>
      </div>

      <Tabs defaultValue="base64" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="base64">Base64</TabsTrigger>
          <TabsTrigger value="hash">Hash</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="website">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="base64" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Base64 Encoder/Decoder
              </CardTitle>
              <CardDescription className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Encode text to Base64 format or decode Base64 strings back to plain text. Useful for data transmission, API authentication, and encoding binary data.</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter text to encode/decode"
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                className="font-mono text-sm min-h-[100px]"
              />
              
              <div className="flex gap-2">
                <Button onClick={handleBase64Encode}>Encode</Button>
                <Button onClick={handleBase64Decode} variant="outline">Decode</Button>
              </div>

              {base64Output && (
                <div className="p-4 rounded border bg-muted">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs text-terminal-gray">Output:</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(base64Output)}
                      className="h-6"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="font-mono text-sm break-all">{base64Output}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hash" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Hash Generator
              </CardTitle>
              <CardDescription className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Generate cryptographic hashes (SHA-256, SHA-512) for text. Useful for password verification, data integrity checks, and creating unique identifiers.</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter text to hash"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                className="font-mono text-sm min-h-[100px]"
              />
              
              <Button onClick={handleHash}>Generate Hashes</Button>

              {hashOutputs && (
                <div className="space-y-3">
                  {hashOutputs.error ? (
                    <div className="text-destructive text-sm">{hashOutputs.error}</div>
                  ) : (
                    <>
                      <div className="p-3 rounded border bg-muted">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs text-terminal-gray">SHA-256:</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(hashOutputs.sha256)}
                            className="h-6"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <div className="font-mono text-xs break-all">{hashOutputs.sha256}</div>
                      </div>
                      <div className="p-3 rounded border bg-muted">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs text-terminal-gray">SHA-512:</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(hashOutputs.sha512)}
                            className="h-6"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <div className="font-mono text-xs break-all">{hashOutputs.sha512}</div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="json" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                JSON Formatter
              </CardTitle>
              <CardDescription className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Format JSON with proper indentation for readability or minify it to reduce size. Validates JSON syntax and displays errors for invalid input.</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter JSON to format or minify"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="font-mono text-sm min-h-[150px]"
              />
              
              <div className="flex gap-2">
                <Button onClick={handleJsonFormat}>Format</Button>
                <Button onClick={handleJsonMinify} variant="outline">Minify</Button>
              </div>

              {jsonOutput && (
                <div className="p-4 rounded border bg-muted">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs text-terminal-gray">Output:</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(jsonOutput)}
                      className="h-6"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <pre className="font-mono text-xs overflow-auto max-h-[300px]">{jsonOutput}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="website" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Website Status Checker
              </CardTitle>
              <CardDescription className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Check if a website is online and get response details including response time, status code, and server information.</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter website URL (e.g., google.com)"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleWebsiteCheck()}
                  className="font-mono text-sm"
                />
                <Button onClick={handleWebsiteCheck} disabled={isCheckingWebsite}>
                  {isCheckingWebsite ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Check'
                  )}
                </Button>
              </div>

              {websiteStatus && (
                <div className="p-4 rounded border bg-muted space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {websiteStatus.isOnline ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                      <span className={`font-semibold ${websiteStatus.isOnline ? 'text-green-500' : 'text-destructive'}`}>
                        {websiteStatus.isOnline ? 'Online' : 'Offline / Unreachable'}
                      </span>
                    </div>
                    <span className="text-xs text-terminal-gray">{websiteStatus.timestamp}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <div className="text-xs text-terminal-gray">URL</div>
                      <div className="font-mono text-xs break-all">{websiteStatus.url}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-terminal-gray flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Response Time
                      </div>
                      <div className={`font-mono text-xs ${
                        websiteStatus.responseTime < 300 ? 'text-green-500' : 
                        websiteStatus.responseTime < 1000 ? 'text-yellow-500' : 'text-destructive'
                      }`}>
                        {websiteStatus.responseTime}ms
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-terminal-gray">Status</div>
                      <div className="font-mono text-xs">
                        {websiteStatus.statusCode ? `${websiteStatus.statusCode} ${websiteStatus.statusText}` : websiteStatus.statusText}
                      </div>
                    </div>

                    {websiteStatus.redirected && (
                      <div className="space-y-1">
                        <div className="text-xs text-terminal-gray flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" /> Redirected To
                        </div>
                        <div className="font-mono text-xs break-all">{websiteStatus.finalUrl}</div>
                      </div>
                    )}

                    {websiteStatus.server && (
                      <div className="space-y-1">
                        <div className="text-xs text-terminal-gray">Server</div>
                        <div className="font-mono text-xs">{websiteStatus.server}</div>
                      </div>
                    )}

                    {websiteStatus.contentType && (
                      <div className="space-y-1">
                        <div className="text-xs text-terminal-gray">Content Type</div>
                        <div className="font-mono text-xs">{websiteStatus.contentType}</div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-terminal-gray">
                      <Shield className="h-3 w-3" />
                      <span>
                        {websiteStatus.url.startsWith('https://') ? 'SSL/TLS Enabled' : 'No SSL (HTTP only)'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {websiteHistory.length > 1 && (
                <div className="space-y-2">
                  <div className="text-xs text-terminal-gray">Recent Checks:</div>
                  <div className="space-y-1 max-h-[150px] overflow-y-auto">
                    {websiteHistory.slice(1).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-secondary text-xs">
                        <div className="flex items-center gap-2">
                          {item.isOnline ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <XCircle className="h-3 w-3 text-destructive" />
                          )}
                          <span className="font-mono truncate max-w-[200px]">{item.url}</span>
                        </div>
                        <div className="flex items-center gap-2 text-terminal-gray">
                          <span>{item.responseTime}ms</span>
                          <span>{item.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}