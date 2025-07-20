import { TerminalPrompt } from '../TerminalPrompt';

export function AboutSection() {
  const aboutOutput = `
╭─ Personal Information ─────────────────────────────────────────────╮
│                                                                    │
│  Name: Jerin M R                                                   │
│  Role: Entry-Level IT Professional                                 │
│  Focus: Networking, Server Administration, Cloud Infrastructure & Cybersecurity   │
│                                                                    │
│                                                                    │
╰────────────────────────────────────────────────────────────────────╯

Education:
├── Advanced Diploma in Networking (Sep 2024 - May 2025)
│   ├── Institution: Synenfo Solutions, Ernakulam
│   ├── Coursework: CompTIA A+, CCNA, RHCE, AWS
│   └── Focus: Enterprise networking and cloud technologies
│
├── Diploma in Computer Engineering (Sep 2021 - Jun 2024)
│   ├── Institution: Govt Polytechnic College, Kunnamkulam
│   ├── GPA: 8.45/10.0
│   └── Specialization: Computer systems and networking fundamentals
│
└── Vocational Higher Secondary (Jun 2019 - Jun 2021)
    ├── Institution: Govt VHS School, Thrissur
    ├── NSQF: Field Technician
    └── Focus: Hardware & Network Essentials

Personal Philosophy:
"Technology is best when it brings people together and solves real-world 
problems. I believe in continuous learning, hands-on experience, and 
building reliable, secure systems that users can depend on."

Hobbies:
• Reading books
• Gaming
• Learning about universe

Interests:
• Network security and ethical hacking
• Open-source technologies and Linux systems
• Contributing to tech communities
`;

  return (
    <div className="space-y-4">
      <TerminalPrompt
        command="cat about.txt"
        output={aboutOutput}
        showCursor={false}
      />
    </div>
  );
}