import { User, MapPin, Mail, Phone, Linkedin, Download } from 'lucide-react';
import { Button } from './ui/button';

export function ProfileSection() {
  const profileImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80";

  const handleResumeDownload = () => {
    // Simulate resume download
    console.log("wget resume.pdf");
    alert("Downloading resume.pdf...\n[====================] 100%\nDownload complete!");
  };

  return (
    <div className="space-y-4">
      <div className="border border-terminal-green p-4 bg-card/50">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={profileImage}
              alt="Jerin M R"
              className="w-20 h-20 rounded border-2 border-terminal-green"
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-terminal-green rounded-full animate-pulse"></div>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="font-mono">
              <div className="text-terminal-green text-lg font-bold">Jerin M R</div>
              <div className="text-terminal-cyan">Entry-Level IT Professional</div>
              <div className="text-terminal-gray">Networking & Server Administration</div>
            </div>
            
            <div className="text-sm space-y-1 font-mono">
              <div className="flex items-center gap-2 text-terminal-amber">
                <MapPin className="w-3 h-3" />
                <span>Thrissur, Kerala</span>
              </div>
              <div className="flex items-center gap-2 text-terminal-cyan">
                <Mail className="w-3 h-3" />
                <span>jerinmr@hotmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-terminal-blue">
                <Phone className="w-3 h-3" />
                <span>8848158987</span>
              </div>
              <div className="flex items-center gap-2 text-terminal-magenta">
                <Linkedin className="w-3 h-3" />
                <span>linkedin.com/in/jerinmr51</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-terminal-gray/30">
          <p className="text-sm text-foreground font-mono leading-relaxed">
            I'm an entry-level IT professional with practical experience in Cisco networking, 
            Linux/Windows servers, and AWS. I specialize in finding secure, efficient solutions 
            across IT environments.
          </p>
          
          <div className="mt-4">
            <Button
              onClick={handleResumeDownload}
              variant="outline"
              size="sm"
              className="font-mono text-terminal-green border-terminal-green hover:bg-terminal-green hover:text-background"
            >
              <Download className="w-4 h-4 mr-2" />
              wget resume.pdf
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}