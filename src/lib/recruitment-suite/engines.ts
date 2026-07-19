// WorkoraJobs Recruitment Suite — Deterministic Engines & Libraries

export const SKILLS_LIBRARY = [
  "React", "TypeScript", "Node.js", "Python", "Java", "C++", "Go", "Rust", "Swift", "Kotlin",
  "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra", "DynamoDB",
  "AWS", "Google Cloud", "Azure", "Docker", "Kubernetes", "Terraform", "Ansible",
  "HTML5", "CSS3", "Sass", "Tailwind CSS", "Next.js", "NestJS", "Express.js",
  "GraphQL", "REST API", "gRPC", "WebSockets", "Apache Kafka", "RabbitMQ",
  "Figma", "Sketch", "Adobe XD", "User Research", "Wireframing", "Prototyping",
  "Product Management", "Scrum", "Agile", "Jira", "Confluence", "Product Strategy",
  "Data Analysis", "SQL", "Pandas", "NumPy", "Tableau", "PowerBI", "Machine Learning",
  "Recruiting", "Sourcing", "Applicant Tracking Systems", "CRM", "Talent Acquisition",
  "Financial Modeling", "Excel", "Project Management", "Budgeting", "Risk Assessment"
];

export const JOB_TITLES_LIBRARY = [
  "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Engineer",
  "Mobile App Developer", "DevOps Engineer", "Cloud Architect", "Site Reliability Engineer",
  "UI/UX Designer", "Product Designer", "Interaction Designer", "Visual Designer",
  "Product Manager", "Technical Product Manager", "Scrum Master", "Project Manager",
  "Data Scientist", "Data Analyst", "Data Engineer", "Machine Learning Engineer",
  "Technical Recruiter", "Talent Acquisition Specialist", "HR Manager", "Sourcer",
  "Financial Analyst", "Operations Manager", "Business Analyst", "Marketing Specialist"
];

export const COMPANIES_LIBRARY = [
  "Google", "Meta", "Microsoft", "Apple", "Amazon", "Netflix", "Salesforce", "Adobe",
  "Stripe", "Airbnb", "Uber", "Lyft", "Spotify", "Shopify", "HubSpot", "Slack",
  "McKinsey & Company", "Boston Consulting Group", "Bain & Company", "Goldman Sachs",
  "JPMorgan Chase", "Deloitte", "PwC", "EY", "KPMG", "Accenture", "Infosys", "Tata Consultancy Services"
];

export const UNIVERSITIES_LIBRARY = [
  "Stanford University", "Massachusetts Institute of Technology", "Harvard University",
  "University of California, Berkeley", "Carnegie Mellon University", "California Institute of Technology",
  "Oxford University", "Cambridge University", "University of Toronto", "OCAD University",
  "Waterloo University", "IIT Bombay", "IIT Delhi", "National University of Singapore"
];

export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  socials: string[];
  skills: string[];
  experienceYears: number;
  sections: Record<string, string[]>;
}

