import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hash, FileCode, Code2 } from 'lucide-react';

export function UtilityToolsSection() {
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [hashInput, setHashInput] = useState('');
  const [hashOutputs, setHashOutputs] = useState<any>(null);
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-terminal-green">$ utility_tools</h2>
        <p className="text-terminal-gray">Developer utilities and converters</p>
      </div>

      <Tabs defaultValue="base64" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="base64">Base64</TabsTrigger>
          <TabsTrigger value="hash">Hash Generator</TabsTrigger>
          <TabsTrigger value="json">JSON Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="base64" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Base64 Encoder/Decoder
              </CardTitle>
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
                  <div className="text-xs text-terminal-gray mb-1">Output:</div>
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
                        <div className="text-xs text-terminal-gray mb-1">SHA-256:</div>
                        <div className="font-mono text-xs break-all">{hashOutputs.sha256}</div>
                      </div>
                      <div className="p-3 rounded border bg-muted">
                        <div className="text-xs text-terminal-gray mb-1">SHA-512:</div>
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
                  <div className="text-xs text-terminal-gray mb-1">Output:</div>
                  <pre className="font-mono text-xs overflow-auto max-h-[300px]">{jsonOutput}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}