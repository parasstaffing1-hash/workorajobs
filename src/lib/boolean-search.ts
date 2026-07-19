/**
 * Master Boolean Search String Generator & Full Job Description Parser
 * Supports extracting title variations, tech stacks, databases, cloud tools, methodologies,
 * and anti-keywords from 1-page Job Descriptions for LinkedIn Recruiter, Google X-Ray & ATS Databases.
 */

export type BooleanVariant = {
  id: string;
  label: string;
  platform: "LinkedIn Recruiter" | "Google X-Ray (LinkedIn)" | "Google X-Ray (GitHub)" | "ATS Database" | "Broad Reach" | "High Precision";
  description: string;
  query: string;
};

export type ParsedBooleanResult = {
  jobTitle: string;
  titleSynonyms: string[];
  primarySkills: string[];
  secondarySkills: string[];
  toolsAndCloud: string[];
  antiKeywords: string[];
  variants: BooleanVariant[];
  sourcingTips: string[];
};

// Dictionaries for dynamic extraction
const LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Java", "Go", "Golang", "C#", "C++",
  "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "SQL", "R", "Bash", "Shell",
];

const FRONTEND = [
  "React", "React.js", "Next.js", "Angular", "Vue", "Vue.js", "Redux", "Tailwind",
  "Tailwind CSS", "HTML", "CSS", "Sass", "Webpack", "Vite", "Svelte", "Microfrontends",
  "Figma", "UX", "UI", "Design Systems", "Accessibility", "WCAG",
];

const BACKEND = [
  "Node.js", "Node", "Express", "NestJS", "Django", "Flask", "FastAPI", "Spring Boot",
  "Spring", ".NET", "ASP.NET", "Ruby on Rails", "Rails", "Laravel", "GraphQL", "REST API",
  "RESTful APIs", "Microservices", "gRPC", "Distributed Systems", "Event-Driven",
];

const DATABASES_DATA = [
  "PostgreSQL", "Postgres", "MySQL", "MongoDB", "Redis", "Elasticsearch", "DynamoDB",
  "Cassandra", "Snowflake", "BigQuery", "Redshift", "Kafka", "RabbitMQ", "Spark",
  "Airflow", "dbt", "Tableau", "Power BI", "Data Pipelines",
];

const CLOUD_DEVOPS = [
  "AWS", "Amazon Web Services", "Azure", "GCP", "Google Cloud", "Docker", "Kubernetes",
  "k8s", "Terraform", "Helm", "Ansible", "Jenkins", "CI/CD", "GitHub Actions",
  "CloudFormation", "Linux", "Serverless", "Lambda",
];

const DOMAINS_METHODOLOGIES = [
  "Fintech", "SaaS", "B2B", "B2C", "HealthTech", "E-Commerce", "Cybersecurity",
  "Agile", "Scrum", "Kanban", "Jira", "TDD", "System Architecture", "High Scalability",
  "Recruiting Operations", "ATS", "Workday", "Salesforce", "Payroll", "Compliance",
];

function extractMatchList(text: string, dictionary: string[]): string[] {
  const lowerText = text.toLowerCase();
  const matched: string[] = [];

  for (const item of dictionary) {
    const itemLower = item.toLowerCase();
    // Match whole words or standard terms
    const regex = new RegExp(`\\b${itemLower.replace(/[-[\]{}()*+?~:\\^$|#\s]/g, "\\$&")}\\b`, "i");
    if (regex.test(lowerText) && !matched.map(m => m.toLowerCase()).includes(itemLower)) {
      matched.push(item);
    }
  }

  return matched;
}

