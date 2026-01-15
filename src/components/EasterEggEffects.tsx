import { useEffect, useState } from 'react';

interface EasterEggEffectsProps {
  effect: 'matrix' | 'hacker' | 'sudo' | 'hello' | 'coffee' | 'party' | 'glitch' | 'rickroll' | null;
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
    default:
      return null;
  }
}
