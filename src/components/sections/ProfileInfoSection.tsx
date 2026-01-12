import { TerminalPrompt } from '../TerminalPrompt';

export function ProfileInfoSection() {
  const skillsData = [
    {
      category: "Systems Administration",
      subcategories: [
        {
          name: "Operating Systems",
          skills: [
            { name: "Linux (Ubuntu, CentOS, RHEL-based, OpenSUSE)", level: 85 },
            { name: "Windows Server 2022 and Windows Client OS", level: 80 }
          ]
        },
        {
          name: "Scripting & Automation", 
          skills: [
            { name: "Bash Scripting", level: 75 },
            { name: "PowerShell", level: 65 },
            { name: "Python (Basic)", level: 50 }
          ]
        },
        {
          name: "System Management",
          skills: [
            { name: "User Account & Group Management", level: 85 },
            { name: "Partition & File System Management", level: 80 },
            { name: "Service Management", level: 85 },
            { name: "Network Profile Management", level: 70 },
            { name: "Security (SELinux, Antivirus, System FW)", level: 75 }
          ]
        }
      ]
    },
    {
      category: "Networking",
      subcategories: [
        {
          name: "Cisco Technologies",
          skills: [
            { name: "Cisco IOS", level: 90 },
            { name: "VLANs, STP", level: 85 },
            { name: "EtherChannel", level: 80 },
            { name: "Switch Configuration", level: 88 }
          ]
        },
        {
          name: "Routing Protocols",
          skills: [
            { name: "OSPF", level: 85 },
            { name: "EIGRP", level: 70 },
            { name: "Static Routing", level: 90 }
          ]
        },
        {
          name: "Protocols & Standards",
          skills: [
            { name: "IPv4/IPv6 Subnetting", level: 90 },
            { name: "TCP/IP Stack", level: 85 },
            { name: "DNS, DHCP Configuration", level: 80 },
            { name: "HSRP (Hot Standby)", level: 70 },
            { name: "GLBP (Gateway Load)", level: 55 },
            { name: "VRRP (Virtual Router)", level: 60 }
          ]
        }
      ]
    },
    {
      category: "Computer Hardware",
      subcategories: [
        {
          name: "",
          skills: [
            { name: "PC Assembly and Disassembly", level: 85 },
            { name: "BIOS/UEFI Configuration", level: 80 },
            { name: "Hardware Troubleshooting and Diagnostics", level: 75 }
          ]
        }
      ]
    },
    {
      category: "Cloud Technologies",
      subcategories: [
        {
          name: "Amazon Web Services (AWS)",
          skills: [
            { name: "EC2 (Compute)", level: 80 },
            { name: "S3 (Storage)", level: 75 },
            { name: "IAM (Identity)", level: 80 },
            { name: "VPC (Networking)", level: 70 }
          ]
        },
        {
          name: "Virtualization",
          skills: [
            { name: "VMware Workstation", level: 85 },
            { name: "VirtualBox", level: 90 }
          ]
        }
      ]
    },
    {
      category: "Troubleshooting & Monitoring",
      subcategories: [
        {
          name: "System Analysis",
          skills: [
            { name: "Log Analysis", level: 85 },
            { name: "Performance Monitoring", level: 70 },
            { name: "Network Diagnostics", level: 80 }
          ]
        },
        {
          name: "Documentation",
          skills: [
            { name: "Technical Writing", level: 85 },
            { name: "Network Diagrams", level: 70 },
            { name: "Issue Tracking", level: 80 }
          ]
        }
      ]
    }
  ];

  const renderSkillBar = (level: number) => {
    return (
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 bg-muted rounded-sm h-2 overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${level}%` }}
          />
        </div>
        <span className="text-muted-foreground text-xs min-w-[3ch] text-right">{level}%</span>
      </div>
    );
  };

  const aboutOutput = `
╭─ Personal Information ─────────────────────────────────────────────╮
│                                                                    │
│  Name: Jerin M R                                                   │
│  Role: Entry-Level IT Professional                                 │
│  Focus: Networking, Server Administration, Cloud Infrastructure & Cybersecurity   │
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

  const experienceOutput = `
┌─ EMPLOYMENT HISTORY ──────────────────────────────────────────────┐
│                                                                   │
│  Displaying work timeline from experience.log                    │
│  Format: [TIMESTAMP] [COMPANY] [ROLE] [LOCATION]                 │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

[2024-10-01 TO 2025-04-30] PERFECT GROUP - Service Trainee
Location: Ernakulam, Kerala


╭─ Role Overview ───────────────────────────────────────────────────╮
│ Comprehensive hands-on training in enterprise IT infrastructure  │
│ Focus on networking, hardware management, and system support     │
╰───────────────────────────────────────────────────────────────────╯

Key Responsibilities:
▸ Layer 1/2 Network Management
  ├── Configured and maintained enterprise switches
  ├── Implemented VLAN segmentation for department isolation  
  ├── Troubleshot connectivity issues across multiple floors
  └── Documented network topology and cable management

▸ Hardware & Peripherals Support
  ├── Desktop/laptop setup and configuration
  ├── POS system deployment and maintenance
  ├── Printer network integration and troubleshooting
  └── Hardware inventory management and asset tracking

Learning Outcomes:
• Gained practical experience with enterprise-grade equipment
• Developed troubleshooting methodology for complex issues
• Enhanced communication skills working with end users
• Learned importance of documentation in IT operations

┌─ EDUCATION & TRAINING ────────────────────────────────────────────┐
│                                                                   │
│  Concurrent advanced networking training program                  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

[2024-09-01 TO 2025-05-31] SYNENFO SOLUTIONS - Advanced Diploma
Program: Networking & Infrastructure Specialization
Location: Ernakulam, Kerala

Core Modules:
• CompTIA A+ (Hardware & Software Fundamentals)
• CCNA (Cisco Certified Network Associate)
• RHCE (Red Hat Certified Engineer)
• AWS Cloud Practitioner & Associate
Practical Labs:
• 200+ hours of hands-on lab work
• Real-world scenario simulations
• Industry-standard equipment training
`;

  const skillsOutput = (
    <div className="space-y-4 text-sm">
      {skillsData.map((category, catIndex) => (
        <div key={catIndex} className="space-y-2">
          <div className="text-primary font-semibold">├── {category.category}</div>
          {category.subcategories.map((subcategory, subIndex) => (
            <div key={subIndex} className="ml-4 space-y-1">
              {subcategory.name && (
                <div className="text-muted-foreground">│   ├── {subcategory.name}</div>
              )}
              {subcategory.skills.map((skill, skillIndex) => (
                <div key={skillIndex} className="ml-8 flex items-center gap-3">
                  <span className="text-muted-foreground min-w-0 flex-shrink">
                    │   │   {skillIndex === subcategory.skills.length - 1 ? '└──' : '├──'} {skill.name}
                  </span>
                  <div className="flex-1 max-w-[200px] min-w-[120px]">
                    {renderSkillBar(skill.level)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
      
      <div className="mt-6 space-y-2">
        <div className="text-primary font-semibold">Professional Development:</div>
        <div className="ml-4 space-y-1 text-muted-foreground">
          <div>• Hands-on lab environments for practical learning</div>
          <div>• Contributing to open-source networking projects</div>
          <div>• Active member of local IT communities</div>
          <div>• Continuous learning through online platforms and documentation</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* About Section */}
      <div className="space-y-4">
        <TerminalPrompt
          command="cat about.txt"
          output={aboutOutput}
          showCursor={false}
        />
      </div>

      {/* Skills Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="text-primary font-mono text-sm">user@portfolio:~$ ls -la skills/</div>
          <div className="bg-terminal-bg p-4 rounded-lg font-mono text-sm overflow-x-auto">
            {skillsOutput}
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="space-y-4">
        <TerminalPrompt
          command="cat experience.log"
          output={experienceOutput}
          showCursor={false}
        />
      </div>
    </div>
  );
}
