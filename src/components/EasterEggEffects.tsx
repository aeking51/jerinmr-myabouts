import { useEffect, useState } from 'react';

export type EasterEggEffect = 'matrix' | 'hacker' | 'sudo' | 'hello' | 'coffee' | 'party' | 'glitch' | 'rickroll' | 'ls' | 'cd' | 'whoami' | 'pwd' | 'cat' | 'rm' | 'ping' | 'help' | 'exit' | 'clear' | 'neofetch' | null;

interface EasterEggEffectsProps {
  effect: EasterEggEffect;
  onClear: () => void;
}

function MatrixRain() {
  const [columns, setColumns] = useState<number[]>([]);

  useEffect(() => {
    const cols = Math.floor(window.innerWidth / 20);
    setColumns(Array.from({ length: cols }, () => Math.random() * -100));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden bg-black/80">
      {columns.map((_, i) => (
        <div
          key={i}
          className="absolute text-terminal-green text-sm font-mono animate-matrix-fall"
          style={{
            left: `${i * 20}px`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        >
          {Array.from({ length: 30 }, () => 
            String.fromCharCode(0x30A0 + Math.random() * 96)
          ).join('\n')}
        </div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-terminal-green text-2xl font-mono animate-pulse">
          WAKE UP, NEO...
        </p>
      </div>
    </div>
  );
}

function HackerMode() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center bg-black/90">
      <div className="text-center space-y-4">
        <pre className="text-terminal-green font-mono text-xs sm:text-sm animate-pulse">
{`
  ██╗  ██╗ █████╗  ██████╗██╗  ██╗███████╗██████╗ 
  ██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
  ███████║███████║██║     █████╔╝ █████╗  ██████╔╝
  ██╔══██║██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
  ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║
  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
                  M O D E   A C T I V A T E D
`}
        </pre>
        <p className="text-terminal-green font-mono">Access Granted. Welcome, Elite Hacker.</p>
      </div>
    </div>
  );
}

function SudoMode() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center bg-black/90">
      <div className="text-center space-y-2 font-mono">
        <p className="text-terminal-green">$ sudo su</p>
        <p className="text-terminal-yellow">[sudo] password for visitor: ********</p>
        <p className="text-terminal-green animate-pulse text-xl">
          root@jerinmr:~# <span className="animate-blink">_</span>
        </p>
        <p className="text-terminal-gray text-sm mt-4">
          You now have root access. Use it wisely!
        </p>
      </div>
    </div>
  );
}

function HelloMessage() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="bg-card/95 border border-terminal-green p-8 rounded-lg shadow-2xl animate-scale-in">
        <p className="text-4xl mb-4">👋</p>
        <p className="text-terminal-green font-mono text-xl">Hello there, friend!</p>
        <p className="text-terminal-gray font-mono text-sm mt-2">
          Thanks for exploring my portfolio!
        </p>
      </div>
    </div>
  );
}

function CoffeeBreak() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="bg-card/95 border border-terminal-yellow p-8 rounded-lg shadow-2xl animate-scale-in text-center">
        <p className="text-6xl mb-4 animate-bounce">☕</p>
        <p className="text-terminal-yellow font-mono text-xl">Coffee Break!</p>
        <pre className="text-terminal-gray font-mono text-xs mt-4">
{`
    ( (
     ) )
  .______.
  |      |]
  \\      /
   \`----'
`}
        </pre>
        <p className="text-terminal-gray font-mono text-sm mt-2">
          Time for a quick caffeine boost!
        </p>
      </div>
    </div>
  );
}

function PartyMode() {
  const emojis = ['🎉', '🎊', '🥳', '🎈', '🎁', '✨', '💫', '🌟'];
  const [particles, setParticles] = useState<Array<{id: number; emoji: string; left: number; delay: number}>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute text-3xl animate-confetti"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-4xl font-mono text-terminal-green animate-pulse">
          🎉 PARTY TIME! 🎉
        </p>
      </div>
    </div>
  );
}

function GlitchEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 animate-glitch-overlay">
      <div className="absolute inset-0 bg-terminal-red/20 animate-glitch-1" />
      <div className="absolute inset-0 bg-terminal-cyan/20 animate-glitch-2" />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-terminal-red font-mono text-2xl animate-glitch-text">
          SYSTEM MALFUNCTION
        </p>
      </div>
    </div>
  );
}

function TerminalOutput({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="bg-card/95 border border-terminal-green p-6 rounded-lg shadow-2xl animate-scale-in max-w-md w-full mx-4">
        <div className="font-mono text-sm space-y-1">
          {children}
        </div>
      </div>
    </div>
  );
}

