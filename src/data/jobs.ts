export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Contract" | "Remote" | "Internship";
  workMode: "Remote" | "Hybrid" | "On-site";
  department: string;
  salary: string;
  posted: string;
  tags: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experience: string;
  education: string;
  description: string;
  responsibilities: string[];
  keywords: string[];
  isFeaturedInternship?: boolean;
};

export const jobs: Job[] = [
  {
    id: "wj-intern-001",
    title: "Frontend Engineering Intern (Summer 2026)",
    company: "Northstar Cloud",
    location: "Remote, North America",
    type: "Internship",
    workMode: "Remote",
    department: "Engineering",
    salary: "$42 - $55/hr + Housing Stipend",
    posted: "Just posted",
    tags: ["React", "TypeScript", "Next.js", "Summer 2026"],
    requiredSkills: ["React", "TypeScript", "HTML/CSS", "Git"],
    preferredSkills: ["Next.js", "Tailwind CSS", "REST APIs"],
    experience: "Current Student or Recent Grad (BS/MS in CS)",
    education: "Enrolled in Computer Science, Software Engineering or related program",
    description:
      "Join Northstar Cloud's frontend engineering team to build accessible, high-performance UI components for our enterprise workforce platform.",
    responsibilities: [
      "Develop responsive web interfaces using React, TypeScript and Next.js",
      "Collaborate with senior software engineers and product designers",
      "Participate in code reviews, testing, and sprint planning",
    ],
    keywords: ["Internship", "Frontend", "React", "Student", "Early Career"],
    isFeaturedInternship: true,
  },
  {
    id: "wj-intern-002",
    title: "AI & Machine Learning Research Intern",
    company: "Cobalt Systems",
    location: "San Francisco, CA / Remote",
    type: "Internship",
    workMode: "Hybrid",
    department: "Engineering",
    salary: "$50 - $65/hr + Mentorship",
    posted: "1 day ago",
    tags: ["Python", "LLMs", "PyTorch", "AI Agents"],
    requiredSkills: ["Python", "PyTorch", "Machine Learning", "Linear Algebra"],
    preferredSkills: ["OpenAI API", "LangChain", "n8n", "Transformers"],
    experience: "Undergraduate or Graduate AI Student",
    education: "Degree in Computer Science, AI, Mathematics or Data Science",
    description:
      "Work alongside frontier AI researchers building agentic workflow engines and LLM-powered hiring automation tools.",
    responsibilities: [
      "Experiment with fine-tuning and prompt orchestration for AI agents",
      "Evaluate model accuracy and benchmark latency across workloads",
      "Present research findings to technical leadership",
    ],
    keywords: ["AI Internship", "Machine Learning", "Python", "Research"],
    isFeaturedInternship: true,
  },
  {
    id: "wj-intern-003",
    title: "Product Design Intern (UX/UI)",
    company: "Northstar Cloud",
    location: "Toronto, Canada / Hybrid",
    type: "Internship",
    workMode: "Hybrid",
    department: "Design",
    salary: "$38 - $48/hr",
    posted: "3 days ago",
    tags: ["Figma", "UX Research", "Design Systems"],
    requiredSkills: ["Figma", "Wireframing", "Prototyping", "User Research"],
    preferredSkills: ["Design Systems", "Accessibility", "Usability Testing"],
    experience: "Design Student or Portfolio Portfolio",
    education: "Degree in Design, HCI, Interactive Media or equivalent",
    description:
      "Design intuitive web experiences, conduct usability testing, and contribute to enterprise design systems under senior design mentorship.",
    responsibilities: [
      "Create high-fidelity UI mockups and interactive Figma prototypes",
      "Conduct candidate usability interviews and synthesize feedback",
      "Maintain component libraries in Northstar's design system",
    ],
    keywords: ["Design Internship", "UX", "UI", "Figma", "Student"],
    isFeaturedInternship: true,
  },
  {
    id: "wj-intern-004",
    title: "Data Analytics & BI Intern",
    company: "FinCore Labs",
    location: "Toronto, Canada",
    type: "Internship",
    workMode: "Hybrid",
    department: "Data",
    salary: "$45 - $58/hr",
    posted: "4 days ago",
    tags: ["SQL", "Python", "PostgreSQL", "Dashboards"],
    requiredSkills: ["SQL", "Python", "Data Analysis", "Excel"],
    preferredSkills: ["PostgreSQL", "Tableau", "dbt", "Statistics"],
    experience: "Analytics or Finance Student",
    education: "Enrolled in Data Analytics, Statistics, Finance or CS",
    description:
      "Analyze fintech transaction flows, design executive dashboards, and extract business intelligence for banking compliance engines.",
    responsibilities: [
      "Write SQL queries to analyze high-volume financial transactions",
      "Build automated KPI reporting dashboards",
      "Collaborate with data engineers and compliance leads",
    ],
    keywords: ["Data Internship", "SQL", "Analytics", "Fintech"],
    isFeaturedInternship: true,
  },
  {
    id: "wj-001",
    title: "Senior Product Designer",
    company: "Northstar Cloud",
    location: "Remote, Europe",
    type: "Full-time",
    workMode: "Remote",
    department: "Design",
    salary: "$110k - $145k",
    posted: "2 days ago",
    tags: ["SaaS", "Design systems", "Research"],
    requiredSkills: ["Figma", "UX research", "Design systems", "Accessibility"],
    preferredSkills: ["B2B SaaS", "Analytics dashboards", "Prototyping"],
    experience: "6+ years",
    education: "Design, HCI or equivalent portfolio experience",
    description:
      "Lead product design for enterprise SaaS hiring workflows, research programs and accessible design systems.",
    responsibilities: [
      "Own discovery, prototyping and usability testing",
      "Improve design system quality across product teams",
      "Partner with product, engineering and recruiting operations",
    ],
    keywords: ["Product design", "Hiring workflows", "Enterprise", "SaaS"],
  },
  {
    id: "wj-002",
    title: "Staff Backend Engineer",
    company: "FinCore Labs",
    location: "Toronto, Canada",
    type: "Full-time",
    workMode: "Hybrid",
    department: "Engineering",
    salary: "$155k - $190k",
    posted: "4 days ago",
    tags: ["Node.js", "Distributed systems", "Fintech"],
    requiredSkills: [
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Distributed systems",
    ],
    preferredSkills: ["AWS", "Docker", "Redis", "Kafka"],
    experience: "8+ years",
    education: "Computer Science or equivalent engineering experience",
    description:
      "Build resilient fintech services, event-driven systems and high-scale backend infrastructure.",
    responsibilities: [
      "Design distributed services and data flows",
      "Improve reliability, observability and performance",
      "Mentor engineers across backend architecture",
    ],
    keywords: ["Backend", "Fintech", "API", "Systems design"],
  },
  {
    id: "wj-003",
    title: "Global Payroll Operations Lead",
    company: "Meridian Works",
    location: "Singapore",
    type: "Full-time",
    workMode: "On-site",
    department: "Operations",
    salary: "$95k - $130k",
    posted: "1 week ago",
    tags: ["Payroll", "Compliance", "APAC"],
    requiredSkills: ["Payroll", "Compliance", "APAC", "Operations"],
    preferredSkills: ["Workday", "SAP", "Audit", "Vendor management"],
    experience: "7+ years",
    education: "Business, HR operations or equivalent experience",
    description:
      "Lead payroll operations across APAC with strong compliance, audit and stakeholder management.",
    responsibilities: [
      "Own regional payroll controls and reporting",
      "Coordinate vendors and internal operations teams",
      "Improve payroll accuracy and employee experience",
    ],
    keywords: ["Global payroll", "Compliance", "Operations leadership"],
  },
  {
    id: "wj-004",
    title: "Contract Data Analyst",
    company: "Helix Health",
    location: "Remote, Americas",
    type: "Contract",
    workMode: "Remote",
    department: "Data",
    salary: "$80 - $110/hr",
    posted: "1 week ago",
    tags: ["SQL", "Healthcare", "Dashboards"],
    requiredSkills: ["SQL", "Dashboards", "Data analysis", "Healthcare"],
    preferredSkills: ["dbt", "Tableau", "Python", "Stakeholder reporting"],
    experience: "4+ years",
    education: "Analytics, statistics or equivalent experience",
    description:
      "Deliver healthcare analytics dashboards, reporting workflows and operational data insights.",
    responsibilities: [
      "Build dashboards and recurring reports",
      "Translate stakeholder questions into SQL analysis",
      "Validate data quality and explain insights clearly",
    ],
    keywords: ["Analytics", "Healthcare", "BI", "Contract"],
  },
  {
    id: "wj-005",
    title: "Customer Success Manager",
    company: "Orbit Commerce",
    location: "London, United Kingdom",
    type: "Full-time",
    workMode: "Hybrid",
    department: "Customer",
    salary: "$85k - $105k",
    posted: "2 weeks ago",
    tags: ["B2B", "Retention", "Enterprise"],
    requiredSkills: ["Customer success", "B2B", "Retention", "Enterprise"],
    preferredSkills: ["Salesforce", "Gainsight", "SaaS", "Revenue expansion"],
    experience: "5+ years",
    education: "Business or equivalent customer-facing experience",
    description:
      "Manage enterprise customer relationships, retention programs and expansion opportunities.",
    responsibilities: [
      "Own strategic customer success plans",
      "Improve adoption, renewals and retention",
      "Partner with sales and product on account health",
    ],
    keywords: ["Customer success", "Enterprise SaaS", "Retention"],
  },
  {
    id: "wj-006",
    title: "AI Recruiting Operations Specialist",
    company: "Cobalt Systems",
    location: "Remote, Global",
    type: "Remote",
    workMode: "Remote",
    department: "People",
    salary: "$70k - $95k",
    posted: "2 weeks ago",
    tags: ["Recruiting", "Automation", "Operations"],
    requiredSkills: ["Recruiting", "Automation", "Operations", "ATS"],
    preferredSkills: ["n8n", "OpenAI", "Zapier", "Analytics"],
    experience: "3+ years",
    education: "People operations or equivalent recruiting experience",
    description:
      "Automate recruiting operations, candidate workflows and AI-assisted hiring processes.",
    responsibilities: [
      "Build automation workflows for recruiting teams",
      "Improve candidate communication and process visibility",
      "Measure operational quality and recruiter productivity",
    ],
    keywords: ["Recruiting operations", "Automation", "AI hiring", "ATS"],
  },
];

export const featuredInternships = jobs.filter((j) => j.isFeaturedInternship);

export const jobDepartments = [
  "All",
  "Engineering",
  "Design",
  "Data",
  "Operations",
  "Customer",
  "People",
];
