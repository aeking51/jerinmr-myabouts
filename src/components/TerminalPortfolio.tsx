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
  const [theme, setTheme] = useState<'dark' | 'light' | 'eye-comfort'>('dark');
  const [visitorIP, setVisitorIP] = useState<string>('');
  const [visitorLocation, setVisitorLocation] = useState<string>('');

  useEffect(() => {
    // Fetch visitor IP and location
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        setVisitorIP(data.ip || '127.0.0.1');
        setVisitorLocation(data.city && data.country ? `${data.city}, ${data.country}` : '');
      })
      .catch(() => {
        setVisitorIP('127.0.0.1');
        setVisitorLocation('');
      });
  }, []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(current => 
      current === 'dark' ? 'light' : 
      current === 'light' ? 'eye-comfort' : 
      'dark'
    );
  };

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
          onThemeToggle={handleThemeToggle} 
          theme={theme}
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
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-terminal-green rounded-full animate-pulse"></span>
              Connected {visitorIP && `- IP: ${visitorIP}`} {visitorLocation && `- ${visitorLocation}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}