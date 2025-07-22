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
      command: "ip addr show",
      output: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
    
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP
    link/ether 08:00:27:ab:cd:ef brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0
    
3: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP
    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff
    inet 10.0.0.15/24 brd 10.0.0.255 scope global wlan0

Welcome to Jerin M R's Network Terminal!
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