function LsCommand() {
  return (
    <TerminalOutput>
      <p className="text-terminal-gray">$ ls -la</p>
      <p className="text-terminal-blue">drwxr-xr-x</p>
      <p className="text-terminal-cyan">📁 skills/</p>
      <p className="text-terminal-cyan">📁 projects/</p>
      <p className="text-terminal-cyan">📁 secret_stuff/</p>
      <p className="text-terminal-green">📄 resume.pdf</p>
      <p className="text-terminal-green">📄 cover_letter.txt</p>
      <p className="text-terminal-yellow">🔒 classified.zip</p>
      <p className="text-terminal-red">💀 do_not_open.exe</p>
      <p className="text-terminal-gray mt-2 text-xs">Total: 42 items (nice try!)</p>
    </TerminalOutput>
  );
}

function CdCommand() {
  return (
    <TerminalOutput>
      <p className="text-terminal-gray">$ cd secret_stuff/</p>
      <p className="text-terminal-red">bash: cd: secret_stuff/: Permission denied</p>
      <p className="text-terminal-yellow mt-2">🔐 Nice try! This folder is protected.</p>
      <p className="text-terminal-gray text-xs mt-1">Hint: Try &quot;sudo&quot; instead...</p>
    </TerminalOutput>
  );
}

function WhoamiCommand() {
  return (
    <TerminalOutput>
      <p className="text-terminal-gray">$ whoami</p>
      <p className="text-terminal-green">awesome_visitor</p>
      <p className="text-terminal-cyan mt-2">UID: 1337 (elite)</p>
      <p className="text-terminal-cyan">GID: 42 (hitchhikers)</p>
      <p className="text-terminal-yellow">Groups: developers, coffee_addicts, night_owls</p>
      <p className="text-terminal-gray text-xs mt-2">You are amazing! 🌟</p>
    </TerminalOutput>
  );
}

function PwdCommand() {
  return (
    <TerminalOutput>
      <p className="text-terminal-gray">$ pwd</p>
      <p className="text-terminal-green">/home/visitor/jerinmr-portfolio/easter-eggs</p>
      <p className="text-terminal-cyan mt-2">📍 You are here: The secret corner of the internet</p>
      <p className="text-terminal-gray text-xs">Coordinates: 10.8505° N, 76.2711° E (Kerala, India)</p>
    </TerminalOutput>
  );
}

function CatCommand() {
  return (
    <TerminalOutput>
      <p className="text-terminal-gray">$ cat secrets.txt</p>
      <pre className="text-terminal-yellow mt-2 text-xs">
{`
   /\\_/\\  
  ( o.o ) 
   > ^ <
  /|   |\\
 (_|   |_)
`}
      </pre>
      <p className="text-terminal-green">Meow! You found the cat! 🐱</p>
      <p className="text-terminal-gray text-xs mt-1">Fun fact: This cat knows all the secrets.</p>
    </TerminalOutput>
  );
}

function RmCommand() {
  return (
    <TerminalOutput>
      <p className="text-terminal-gray">$ rm -rf /</p>
      <p className="text-terminal-red animate-pulse">⚠️ DANGER ZONE ⚠️</p>
      <p className="text-terminal-red mt-2">rm: cannot remove &apos;/&apos;: Nice try!</p>
      <p className="text-terminal-yellow mt-2">This is a protected system.</p>
      <p className="text-terminal-gray text-xs mt-1">No websites were harmed in this attempt. 😅</p>
    </TerminalOutput>
  );
}

function PingCommand() {
  return (
    <TerminalOutput>
      <p className="text-terminal-gray">$ ping localhost</p>
      <p className="text-terminal-green">PING localhost (127.0.0.1): 56 data bytes</p>
      <p className="text-terminal-cyan">64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms</p>
      <p className="text-terminal-cyan">64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.069 ms</p>
      <p className="text-terminal-cyan">64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.051 ms</p>
      <p className="text-terminal-yellow mt-2">🏓 Pong! Connection is great!</p>
    </TerminalOutput>
  );
}

function HelpCommand() {
  return (
    <TerminalOutput>
      <p className="text-terminal-gray">$ help</p>
      <p className="text-terminal-green font-bold mt-2">Available Easter Egg Commands:</p>
      <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
        <p className="text-terminal-cyan">hack</p><p className="text-terminal-gray">- Hacker mode</p>
        <p className="text-terminal-cyan">matrix</p><p className="text-terminal-gray">- Matrix rain</p>
        <p className="text-terminal-cyan">sudo</p><p className="text-terminal-gray">- Root access</p>
        <p className="text-terminal-cyan">hello</p><p className="text-terminal-gray">- Greeting</p>
        <p className="text-terminal-cyan">coffee</p><p className="text-terminal-gray">- Coffee break</p>
        <p className="text-terminal-cyan">party</p><p className="text-terminal-gray">- Celebration</p>
        <p className="text-terminal-cyan">ls</p><p className="text-terminal-gray">- List files</p>
        <p className="text-terminal-cyan">whoami</p><p className="text-terminal-gray">- Who are you</p>
        <p className="text-terminal-cyan">neofetch</p><p className="text-terminal-gray">- System info</p>
      </div>
      <p className="text-terminal-yellow mt-2 text-xs">🎮 Konami Code: ↑↑↓↓←→←→BA</p>
    </TerminalOutput>
  );
}

