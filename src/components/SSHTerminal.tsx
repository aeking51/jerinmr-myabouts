import { useState, useRef, useEffect, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Globe, Terminal, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TerminalLine {
  type: 'input' | 'output' | 'system' | 'error' | 'success' | 'ascii';
  content: string;
  timestamp?: string;
}

interface SSHSession {
  host: string;
  user: string;
  connected: boolean;
  currentPath: string;
}

const FAKE_FILES: Record<string, string[]> = {
  '~': ['Documents', 'Downloads', 'Pictures', 'Music', '.bashrc', '.ssh', 'notes.txt', 'secret.txt'],
  '~/Documents': ['projects', 'resume.pdf', 'budget.xlsx', 'ideas.md'],
  '~/Documents/projects': ['webapp', 'cli-tool', 'dotfiles'],
  '~/Downloads': ['installer.exe', 'wallpaper.jpg', 'song.mp3'],
  '~/Pictures': ['vacation', 'screenshots', 'profile.png'],
  '~/Music': ['playlist.m3u', 'album'],
  '~/.ssh': ['id_rsa', 'id_rsa.pub', 'known_hosts', 'config'],
};

const FILE_CONTENTS: Record<string, string> = {
  '~/.bashrc': `# ~/.bashrc: executed by bash for non-login shells
export PS1='\\u@\\h:\\w\\$ '
alias ll='ls -la'
alias cls='clear'
alias ..='cd ..'

# Custom greeting
echo "Welcome back, hacker!"`,
  '~/notes.txt': `TODO:
- Fix that weird bug in production
- Call mom for her birthday
- Learn Rust (for real this time)
- Touch grass

REMEMBER: The password is definitely not "password123"`,
  '~/secret.txt': `🔒 ACCESS DENIED 🔒
Just kidding! You found the secret file.

Here's a joke for you:
Why do programmers prefer dark mode?
Because light attracts bugs! 🐛`,
  '~/Documents/ideas.md': `# Million Dollar Ideas

1. App that tells you when to stop scrolling
2. Smart fridge that judges your food choices
3. AI that writes better commit messages
4. Sock matching service with ML
5. This portfolio website (nailed it!)`,
  '~/.ssh/config': `Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa

Host production
  HostName 10.0.0.1
  User admin
  Port 22
  IdentityFile ~/.ssh/id_rsa`,
};

const ASCII_BANNER = `
╔═══════════════════════════════════════════════════════════════╗
║  ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗ ║
║  ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║ ║
║     ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║ ║
║     ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║ ║
║     ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███╗║
║     ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══╝║
║                     Web SSH Client v2.0                       ║
╚═══════════════════════════════════════════════════════════════╝`;

export function SSHTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'ascii', content: ASCII_BANNER },
    { type: 'system', content: 'Type "connect" to start an SSH session or "help" for commands.' },
  ]);
  const [input, setInput] = useState('');
  const [session, setSession] = useState<SSHSession | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isConnecting, setIsConnecting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  const addLine = useCallback((type: TerminalLine['type'], content: string) => {
    setLines(prev => [...prev, { type, content, timestamp: new Date().toLocaleTimeString() }]);
  }, []);

  const simulateTyping = async (messages: { type: TerminalLine['type']; content: string }[], delay = 100) => {
    for (const msg of messages) {
      await new Promise(resolve => setTimeout(resolve, delay));
      addLine(msg.type, msg.content);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    
    await simulateTyping([
      { type: 'system', content: 'Initiating SSH connection...' },
      { type: 'system', content: 'Resolving hostname: demo-server.local' },
    ], 300);

    await new Promise(resolve => setTimeout(resolve, 500));
    
    await simulateTyping([
      { type: 'system', content: 'Performing SSH key exchange...' },
      { type: 'system', content: 'Server key fingerprint: SHA256:Xk8z...9Fq2' },
      { type: 'success', content: '✓ Host key verified' },
    ], 400);

    await new Promise(resolve => setTimeout(resolve, 300));

    await simulateTyping([
      { type: 'system', content: 'Authenticating user: guest' },
      { type: 'success', content: '✓ Authentication successful' },
      { type: 'system', content: '' },
      { type: 'system', content: 'Last login: ' + new Date().toLocaleString() + ' from 127.0.0.1' },
      { type: 'system', content: 'Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-88-generic x86_64)' },
      { type: 'system', content: '' },
      { type: 'system', content: ' * Documentation:  https://help.ubuntu.com' },
      { type: 'system', content: ' * Management:     https://landscape.canonical.com' },
      { type: 'system', content: ' * Support:        https://ubuntu.com/advantage' },
      { type: 'system', content: '' },
    ], 150);

    setSession({
      host: 'demo-server.local',
      user: 'guest',
      connected: true,
      currentPath: '~',
    });
    setIsConnecting(false);
  };

  const getPrompt = () => {
    if (!session?.connected) return '$ ';
    return `${session.user}@${session.host}:${session.currentPath}$ `;
  };

  const processCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (!session?.connected) {
      // Pre-connection commands
      switch (trimmedCmd) {
        case 'connect':
        case 'ssh':
          await handleConnect();
          return;
        case 'help':
          addLine('output', 'Available commands:');
          addLine('output', '  connect    - Start SSH session to demo server');
          addLine('output', '  clear      - Clear terminal');
          addLine('output', '  help       - Show this help');
          return;
        case 'clear':
          setLines([{ type: 'ascii', content: ASCII_BANNER }]);
          return;
        default:
          addLine('error', `Command not found: ${command}. Type "connect" to start session or "help" for commands.`);
          return;
      }
    }

    // Connected session commands
    switch (command) {
      case 'ls':
        const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
        const files = FAKE_FILES[session.currentPath] || ['(empty)'];
        const displayFiles = showAll ? ['.', '..', ...files] : files;
        
        if (args.includes('-l') || args.includes('-la') || args.includes('-al')) {
          addLine('output', 'total ' + files.length);
          displayFiles.forEach((f, i) => {
            const isDir = !f.includes('.') || f.startsWith('.');
            const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
            const size = Math.floor(Math.random() * 10000);
            const date = 'Jan ' + (i + 1).toString().padStart(2, ' ') + ' 12:00';
            addLine('output', `${perms}  1 ${session.user} ${session.user}  ${size.toString().padStart(5)} ${date} ${f}`);
          });
        } else {
          addLine('output', displayFiles.join('  '));
        }
        break;

      case 'cd':
        const target = args[0] || '~';
        if (target === '..') {
          if (session.currentPath !== '~') {
            const newPath = session.currentPath.split('/').slice(0, -1).join('/') || '~';
            setSession({ ...session, currentPath: newPath });
          }
        } else if (target === '~' || target === '/home/guest') {
          setSession({ ...session, currentPath: '~' });
        } else {
          const newPath = target.startsWith('~') ? target : `${session.currentPath}/${target}`;
          if (FAKE_FILES[newPath]) {
            setSession({ ...session, currentPath: newPath });
          } else {
            addLine('error', `bash: cd: ${target}: No such file or directory`);
          }
        }
        break;

      case 'pwd':
        addLine('output', session.currentPath.replace('~', '/home/guest'));
        break;

      case 'whoami':
        addLine('output', session.user);
        break;

      case 'hostname':
        addLine('output', session.host);
        break;

      case 'cat':
        if (!args[0]) {
          addLine('error', 'cat: missing operand');
        } else {
          const filePath = args[0].startsWith('~') ? args[0] : `${session.currentPath}/${args[0]}`;
          const content = FILE_CONTENTS[filePath];
          if (content) {
            content.split('\n').forEach(line => addLine('output', line));
          } else {
            addLine('error', `cat: ${args[0]}: No such file or directory`);
          }
        }
        break;

      case 'uname':
        if (args.includes('-a')) {
          addLine('output', 'Linux demo-server 5.15.0-88-generic #98-Ubuntu SMP Mon Oct 2 15:18:56 UTC 2023 x86_64 GNU/Linux');
        } else {
          addLine('output', 'Linux');
        }
        break;

      case 'uptime':
        addLine('output', ` ${new Date().toLocaleTimeString()} up 42 days, 13:37,  1 user,  load average: 0.42, 0.69, 1.00`);
        break;

      case 'date':
        addLine('output', new Date().toString());
        break;

      case 'echo':
        addLine('output', args.join(' ').replace(/["']/g, ''));
        break;

      case 'ps':
        addLine('output', '  PID TTY          TIME CMD');
        addLine('output', ' 1337 pts/0    00:00:00 bash');
        addLine('output', ' 4242 pts/0    00:00:00 ps');
        break;

      case 'top':
        addLine('output', 'top - ' + new Date().toLocaleTimeString() + ' up 42 days, 13:37,  1 user,  load average: 0.42, 0.69, 1.00');
        addLine('output', 'Tasks: 142 total,   1 running, 141 sleeping,   0 stopped,   0 zombie');
        addLine('output', '%Cpu(s):  4.2 us,  0.7 sy,  0.0 ni, 94.8 id,  0.3 wa,  0.0 hi,  0.0 si');
        addLine('output', 'MiB Mem :  16000.0 total,   8000.0 free,   4000.0 used,   4000.0 buff/cache');
        addLine('output', '');
        addLine('output', '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND');
        addLine('output', ' 1337 guest     20   0  500000  50000  25000 S   4.2   0.3   0:42.69 node');
        addLine('system', '(Press Ctrl+C to exit... just kidding, this is simulated)');
        break;

      case 'df':
        addLine('output', 'Filesystem     1K-blocks      Used Available Use% Mounted on');
        addLine('output', '/dev/sda1      500000000 125000000 375000000  25% /');
        addLine('output', 'tmpfs            8000000    100000   7900000   2% /run');
        break;

      case 'free':
        addLine('output', '              total        used        free      shared  buff/cache   available');
        addLine('output', 'Mem:       16000000     4000000     8000000      100000     4000000    11500000');
        addLine('output', 'Swap:       2000000           0     2000000');
        break;

      case 'neofetch':
        addLine('ascii', `
        .-/+oossssoo+/-.               ${session.user}@${session.host}
    \`:+ssssssssssssssssss+:\`           -------------------------
  -+ssssssssssssssssssyyssss+-         OS: Ubuntu 22.04.3 LTS x86_64
.ossssssssssssssssssdMMMNysssso.       Host: Virtual Machine
/ssssssssssshdmmNNmmyNMMMMhssssss/     Kernel: 5.15.0-88-generic
+ssssssssshmydMMMMMMMNddddyssssssss+   Uptime: 42 days, 13 hours
/sssssssshNMMMyhhyyyyhmNMMMNhssssssss/ Shell: bash 5.1.16
.ssssssssdMMMNhsssssssssshNMMMdssssss. Terminal: web-ssh
+sssshhhyNMMNyssssssssssssyNMMMysssss+ CPU: Intel Virtual @ 2.40GHz
ossyNMMMNyMMhsssssssssssssshmmmhssso   Memory: 4000M / 16000M
ossyNMMMNyMMhssssssssssssssshmmmhsso
+sssshhhyNMMNyssssssssssssyNMMMysss+
.ssssssssdMMMNhsssssssssshNMMMdssss.
/sssssssshNMMMyhhyyyyhdNMMMNhssss/
+sssssssssdmydMMMMMMMMddddyssssss+
/ssssssssssshdmNNNNmyNMMMMhsssss/
.ossssssssssssssssssdMMMNyssso.`);
        break;

      case 'help':
        addLine('output', 'Available commands:');
        addLine('output', '  ls [-la]      - List directory contents');
        addLine('output', '  cd <dir>      - Change directory');
        addLine('output', '  pwd           - Print working directory');
        addLine('output', '  cat <file>    - Display file contents');
        addLine('output', '  whoami        - Display current user');
        addLine('output', '  hostname      - Display hostname');
        addLine('output', '  uname [-a]    - System information');
        addLine('output', '  uptime        - System uptime');
        addLine('output', '  date          - Current date/time');
        addLine('output', '  echo <text>   - Print text');
        addLine('output', '  ps            - List processes');
        addLine('output', '  top           - System monitor');
        addLine('output', '  df            - Disk usage');
        addLine('output', '  free          - Memory usage');
        addLine('output', '  neofetch      - System info with logo');
        addLine('output', '  clear         - Clear terminal');
        addLine('output', '  exit          - Disconnect from server');
        addLine('output', '  help          - Show this help');
        break;

      case 'clear':
        setLines([]);
        break;

      case 'exit':
      case 'logout':
      case 'disconnect':
        addLine('system', 'Connection to demo-server.local closed.');
        setSession(null);
        addLine('system', 'Type "connect" to start a new session.');
        break;

      case 'sudo':
        addLine('output', `[sudo] password for ${session.user}: `);
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLine('error', 'Sorry, try again.');
        addLine('error', 'sudo: 3 incorrect password attempts');
        addLine('system', "Nice try! You didn't really think that would work, did you? 😏");
        break;

      case 'rm':
        if (args.includes('-rf') && (args.includes('/') || args.includes('/*'))) {
          addLine('error', 'rm: refusing to remove "/" or "/*"');
          addLine('system', "I'm not gonna let you break things that easily! 🛡️");
        } else if (args[0]) {
          addLine('output', `rm: cannot remove '${args[0]}': Permission denied`);
        } else {
          addLine('error', 'rm: missing operand');
        }
        break;

      case 'vim':
      case 'vi':
      case 'nano':
        addLine('system', `${command}: Opening editor...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        addLine('system', 'Just kidding! This is a simulated terminal. 😄');
        addLine('system', 'But here\'s a vim tip: To exit vim, press ESC then type :q! and press Enter');
        break;

      case 'curl':
      case 'wget':
        addLine('system', `${command}: command not available in this sandbox`);
        addLine('system', 'Network requests are disabled for security. Use the Site Monitor tool instead!');
        break;

      case 'sl':
        addLine('ascii', `
      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ |   |        =|___ ___|
   /     |  |   H  |  |     |   |         ||_| |_||
  |      |  |   H  |__--------------------| [___] |
  | ________|___H__/__|_____/[][]~\\_______|       |
  |/ |   |-----------I_____I [][] []  D   |=======|_
__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__
|/-=|___|=    ||    ||    ||    |_____/~\\___/
 \\_/      \\O=====O=====O=====O_/      \\_/`);
        break;

      case 'cowsay':
        const message = args.join(' ') || 'Moo!';
        const border = '-'.repeat(message.length + 2);
        addLine('ascii', ` ${border}`);
        addLine('ascii', `< ${message} >`);
        addLine('ascii', ` ${border}`);
        addLine('ascii', '        \\   ^__^');
        addLine('ascii', '         \\  (oo)\\_______');
        addLine('ascii', '            (__)\\       )\\/\\');
        addLine('ascii', '                ||----w |');
        addLine('ascii', '                ||     ||');
        break;

      case 'matrix':
        addLine('success', 'Wake up, Neo...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLine('success', 'The Matrix has you...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLine('success', 'Follow the white rabbit. 🐇');
        break;

      case 'fortune':
        const fortunes = [
          'You will debug on the first try... someday.',
          'A wise programmer once said: "It works on my machine."',
          'Your code will compile, but not without warnings.',
          'Beware of bugs in the above code; I have only proved it correct, not tried it.',
          'The best thing about a boolean is even if you are wrong, you are only off by a bit.',
          'There are only 10 types of people: those who understand binary and those who don\'t.',
        ];
        addLine('output', fortunes[Math.floor(Math.random() * fortunes.length)]);
        break;

      default:
        addLine('error', `bash: ${command}: command not found`);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isConnecting) return;

    const cmd = input;
    addLine('input', getPrompt() + cmd);
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput('');

    await processCommand(cmd);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
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
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion
      if (session?.connected && input) {
        const files = FAKE_FILES[session.currentPath] || [];
        const match = files.find(f => f.toLowerCase().startsWith(input.split(' ').pop()?.toLowerCase() || ''));
        if (match) {
          const parts = input.split(' ');
          parts[parts.length - 1] = match;
          setInput(parts.join(' '));
        }
      }
    }
  };

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return 'text-terminal-green';
      case 'output': return 'text-foreground';
      case 'system': return 'text-terminal-cyan';
      case 'error': return 'text-destructive';
      case 'success': return 'text-terminal-green';
      case 'ascii': return 'text-terminal-amber';
      default: return 'text-foreground';
    }
  };

  const SSH_SERVICES = [
    { name: 'ShellNGN', url: 'https://shellngn.com/', description: 'Full-featured web SSH client' },
    { name: 'Sshwifty', url: 'https://sshwifty-demo.nirui.org/', description: 'Open-source web SSH & Telnet client' },
  ];

  const [selectedService, setSelectedService] = useState(SSH_SERVICES[0]);
  const [showLiveSSH, setShowLiveSSH] = useState(false);

  return (
    <Tabs defaultValue="demo" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-2">
        <TabsTrigger value="demo" className="flex items-center gap-1.5">
          <Terminal className="h-3.5 w-3.5" />
          Demo Terminal
        </TabsTrigger>
        <TabsTrigger value="live" className="flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5" />
          Live SSH
        </TabsTrigger>
      </TabsList>

      <TabsContent value="demo">
        <div 
          className="bg-background border border-border rounded-lg overflow-hidden h-[500px] flex flex-col"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="bg-muted px-3 py-2 border-b border-border flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-terminal-amber" />
              <div className="w-3 h-3 rounded-full bg-terminal-green" />
            </div>
            <span className="text-xs text-terminal-gray font-mono flex-1 text-center">
              {session?.connected 
                ? `${session.user}@${session.host} - SSH Session` 
                : 'SSH Terminal - Not Connected'}
            </span>
            {session?.connected && (
              <span className="text-xs text-terminal-green">● Connected</span>
            )}
          </div>
          
          <div 
            ref={scrollRef}
            className="flex-1 overflow-auto p-3 font-mono text-sm bg-background"
          >
            {lines.map((line, index) => (
              <div 
                key={index} 
                className={`whitespace-pre-wrap ${getLineColor(line.type)}`}
              >
                {line.content}
              </div>
            ))}
            
            <form onSubmit={handleSubmit} className="flex items-center mt-1">
              <span className="text-terminal-green whitespace-pre">{getPrompt()}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isConnecting}
                className="flex-1 bg-transparent border-none outline-none text-foreground font-mono"
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
              <span className="animate-blink text-terminal-green">█</span>
            </form>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="live">
        <div className="bg-background border border-border rounded-lg overflow-hidden flex flex-col">
          <div className="bg-muted px-3 py-2 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-terminal-green" />
              <span className="text-xs font-mono text-terminal-gray">Live SSH Client</span>
            </div>
            <div className="flex items-center gap-2">
              {SSH_SERVICES.map((svc) => (
                <Button
                  key={svc.name}
                  variant={selectedService.name === svc.name ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => {
                    setSelectedService(svc);
                    setShowLiveSSH(false);
                  }}
                >
                  {svc.name}
                </Button>
              ))}
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
            <div className="h-[500px] flex flex-col items-center justify-center gap-4 p-6 text-center">
              <Terminal className="h-12 w-12 text-terminal-green opacity-60" />
              <div>
                <h3 className="text-lg font-semibold mb-1">{selectedService.name}</h3>
                <p className="text-sm text-terminal-gray max-w-md">
                  {selectedService.description}. Click below to load the SSH client. You can connect to any server with your credentials.
                </p>
              </div>
              <Button 
                onClick={() => setShowLiveSSH(true)} 
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Launch SSH Client
              </Button>
              <p className="text-xs text-muted-foreground max-w-sm">
                This loads an external SSH web client in an iframe. Your credentials are sent directly to the target server, not through our site.
              </p>
            </div>
          ) : (
            <iframe
              src={selectedService.url}
              className="w-full h-[500px] border-0"
              title={`${selectedService.name} SSH Client`}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
