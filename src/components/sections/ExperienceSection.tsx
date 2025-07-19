import { TerminalPrompt } from '../TerminalPrompt';

export function ExperienceSection() {
  const experienceOutput = `
┌─ EMPLOYMENT HISTORY ──────────────────────────────────────────────┐
│                                                                   │
│  Displaying work timeline from experience.log                    │
│  Format: [TIMESTAMP] [COMPANY] [ROLE] [LOCATION]                 │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

[2024-10-01 TO 2025-04-30] PERFECT GROUP - Service Trainee
Location: Ernakulam, Kerala
Status: Current Position

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

▸ System Administration
  ├── User account management in domain environments
  ├── Software deployment and license management
  ├── System monitoring and basic performance optimization
  └── Backup verification and disaster recovery testing

▸ Technical Documentation
  ├── Created network diagrams using Visio
  ├── Maintained troubleshooting knowledge base
  ├── Developed standard operating procedures
  └── Generated weekly system health reports

Technologies Used:
• Cisco Catalyst switches (2960, 3560 series)
• Windows Server 2019/2022 Active Directory
• Network monitoring tools (PRTG, SolarWinds)
• HP/Dell enterprise hardware
• VMware vSphere infrastructure

Achievements:
✓ Reduced network downtime by 40% through proactive monitoring
✓ Streamlined hardware deployment process, saving 2 hours per setup
✓ Created comprehensive network documentation for future reference
✓ Successfully completed 50+ hardware installations without incidents

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
• Network Security & Ethical Hacking

Practical Labs:
• 200+ hours of hands-on lab work
• Real-world scenario simulations
• Industry-standard equipment training
• Capstone project: Multi-site network design

Future Goals:
□ Complete CCNA certification by Q2 2025
□ Gain AWS Cloud Practitioner certification
□ Pursue Linux+ certification
□ Specialize in network security and penetration testing
□ Contribute to open-source networking projects
`;

  return (
    <div className="space-y-4">
      <TerminalPrompt
        command="tail -f experience.log"
        output={experienceOutput}
        showCursor={false}
      />
    </div>
  );
}