export const projects = [
  {
    slug: 'soc-box',
    name: 'SOC Box',
    subtitle: "The SOC analyst's toolbox",
    repository: 'https://github.com/fredzirbel/SOCBox',
    description:
      'A containerized investigation workspace for URL detonation, multi-source IP enrichment, and Defender XDR/Sentinel KQL generation.',
    tags: ['Python', 'FastAPI', 'Playwright', 'KQL'],
  },
  {
    slug: 'sigil',
    name: 'SIGIL',
    subtitle: 'Detection-as-code for Sigma rules',
    repository: 'https://github.com/fredzirbel/SIGIL',
    description:
      'A pipeline that validates, converts, tests, and maps Sigma detections before they reach production SIEMs.',
    tags: ['Python', 'Sigma', 'MITRE ATT&CK', 'CI/CD'],
  },
  {
    slug: 'homesoc',
    name: 'HomeSOC',
    subtitle: 'Live homelab detection engineering',
    repository: 'https://github.com/fredzirbel/homesoc-platform',
    description:
      'A Proxmox-hosted ELK detection platform that routes OPNsense and Proxmox telemetry through Logstash into Elasticsearch, Kibana, and analyst-ready alerts.',
    tags: ['ELK Stack', 'Proxmox', 'OPNsense', 'Detection'],
  },
] as const;

export const roles = [
  {
    title: 'Principal Security Analyst',
    period: 'Jul 2026 - Present',
    bullets: [
      'Triage, investigate, and respond to security incidents from detection through resolution across an MDR operation covering 200+ customer environments, correlating evidence from 30+ integrated EDR, SIEM, identity, and network security products to determine scope, root cause, and required containment.',
      'Analyze endpoint, network, and log data directly within Cortex XDR, CrowdStrike Falcon, Microsoft Defender XDR, and SentinelOne to identify malicious activity and confirm attack techniques across customer environments.',
      'Execute live containment and remediation actions, including host isolation, credential resets, session revocation, email deletion, and file quarantine, through a dual authorization workflow that removes attacker access and malicious artifacts.',
      'Communicate investigation findings, response status, and remediation recommendations to customer stakeholders, documenting response actions and incident outcomes during high priority incidents across a 24x7 MDR operation with rotating overnight and weekend shift coverage.',
      'Maintain a 16 minute average time to investigation while handling 300+ alerts monthly, applying an in-house AI platform across triage, investigation, correlation, and incident documentation while validating all findings against source telemetry.',
      'Train and mentor L1 analysts on investigation workflow, AI platform usage, and client ready incident documentation.',
    ],
  },
  {
    title: 'Senior Security Analyst',
    period: 'Jul 2025 - Jul 2026',
    bullets: [
      'Reconstructed attacker activity with custom KQL across endpoint, identity, and email evidence sources, including URL clicks, file downloads, and process telemetry, to establish incident scope and root cause.',
      'Briefed customer stakeholders during three to five weekly high priority incident calls, communicating findings, attribution, and remediation guidance that informed response decisions.',
      'Correlated indicators of compromise across customer environments to identify shared phishing and malware campaigns, enabling coordinated response beyond individual alerts.',
      'Engineered 500+ suppression filters using KVP logic and regex within the MDR detection and orchestration platform, eliminating thousands of recurring false positive alerts and improving analyst signal quality.',
    ],
  },
  {
    title: 'Security Analyst',
    period: 'Oct 2024 - Jul 2025',
    bullets: [
      'Triaged identity, phishing, malware, and endpoint security alerts across four EDR and SIEM platforms, producing scoped escalations for senior incident responders.',
      'Developed custom KQL queries across identity, endpoint, and email telemetry in Microsoft Sentinel and Defender to accelerate incident scoping and detection.',
    ],
  },
] as const;

export const earnedCertifications = [
  { name: 'CompTIA SecurityX (CASP+)', org: 'comptia', href: null },
  { name: 'CompTIA CySA+', org: 'comptia', href: 'https://www.credly.com/badges/169e383d-80ba-4a0a-b12b-b1cf447bac8e' },
  { name: 'CompTIA PenTest+', org: 'comptia', href: 'https://www.credly.com/badges/8ed7f32d-6a82-4aab-9079-8fec5bcef846/public_url' },
  { name: 'CompTIA Security+', org: 'comptia', href: 'https://www.credly.com/badges/9283e8db-5d15-40a4-af14-5b44b5fcc42c' },
  { name: 'CompTIA A+', org: 'comptia', href: 'https://www.credly.com/badges/c183d3cb-6f71-4313-abfd-2bae18629f53' },
  { name: 'ISC2 Certified in Cybersecurity', org: 'isc2', href: 'https://www.credly.com/badges/bca3d97b-0a51-4905-9804-8aa872f78404/public_url' },
] as const;

export const capabilityGroups = [
  { heading: 'Investigation', items: ['Defender XDR', 'CrowdStrike Falcon', 'Cortex XDR', 'SentinelOne', 'Sumo Logic'] },
  { heading: 'Detection', items: ['KQL', 'Sigma', 'Microsoft Sentinel', 'Splunk ES', 'MITRE ATT&CK'] },
  { heading: 'Engineering', items: ['Python', 'FastAPI', 'Docker', 'GitHub Actions', 'ELK Stack'] },
] as const;
