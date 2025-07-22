import { useState, useEffect } from 'react';
import { TerminalPrompt } from './TerminalPrompt';

interface WelcomeAnimationProps {
  onComplete: () => void;
}

export function WelcomeAnimation({ onComplete }: WelcomeAnimationProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      command: "ssh guest@jerinmr.myabouts",
      output: "Connecting to jerinmr.myabouts...\nConnection established.\nWelcome to Jerin M R's portfolio terminal!"
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
      command: "neofetch",
      output: `                   -\`                    guest@jerinmr.myabouts 
                  .o+\`                   ----------------------------- 
                 \`ooo/                   OS: Ubuntu 22.04.3 LTS x86_64 
                \`+oooo:                  Host: Portfolio Terminal v2.1 
               \`+oooooo:                 Kernel: 5.15.0-88-generic 
               -+oooooo+:                Uptime: 2 days, 14 hours, 32 mins 
             \`/:-:++oooo+:               Packages: 1847 (dpkg), 15 (snap) 
            \`/++++/+++++++:              Shell: bash 5.1.16 
           \`/++++++++++++++:             Resolution: 1920x1080 
          \`/+++ooooooooooooo/\`           DE: Terminal Portfolio Interface 
         ./ooosssso++osssssso+\`          WM: Tmux 3.2a 
        .oossssso-\`\`\`\`/ossssss+\`         Theme: Matrix Green [GTK3] 
       -osssssso.      :ssssssso.        Icons: Terminal Classic 
      :osssssss/        osssso+++.       Terminal: portfolio-term 
     /ossssssss/        +ssssooo/-       CPU: Intel i7-12700K (16) @ 3.60GHz 
   \`/ossssso+/:-        -:/+osssso+-     GPU: NVIDIA GeForce RTX 3070 
  \`+sso+:-\`                 \`.-/+oso:    Memory: 2847MiB / 32768MiB 
 \`++:.                           \`-/+/
 .\`                                 \`/   Role: Entry-Level IT Professional
                                         Focus: Networking & Server Administration
                                         Skills: Cisco, Linux, AWS, Cybersecurity
                                         
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