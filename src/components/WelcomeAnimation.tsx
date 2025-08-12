import { useState, useEffect } from 'react';
import { TerminalPrompt } from './TerminalPrompt';
import { 
  Code2, 
  Database, 
  Globe, 
  Palette, 
  Zap, 
  Shield, 
  Settings, 
  Cloud,
  Smartphone,
  Monitor
} from 'lucide-react';

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
      command: "cat tech-stack.json",
      output: null // Will be rendered as a special component
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

  const technologies = [
    { name: 'React', icon: Code2, description: 'Frontend Framework', color: 'text-blue-500' },
    { name: 'TypeScript', icon: Code2, description: 'Type-safe JavaScript', color: 'text-blue-600' },
    { name: 'Tailwind CSS', icon: Palette, description: 'Utility-first CSS', color: 'text-cyan-500' },
    { name: 'Vite', icon: Zap, description: 'Lightning-fast build tool', color: 'text-yellow-500' },
    { name: 'Supabase', icon: Database, description: 'Backend-as-a-Service', color: 'text-green-500' },
    { name: 'Lucide Icons', icon: Shield, description: 'Beautiful SVG icons', color: 'text-orange-500' },
    { name: 'Radix UI', icon: Settings, description: 'Accessible components', color: 'text-purple-500' },
    { name: 'React Router', icon: Globe, description: 'Client-side routing', color: 'text-red-500' },
    { name: 'React Query', icon: Cloud, description: 'Data fetching library', color: 'text-indigo-500' },
    { name: 'Responsive Design', icon: Smartphone, description: 'Mobile-first approach', color: 'text-pink-500' }
  ];

  const renderTechStack = () => (
    <div className="animate-fade-in">
      <div className="text-terminal-green font-mono text-sm mb-4">
        {`{
  "portfolio_tech_stack": {
    "framework": "React + TypeScript",
    "styling": "Tailwind CSS",
    "backend": "Supabase",
    "deployment": "Vercel"
  },
  "technologies": [`}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-4 mb-4">
        {technologies.map((tech, index) => (
          <div 
            key={tech.name} 
            className="flex items-center gap-3 animate-fade-in opacity-0 font-mono text-sm"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'forwards'
            }}
          >
            <tech.icon className={`w-4 h-4 ${tech.color}`} />
            <span className="text-terminal-green">{tech.name}</span>
            <span className="text-terminal-gray text-xs">- {tech.description}</span>
          </div>
        ))}
      </div>
      <div className="text-terminal-green font-mono text-sm">
        {`  ]
}`}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {steps.slice(0, step).map((stepData, index) => (
        <div key={index}>
          {stepData.output === null ? (
            <div className="space-y-2">
              <TerminalPrompt
                command={stepData.command}
                output=""
                delay={0}
                showCursor={false}
              />
              {renderTechStack()}
            </div>
          ) : (
            <TerminalPrompt
              command={stepData.command}
              output={stepData.output}
              delay={index === 0 ? 500 : 0}
              showCursor={index === step - 1}
            />
          )}
        </div>
      ))}
    </div>
  );
}