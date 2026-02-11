import { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Wifi, WifiOff, Shield, ExternalLink, Loader2 } from 'lucide-react';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface ConnectionConfig {
  proxyUrl: string;
  host: string;
  port: string;
  username: string;
}

export function LiveSSHTerminal() {
  const [config, setConfig] = useState<ConnectionConfig>({
    proxyUrl: '',
    host: '',
    port: '22',
    username: '',
  });
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [errorMsg, setErrorMsg] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [autoReconnect, setAutoReconnect] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [output, scrollToBottom]);

  useEffect(() => {
    return () => {
      wsRef.current?.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, []);

  const addOutput = useCallback((text: string) => {
    setOutput(prev => [...prev, text]);
  }, []);

  const handleConnect = () => {
    if (!config.proxyUrl.trim()) {
      setErrorMsg('WebSocket proxy URL is required');
      return;
    }

    setStatus('connecting');
    setErrorMsg('');
    setOutput([]);
    addOutput(`Connecting to proxy: ${config.proxyUrl}`);
    if (config.host) addOutput(`Target host: ${config.host}:${config.port}`);
    addOutput(`User: ${config.username || '(not specified)'}`);
    addOutput('---');

    try {
      // Build the WebSocket URL - some proxies accept query params for host info
      let wsUrl = config.proxyUrl.trim();
      const params = new URLSearchParams();
      if (config.host) params.set('hostname', config.host);
      if (config.port && config.port !== '22') params.set('port', config.port);
      if (config.username) params.set('username', config.username);
      
      const separator = wsUrl.includes('?') ? '&' : '?';
      const paramStr = params.toString();
      if (paramStr) wsUrl += separator + paramStr;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('connected');
        addOutput('✓ WebSocket connection established');
        addOutput('You are now connected. Type commands below.');
        inputRef.current?.focus();
      };

      ws.onmessage = (event) => {
        const data = typeof event.data === 'string' ? event.data : '';
        // Split by newlines and add each line
        const lines = data.split('\n');
        lines.forEach(line => {
          if (line) addOutput(line);
        });
      };

      ws.onerror = () => {
        setStatus('error');
        setErrorMsg('WebSocket connection failed. Check that your proxy is running and the URL is correct.');
        addOutput('✗ Connection error');
      };

      ws.onclose = (event) => {
        setStatus('disconnected');
        addOutput(`Connection closed (code: ${event.code})`);
        wsRef.current = null;

        if (autoReconnect && event.code !== 1000) {
          addOutput('Reconnecting in 3 seconds...');
          reconnectTimer.current = setTimeout(handleConnect, 3000);
        }
      };
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to create WebSocket connection');
    }
  };

  const handleDisconnect = () => {
    if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    setAutoReconnect(false);
    wsRef.current?.close(1000, 'User disconnected');
    wsRef.current = null;
    setStatus('disconnected');
    addOutput('Disconnected by user.');
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(input + '\n');
    setInput('');
  };

  const statusColor: Record<ConnectionStatus, string> = {
    disconnected: 'text-muted-foreground',
    connecting: 'text-terminal-amber',
    connected: 'text-terminal-green',
    error: 'text-destructive',
  };

  const statusIcon = status === 'connected' ? (
    <Wifi className="h-3 w-3 text-terminal-green" />
  ) : (
    <WifiOff className="h-3 w-3 text-muted-foreground" />
  );

  return (
    <div className="space-y-4">
      {/* Security info banner */}
      <div className="flex items-start gap-2 p-3 rounded-md border border-border bg-muted/50 text-xs text-muted-foreground">
        <Shield className="h-4 w-4 mt-0.5 flex-shrink-0 text-terminal-amber" />
        <div>
          <p className="font-medium text-foreground mb-1">How it works</p>
          <p>
            Your browser connects to a <strong>WebSocket proxy</strong> (wss://), which forwards traffic to the SSH server. 
            Always use <code className="bg-muted px-1 rounded">wss://</code> (TLS) for security.
          </p>
          <p className="mt-1">
            Compatible proxies:{' '}
            <a href="https://github.com/nicedoc/webssh2" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline inline-flex items-center gap-0.5">
              WebSSH2 <ExternalLink className="h-2.5 w-2.5" />
            </a>
            {', '}
            <a href="https://github.com/nicedoc/wetty" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline inline-flex items-center gap-0.5">
              Wetty <ExternalLink className="h-2.5 w-2.5" />
            </a>
            {', '}
            <a href="https://github.com/nicedoc/ttyd" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline inline-flex items-center gap-0.5">
              ttyd <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </p>
        </div>
      </div>

      {/* Connection form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <Label htmlFor="proxyUrl" className="text-xs">WebSocket Proxy URL *</Label>
          <Input
            id="proxyUrl"
            placeholder="wss://your-proxy.example.com/ssh"
            value={config.proxyUrl}
            onChange={(e) => setConfig(c => ({ ...c, proxyUrl: e.target.value }))}
            disabled={status === 'connected' || status === 'connecting'}
            className="font-mono text-sm mt-1"
          />
        </div>
        <div>
          <Label htmlFor="host" className="text-xs">Host / IP</Label>
          <Input
            id="host"
            placeholder="192.168.1.100"
            value={config.host}
            onChange={(e) => setConfig(c => ({ ...c, host: e.target.value }))}
            disabled={status === 'connected' || status === 'connecting'}
            className="font-mono text-sm mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="port" className="text-xs">Port</Label>
            <Input
              id="port"
              placeholder="22"
              value={config.port}
              onChange={(e) => setConfig(c => ({ ...c, port: e.target.value }))}
              disabled={status === 'connected' || status === 'connecting'}
              className="font-mono text-sm mt-1"
            />
          </div>
          <div>
            <Label htmlFor="username" className="text-xs">Username</Label>
            <Input
              id="username"
              placeholder="root"
              value={config.username}
              onChange={(e) => setConfig(c => ({ ...c, username: e.target.value }))}
              disabled={status === 'connected' || status === 'connecting'}
              className="font-mono text-sm mt-1"
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {status === 'connected' ? (
          <Button variant="destructive" size="sm" onClick={handleDisconnect}>
            Disconnect
          </Button>
        ) : (
          <Button size="sm" onClick={handleConnect} disabled={status === 'connecting'}>
            {status === 'connecting' ? (
              <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Connecting...</>
            ) : (
              'Connect'
            )}
          </Button>
        )}
        <div className="flex items-center gap-1.5 text-xs">
          {statusIcon}
          <span className={statusColor[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto cursor-pointer">
          <input
            type="checkbox"
            checked={autoReconnect}
            onChange={(e) => setAutoReconnect(e.target.checked)}
            className="rounded"
          />
          Auto-reconnect
        </label>
      </div>

      {errorMsg && (
        <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded p-2">
          {errorMsg}
        </div>
      )}

      {/* Terminal output */}
      <div
        className="bg-background border border-border rounded-lg overflow-hidden h-[350px] flex flex-col"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="bg-muted px-3 py-2 border-b border-border flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <div className="w-3 h-3 rounded-full bg-terminal-amber" />
            <div className="w-3 h-3 rounded-full bg-terminal-green" />
          </div>
          <span className="text-xs text-muted-foreground font-mono flex-1 text-center">
            {status === 'connected'
              ? `${config.username || 'user'}@${config.host || 'proxy'} - Live SSH`
              : 'Live SSH - Not Connected'}
          </span>
          {status === 'connected' && (
            <span className="text-xs text-terminal-green">● Live</span>
          )}
        </div>

        <div ref={scrollRef} className="flex-1 overflow-auto p-3 font-mono text-sm">
          {output.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap text-foreground">{line}</div>
          ))}

          {status === 'connected' && (
            <form onSubmit={handleSend} className="flex items-center mt-1">
              <span className="text-terminal-green whitespace-pre">$ </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-foreground font-mono"
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
              <span className="animate-blink text-terminal-green">█</span>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
