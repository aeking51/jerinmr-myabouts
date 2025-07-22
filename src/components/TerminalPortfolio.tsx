import { useState, useEffect } from 'react';
import { TerminalHeader } from './TerminalHeader';
import { TerminalNavigation } from './TerminalNavigation';
import { WelcomeAnimation } from './WelcomeAnimation';
import { ProfileSection } from './ProfileSection';
import { AboutSection } from './sections/AboutSection';
import { SkillsSection } from './sections/SkillsSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { ContactSection } from './sections/ContactSection';

export function TerminalPortfolio() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isLight, setIsLight] = useState(false);
  const [visitorIP, setVisitorIP] = useState<string>('');

  useEffect(() => {
    // Fetch visitor IP
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setVisitorIP(data.ip))
      .catch(() => setVisitorIP('127.0.0.1'));
  }, []);

  useEffect(() => {
    document.body.className = isLight ? 'light' : '';
  }, [isLight]);

  const renderSection = () => {
    if (!isLoaded) {
      return <WelcomeAnimation onComplete={() => setIsLoaded(true)} />;
    }

    switch (activeSection) {
      case 'home':
        return <ProfileSection />;
      case 'about':
        return <AboutSection />;
      case 'skills':
        return <SkillsSection />;
      case 'experience':
        return <ExperienceSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-2 sm:px-4">
      <div className="max-w-6xl mx-auto border border-border bg-card shadow-2xl min-h-screen sm:min-h-0">
        <TerminalHeader 
          onThemeToggle={() => setIsLight(!isLight)} 
          isLight={isLight} 
        />
        
        {isLoaded && (
          <TerminalNavigation 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
        )}
        
        <div className="p-3 sm:p-6 min-h-[400px] sm:min-h-[600px] overflow-auto">
          {renderSection()}
        </div>
        
        <div className="px-3 sm:px-6 py-2 bg-muted border-t border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono text-terminal-gray gap-2 sm:gap-0">
            <span className="hidden sm:inline">Terminal ready - Type 'help' for commands</span>
            <span className="sm:hidden">Terminal ready</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-terminal-green rounded-full animate-pulse"></span>
              Connected {visitorIP && `- IP: ${visitorIP}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}