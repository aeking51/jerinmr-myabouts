interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function TerminalNavigation({ activeSection, onSectionChange }: NavigationProps) {
  const commands = [
    { id: 'home', command: 'cd ~', label: 'Home' },
    { id: 'about', command: 'cat about.txt', label: 'About' },
    { id: 'skills', command: 'ls skills/', label: 'Skills' },
    { id: 'experience', command: 'cat experience.log', label: 'Experience' },
    { id: 'contact', command: 'whois jerinmr', label: 'Contact' },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-muted border-b border-border">
      {commands.map((cmd) => (
        <button
          key={cmd.id}
          onClick={() => onSectionChange(cmd.id)}
          className={`px-3 py-1 rounded font-mono text-sm transition-colors ${
            activeSection === cmd.id
              ? 'bg-terminal-green text-background'
              : 'text-terminal-gray hover:text-terminal-green hover:bg-secondary'
          }`}
        >
          {cmd.command}
        </button>
      ))}
    </div>
  );
}