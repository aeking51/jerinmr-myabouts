import { useState, useEffect } from 'react';

interface TerminalPromptProps {
  command: string;
  output?: string;
  delay?: number;
  showCursor?: boolean;
}

export function TerminalPrompt({ command, output, delay = 0, showCursor = true }: TerminalPromptProps) {
  const [displayedCommand, setDisplayedCommand] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index <= command.length) {
          setDisplayedCommand(command.slice(0, index));
          index++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          if (output) {
            setTimeout(() => setShowOutput(true), 500);
          }
        }
      }, 50);
    }, delay);

    return () => clearTimeout(timer);
  }, [command, output, delay]);

  return (
    <div className="font-mono text-xs sm:text-sm">
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-terminal-green">
        <span className="text-terminal-gray hidden sm:inline">guest@jerinmr</span>
        <span className="text-terminal-gray sm:hidden">~</span>
        <span className="text-terminal-gray hidden sm:inline">:</span>
        <span className="text-terminal-cyan hidden sm:inline">~/portfolio</span>
        <span className="text-terminal-gray">$</span>
        <span className="break-all">{displayedCommand}</span>
        {showCursor && (isTyping || !output) && (
          <span className="animate-terminal-blink text-terminal-green">_</span>
        )}
      </div>
      
      {showOutput && output && (
        <div className="mt-2 text-foreground whitespace-pre-wrap break-words overflow-x-auto text-xs sm:text-sm">
          {output}
        </div>
      )}
    </div>
  );
}