function extractJobTitle(text: string): { primaryTitle: string; synonyms: string[] } {
  // Common title pattern matching
  const titlePatterns = [
    /title[:\s]+([a-z0-9\s/&+-]+)(?:\n|$)/i,
    /(senior|staff|principal|lead|head of|junior)?\s*(full\s*stack|backend|frontend|software|product|data|devops|cloud|site\s*reliability|qa|test|recruiting|payroll|operations|security)\s*(engineer|developer|architect|designer|manager|specialist|lead|analyst)/i,
    /(product manager|product designer|ux designer|ui designer|data scientist|data analyst|scrum master|project manager|talent acquisition|recruiter)/i,
  ];

  let primaryTitle = "Software Engineer";

  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match) {
      primaryTitle = match[0].replace(/^title[:\s]+/i, "").trim();
      break;
    }
  }

  // Generate title synonyms dynamically
  const synonyms: string[] = [primaryTitle];
  const pLower = primaryTitle.toLowerCase();

  if (pLower.includes("full stack") || pLower.includes("fullstack")) {
    synonyms.push("Full Stack Engineer", "Full Stack Developer", "Fullstack Engineer", "Software Engineer", "Software Developer");
  } else if (pLower.includes("backend")) {
    synonyms.push("Backend Engineer", "Backend Developer", "Server Side Engineer", "Software Engineer");
  } else if (pLower.includes("frontend")) {
    synonyms.push("Frontend Engineer", "Frontend Developer", "UI Engineer", "Web Developer");
  } else if (pLower.includes("devops") || pLower.includes("cloud") || pLower.includes("site reliability") || pLower.includes("sre")) {
    synonyms.push("DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer", "SRE", "Infrastructure Engineer");
  } else if (pLower.includes("product designer") || pLower.includes("ux")) {
    synonyms.push("Product Designer", "UX Designer", "UI/UX Designer", "UX Researcher");
  } else if (pLower.includes("data scientist") || pLower.includes("data analyst") || pLower.includes("data engineer")) {
    synonyms.push("Data Engineer", "Data Scientist", "Data Analyst", "Analytics Engineer", "BI Engineer");
  } else if (pLower.includes("recruiter") || pLower.includes("talent")) {
    synonyms.push("Technical Recruiter", "Talent Acquisition Partner", "Recruiter", "Sourcer", "Talent Partner");
  } else {
    synonyms.push(`${primaryTitle} Engineer`, `${primaryTitle} Developer`, `${primaryTitle} Specialist`);
  }

  return {
    primaryTitle,
    synonyms: [...new Set(synonyms)].slice(0, 5),
  };
}

function formatGroup(items: string[]): string {
  const clean = [...new Set(items.filter(Boolean))].slice(0, 6);
  if (!clean.length) return "";
  if (clean.length === 1) return clean[0].includes(" ") ? `"${clean[0]}"` : clean[0];
  return `(${clean.map((item) => (item.includes(" ") ? `"${item}"` : item)).join(" OR ")})`;
}

/**
 * Parses full 1-page Job Description and returns structured Boolean search strings
 */
