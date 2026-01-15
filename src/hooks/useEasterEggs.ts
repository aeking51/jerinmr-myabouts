import { useEffect, useState, useCallback } from 'react';
import { type EasterEggEffect } from '@/components/EasterEggEffects';

// Konami Code sequence
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

// Secret commands that can be typed anywhere
const SECRET_COMMANDS: Record<string, EasterEggEffect> = {
  'hack': 'hacker',
  'matrix': 'matrix',
  'sudo': 'sudo',
  'hello': 'hello',
  'coffee': 'coffee',
  'party': 'party',
  'ls': 'ls',
  'cd': 'cd',
  'whoami': 'whoami',
  'pwd': 'pwd',
  'cat': 'cat',
  'rm': 'rm',
  'ping': 'ping',
  'help': 'help',
  'exit': 'exit',
  'clear': 'clear',
  'neofetch': 'neofetch',
};

export function useEasterEggs() {
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [typedKeys, setTypedKeys] = useState('');
  const [activeEffect, setActiveEffect] = useState<EasterEggEffect>(null);
  const [headerClickCount, setHeaderClickCount] = useState(0);

  // Console Easter eggs - run once on mount
  useEffect(() => {
    console.log('%c🔓 You found the console! Here are some secrets:', 'color: #00ff00; font-size: 16px; font-weight: bold;');
    console.log('%c' + `
    ╔══════════════════════════════════════════════════════╗
    ║                    EASTER EGGS                       ║
    ╠══════════════════════════════════════════════════════╣
    ║  🎮 Konami Code: ↑↑↓↓←→←→BA                         ║
    ║  💻 Type "hack" anywhere for hacker mode            ║
    ║  🟢 Type "matrix" for Matrix rain                   ║
    ║  🔐 Type "sudo" for root access                     ║
    ║  👋 Type "hello" for a greeting                     ║
    ║  ☕ Type "coffee" for a surprise                    ║
    ║  🎉 Type "party" for celebration                    ║
    ║  🖱️ Triple-click the header for glitch effect       ║
    ╚══════════════════════════════════════════════════════╝
    `, 'color: #00ff00; font-family: monospace;');
    console.log('%c⚡ Built with passion by Jerin M R', 'color: #ffcc00; font-size: 12px;');
    console.log('%c🎵 Never gonna give you up... (or am I?)', 'color: #ff6b6b; font-size: 10px;');
  }, []);

  // Konami Code detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check Konami code
      if (e.code === KONAMI_CODE[konamiIndex]) {
        const newIndex = konamiIndex + 1;
        setKonamiIndex(newIndex);
        
        if (newIndex === KONAMI_CODE.length) {
          setActiveEffect('matrix');
          setKonamiIndex(0);
          setTimeout(() => setActiveEffect(null), 10000);
        }
      } else {
        setKonamiIndex(0);
      }

      // Secret command detection (only for letter keys)
      if (e.code.startsWith('Key')) {
        const letter = e.code.replace('Key', '').toLowerCase();
        const newTyped = (typedKeys + letter).slice(-10);
        setTypedKeys(newTyped);

        // Check for secret commands
        for (const [command, effect] of Object.entries(SECRET_COMMANDS)) {
          if (newTyped.endsWith(command)) {
            setActiveEffect(effect);
            setTypedKeys('');
            setTimeout(() => setActiveEffect(null), 5000);
            break;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex, typedKeys]);

  // Header click handler for glitch effect
  const handleHeaderClick = useCallback(() => {
    const newCount = headerClickCount + 1;
    setHeaderClickCount(newCount);
    
    if (newCount >= 3) {
      setActiveEffect('glitch');
      setHeaderClickCount(0);
      setTimeout(() => setActiveEffect(null), 3000);
    }

    // Reset click count after 1 second of no clicks
    setTimeout(() => setHeaderClickCount(0), 1000);
  }, [headerClickCount]);

  const triggerRickroll = useCallback(() => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  }, []);

  return {
    activeEffect,
    handleHeaderClick,
    triggerRickroll,
    clearEffect: () => setActiveEffect(null),
  };
}
