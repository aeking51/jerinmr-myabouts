import { useState } from 'react';
import { ExternalLink, Globe, Terminal, Play, ShieldAlert } from 'lucide-react';
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

export function SSHTerminal() {
  const [selectedService, setSelectedService] = useState(SSH_SERVICES[0]);
  const [showLiveSSH, setShowLiveSSH] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [pendingService, setPendingService] = useState<typeof SSH_SERVICES[0] | null>(null);
  const [showExitWarning, setShowExitWarning] = useState(false);

  const handleServiceSwitch = (svc: typeof SSH_SERVICES[0]) => {
    if (showLiveSSH && svc.name !== selectedService.name) {
      setPendingService(svc);
    } else {
      setSelectedService(svc);
    }
  };

  const confirmSwitch = () => {
    if (pendingService) {
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
    setShowLiveSSH(false);
    setAcknowledged(false);
    setShowExitWarning(false);
  };

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-muted px-3 py-2 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-terminal-green" />
          <span className="text-xs font-mono text-terminal-gray">Web SSH Client</span>
        </div>
        <div className="flex items-center gap-2">
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
            onClick={() => setShowLiveSSH(true)}
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