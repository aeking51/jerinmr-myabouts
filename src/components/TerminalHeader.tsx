import { useState, useEffect, memo } from 'react';
import { Terminal, User, Sun, Moon, Eye } from 'lucide-react';
import { Button } from './ui/button';

interface TerminalHeaderProps {
  onThemeToggle: () => void;
  theme: 'dark' | 'light' | 'eye-comfort';
  onHeaderClick?: () => void;
}

export const TerminalHeader = memo(function TerminalHeader({ onThemeToggle, theme, onHeaderClick }: TerminalHeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const themeIcon = theme === 'light' ? <Sun className="w-3 h-3 sm:w-4 sm:h-4" /> 
    : theme === 'eye-comfort' ? <Eye className="w-3 h-3 sm:w-4 sm:h-4" /> 
    : <Moon className="w-3 h-3 sm:w-4 sm:h-4" />;

  const themeTitle = theme === 'dark' ? 'Switch to light mode' 
    : theme === 'light' ? 'Switch to eye comfort mode' 
    : 'Switch to dark mode';

  return (
    <header className="flex items-center justify-between bg-muted border-b border-border p-2 font-mono text-xs sm:text-sm" role="banner">
      <div 
        className="flex items-center gap-1 sm:gap-2 overflow-hidden cursor-pointer select-none"
        onClick={onHeaderClick}
        title="Try clicking me three times..."
        role="button"
        aria-label="Terminal header - click for surprise"
      >
        <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-terminal-green flex-shrink-0" aria-hidden="true" />
        <span className="text-terminal-green truncate">guest@jerinmr.myabouts</span>
        <span className="text-terminal-gray hidden sm:inline">:</span>
        <span className="text-terminal-cyan hidden sm:inline">~/portfolio</span>
        <span className="text-terminal-gray hidden sm:inline">$</span>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex items-center gap-2 text-terminal-gray">
          <User className="w-3 h-3" aria-hidden="true" />
          <time dateTime={time.toISOString()}>{time.toLocaleTimeString()}</time>
        </div>
        
        <Button
          onClick={onThemeToggle}
          variant="ghost"
          size="sm"
          className="p-1 sm:p-2 text-terminal-gray hover:text-terminal-green h-auto"
          title={themeTitle}
          aria-label={themeTitle}
        >
          {themeIcon}
        </Button>
      </div>
    </header>
  );
});
