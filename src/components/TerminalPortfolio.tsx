import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TerminalHeader } from './TerminalHeader';
import { TerminalNavigation } from './TerminalNavigation';
import { WelcomeAnimation } from './WelcomeAnimation';
import { ProfileSection } from './ProfileSection';
import { NetworkWarning } from './NetworkWarning';
import { ProfileInfoSection } from './sections/ProfileInfoSection';
import { ContactSection } from './sections/ContactSection';
import { NetworkToolsSection } from './sections/NetworkToolsSection';
import { UtilityToolsSection } from './sections/UtilityToolsSection';
import { ArticlesSection } from './sections/ArticlesSection';
import { EasterEggEffects } from './EasterEggEffects';
import { SshSimulator } from './SshSimulator';
import { useEasterEggs } from '@/hooks/useEasterEggs';

export function TerminalPortfolio() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(() => {
    // Skip animation if already played this session
    return sessionStorage.getItem('welcomeAnimationPlayed') === 'true';
  });
  const [activeSection, setActiveSection] = useState('home');
  const [theme, setTheme] = useState<'dark' | 'light' | 'eye-comfort'>('dark');
  const [visitorIP, setVisitorIP] = useState<string>('');
  const [visitorLocation, setVisitorLocation] = useState<string>('');
  const [adminClicks, setAdminClicks] = useState(0);
  const { activeEffect, handleHeaderClick, clearEffect, showSshSimulator, closeSshSimulator } = useEasterEggs();

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

  const handleAdminAccess = () => {
    setAdminClicks(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        navigate('/admin/visitors');
        return 0;
      }
      return newCount;
    });
  };

  const renderSection = () => {
    if (!isLoaded) {
      return <WelcomeAnimation onComplete={() => {
        sessionStorage.setItem('welcomeAnimationPlayed', 'true');
        setIsLoaded(true);
      }} />;
    }

    switch (activeSection) {
      case 'home':
        return <ProfileSection />;
      case 'profile':
        return <ProfileInfoSection />;
      case 'articles':
        return <ArticlesSection />;
      case 'contact':
        return <ContactSection />;
      case 'network':
        return <NetworkToolsSection />;
      case 'utilities':
        return <UtilityToolsSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-2 sm:px-4">
      <NetworkWarning />
      <EasterEggEffects effect={activeEffect} onClear={clearEffect} />
      {showSshSimulator && <SshSimulator onClose={closeSshSimulator} />}
      <div className="max-w-6xl mx-auto border border-border bg-card shadow-2xl min-h-screen sm:min-h-0">
        <TerminalHeader 
          onThemeToggle={handleThemeToggle} 
          theme={theme}
          onHeaderClick={handleHeaderClick}
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
              <span 
                className="w-2 h-2 bg-terminal-green rounded-full animate-pulse cursor-pointer" 
                onClick={handleAdminAccess}
                title={adminClicks > 0 ? `${5 - adminClicks} more clicks` : ''}
              ></span>
              Connected {visitorIP && `- IP: ${visitorIP}`} {visitorLocation && `- ${visitorLocation}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}