export function parseJobDescriptionToBoolean(
  jobDescription: string,
  userPrompt = "",
): ParsedBooleanResult {
  const fullText = `${jobDescription} ${userPrompt}`;

  // 1. Extract Title & Synonyms
  const { primaryTitle, synonyms } = extractJobTitle(fullText);

  // 2. Extract Tech Stack & Hard Skills
  const languagesMatched = extractMatchList(fullText, LANGUAGES);
  const frontendMatched = extractMatchList(fullText, FRONTEND);
  const backendMatched = extractMatchList(fullText, BACKEND);
  const dataMatched = extractMatchList(fullText, DATABASES_DATA);
  const cloudMatched = extractMatchList(fullText, CLOUD_DEVOPS);
  const domainMatched = extractMatchList(fullText, DOMAINS_METHODOLOGIES);

  const primarySkills = [...new Set([...languagesMatched, ...frontendMatched.slice(0, 3), ...backendMatched.slice(0, 3)])].slice(0, 6);
  const secondarySkills = [...new Set([...backendMatched.slice(3), ...frontendMatched.slice(3), ...domainMatched])].slice(0, 6);
  const toolsAndCloud = [...new Set([...dataMatched, ...cloudMatched])].slice(0, 6);

  // Fallbacks if JD is short
  if (!primarySkills.length) primarySkills.push("TypeScript", "React", "Node.js");
  if (!toolsAndCloud.length) toolsAndCloud.push("PostgreSQL", "AWS", "Docker");

  // 3. Determine Anti-Keywords (Seniority exclusions)
  const isSenior = /senior|staff|principal|lead|head|architect/i.test(fullText);
  const antiKeywords = isSenior
    ? ["Junior", "Intern", "Internship", "Entry Level", "Trainee", "Student", "Assistant"]
    : ["Internship", "Student"];

  const antiClause = `NOT ${formatGroup(antiKeywords)}`;

  // 4. Construct Boolean Strings

  // Variant A: LinkedIn Recruiter Query
  const linkedinRecruiterQuery = [
    formatGroup(synonyms),
    formatGroup(primarySkills),
    formatGroup(toolsAndCloud),
    antiClause,
  ]
    .filter(Boolean)
    .join(" AND ");

  // Variant B: Google X-Ray Query (LinkedIn Profiles)
  const locationClause = fullText.match(/(remote|toronto|san francisco|new york|london|singapore|austin|chicago|europe|americas)/i);
  const locationTerm = locationClause ? locationClause[0] : "Remote";

  const googleXrayLinkedin = `site:linkedin.com/in/ ("${locationTerm}" OR "United States" OR "Canada") ${formatGroup(synonyms.slice(0, 3))} ${formatGroup(primarySkills.slice(0, 4))} ${formatGroup(toolsAndCloud.slice(0, 3))} ${antiClause}`;

  // Variant C: Google X-Ray Query (GitHub Contributors)
  const githubSkills = languagesMatched.length ? languagesMatched : primarySkills;
  const googleXrayGithub = `site:github.com ("Joined on" OR "repositories" OR "contributions") ${formatGroup(githubSkills.slice(0, 3))} ${formatGroup(toolsAndCloud.slice(0, 3))} "${locationTerm}"`;

  // Variant D: Universal ATS Database Query (Taleo, Greenhouse, Lever, Workday)
  const atsQuery = [
    formatGroup(synonyms),
    formatGroup([...primarySkills, ...secondarySkills].slice(0, 6)),
    formatGroup(toolsAndCloud),
  ]
    .filter(Boolean)
    .join(" AND ");

  // Variant E: Broad Reach Sourcing Variant
  const broadQuery = [
    formatGroup([...synonyms, "Software Engineer", "Developer"]),
    formatGroup(primarySkills.slice(0, 3)),
  ]
    .filter(Boolean)
    .join(" AND ");

  // Variant F: High Precision Strict Match
  const strictQuery = [
    formatGroup([synonyms[0], synonyms[1]].filter(Boolean)),
    formatGroup(primarySkills),
    formatGroup(toolsAndCloud),
    antiClause,
  ]
    .filter(Boolean)
    .join(" AND ");

  const variants: BooleanVariant[] = [
    {
      id: "var-linkedin",
      label: "LinkedIn Recruiter / Talent Solutions Query",
      platform: "LinkedIn Recruiter",
      description: "Optimized for LinkedIn Recruiter search bar with grouped titles, primary skills, infrastructure & anti-keywords.",
      query: linkedinRecruiterQuery,
    },
    {
      id: "var-xray-linkedin",
      label: "Google X-Ray Query (LinkedIn Candidates)",
      platform: "Google X-Ray (LinkedIn)",
      description: "Google X-Ray string to bypass LinkedIn search limits and find public candidate profiles directly.",
      query: googleXrayLinkedin,
    },
    {
      id: "var-xray-github",
      label: "Google X-Ray Query (GitHub Developers)",
      platform: "Google X-Ray (GitHub)",
      description: "Target open-source engineers, active code contributors and public GitHub repositories matching tech stack.",
      query: googleXrayGithub,
    },
    {
      id: "var-ats",
      label: "ATS & Sourcing Database Query",
      platform: "ATS Database",
      description: "Universal Boolean format compatible with Greenhouse, Lever, Workday, Taleo, Ashby, and iCIMS.",
      query: atsQuery,
    },
    {
      id: "var-broad",
      label: "Broad Sourcing Variant (High Reach)",
      platform: "Broad Reach",
      description: "Expands candidate funnel by capturing adjacent titles and core transferable skills.",
      query: broadQuery,
    },
    {
      id: "var-strict",
      label: "High Precision Strict Match (Top 5%)",
      platform: "High Precision",
      description: "Narrows sourcing results to exact stack matches for urgent high-bar roles.",
      query: strictQuery,
    },
  ];

  const sourcingTips = [
    `Targeting ${synonyms.length} title variations to capture candidates who use non-standard job titles on LinkedIn.`,
    `Extracted ${primarySkills.length + toolsAndCloud.length} core technologies directly from the 1-page Job Description.`,
    `Excluded junior/intern anti-keywords to maintain candidate seniority quality.`,
    `Use Google X-Ray strings in Google Search to uncover un-indexed profiles without requiring a paid LinkedIn Recruiter seat.`,
  ];

  return {
    jobTitle: primaryTitle,
    titleSynonyms: synonyms,
    primarySkills,
    secondarySkills,
    toolsAndCloud,
    antiKeywords,
    variants,
    sourcingTips,
  };
}
