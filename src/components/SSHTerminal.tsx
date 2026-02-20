import { useState, useEffect, useRef, useCallback } from 'react';
import { ExternalLink, Globe, Terminal, Play, ShieldAlert, Clock, History, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const SSH_SERVICES = [
  { name: 'serFISH', url: 'https://www.serfish.com/console/', description: 'Free browser-based SSH client, no account required' },
  { name: 'Sshwifty', url: 'https://sshwifty-demo.nirui.org/', description: 'Open-source web SSH & Telnet client' },
];

interface SessionRecord {
  id: number;
  service: string;
  startedAt: Date;
  endedAt: Date | null;
  duration: string;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function SSHTerminal() {
  const [selectedService, setSelectedService] = useState(SSH_SERVICES[0]);
  const [showLiveSSH, setShowLiveSSH] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [pendingService, setPendingService] = useState<typeof SSH_SERVICES[0] | null>(null);
  const [showExitWarning, setShowExitWarning] = useState(false);

  // Session timer
  const [elapsed, setElapsed] = useState(0);
  const sessionStartRef = useRef<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Session history
  const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const sessionIdRef = useRef(0);

  const startTimer = useCallback(() => {
    sessionStartRef.current = new Date();
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const endTime = new Date();
    if (sessionStartRef.current) {
      const durationSec = Math.floor((endTime.getTime() - sessionStartRef.current.getTime()) / 1000);
      setSessionHistory((prev) => [
        {
          id: ++sessionIdRef.current,
          service: selectedService.name,
          startedAt: sessionStartRef.current!,
          endedAt: endTime,
          duration: formatDuration(durationSec),
        },
        ...prev,
      ]);
    }
    sessionStartRef.current = null;
    setElapsed(0);
  }, [selectedService.name]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleLaunch = () => {
    setShowLiveSSH(true);
    startTimer();
  };

  const handleServiceSwitch = (svc: typeof SSH_SERVICES[0]) => {
    if (showLiveSSH && svc.name !== selectedService.name) {
      setPendingService(svc);
    } else {
      setSelectedService(svc);
    }
  };

  const confirmSwitch = () => {
    if (pendingService) {
      stopTimer();
      setSelectedService(pendingService);
      setShowLiveSSH(false);
      setAcknowledged(false);
      setPendingService(null);
    }
  };

  const handleExit = () => {
    if (showLiveSSH) {
      setShowExitWarning(true);
    }
  };

  const confirmExit = () => {
    stopTimer();
    setShowLiveSSH(false);
    setAcknowledged(false);
    setShowExitWarning(false);
  };

  const clearHistory = () => {
    setSessionHistory([]);
  };

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-muted px-3 py-2 border-b border-border flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-terminal-green" />
          <span className="text-xs font-mono text-terminal-gray">Web SSH Client</span>
          {showLiveSSH && (
            <Badge variant="outline" className="text-[10px] h-5 px-1.5 gap-1 border-terminal-green/50 text-terminal-green font-mono animate-pulse">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-terminal-green" />
              LIVE — {selectedService.name}
            </Badge>
          )}
          {showLiveSSH && (
            <Badge variant="outline" className="text-[10px] h-5 px-1.5 gap-1 border-terminal-cyan/50 text-terminal-cyan font-mono">
              <Clock className="h-3 w-3" />
              {formatDuration(elapsed)}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showHistory ? 'default' : 'outline'}
            size="sm"
            className="text-xs h-7 gap-1"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="h-3 w-3" />
            History{sessionHistory.length > 0 && ` (${sessionHistory.length})`}
          </Button>
          {SSH_SERVICES.map((svc) => (
            <Button
              key={svc.name}
              variant={selectedService.name === svc.name ? 'default' : 'outline'}
              size="sm"
              className="text-xs h-7"
              onClick={() => handleServiceSwitch(svc)}
            >
              {svc.name}
            </Button>
          ))}
          {showLiveSSH && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={handleExit}
            >
              Exit Session
            </Button>
          )}
          <a
            href={selectedService.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-terminal-cyan hover:underline flex items-center gap-1"
          >
            Open in new tab <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Session History Panel */}
      {showHistory && (
        <div className="border-b border-border bg-muted/30 px-3 py-2 max-h-40 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-terminal-gray flex items-center gap-1">
              <History className="h-3 w-3" /> Session History
            </span>
            {sessionHistory.length > 0 && (
              <Button variant="ghost" size="sm" className="text-xs h-6 gap-1 text-muted-foreground hover:text-destructive" onClick={clearHistory}>
                <Trash2 className="h-3 w-3" /> Clear
              </Button>
            )}
          </div>
          {sessionHistory.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No sessions recorded yet.</p>
          ) : (
            <div className="space-y-1">
              {sessionHistory.map((session) => (
                <div key={session.id} className="flex items-center gap-3 text-xs font-mono py-1 px-2 rounded bg-muted/50 border border-border/50">
                  <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-terminal-cyan/30 text-terminal-cyan">{session.service}</Badge>
                  <span className="text-muted-foreground">{formatTime(session.startedAt)}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-muted-foreground">{session.endedAt ? formatTime(session.endedAt) : '—'}</span>
                  <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-terminal-green/30 text-terminal-green">{session.duration}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!showLiveSSH ? (
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-terminal-green" />
              <h3 className="text-base font-semibold">What is this?</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This connects you to a <strong>third-party web-based SSH client</strong> ({selectedService.name}) loaded in an iframe. 
              You can use it to establish SSH connections to remote servers directly from your browser.
            </p>
          </div>

          <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle className="text-sm font-semibold">Safety &amp; Security Concerns</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed list-disc list-inside">
                <li>Your credentials (username, password, SSH keys) are transmitted through a third-party service — <strong>never enter sensitive production credentials</strong>.</li>
                <li>These services are <strong>not controlled by this website</strong> — use at your own risk.</li>
                <li>Avoid connecting to critical infrastructure from public or shared computers.</li>
                <li>Always verify the SSH host fingerprint before authenticating.</li>
                <li>Use key-based authentication over passwords when possible.</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="rounded-md border border-border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Recommended use:</strong> Learning, testing, or connecting to non-critical / sandbox servers only.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="acknowledge-risks"
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(checked === true)}
              className="mt-0.5"
            />
            <label htmlFor="acknowledge-risks" className="text-sm cursor-pointer select-none leading-snug">
              I understand the risks and accept that my credentials will be handled by a third-party service.
            </label>
          </div>

          <Button
            onClick={handleLaunch}
            disabled={!acknowledged}
            className="flex items-center gap-2 w-full"
          >
            <Play className="h-4 w-4" />
            Launch {selectedService.name}
          </Button>
        </div>
      ) : (
        <iframe
          src={selectedService.url}
          className="w-full h-[500px] border-0"
          title={`${selectedService.name} SSH Client`}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      )}

      {/* Warning when switching services */}
      <AlertDialog open={!!pendingService} onOpenChange={(open) => !open && setPendingService(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch SSH Client?</AlertDialogTitle>
            <AlertDialogDescription>
              Your current SSH session will be terminated. Any active connections will be lost and cannot be recovered. Are you sure you want to switch to {pendingService?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSwitch} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Switch &amp; Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Warning when exiting */}
      <AlertDialog open={showExitWarning} onOpenChange={setShowExitWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit SSH Session?</AlertDialogTitle>
            <AlertDialogDescription>
              Your current SSH session will be terminated. Any active connections and unsaved work will be lost. Are you sure you want to exit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Exit Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
