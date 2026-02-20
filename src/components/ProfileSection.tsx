import { memo } from 'react';
import { MapPin, Mail, Phone, Linkedin } from 'lucide-react';
import { NewsRibbon } from './NewsRibbon';
import { QuickLinksColumn } from './QuickLinksColumn';

export const ProfileSection = memo(function ProfileSection() {
  return (
    <section className="space-y-4" aria-label="Profile overview">
      <div className="border border-terminal-green p-3 sm:p-4 bg-card/50">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="font-mono">
                <h1 className="text-terminal-green text-lg sm:text-xl font-bold">Jerin M R</h1>
                <p className="text-terminal-cyan text-base sm:text-lg">Entry-Level IT Professional</p>
                <p className="text-terminal-gray text-sm sm:text-base">Networking & Server Administration</p>
              </div>
              
              <address className="text-xs sm:text-sm space-y-1 font-mono not-italic">
                <div className="flex items-center gap-1 sm:gap-2 text-terminal-amber">
                  <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                  <span>Thrissur, Kerala</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-terminal-cyan">
                  <Mail className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                  <a href="mailto:jerinmr@hotmail.com" className="break-all hover:underline">jerinmr@hotmail.com</a>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-terminal-blue">
                  <Phone className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                  <a href="tel:+918848158987" className="hover:underline">8848158987</a>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-terminal-magenta">
                  <Linkedin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                  <a href="https://linkedin.com/in/jerinmr51" target="_blank" rel="noopener noreferrer" className="break-all hover:underline">linkedin.com/in/jerinmr51</a>
                </div>
              </address>
            </div>
          
            <div className="mt-4 pt-4 border-t border-terminal-gray/30">
              <p className="text-xs sm:text-sm text-foreground font-mono leading-relaxed">
                I'm an entry-level IT professional with practical experience in Cisco networking, 
                Linux/Windows servers, and AWS. I specialize in finding secure, efficient solutions 
                across IT environments.
              </p>
            </div>
          </div>

          <div className="lg:w-48 lg:border-l lg:border-terminal-gray/30 lg:pl-4">
            <QuickLinksColumn />
          </div>
        </div>
        
        <NewsRibbon />
      </div>
    </section>
  );
});