export function parseResumeText(text: string): ParsedResume {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  
  // Extract Email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : "";

  // Extract Phone
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : "";

  // Extract Name (First non-empty line that doesn't contain email/phone/urls)
  let name = "";
  for (const line of lines) {
    if (
      line.length > 2 &&
      line.length < 40 &&
      !line.includes("@") &&
      !line.match(/\d{4}/) &&
      !line.toLowerCase().includes("resume") &&
      !line.toLowerCase().includes("curriculum")
    ) {
      name = line;
      break;
    }
  }

  // Extract Socials
  const socialDomains = ["linkedin.com", "github.com", "twitter.com", "behance.net", "dribbble.com"];
  const socials = lines.filter(l => socialDomains.some(domain => l.toLowerCase().includes(domain)));

  // Extract Skills matching library
  const skills = SKILLS_LIBRARY.filter(skill => 
    new RegExp(`\\b${skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, "i").test(text)
  );

  // Extract Experience Years (heuristic)
  let experienceYears = 0;
  const expMatch = text.match(/\b(\d{1,2})\+?\s*years?\b/i);
  if (expMatch) {
    experienceYears = parseInt(expMatch[1], 10);
  } else {
    // Guess based on dates
    const years = [...text.matchAll(/\b(19|20)\d{2}\b/g)].map(m => parseInt(m[0], 10));
    if (years.length > 0) {
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      const diff = maxYear - minYear;
      if (diff > 0 && diff < 50) {
        experienceYears = diff;
      }
    }
  }

  // Split into sections
  const sectionKeywords: Record<string, string[]> = {
    summary: ["summary", "profile", "objective", "about me"],
    experience: ["experience", "employment", "work history", "career history"],
    education: ["education", "academics", "university", "college"],
    projects: ["projects", "key initiatives", "portfolio"],
    certifications: ["certifications", "certs", "courses", "licenses"]
  };

  const sections: Record<string, string[]> = {
    summary: [],
    experience: [],
    education: [],
    projects: [],
    certifications: []
  };

  let currentSection = "summary";
  for (const line of lines) {
    let switched = false;
    for (const [secKey, keywords] of Object.entries(sectionKeywords)) {
      if (keywords.some(kw => line.toLowerCase().replace(/[^a-z\s]/g, "").trim() === kw)) {
        currentSection = secKey;
        switched = true;
        break;
      }
    }
    if (!switched) {
      sections[currentSection].push(line);
    }
  }

  return {
    name: name || "Applicant Profile",
    email,
    phone,
    socials,
    skills,
    experienceYears: experienceYears || 1,
    sections
  };
}

// Visual Boolean Search Query Translator
export interface BooleanNode {
  operator: "AND" | "OR" | "NOT";
  terms: string[];
  children?: BooleanNode[];
}

export function generateBooleanQuery(node: BooleanNode, platform: string): string {
  const termsMapped = node.terms.map(t => t.includes(" ") ? `"${t}"` : t);
  const childQueries = node.children?.map(child => generateBooleanQuery(child, platform)) ?? [];
  const allElements = [...termsMapped, ...childQueries];

  if (allElements.length === 0) return "";
  
  let query = "";
  if (allElements.length === 1) {
    query = allElements[0];
  } else {
    const opSeparator = ` ${node.operator} `;
    query = `(${allElements.join(opSeparator)})`;
  }

  if (platform === "google-xray") {
    return `site:linkedin.com/in/ OR site:github.com/ ${query}`;
  }
  if (platform === "github") {
    return `location:global ${query}`;
  }
  return query;
}

// ATS Scorecard warnings validator
export interface AtsWarning {
  id: string;
  type: "error" | "warning";
  message: string;
}

export function validateAtsFormat(resume: ParsedResume): AtsWarning[] {
  const warnings: AtsWarning[] = [];

  if (!resume.email) {
    warnings.push({ id: "no-email", type: "error", message: "Missing email address in contact details." });
  }
  if (!resume.phone) {
    warnings.push({ id: "no-phone", type: "warning", message: "Missing contact phone number." });
  }
  if (resume.skills.length === 0) {
    warnings.push({ id: "no-skills", type: "error", message: "No standard technical skills detected. ATS algorithms may filter this resume out." });
  }
  if (resume.sections.experience.length === 0) {
    warnings.push({ id: "no-experience", type: "error", message: "No professional experience section identified." });
  }
  if (resume.sections.education.length === 0) {
    warnings.push({ id: "no-education", type: "warning", message: "Education section is missing or unformatted." });
  }

  // Check for placeholder templates / brackets
  const rawTextJoin = Object.values(resume.sections).flat().join(" ");
  if (rawTextJoin.includes("[") || rawTextJoin.includes("]") || rawTextJoin.toLowerCase().includes("lorem ipsum")) {
    warnings.push({ id: "placeholder-text", type: "error", message: "Draft placeholders or template bracket characters detected in resume text." });
  }

  return warnings;
}
