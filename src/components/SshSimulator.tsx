import { useState, useEffect, useCallback, useRef } from 'react';

interface SshSimulatorProps {
  onClose: () => void;
}

type ConnectionStage = 'init' | 'dns' | 'connecting' | 'key_exchange' | 'authenticating' | 'connected' | 'session';

interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'error' | 'success' | 'info' | 'ascii';
  content: string;
  delay?: number;
}

const SSH_COMMANDS: Record<string, (args: string[]) => TerminalLine[]> = {
  help: () => [
    { id: Date.now(), type: 'info', content: 'Available commands:' },
    { id: Date.now() + 1, type: 'output', content: '  ls          - List directory contents' },
    { id: Date.now() + 2, type: 'output', content: '  cd <dir>    - Change directory' },
    { id: Date.now() + 3, type: 'output', content: '  cat <file>  - Display file contents' },
    { id: Date.now() + 4, type: 'output', content: '  pwd         - Print working directory' },
    { id: Date.now() + 5, type: 'output', content: '  whoami      - Display current user' },
    { id: Date.now() + 6, type: 'output', content: '  uname -a    - System information' },
    { id: Date.now() + 7, type: 'output', content: '  uptime      - System uptime' },
    { id: Date.now() + 8, type: 'output', content: '  df -h       - Disk space usage' },
    { id: Date.now() + 9, type: 'output', content: '  ps aux      - Running processes' },
    { id: Date.now() + 10, type: 'output', content: '  netstat     - Network connections' },
    { id: Date.now() + 11, type: 'output', content: '  history     - Command history' },
    { id: Date.now() + 12, type: 'output', content: '  clear       - Clear terminal' },
    { id: Date.now() + 13, type: 'output', content: '  exit        - Close SSH session' },
  ],
  ls: (args) => {
    const showAll = args.includes('-la') || args.includes('-a') || args.includes('-l');
    const lines: TerminalLine[] = [];
    if (showAll) {
      lines.push({ id: Date.now(), type: 'output', content: 'total 42' });
      lines.push({ id: Date.now() + 1, type: 'output', content: 'drwxr-xr-x  5 visitor users 4096 Feb  4 09:00 .' });
      lines.push({ id: Date.now() + 2, type: 'output', content: 'drwxr-xr-x  3 root    root  4096 Jan 15 12:30 ..' });
      lines.push({ id: Date.now() + 3, type: 'output', content: '-rw-------  1 visitor users  512 Feb  4 08:45 .bash_history' });
      lines.push({ id: Date.now() + 4, type: 'output', content: '-rw-r--r--  1 visitor users  220 Jan 15 12:30 .bashrc' });
    }
    lines.push({ id: Date.now() + 5, type: 'info', content: '📁 projects/  📁 secrets/  📁 .hidden/' });
    lines.push({ id: Date.now() + 6, type: 'success', content: '📄 welcome.txt  📄 readme.md  📄 todo.txt' });
    lines.push({ id: Date.now() + 7, type: 'error', content: '🔒 classified.enc  💀 danger.sh' });
    return lines;
  },
  cd: (args) => {
    const dir = args[0] || '~';
    if (dir === 'secrets' || dir === 'secrets/') {
      return [{ id: Date.now(), type: 'error', content: 'bash: cd: secrets/: Permission denied (try sudo?)' }];
    }
    if (dir === '.hidden' || dir === '.hidden/') {
      return [
        { id: Date.now(), type: 'success', content: '🎉 You found the hidden directory!' },
        { id: Date.now() + 1, type: 'info', content: 'Contents: easter_egg.txt, konami.sh, matrix.bin' },
      ];
    }
    return [{ id: Date.now(), type: 'output', content: `Changed directory to ${dir}` }];
  },
  cat: (args) => {
    const file = args[0];
    if (!file) {
      return [{ id: Date.now(), type: 'error', content: 'cat: missing file operand' }];
    }
    if (file === 'welcome.txt') {
      return [
        { id: Date.now(), type: 'ascii', content: '╔════════════════════════════════════════╗' },
        { id: Date.now() + 1, type: 'ascii', content: '║     Welcome to Secret Server v3.14     ║' },
        { id: Date.now() + 2, type: 'ascii', content: '╠════════════════════════════════════════╣' },
        { id: Date.now() + 3, type: 'output', content: '║  This is Jerin\'s portfolio server.    ║' },
        { id: Date.now() + 4, type: 'output', content: '║  Feel free to explore around!          ║' },
        { id: Date.now() + 5, type: 'info', content: '║  Type "help" for available commands.   ║' },
        { id: Date.now() + 6, type: 'ascii', content: '╚════════════════════════════════════════╝' },
      ];
    }
    if (file === 'readme.md') {
      return [
        { id: Date.now(), type: 'info', content: '# About This Server' },
        { id: Date.now() + 1, type: 'output', content: '' },
        { id: Date.now() + 2, type: 'output', content: 'This is a simulated SSH session for demonstration.' },
        { id: Date.now() + 3, type: 'output', content: 'Built with React + TypeScript + Tailwind CSS.' },
        { id: Date.now() + 4, type: 'output', content: '' },
        { id: Date.now() + 5, type: 'success', content: '## Skills: React, Node.js, TypeScript, AWS, Docker' },
      ];
    }
    if (file === 'todo.txt') {
      return [
        { id: Date.now(), type: 'output', content: '☑ Build awesome portfolio' },
        { id: Date.now() + 1, type: 'output', content: '☑ Add cool easter eggs' },
        { id: Date.now() + 2, type: 'output', content: '☑ Create SSH simulator' },
        { id: Date.now() + 3, type: 'info', content: '☐ Take over the world' },
        { id: Date.now() + 4, type: 'info', content: '☐ Get coffee ☕' },
      ];
    }
    if (file === 'classified.enc') {
      return [
        { id: Date.now(), type: 'error', content: 'cat: classified.enc: Permission denied' },
        { id: Date.now() + 1, type: 'info', content: 'This file is encrypted with AES-256-GCM' },
      ];
    }
    if (file === 'danger.sh') {
      return [
        { id: Date.now(), type: 'error', content: '⚠️  WARNING: Executing this file is not recommended!' },
        { id: Date.now() + 1, type: 'output', content: '#!/bin/bash' },
        { id: Date.now() + 2, type: 'output', content: 'echo "Just kidding, this is harmless 😄"' },
      ];
    }
    return [{ id: Date.now(), type: 'error', content: `cat: ${file}: No such file or directory` }];
  },
  pwd: () => [{ id: Date.now(), type: 'output', content: '/home/visitor/portfolio' }],
  whoami: () => [
    { id: Date.now(), type: 'success', content: 'visitor' },
    { id: Date.now() + 1, type: 'info', content: 'uid=1337(visitor) gid=42(elite) groups=42(elite),100(users),999(sudo)' },
  ],
  'uname': (args) => {
    if (args.includes('-a')) {
      return [{ id: Date.now(), type: 'output', content: 'Linux secret-server 5.15.0-generic #1 SMP x86_64 GNU/Linux' }];
    }
    return [{ id: Date.now(), type: 'output', content: 'Linux' }];
  },
  uptime: () => [
    { id: Date.now(), type: 'output', content: ' 09:23:45 up 42 days, 13:37, 1 user, load average: 0.42, 0.69, 0.31' },
  ],
  df: () => [
    { id: Date.now(), type: 'output', content: 'Filesystem      Size  Used Avail Use% Mounted on' },
    { id: Date.now() + 1, type: 'output', content: '/dev/sda1       100G   42G   58G  42% /' },
    { id: Date.now() + 2, type: 'output', content: '/dev/sdb1       1.0T  420G  580G  42% /data' },
    { id: Date.now() + 3, type: 'info', content: 'tmpfs           4.0G  1.3G  2.7G  33% /dev/shm' },
  ],
  ps: () => [
    { id: Date.now(), type: 'output', content: 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND' },
    { id: Date.now() + 1, type: 'output', content: 'visitor   1337  0.0  0.1  12345  6789 pts/0    Ss   09:00   0:00 -bash' },
    { id: Date.now() + 2, type: 'output', content: 'visitor   1338  0.5  0.2  54321  9876 pts/0    S+   09:01   0:42 portfolio-server' },
    { id: Date.now() + 3, type: 'info', content: 'visitor   1339  0.0  0.0   8888  1234 pts/0    R+   09:23   0:00 ps aux' },
  ],
  netstat: () => [
    { id: Date.now(), type: 'output', content: 'Active Internet connections (servers and established)' },
    { id: Date.now() + 1, type: 'output', content: 'Proto Recv-Q Send-Q Local Address           Foreign Address         State' },
    { id: Date.now() + 2, type: 'success', content: 'tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN' },
    { id: Date.now() + 3, type: 'success', content: 'tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN' },
    { id: Date.now() + 4, type: 'info', content: 'tcp        0      0 10.0.0.42:22            YOUR_IP:54321           ESTABLISHED' },
  ],
  history: () => [
    { id: Date.now(), type: 'output', content: '    1  ssh visitor@secret-server.local' },
    { id: Date.now() + 1, type: 'output', content: '    2  ls -la' },
    { id: Date.now() + 2, type: 'output', content: '    3  cat welcome.txt' },
    { id: Date.now() + 3, type: 'output', content: '    4  cd secrets/' },
    { id: Date.now() + 4, type: 'error', content: '    5  sudo rm -rf /' },
    { id: Date.now() + 5, type: 'info', content: '    6  echo "Just kidding!"' },
  ],
  sudo: (args) => {
    if (args.length === 0) {
      return [{ id: Date.now(), type: 'error', content: 'usage: sudo <command>' }];
    }
    return [
      { id: Date.now(), type: 'info', content: '[sudo] password for visitor: ********' },
      { id: Date.now() + 1, type: 'error', content: 'visitor is not in the sudoers file. This incident will be reported.' },
      { id: Date.now() + 2, type: 'output', content: '📧 Email sent to: admin@secret-server.local' },
    ];
  },
  echo: (args) => [{ id: Date.now(), type: 'output', content: args.join(' ') }],
  date: () => [{ id: Date.now(), type: 'output', content: new Date().toString() }],
  hostname: () => [{ id: Date.now(), type: 'success', content: 'secret-server.local' }],
  ping: (args) => {
    const host = args[0] || 'localhost';
    return [
      { id: Date.now(), type: 'output', content: `PING ${host} (127.0.0.1) 56(84) bytes of data.` },
      { id: Date.now() + 1, type: 'success', content: `64 bytes from ${host}: icmp_seq=1 ttl=64 time=0.042 ms` },
      { id: Date.now() + 2, type: 'success', content: `64 bytes from ${host}: icmp_seq=2 ttl=64 time=0.038 ms` },
      { id: Date.now() + 3, type: 'info', content: '--- ping statistics ---' },
      { id: Date.now() + 4, type: 'info', content: '2 packets transmitted, 2 received, 0% packet loss' },
    ];
  },
  vim: () => [
    { id: Date.now(), type: 'error', content: '⚠️ You have entered vim!' },
    { id: Date.now() + 1, type: 'info', content: 'Good luck getting out... 😈' },
    { id: Date.now() + 2, type: 'output', content: 'Hint: Press ESC then type :q! and press Enter' },
    { id: Date.now() + 3, type: 'output', content: '(Just kidding, you\'re still in the SSH simulator)' },
  ],
  nano: () => [{ id: Date.now(), type: 'info', content: 'nano: Smart choice! But this is just a simulation 📝' }],
  exit: () => [{ id: Date.now(), type: 'info', content: 'logout' }],
  clear: () => [],
};

export function SshSimulator({ onClose }: SshSimulatorProps) {
  const [stage, setStage] = useState<ConnectionStage>('init');
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const addLine = useCallback((line: TerminalLine) => {
    setLines(prev => [...prev, line]);
  }, []);

  const addLines = useCallback((newLines: TerminalLine[]) => {
    setLines(prev => [...prev, ...newLines]);
  }, []);

  // Connection simulation
  useEffect(() => {
    const connectionSequence = async () => {
      // Init
      await new Promise(r => setTimeout(r, 300));
      addLine({ id: 1, type: 'input', content: '$ ssh visitor@secret-server.local -p 22' });
      
      await new Promise(r => setTimeout(r, 500));
      setStage('dns');
      addLine({ id: 2, type: 'info', content: 'Resolving hostname secret-server.local...' });
      
      await new Promise(r => setTimeout(r, 800));
      addLine({ id: 3, type: 'success', content: '✓ DNS resolved: 10.0.42.69' });
      
      await new Promise(r => setTimeout(r, 400));
      setStage('connecting');
      addLine({ id: 4, type: 'info', content: 'Connecting to 10.0.42.69 port 22...' });
      
      await new Promise(r => setTimeout(r, 600));
      addLine({ id: 5, type: 'success', content: '✓ Connection established.' });
      
      await new Promise(r => setTimeout(r, 300));
      setStage('key_exchange');
      addLine({ id: 6, type: 'info', content: 'Performing SSH2 key exchange...' });
      addLine({ id: 7, type: 'output', content: '  KEX: curve25519-sha256@libssh.org' });
      addLine({ id: 8, type: 'output', content: '  Host key: ECDSA SHA256:xK9dF2mN8vL3qR7wY5zA1bC4eH6iJ0kM' });
      
      await new Promise(r => setTimeout(r, 700));
      addLine({ id: 9, type: 'success', content: '✓ Key exchange completed.' });
      
      await new Promise(r => setTimeout(r, 400));
      setStage('authenticating');
      addLine({ id: 10, type: 'info', content: 'Authenticating with public key "visitor_rsa"...' });
      addLine({ id: 11, type: 'output', content: '  Signature: RSA-SHA256' });
      
      await new Promise(r => setTimeout(r, 600));
      addLine({ id: 12, type: 'success', content: '✓ Authentication successful!' });
      
      await new Promise(r => setTimeout(r, 300));
      setStage('connected');
      addLine({ id: 13, type: 'info', content: 'Opening session channel...' });
      
      await new Promise(r => setTimeout(r, 400));
      addLine({ id: 14, type: 'success', content: '✓ Session established.' });
      
      await new Promise(r => setTimeout(r, 300));
      setStage('session');
      addLine({ id: 15, type: 'ascii', content: '' });
      addLine({ id: 16, type: 'ascii', content: '╔══════════════════════════════════════════════════════════╗' });
      addLine({ id: 17, type: 'ascii', content: '║                                                          ║' });
      addLine({ id: 18, type: 'ascii', content: '║   🔒 SECRET SERVER v3.14 - Authorized Access Only 🔒    ║' });
      addLine({ id: 19, type: 'ascii', content: '║                                                          ║' });
      addLine({ id: 20, type: 'ascii', content: '╠══════════════════════════════════════════════════════════╣' });
      addLine({ id: 21, type: 'output', content: '║  Last login: Just now from your-browser                 ║' });
      addLine({ id: 22, type: 'output', content: '║  System: Linux 5.15.0 | Uptime: 42 days                 ║' });
      addLine({ id: 23, type: 'info', content: '║  Welcome, visitor! Type "help" for commands.            ║' });
      addLine({ id: 24, type: 'ascii', content: '║                                                          ║' });
      addLine({ id: 25, type: 'ascii', content: '╚══════════════════════════════════════════════════════════╝' });
      addLine({ id: 26, type: 'output', content: '' });
      
      inputRef.current?.focus();
    };

    connectionSequence();
  }, [addLine]);

  // Auto-scroll
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Add to history
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Add input line
    addLine({ id: Date.now(), type: 'input', content: `visitor@secret-server:~$ ${trimmed}` });

    // Parse command
    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Handle special commands
    if (command === 'exit' || command === 'logout') {
      addLine({ id: Date.now() + 1, type: 'info', content: 'Connection to secret-server.local closed.' });
      setTimeout(onClose, 1000);
      return;
    }

    if (command === 'clear') {
      setLines([]);
      return;
    }

    // Execute command
    const handler = SSH_COMMANDS[command];
    if (handler) {
      const output = handler(args);
      addLines(output);
    } else {
      addLine({ id: Date.now() + 1, type: 'error', content: `bash: ${command}: command not found` });
      addLine({ id: Date.now() + 2, type: 'info', content: 'Type "help" for available commands.' });
    }
  }, [addLine, addLines, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return 'text-terminal-cyan';
      case 'output': return 'text-terminal-gray';
      case 'error': return 'text-terminal-red';
      case 'success': return 'text-terminal-green';
      case 'info': return 'text-terminal-yellow';
      case 'ascii': return 'text-terminal-green';
      default: return 'text-terminal-gray';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl h-[80vh] bg-card border border-terminal-green rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-terminal-green/20 border-b border-terminal-green/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <button 
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-terminal-red hover:brightness-110 transition-all"
                title="Close"
              />
              <div className="w-3 h-3 rounded-full bg-terminal-yellow" />
              <div className="w-3 h-3 rounded-full bg-terminal-green" />
            </div>
            <span className="text-terminal-green font-mono text-sm ml-2">
              visitor@secret-server.local — ssh
            </span>
          </div>
          <div className="flex items-center gap-2 text-terminal-gray text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${stage === 'session' ? 'bg-terminal-green animate-pulse' : 'bg-terminal-yellow'}`} />
            <span>{stage === 'session' ? 'Connected' : 'Connecting...'}</span>
          </div>
        </div>

        {/* Terminal content */}
        <div 
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-4 font-mono text-sm"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line) => (
            <div key={line.id} className={`${getLineColor(line.type)} whitespace-pre-wrap`}>
              {line.content}
            </div>
          ))}
          
          {/* Input prompt */}
          {stage === 'session' && (
            <div className="flex items-center text-terminal-cyan">
              <span>visitor@secret-server:~$ </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-terminal-green caret-terminal-green"
                autoFocus
                spellCheck={false}
              />
              <span className="animate-blink text-terminal-green">▋</span>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="px-4 py-1.5 bg-terminal-green/10 border-t border-terminal-green/30 font-mono text-xs text-terminal-gray flex justify-between">
          <span>ESC to close | Ctrl+L to clear | ↑↓ for history</span>
          <span>SSH-2.0-OpenSSH_8.9 | AES256-GCM | ECDSA-SHA2</span>
        </div>
      </div>
    </div>
  );
}