function ExitCommand() {
  return (
    <TerminalOutput>
      <p className="text-terminal-gray">$ exit</p>
      <p className="text-terminal-yellow mt-2">👋 Goodbye!</p>
      <p className="text-terminal-cyan">Thanks for visiting!</p>
      <p className="text-terminal-gray text-xs mt-2">Just kidding, you can&apos;t leave that easily! 😄</p>
      <p className="text-terminal-green mt-1">Connection maintained.</p>
    </TerminalOutput>
  );
}

function ClearCommand() {
  return (
    <TerminalOutput>
      <p className="text-terminal-gray">$ clear</p>
      <p className="text-terminal-cyan mt-4 text-center">Screen cleared! ✨</p>
      <p className="text-terminal-gray text-xs text-center mt-2">(But the memories remain...)</p>
    </TerminalOutput>
  );
}

function NeofetchCommand() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="bg-card/95 border border-terminal-green p-6 rounded-lg shadow-2xl animate-scale-in max-w-lg w-full mx-4">
        <div className="font-mono text-xs flex gap-4">
          <pre className="text-terminal-green">
{`        _,met$$$$$gg.
     ,g$$$$$$$$$$$$$$$P.
   ,g$$P"     """Y$$.".
  ,$$P'              \`$$$.
',$$P       ,ggs.     \`$$b:
\`d$$'     ,$P"'   .    $$$
 $$P      d$'     ,    $$P
 $$:      $$.   -    ,d$$'
 $$;      Y$b._   _,d$P'
 Y$$.    \`.\`"Y$$$$P"'
 \`$$b      "-.__
  \`Y$$
   \`Y$$.
     \`$$b.
       \`Y$$b.
          \`"Y$b._
              \`"""
`}
          </pre>
          <div className="text-terminal-gray space-y-0.5">
            <p><span className="text-terminal-green">visitor</span>@<span className="text-terminal-green">jerinmr</span></p>
            <p>------------------</p>
            <p><span className="text-terminal-cyan">OS:</span> JerinOS 2.0</p>
            <p><span className="text-terminal-cyan">Host:</span> Portfolio v3.0</p>
            <p><span className="text-terminal-cyan">Kernel:</span> React 18.3.1</p>
            <p><span className="text-terminal-cyan">Uptime:</span> Since 2024</p>
            <p><span className="text-terminal-cyan">Shell:</span> zsh 5.9</p>
            <p><span className="text-terminal-cyan">Terminal:</span> Web Browser</p>
            <p><span className="text-terminal-cyan">CPU:</span> Your Brain</p>
            <p><span className="text-terminal-cyan">Memory:</span> ∞ / ∞ MB</p>
            <p className="pt-2">
              <span className="inline-block w-3 h-3 bg-terminal-red mr-1"></span>
              <span className="inline-block w-3 h-3 bg-terminal-green mr-1"></span>
              <span className="inline-block w-3 h-3 bg-terminal-yellow mr-1"></span>
              <span className="inline-block w-3 h-3 bg-terminal-blue mr-1"></span>
              <span className="inline-block w-3 h-3 bg-terminal-magenta mr-1"></span>
              <span className="inline-block w-3 h-3 bg-terminal-cyan"></span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EasterEggEffects({ effect, onClear }: EasterEggEffectsProps) {
  useEffect(() => {
    if (effect) {
      const handleClick = () => onClear();
      const handleKey = () => onClear();
      
      // Allow dismissing effects by clicking or pressing any key
      const timer = setTimeout(() => {
        window.addEventListener('click', handleClick, { once: true });
        window.addEventListener('keydown', handleKey, { once: true });
      }, 1000);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('click', handleClick);
        window.removeEventListener('keydown', handleKey);
      };
    }
  }, [effect, onClear]);

  if (!effect) return null;

  switch (effect) {
    case 'matrix':
      return <MatrixRain />;
    case 'hacker':
      return <HackerMode />;
    case 'sudo':
      return <SudoMode />;
    case 'hello':
      return <HelloMessage />;
    case 'coffee':
      return <CoffeeBreak />;
    case 'party':
      return <PartyMode />;
    case 'glitch':
      return <GlitchEffect />;
    case 'ls':
      return <LsCommand />;
    case 'cd':
      return <CdCommand />;
    case 'whoami':
      return <WhoamiCommand />;
    case 'pwd':
      return <PwdCommand />;
    case 'cat':
      return <CatCommand />;
    case 'rm':
      return <RmCommand />;
    case 'ping':
      return <PingCommand />;
    case 'help':
      return <HelpCommand />;
    case 'exit':
      return <ExitCommand />;
    case 'clear':
      return <ClearCommand />;
    case 'neofetch':
      return <NeofetchCommand />;
    default:
      return null;
  }
}
