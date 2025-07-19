import { useState, useEffect } from 'react';
import { TerminalPrompt } from './TerminalPrompt';

interface WelcomeAnimationProps {
  onComplete: () => void;
}

export function WelcomeAnimation({ onComplete }: WelcomeAnimationProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      command: "ssh guest@jerinmr.tech",
      output: "Connecting to jerinmr.tech...\nConnection established.\nWelcome to Jerin M R's portfolio terminal!"
    },
    {
      command: "whoami",
      output: "guest"
    },
    {
      command: "ls -la",
      output: `total 8
drwxr-xr-x  5 jerin jerin  4096 Nov 15 14:30 .
drwxr-xr-x  3 root  root   4096 Nov 15 14:00 ..
-rw-r--r--  1 jerin jerin   220 Nov 15 14:30 about.txt
-rw-r--r--  1 jerin jerin   180 Nov 15 14:30 skills.txt
-rw-r--r--  1 jerin jerin   150 Nov 15 14:30 experience.log
-rw-r--r--  1 jerin jerin   120 Nov 15 14:30 contact.txt
-rw-r--r--  1 jerin jerin  2048 Nov 15 14:30 resume.pdf`
    },
    {
      command: "cat welcome.txt",
      output: `██╗  ██╗███████╗██████╗ ██╗███╗   ██╗    ███╗   ███╗    ██████╗ 
██║  ██║██╔════╝██╔══██╗██║████╗  ██║    ████╗ ████║    ██╔══██╗
███████║█████╗  ██████╔╝██║██╔██╗ ██║    ██╔████╔██║    ██████╔╝
██╔══██║██╔══╝  ██╔══██╗██║██║╚██╗██║    ██║╚██╔╝██║    ██╔══██╗
██║  ██║███████╗██║  ██║██║██║ ╚████║    ██║ ╚═╝ ██║    ██║  ██║
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝    ╚═╝     ╚═╝    ╚═╝  ╚═╝

Entry-Level IT Professional | Networking & Server Administration
Specializing in Cisco, Linux, AWS & Network Security

Type 'help' for available commands or click the navigation above.`
    }
  ];

  useEffect(() => {
    if (step < steps.length) {
      const totalDelay = step === 0 ? 1000 : 3000;
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, totalDelay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  return (
    <div className="space-y-4">
      {steps.slice(0, step).map((stepData, index) => (
        <TerminalPrompt
          key={index}
          command={stepData.command}
          output={stepData.output}
          delay={index === 0 ? 500 : 0}
          showCursor={index === step - 1}
        />
      ))}
    </div>
  );
}