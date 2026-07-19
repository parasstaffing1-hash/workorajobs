export type JobSourceStatus = "Prepared" | "Needs API access" | "Needs crawler";

export type JobSource = {
  name: string;
  category: string;
  status: JobSourceStatus;
  coverage: string;
};

export type CompanyIntel = {
  company: string;
  rating: number;
  interviewDifficulty: "Low" | "Medium" | "High";
  employeeCount: string;
  funding: string;
  revenue: string;
  hiringTrend: "Expanding" | "Steady" | "Selective";
  layoffHistory: "None detected" | "Low signal" | "Needs review";
  techStack: string[];
  benefits: string[];
  culture: string;
  scamProbability: number;
  summary: string;
};

export type CareerCopilotFeature = {
  title: string;
  description: string;
  status: "Working locally" | "Integration-ready" | "Requires credentials";
};

export const jobSources: JobSource[] = [
  {
    name: "Company career pages",
    category: "Crawler",
    status: "Needs crawler",
    coverage: "Canonical source, expiry checks and duplicate detection.",
  },
  {
    name: "LinkedIn Jobs",
    category: "Marketplace",
    status: "Needs API access",
    coverage: "Discovery surface prepared; requires approved data access.",
  },
  {
    name: "Indeed",
    category: "Marketplace",
    status: "Needs API access",
    coverage: "Search and matching surface prepared for partner feed.",
  },
  {
    name: "Greenhouse",
    category: "ATS",
    status: "Prepared",
    coverage: "Public board ingestion, duplicate checks and expiry status.",
  },
  {
    name: "Lever",
    category: "ATS",
    status: "Prepared",
    coverage: "Public postings, departments, locations and apply URLs.",
  },
  {
    name: "Ashby",
    category: "ATS",
    status: "Prepared",
    coverage: "Role metadata, remote tags and application routing.",
  },
  {
    name: "Workday",
    category: "Enterprise ATS",
    status: "Needs crawler",
    coverage: "Tenant-specific ingestion and apply-flow tracking.",
  },
  {
    name: "SmartRecruiters",
    category: "ATS",
    status: "Prepared",
    coverage: "Company boards, job families and global location data.",
  },
  {
    name: "iCIMS / Taleo / Oracle HCM / SAP",
    category: "Enterprise ATS",
    status: "Needs crawler",
    coverage: "Connector contracts prepared for enterprise implementations.",
  },
];

export const companyIntelligence: CompanyIntel[] = [
  {
    company: "Northstar Cloud",
    rating: 4.4,
    interviewDifficulty: "Medium",
    employeeCount: "1,200+",
    funding: "Series D",
    revenue: "$180M estimated",
    hiringTrend: "Expanding",
    layoffHistory: "None detected",
    techStack: ["React", "Figma", "Node.js", "Snowflake"],
    benefits: ["Remote-first", "Learning stipend", "Healthcare"],
    culture: "Product-led, design mature and enterprise focused.",
    scamProbability: 3,
    summary:
      "A credible B2B SaaS company with strong design-system maturity and steady hiring signals.",
  },
  {
    company: "FinCore Labs",
    rating: 4.1,
    interviewDifficulty: "High",
    employeeCount: "850+",
    funding: "Private equity backed",
    revenue: "$240M estimated",
    hiringTrend: "Selective",
    layoffHistory: "Low signal",
    techStack: ["Node.js", "Kubernetes", "Kafka", "PostgreSQL"],
    benefits: ["Hybrid", "Equity", "Certification budget"],
    culture: "Engineering-heavy fintech environment with deep systems work.",
    scamProbability: 5,
    summary:
      "A selective fintech employer with high technical bar and strong backend infrastructure demand.",
  },
  {
    company: "Meridian Works",
    rating: 4.0,
    interviewDifficulty: "Medium",
    employeeCount: "2,000+",
    funding: "Public",
    revenue: "$420M estimated",
    hiringTrend: "Steady",
    layoffHistory: "None detected",
    techStack: ["Workday", "SAP", "Looker", "Python"],
    benefits: ["Global mobility", "Healthcare", "Parental leave"],
    culture: "Operations-led, compliance disciplined and globally distributed.",
    scamProbability: 4,
    summary:
      "A stable global workforce company with credible payroll and compliance operations roles.",
  },
  {
    company: "Helix Health",
    rating: 4.2,
    interviewDifficulty: "Medium",
    employeeCount: "500+",
    funding: "Series C",
    revenue: "$90M estimated",
    hiringTrend: "Expanding",
    layoffHistory: "None detected",
    techStack: ["SQL", "dbt", "Tableau", "Python"],
    benefits: ["Remote contract", "Flexible schedule", "Equipment support"],
    culture:
      "Mission-driven health analytics team with practical dashboard work.",
    scamProbability: 6,
    summary:
      "A credible health analytics company with clear data workflow and contract hiring demand.",
  },
  {
    company: "Orbit Commerce",
    rating: 3.9,
    interviewDifficulty: "Low",
    employeeCount: "300+",
    funding: "Series B",
    revenue: "$55M estimated",
    hiringTrend: "Steady",
    layoffHistory: "Low signal",
    techStack: ["Salesforce", "Gainsight", "Stripe", "HubSpot"],
    benefits: ["Hybrid", "Commission", "Wellness allowance"],
    culture:
      "Customer-led commerce environment with enterprise retention focus.",
    scamProbability: 7,
    summary:
      "A mid-market commerce SaaS employer with practical customer success hiring signals.",
  },
  {
    company: "Cobalt Systems",
    rating: 4.3,
    interviewDifficulty: "Medium",
    employeeCount: "700+",
    funding: "Series C",
    revenue: "$120M estimated",
    hiringTrend: "Expanding",
    layoffHistory: "None detected",
    techStack: ["n8n", "OpenAI", "PostgreSQL", "Redis"],
    benefits: ["Remote global", "Home office budget", "Learning stipend"],
    culture:
      "Automation-first recruiting operations team with strong AI adoption.",
    scamProbability: 4,
    summary:
      "A credible AI operations company with strong fit for recruiting automation specialists.",
  },
];

export const careerCopilotFeatures: CareerCopilotFeature[] = [
  {
    title: "AI job discovery",
    description:
      "Connector map, duplicate-removal logic, expiry detection and scam screening are represented in the UI contract.",
    status: "Integration-ready",
  },
  {
    title: "Resume intelligence",
    description:
      "Local parsing extracts skills, score signals, missing keywords and resume improvement guidance.",
    status: "Working locally",
  },
  {
    title: "Job match engine",
    description:
      "Every demo job receives skill, salary, location, remote, visa and industry match signals.",
    status: "Working locally",
  },
  {
    title: "Recommendation engine",
    description:
      "Recommendations react to skills, location, remote preference, salary, visa and saved memory.",
    status: "Working locally",
  },
  {
    title: "Company intelligence",
    description:
      "Company cards expose rating, hiring trend, layoff signal, tech stack, benefits and scam probability.",
    status: "Working locally",
  },
  {
    title: "One-click apply",
    description:
      "Apply workflow is modeled with ATS support status; real submission requires authenticated integrations.",
    status: "Requires credentials",
  },
  {
    title: "Smart notifications",
    description:
      "Notification triggers are generated locally; Telegram, WhatsApp, email and push require provider keys.",
    status: "Requires credentials",
  },
  {
    title: "Personal AI memory",
    description:
      "Candidate preferences can be saved in browser local storage as a future authenticated-memory contract.",
    status: "Working locally",
  },
];
