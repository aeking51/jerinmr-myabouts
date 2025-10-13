import { User, MapPin, Mail, Phone, Linkedin } from 'lucide-react';
import { NewsRibbon } from './NewsRibbon';

export function ProfileSection() {

  return (
    <div className="space-y-4">
      <div className="border border-terminal-green p-3 sm:p-4 bg-card/50">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="font-mono">
              <div className="text-terminal-green text-lg sm:text-xl font-bold">Jerin M R</div>
              <div className="text-terminal-cyan text-base sm:text-lg">Entry-Level IT Professional</div>
              <div className="text-terminal-gray text-sm sm:text-base">Networking & Server Administration</div>
            </div>
            
            <div className="text-xs sm:text-sm space-y-1 font-mono">
              <div className="flex items-center gap-1 sm:gap-2 text-terminal-amber">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span>Thrissur, Kerala</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-terminal-cyan">
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span className="break-all">jerinmr@hotmail.com</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-terminal-blue">
                <Phone className="w-3 h-3 flex-shrink-0" />
                <span>8848158987</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-terminal-magenta">
                <Linkedin className="w-3 h-3 flex-shrink-0" />
                <span className="break-all">linkedin.com/in/jerinmr51</span>
              </div>
            </div>
          </div>
        
        <div className="mt-4 pt-4 border-t border-terminal-gray/30">
          <p className="text-xs sm:text-sm text-foreground font-mono leading-relaxed">
            I'm an entry-level IT professional with practical experience in Cisco networking, 
            Linux/Windows servers, and AWS. I specialize in finding secure, efficient solutions 
            across IT environments.
          </p>
          
        </div>
        </div>
        
        <NewsRibbon />
      </div>
    </div>
  );
}