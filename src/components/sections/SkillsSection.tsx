import { TerminalPrompt } from '../TerminalPrompt';

export function SkillsSection() {
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
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-primary font-mono text-sm">user@portfolio:~$ ls -la skills/ && cat skills.txt</div>
        <div className="bg-terminal-bg p-4 rounded-lg font-mono text-sm overflow-x-auto">
          {skillsOutput}
        </div>
      </div>
    </div>
  );
}