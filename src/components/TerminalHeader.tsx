import { useState, useEffect } from 'react';
import { Terminal, User, Power, Minimize2, Maximize2, X } from 'lucide-react';

interface TerminalHeaderProps {
  onThemeToggle: () => void;
  isLight: boolean;
}

export function TerminalHeader({ onThemeToggle, isLight }: TerminalHeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-between bg-muted border-b border-border p-2 font-mono text-sm">
      <div className="flex items-center gap-2">
        <Terminal className="w-4 h-4 text-terminal-green" />
        <span className="text-terminal-green">guest@jerinmr.tech</span>
        <span className="text-terminal-gray">:</span>
        <span className="text-terminal-cyan">~/portfolio</span>
        <span className="text-terminal-gray">$</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-terminal-gray">
          <User className="w-3 h-3" />
          <span>{time.toLocaleTimeString()}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={onThemeToggle}
            className="p-1 rounded hover:bg-secondary transition-colors"
            title={`Switch to ${isLight ? 'dark' : 'light'} terminal`}
          >
            <Power className="w-3 h-3 text-terminal-amber" />
          </button>
          <button className="p-1 rounded hover:bg-secondary transition-colors">
            <Minimize2 className="w-3 h-3 text-terminal-gray" />
          </button>
          <button className="p-1 rounded hover:bg-secondary transition-colors">
            <Maximize2 className="w-3 h-3 text-terminal-gray" />
          </button>
          <button className="p-1 rounded hover:bg-secondary transition-colors">
            <X className="w-3 h-3 text-terminal-red" />
          </button>
        </div>
      </div>
    </div>
  );
}