export type WorkplaceBenefit = {
  category: "Health & Wellness" | "Work Flexibility" | "Financial & Equity" | "Career & Growth";
  title: string;
  description: string;
};

export type GlassdoorReview = {
  id: string;
  role: string;
  rating: number;
  date: string;
  pros: string;
  cons: string;
  employmentStatus: string;
};

export type Company = {
  id: string;
  slug: string;
  name: string;
  logo: string; // URL or SVG initials
  industry: string;
  verified: boolean;
  headquarters: string;
  size: string;
  foundedYear: number;
  website: string;
  tagline: string;
  overview: string;
  techStack: string[];
  glassdoorRating: number;
  reviewCount: number;
  benefits: WorkplaceBenefit[];
  reviews: GlassdoorReview[];
  openJobsCount: number;
  featured?: boolean;
};

export const companiesData: Company[] = [
  {
    id: "comp-001",
    slug: "northstar-cloud",
    name: "Northstar Cloud",
    logo: "NS",
    industry: "Cloud & Enterprise SaaS",
    verified: true,
    headquarters: "Toronto, Canada",
    size: "250-500 employees",
    foundedYear: 2018,
    website: "https://northstarcloud.example.com",
    tagline: "Empowering workforce operations with next-generation cloud infrastructure.",
    overview:
      "Northstar Cloud builds multi-tenant enterprise HR platforms, talent analytics dashboards, and accessibility-first workflow tools used by top recruiting organizations across North America and Europe.",
    techStack: ["React", "TypeScript", "Node.js", "Figma", "AWS", "GraphQL", "PostgreSQL"],
    glassdoorRating: 4.8,
    reviewCount: 142,
    openJobsCount: 3,
    featured: true,
    benefits: [
      {
        category: "Work Flexibility",
        title: "100% Remote-First Culture",
        description: "Work from anywhere in the world with flexible core collaboration hours.",
      },
      {
        category: "Health & Wellness",
        title: "Comprehensive Care",
        description: "Full health, dental, vision coverage with mental wellness stipends.",
      },
      {
        category: "Financial & Equity",
        title: "Competitive Equity & 401(k)",
        description: "Generous equity grant packages with 4% retirement matching.",
      },
      {
        category: "Career & Growth",
        title: "$3,000 Annual Learning Budget",
        description: "Dedicated stipend for conferences, books, certifications, and courses.",
      },
    ],
    reviews: [
      {
        id: "rev-1",
        role: "Senior Product Designer",
        rating: 5,
        date: "May 2026",
        pros: "Extremely strong design culture. Leadership deeply values accessibility and UX quality over fast hacks.",
        cons: "Rapid growth means processes update frequently, requiring flexibility.",
        employmentStatus: "Current Employee",
      },
      {
        id: "rev-2",
        role: "Frontend Engineer",
        rating: 4.5,
        date: "Feb 2026",
        pros: "Great engineering standards, clean React/TypeScript codebase, excellent remote stipend.",
        cons: "Cross-timezone coordination requires asynchronous communication discipline.",
        employmentStatus: "Current Employee",
      },
    ],
  },
  {
    id: "comp-002",
    slug: "fincore-labs",
    name: "FinCore Labs",
    logo: "FC",
    industry: "Fintech & Banking",
    verified: true,
    headquarters: "Toronto, Canada",
    size: "500-1,000 employees",
    foundedYear: 2016,
    website: "https://fincorelabs.example.com",
    tagline: "High-throughput event-driven banking engines for global institutions.",
    overview:
      "FinCore Labs engineers mission-critical financial technology, real-time transaction ledgers, and automated compliance engines handling billions in daily transaction volume.",
    techStack: ["Node.js", "TypeScript", "PostgreSQL", "Kafka", "Docker", "Redis", "AWS"],
    glassdoorRating: 4.6,
    reviewCount: 98,
    openJobsCount: 2,
    featured: true,
    benefits: [
      {
        category: "Financial & Equity",
        title: "Top-Tier Compensation",
        description: "Market-leading salary benchmarks with performance bonuses paid quarterly.",
      },
      {
        category: "Work Flexibility",
        title: "Hybrid Working Model",
        description: "2 days in Toronto office with catered meals and 3 days remote flexibility.",
      },
      {
        category: "Health & Wellness",
        title: "Executive Health Benefits",
        description: "Full family medical coverage and premium gym membership access.",
      },
    ],
    reviews: [
      {
        id: "rev-3",
        role: "Staff Backend Engineer",
        rating: 5,
        date: "Apr 2026",
        pros: "Solving complex distributed systems problems. High bar for technical excellence.",
        cons: "Strict compliance testing before deployment, though necessary for financial reliability.",
        employmentStatus: "Current Employee",
      },
    ],
  },
  {
    id: "comp-003",
    slug: "meridian-works",
    name: "Meridian Works",
    logo: "MW",
    industry: "Global HR & Payroll",
    verified: true,
    headquarters: "Singapore",
    size: "1,000-5,000 employees",
    foundedYear: 2012,
    website: "https://meridianworks.example.com",
    tagline: "Cross-border payroll, tax compliance, and global talent infrastructure.",
    overview:
      "Meridian Works simplifies international employment, statutory compliance, and multi-currency payroll operations for fast-growing enterprises across APAC, Europe, and the Americas.",
    techStack: ["Python", "Workday API", "PostgreSQL", "SAP", "React", "Docker"],
    glassdoorRating: 4.7,
    reviewCount: 215,
    openJobsCount: 4,
    featured: false,
    benefits: [
      {
        category: "Career & Growth",
        title: "Global Transfer Program",
        description: "Opportunities to relocate to regional hubs in Singapore, London, or San Francisco.",
      },
      {
        category: "Health & Wellness",
        title: "Wellness & Life Insurance",
        description: "International health insurance and comprehensive critical illness coverage.",
      },
    ],
    reviews: [
      {
        id: "rev-4",
        role: "Global Payroll Operations Lead",
        rating: 4.8,
        date: "Jan 2026",
        pros: "Very supportive leadership, clear career progression framework, diverse international team.",
        cons: "APAC and US time zone overlaps occasionally mean early morning calls.",
        employmentStatus: "Current Employee",
      },
    ],
  },
  {
    id: "comp-004",
    slug: "helix-health",
    name: "Helix Health",
    logo: "HH",
    industry: "HealthTech & Analytics",
    verified: true,
    headquarters: "Boston, USA",
    size: "100-250 employees",
    foundedYear: 2020,
    website: "https://helixhealth.example.com",
    tagline: "Transforming clinical analytics and healthcare delivery through data.",
    overview:
      "Helix Health builds HIPAA-compliant data pipelines, patient outcome prediction models, and analytics dashboards that empower clinical teams and healthcare providers.",
    techStack: ["Python", "SQL", "dbt", "Tableau", "AWS", "Snowflake"],
    glassdoorRating: 4.9,
    reviewCount: 64,
    openJobsCount: 2,
    featured: false,
    benefits: [
      {
        category: "Work Flexibility",
        title: "Flexible Working Hours",
        description: "Asynchronous workflow options tailored for healthcare data operations.",
      },
      {
        category: "Health & Wellness",
        title: "100% Covered Health Insurance",
        description: "Zero-deductible medical and prescription coverage for employees.",
      },
    ],
    reviews: [
      {
        id: "rev-5",
        role: "Data Analyst",
        rating: 5,
        date: "Jun 2026",
        pros: "Meaningful work directly improving healthcare outcome quality. Great data tooling.",
        cons: "Strict data privacy protocols require careful handling.",
        employmentStatus: "Current Employee",
      },
    ],
  },
  {
    id: "comp-005",
    slug: "orbit-commerce",
    name: "Orbit Commerce",
    logo: "OC",
    industry: "E-Commerce & Retail SaaS",
    verified: true,
    headquarters: "London, UK",
    size: "500-1,000 employees",
    foundedYear: 2015,
    website: "https://orbitcommerce.example.com",
    tagline: "Unified merchant tools and automated revenue expansion engines.",
    overview:
      "Orbit Commerce delivers enterprise e-commerce infrastructure, customer success intelligence, and automated inventory logistics for major online brands worldwide.",
    techStack: ["React", "Node.js", "GraphQL", "Salesforce", "Gainsight", "Kubernetes"],
    glassdoorRating: 4.5,
    reviewCount: 180,
    openJobsCount: 3,
    featured: false,
    benefits: [
      {
        category: "Work Flexibility",
        title: "Hybrid & Remote Choice",
        description: "Modern central London office or full UK remote working options.",
      },
      {
        category: "Financial & Equity",
        title: "Merchant Discount Perks",
        description: "Exclusive discounts across top retail and e-commerce partners.",
      },
    ],
    reviews: [
      {
        id: "rev-6",
        role: "Customer Success Manager",
        rating: 4.5,
        date: "Mar 2026",
        pros: "High energy, customer-obsessed team. Great commission structure for CSMs.",
        cons: "Q4 holiday season gets very busy.",
        employmentStatus: "Current Employee",
      },
    ],
  },
  {
    id: "comp-006",
    slug: "cobalt-systems",
    name: "Cobalt Systems",
    logo: "CS",
    industry: "AI & Recruiting Automation",
    verified: true,
    headquarters: "San Francisco, USA",
    size: "50-100 employees",
    foundedYear: 2022,
    website: "https://cobaltsystems.example.com",
    tagline: "AI agentic workflows for modern talent acquisition operations.",
    overview:
      "Cobalt Systems designs specialized autonomous AI agents, recruiting workflow automation, and sourcing intelligence engines that empower talent acquisition teams.",
    techStack: ["Python", "OpenAI API", "n8n", "TypeScript", "React", "PostgreSQL"],
    glassdoorRating: 4.9,
    reviewCount: 42,
    openJobsCount: 3,
    featured: true,
    benefits: [
      {
        category: "Career & Growth",
        title: "Cutting-Edge AI Stack",
        description: "Work directly with frontier AI models, agentic workflows, and LLMs.",
      },
      {
        category: "Work Flexibility",
        title: "Work From Anywhere",
        description: "Global remote setup with annual international team retreats.",
      },
    ],
    reviews: [
      {
        id: "rev-7",
        role: "AI Operations Specialist",
        rating: 5,
        date: "Jun 2026",
        pros: "Fast-paced innovation, high agency, zero bureaucracy, intelligent team.",
        cons: "Move-fast startup speed requires proactive communication.",
        employmentStatus: "Current Employee",
      },
    ],
  },
];
