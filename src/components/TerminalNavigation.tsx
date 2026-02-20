import { memo, useCallback } from 'react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const commands = [
  { id: 'home', command: 'cd ~', label: 'Home' },
  { id: 'profile', command: 'cat profile/*', label: 'Profile' },
  { id: 'articles', command: 'ls articles/', label: 'Articles' },
  { id: 'contact', command: 'whois jerinmr', label: 'Contact' },
  { id: 'network', command: 'netstat -a', label: 'Network Tools' },
  { id: 'utilities', command: 'man utils', label: 'Utilities' },
] as const;

export const TerminalNavigation = memo(function TerminalNavigation({ activeSection, onSectionChange }: NavigationProps) {
  const handleClick = useCallback((id: string) => {
    onSectionChange(id);
  }, [onSectionChange]);

  return (
    <nav className="flex flex-wrap gap-1 sm:gap-2 p-2 sm:p-4 bg-muted border-b border-border overflow-x-auto" role="navigation" aria-label="Main navigation">
      {commands.map((cmd) => (
        <button
          key={cmd.id}
          onClick={() => handleClick(cmd.id)}
          aria-current={activeSection === cmd.id ? 'page' : undefined}
          className={`px-2 sm:px-3 py-1 rounded font-mono text-xs sm:text-sm transition-colors whitespace-nowrap ${
            activeSection === cmd.id
              ? 'bg-terminal-green text-background'
              : 'text-terminal-gray hover:text-terminal-green hover:bg-secondary'
          }`}
        >
          {cmd.command}
        </button>
      ))}
    </nav>
  );
});
