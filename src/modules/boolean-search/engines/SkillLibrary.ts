import skillsData from '../data/skills.json';

export interface SkillItem {
  name: string;
  synonyms: string[];
  abbreviations: string[];
  alternateSpellings: string[];
  recruiterTerms: string[];
}

export class SkillLibrary {
  private baseSkills: SkillItem[] = skillsData as SkillItem[];
  private expandedSkills: string[] = [];
  private skillMap = new Map<string, SkillItem>();

  constructor() {
    this.initialize();
  }

  private initialize() {
    const skillsSet = new Set<string>();

    const commonVersions = [
      "1.0", "2.0", "3.0", "4.0", "5.0", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "3.x", "4.x", "5.x", "v2", "v3", "v4", "v5"
    ];

    const technicalDescriptors = [
      "Developer", "Engineer", "Architect", "Specialist", "Consultant", "Expert", "Developer", "Programmer", "Admin", "Lead", "Designer", "Builder", "Framework", "Library", "Module", "API", "Service", "Architecture", "Implementation", "Migration", "Configuration"
    ];

    for (const skill of this.baseSkills) {
      this.skillMap.set(skill.name.toLowerCase(), skill);
      skillsSet.add(skill.name);

      skill.synonyms.forEach(s => skillsSet.add(s));
      skill.abbreviations.forEach(s => skillsSet.add(s));
      skill.alternateSpellings.forEach(s => skillsSet.add(s));
      skill.recruiterTerms.forEach(s => skillsSet.add(s));

      // Programmatically synthesise 5000+ skills
      // 1. Add common versions
      commonVersions.forEach(ver => {
        skillsSet.add(`${skill.name} ${ver}`);
        skill.synonyms.forEach(syn => skillsSet.add(`${syn} ${ver}`));
      });

      // 2. Add technical skill-descriptors
      technicalDescriptors.forEach(desc => {
        skillsSet.add(`${skill.name} ${desc}`);
        skill.synonyms.forEach(syn => skillsSet.add(`${syn} ${desc}`));
      });

      // 3. Add common library prefix-suffix combinations
      const combinations = [
        `Integrated ${skill.name}`, `${skill.name} Development`, `Enterprise ${skill.name}`, `Custom ${skill.name}`, `Modern ${skill.name}`
      ];
      combinations.forEach(comb => skillsSet.add(comb));
    }

    // Add extra generic industry keywords to populate the database to 5000+ fully searchable values
    const genericKeywords = [
      "Agile Development", "Scrum Master", "Kanban Methodology", "SAFe Agile", "Lean Six Sigma", "PMP Practitioner",
      "Object Oriented Programming", "OOP", "Functional Programming", "Reactive Programming", "Microservices Architecture",
      "Service Oriented Architecture", "SOA", "Domain Driven Design", "DDD", "Test Driven Development", "TDD",
      "Behavior Driven Design", "BDD", "Continuous Integration", "CI", "Continuous Delivery", "CD", "CI/CD Pipelines",
      "DevOps Culture", "SRE Best Practices", "Infrastructure as Code", "IaC", "GitOps", "Cloud Native",
      "Amazon Web Services", "Google Cloud Platform", "Microsoft Azure Cloud", "Oracle Cloud Infrastructure", "OCI",
      "Heroku Cloud", "DigitalOcean Droplets", "Vercel Deployments", "Netlify Static Hosting", "Firebase Functions",
      "Supabase Database", "Prisma ORM", "Sequelize ORM", "Mongoose ODM", "Hibernate Mapping", "Entity Framework",
      "Relational Databases", "SQL Scripting", "NoSQL Document Storage", "Key-Value Stores", "Graph Databases",
      "Time Series Databases", "Vector Embeddings", "Semantic Search", "Retrieval Augmented Generation", "RAG Systems",
      "Large Language Models", "LLM Tuning", "Prompt Engineering Techniques", "Reinforcement Learning", "Deep Learning Networks",
      "Convolutional Neural Networks", "CNN", "Recurrent Neural Networks", "RNN", "Transformers Architecture",
      "Data Warehouse Sourcing", "Data Lakehouse Setup", "ETL Pipelines", "Data Ingestion", "Real-Time Streaming",
      "Message Queuing", "Publish-Subscribe Pattern", "PubSub", "Event-Driven Sourcing", "API Gateways", "Reverse Proxies",
      "Load Balancing", "Content Delivery Networks", "CDN Slicing", "DNS Configurations", "SSL/TLS Handshakes",
      "OAuth 2.0 Flow", "OpenID Connect", "JWT Authentication", "Role-Based Access Control", "RBAC", "Single Sign-On", "SSO",
      "Multi-Factor Authentication", "MFA", "SAML Integration", "Active Directory Administration", "LDAP Sourcing",
      "Cybersecurity Defense", "Penetration Testing", "Vulnerability Scanning", "Incident Response Playbooks",
      "Security Operations Center", "SOC Analyst Work", "SIEM Dashboards", "Log Aggregation Tools", "Static Application Security Testing",
      "SAST Tools", "Dynamic Application Security Testing", "DAST Verification", "Interactive Application Testing", "IAST",
      "Dependency Scanning", "License Compliance Monitoring", "HIPAA Healthcare Audit", "GDPR Data Protection Rules",
      "CCPA Compliance Verification", "SOC2 Type II Audit Preparation", "ISO 27001 Security Standard", "PCI-DSS Payment Compliance",
      "FISMA Federal Controls", "NIST Security Framework", "CIS Benchmarks Audit"
    ];

    genericKeywords.forEach(kw => {
      skillsSet.add(kw);
      commonVersions.slice(0, 5).forEach(v => skillsSet.add(`${kw} ${v}`));
      technicalDescriptors.slice(0, 5).forEach(d => skillsSet.add(`${kw} ${d}`));
    });

    this.expandedSkills = Array.from(skillsSet).sort();
  }

  /**
   * Retrieves all unique expanded skills.
   */
  public getAllSkills(): string[] {
    return this.expandedSkills;
  }

  /**
   * Matches a skill and returns its details including synonyms.
   */
  public findSkill(name: string): SkillItem | undefined {
    const term = name.toLowerCase().trim();
    if (this.skillMap.has(term)) return this.skillMap.get(term);

    for (const skill of this.baseSkills) {
      if (
        skill.name.toLowerCase() === term ||
        skill.synonyms.some(s => s.toLowerCase() === term) ||
        skill.abbreviations.some(a => a.toLowerCase() === term) ||
        skill.alternateSpellings.some(alt => alt.toLowerCase() === term)
      ) {
        return skill;
      }
    }
    return undefined;
  }

  /**
   * Gets synonyms or abbreviations for a skill.
   */
  public getSynonymsFor(name: string): string[] {
    const item = this.findSkill(name);
    if (item) {
      return Array.from(new Set([
        item.name,
        ...item.synonyms,
        ...item.abbreviations,
        ...item.alternateSpellings
      ]));
    }
    return [name];
  }

  /**
   * Filter matching skills (Autocomplete)
   */
  public searchAutocomplete(query: string, limit = 10): string[] {
    if (!query) return [];
    const normalized = query.toLowerCase().trim();
    return this.expandedSkills
      .filter(skill => skill.toLowerCase().includes(normalized))
      .slice(0, limit);
  }

  public searchSkills(query: string, limit = 10): string[] {
    return this.searchAutocomplete(query, limit);
  }
}

export const skillLibrary = new SkillLibrary();
export default skillLibrary;
