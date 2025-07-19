import { useState, useEffect } from 'react';
import { Terminal, User, Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';

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
    <div className="flex items-center justify-between bg-muted border-b border-border p-2 font-mono text-xs sm:text-sm">
      <div className="flex items-center gap-1 sm:gap-2 overflow-hidden">
        <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-terminal-green flex-shrink-0" />
        <span className="text-terminal-green truncate">guest@jerinmr.myabouts</span>
        <span className="text-terminal-gray hidden sm:inline">:</span>
        <span className="text-terminal-cyan hidden sm:inline">~/portfolio</span>
        <span className="text-terminal-gray hidden sm:inline">$</span>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex items-center gap-2 text-terminal-gray">
          <User className="w-3 h-3" />
          <span>{time.toLocaleTimeString()}</span>
        </div>
        
        <Button
          onClick={onThemeToggle}
          variant="ghost"
          size="sm"
          className="p-1 sm:p-2 text-terminal-gray hover:text-terminal-green h-auto"
        >
          {isLight ? <Sun className="w-3 h-3 sm:w-4 sm:h-4" /> : <Moon className="w-3 h-3 sm:w-4 sm:h-4" />}
        </Button>
      </div>
    </div>
  );
}