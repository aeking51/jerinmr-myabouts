import { TerminalPrompt } from '../TerminalPrompt';

export function SkillsSection() {
  const skillsOutput = `
├── Systems Administration
│   ├── Operating Systems
│   │   ├── Linux (Ubuntu, CentOS) ████████████████████ 85%
│   │   └── Windows Server 2022     ████████████████████ 80%
│   │
│   ├── Scripting & Automation
│   │   ├── Bash Scripting          ████████████████████ 75%
│   │   ├── PowerShell              ████████████████     65%
│   │   └── Python (Basic)          ██████████           50%
│   │
│   └── System Tools
│       ├── LVM, rsync, SELinux     ████████████████████ 80%
│       ├── cron, Task Scheduler    ████████████████████ 85%
│       └── System Hardening        ████████████████     70%
│
├── Networking
│   ├── Cisco Technologies
│   │   ├── Cisco IOS               ████████████████████ 90%
│   │   ├── VLANs, STP              ████████████████████ 85%
│   │   ├── EtherChannel            ████████████████████ 80%
│   │   └── Switch Configuration    ████████████████████ 88%
│   │
│   ├── Routing Protocols
│   │   ├── OSPF                    ████████████████████ 85%
│   │   ├── EIGRP                   ████████████████████ 70%
│   │   └── Static Routing          ████████████████████ 90%
│   │
│   ├── Network Security
│   │   ├── NAT Configuration       ████████████████████ 85%
│   │   ├── ACLs (Access Lists)     ████████████████████ 80%
│   │   └── Firewall Basics         ████████████████     65%
│   │
│   └── Protocols & Standards
│       ├── IPv4/IPv6 Subnetting    ████████████████████ 90%
│       ├── TCP/IP Stack            ████████████████████ 85%
│       └── DNS, DHCP Configuration ████████████████████ 80%
│
├── Cloud Technologies
│   ├── Amazon Web Services (AWS)
│   │   ├── EC2 (Compute)           ████████████████████ 80%
│   │   ├── S3 (Storage)            ████████████████████ 75%
│   │   ├── IAM (Identity)          ████████████████████ 80%
│   │   └── VPC (Networking)        ████████████████     70%
│   │
│   └── Virtualization
│       ├── VMware Workstation      ████████████████████ 85%
│       └── VirtualBox              ████████████████████ 90%
│
└── Troubleshooting & Monitoring
    ├── System Analysis
    │   ├── Log Analysis             ████████████████████ 85%
    │   ├── Performance Monitoring   ████████████████     70%
    │   └── Network Diagnostics      ████████████████████ 80%
    │
    └── Documentation
        ├── Technical Writing        ████████████████████ 85%
        ├── Network Diagrams         ████████████████     70%
        └── Issue Tracking           ████████████████████ 80%

Certifications in Progress:
□ CompTIA A+ (Core 1 & 2)
□ CCNA (200-301)
□ RHCE (Red Hat Certified Engineer)
□ AWS Cloud Practitioner

Professional Development:
• Hands-on lab environments for practical learning
• Contributing to open-source networking projects  
• Active member of local IT communities
• Continuous learning through online platforms and documentation
`;

  return (
    <div className="space-y-4">
      <TerminalPrompt
        command="ls -la skills/ && cat skills.txt"
        output={skillsOutput}
        showCursor={false}
      />
    </div>
  );
}