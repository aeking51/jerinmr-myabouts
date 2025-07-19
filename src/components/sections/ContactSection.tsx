import { useState } from 'react';
import { TerminalPrompt } from '../TerminalPrompt';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Send, Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

export function ContactSection() {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const contactOutput = `
┌─ WHOIS LOOKUP RESULT ─────────────────────────────────────────────┐
│                                                                   │
│  Domain: jerinmr.tech                                             │
│  Owner: Jerin M R                                                 │
│  Type: Personal Portfolio & Professional Contact                  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

Contact Information:
├── Primary Contact
│   ├── Email     : jerinmr@hotmail.com
│   ├── Phone     : +91 8848158987
│   └── Location  : Thrissur, Kerala, India
│
├── Professional Networks
│   ├── LinkedIn  : linkedin.com/in/jerinmr51
│   ├── GitHub    : github.com/jerinmr (coming soon)
│   └── Portfolio : jerinmr.tech
│
├── Availability
│   ├── Status    : Available for full-time opportunities
│   ├── Preferred : Networking, Server Admin, Cloud roles
│   ├── Location  : Open to relocation within India
│   └── Remote    : Available for remote/hybrid work
│
└── Response Time
    ├── Email     : Within 24 hours
    ├── Phone     : Mon-Fri 9AM-6PM IST
    └── LinkedIn  : Within 12 hours

Preferred Contact Methods:
1. Email (Professional inquiries)
2. LinkedIn (Networking & opportunities)  
3. Phone (Urgent matters only)

Best Times to Reach:
• Morning: 9:00 AM - 12:00 PM IST
• Evening: 6:00 PM - 8:00 PM IST
• Weekends: Limited availability
`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate terminal output
    setTimeout(() => {
      alert(`Message sent via terminal!\n\nFrom: ${name}\nEmail: ${email}\nMessage: ${message}\n\n[STATUS] Message queued for delivery\n[INFO] Response expected within 24 hours`);
      setMessage('');
      setName('');
      setEmail('');
      setSubmitted(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <TerminalPrompt
        command="whois jerinmr"
        output={contactOutput}
        showCursor={false}
      />
      
      <div className="border border-terminal-green p-4 bg-card/50">
        <div className="font-mono text-terminal-green mb-4">
          guest@jerinmr.tech:~/contact$ nano message.txt
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono text-terminal-cyan mb-2">
                Name:
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-mono bg-background border-terminal-gray"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-terminal-cyan mb-2">
                Email:
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-mono bg-background border-terminal-gray"
                placeholder="your.email@domain.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-mono text-terminal-cyan mb-2">
              Message:
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="font-mono bg-background border-terminal-gray min-h-[120px]"
              placeholder="Type your message here..."
              required
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={submitted}
              className="font-mono bg-terminal-green text-background hover:bg-terminal-green-bright"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitted ? 'Sending...' : 'send message.txt'}
            </Button>
            
            <div className="text-sm text-terminal-gray font-mono">
              {submitted ? 'Transmitting...' : `${message.length} characters`}
            </div>
          </div>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          href="mailto:jerinmr@hotmail.com"
          className="flex items-center gap-2 p-3 border border-terminal-cyan rounded bg-card/30 hover:bg-terminal-cyan hover:text-background transition-colors"
        >
          <Mail className="w-4 h-4" />
          <span className="font-mono text-sm">Email</span>
        </a>
        
        <a
          href="tel:+918848158987"
          className="flex items-center gap-2 p-3 border border-terminal-blue rounded bg-card/30 hover:bg-terminal-blue hover:text-background transition-colors"
        >
          <Phone className="w-4 h-4" />
          <span className="font-mono text-sm">Call</span>
        </a>
        
        <a
          href="https://linkedin.com/in/jerinmr51"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 border border-terminal-magenta rounded bg-card/30 hover:bg-terminal-magenta hover:text-background transition-colors"
        >
          <Linkedin className="w-4 h-4" />
          <span className="font-mono text-sm">LinkedIn</span>
        </a>
        
        <div className="flex items-center gap-2 p-3 border border-terminal-gray rounded bg-card/30 text-terminal-gray">
          <MapPin className="w-4 h-4" />
          <span className="font-mono text-sm">Thrissur, KL</span>
        </div>
      </div>
    </div>
  );
}