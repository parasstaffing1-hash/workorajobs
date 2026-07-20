export const KNOWN_SKILLS = [
  // multi-word first (longest match wins)
  "machine learning", "deep learning", "data science", "data engineering", "data analysis",
  "natural language processing", "computer vision", "business intelligence", "power bi",
  "spring boot", "react native", "react js", "node js", "next js", "vue js", "asp net", "dot net",
  "ruby on rails", "objective c", "visual basic", "sql server", "my sql", "postgre sql",
  "rest api", "restful api", "micro services", "microservices architecture", "unit testing",
  "ci cd", "continuous integration", "continuous delivery", "version control",
  "project management", "product management", "program management", "stakeholder management",
  "supply chain", "quality assurance", "quality control", "test automation", "manual testing",
  "digital marketing", "content marketing", "social media", "search engine optimization",
  "google analytics", "google ads", "account management", "business development",
  "customer success", "customer service", "full stack", "front end", "back end",
  "talent acquisition", "human resources", "financial analysis", "financial modeling",
  "accounts payable", "accounts receivable", "general ledger", "cost accounting",
  "salesforce crm", "ms excel", "microsoft excel", "microsoft office", "active directory",
  "penetration testing", "ethical hacking", "cloud computing", "cloud security",
  "network security", "information security", "cyber security", "incident response",
  "agile methodology", "scrum master", "user research", "user experience", "user interface",
  "graphic design", "motion graphics", "video editing", "technical writing",
  "medical coding", "clinical research", "patient care", "revenue cycle",
  "lead generation", "cold calling", "inside sales", "outside sales", "field sales",
  "mechanical design", "electrical design", "embedded systems", "plc programming",
  "six sigma", "lean manufacturing", "root cause analysis",
  // single-word / acronyms
  "java", "python", "javascript", "typescript", "golang", "rust", "scala", "kotlin", "swift",
  "php", "perl", "ruby", "html", "css", "sass", "sql", "nosql", "mysql", "postgresql", "mongodb",
  "oracle", "redis", "elasticsearch", "kafka", "rabbitmq", "graphql", "django", "flask",
  "laravel", "angular", "react", "vue", "svelte", "jquery", "bootstrap", "tailwind", "nodejs",
  "express", "fastapi", "spring", "hibernate", "dotnet", "csharp", "aws", "azure", "gcp",
  "docker", "kubernetes", "terraform", "ansible", "jenkins", "gitlab", "github", "git", "jira",
  "confluence", "linux", "unix", "bash", "powershell", "devops", "sre", "etl", "hadoop", "spark",
  "airflow", "snowflake", "databricks", "tableau", "looker", "excel", "vba", "sas", "spss", "r",
  "matlab", "tensorflow", "pytorch", "keras", "pandas", "numpy", "nlp", "llm", "genai",
  "selenium", "cypress", "playwright", "appium", "junit", "testng", "postman", "api",
  "salesforce", "sap", "erp", "crm", "hubspot", "zoho", "workday", "peoplesoft", "netsuite",
  "quickbooks", "xero", "figma", "sketch", "photoshop", "illustrator", "indesign", "canva",
  "autocad", "solidworks", "revit", "catia", "ansys", "seo", "sem", "ppc", "smm", "ecommerce",
  "shopify", "magento", "wordpress", "woocommerce", "flutter", "android", "ios", "xamarin",
  "unity", "blockchain", "solidity", "iot", "gis", "cad", "bim", "hvac", "osha", "gmp", "fda",
  "hipaa", "soc2", "gdpr", "pci", "itil", "pmp", "cpa", "cfa", "shrm", "ceh", "cissp", "ccna",
  "scrum", "kanban", "agile", "waterfall", "saas", "b2b", "b2c", "kpi", "roi", "p&l",
  "recruiting", "sourcing", "onboarding", "payroll", "benefits", "compliance", "audit",
  "taxation", "budgeting", "forecasting", "procurement", "logistics", "warehousing",
  "negotiation", "underwriting", "claims", "actuarial", "nursing", "pharmacy", "radiology",
  "phlebotomy", "icd-10", "cpt", "ehr", "emr", "epic", "cerner", "meditech"
];

export const STOP = new Set((
  "a,an,the,and,or,not,of,in,on,at,to,for,with,by,from,as,is,are,was,were,be,been," +
  "we,you,our,your,their,they,he,she,it,its,this,that,these,those,who,what,which,will," +
  "shall,can,could,should,would,may,might,must,have,has,had,do,does,did,about,across," +
  "job,role,position,candidate,candidates,applicant,team,company,client,clients,work," +
  "working,works,ability,able,strong,excellent,good,great,solid,proven,demonstrated," +
  "experience,experienced,years,year,yrs,plus,preferred,required,requirements," +
  "requirement,responsibilities,responsibility,skills,skill,knowledge,understanding," +
  "familiarity,proficiency,proficient,expertise,background,degree,bachelor,bachelors," +
  "master,masters,phd,mba,education,qualification,qualifications,certification," +
  "salary,benefits,location,remote,hybrid,onsite,full,time,part,contract,permanent," +
  "description,summary,overview,duties,including,include,includes,etc,other,various," +
  "related,relevant,equivalent,minimum,least,ideal,ideally,looking,seeking,hiring," +
  "join,opportunity,environment,fast,paced,dynamic,motivated,passionate,detail," +
  "oriented,communication,verbal,written,interpersonal,organizational,multitask," +
  "day,daily,new,within,using,use,used,based,well,also,both,per,via,any,all,more," +
  "ensure,ensuring,develop,developing,development,manage,managing,management," +
  "support,supporting,provide,providing,perform,performing,maintain,maintaining," +
  "collaborate,collaborating,collaboration,cross,functional,best,practices,tools," +
  "technologies,technology,platforms,platform,systems,system,solutions,solution," +
  "services,service,processes,process,projects,project,tasks,task,goals,areas," +
  "must,nice,bonus,apply,now,email,resume,cv,eeo,equal,employer,disability,veteran"
).split(","));

export const TITLE_WORDS = new Set((
  "engineer,developer,manager,analyst,architect,consultant,specialist," +
  "designer,scientist,administrator,lead,director,coordinator,executive,officer,head," +
  "recruiter,accountant,auditor,nurse,technician,programmer,tester,writer,strategist," +
  "representative,associate,supervisor,controller,planner,buyer,estimator,intern"
).split(","));

export const TITLE_MODIFIERS = new Set((
  "senior,junior,sr,jr,lead,principal,staff,chief,associate," +
  "assistant,head,vp,vice,president,entry,level,mid,ii,iii,iv"
).split(","));

export const TITLE_SYNONYMS: Record<string, string[]> = {
  developer: ["engineer", "programmer"],
  engineer: ["developer"],
  programmer: ["developer", "engineer"],
  manager: ["lead", "head"],
  analyst: ["specialist"],
  recruiter: ["talent acquisition"],
  designer: ["ux designer", "ui designer"],
};

export function normalizeText(text: string) {
  return text
    .replace(/[\u2018\u2019\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\r\n/g, "\n");
}

export function cleanTitle(t: string) {
  return t.replace(/\s+/g, " ").replace(/[.,;:!?]+$/, "").trim();
}

export function extractTitle(text: string) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  
  // 1) explicit "Job Title:" / "Role:" / "Position:" labels
  for (let i = 0; i < Math.min(lines.length, 12); i++) {
    const m = lines[i].match(/^(?:job\s*title|role|position|designation)\s*[:\-–]\s*(.{3,70})$/i);
    if (m) return cleanTitle(m[1]);
  }
  
  // 2) "hiring a/an X" / "looking for a/an X" patterns
  const m2 = text.match(/(?:hiring|looking\s+for|seeking|searching\s+for)\s+(?:an?\s+)?([A-Z][A-Za-z+#./ ]{3,60}?)(?:\s+(?:with|who|to|for|in|at)\b|[.,\n])/);
  if (m2) return cleanTitle(m2[1]);
  
  // 3) a short early line that ends in a title word
  for (let j = 0; j < Math.min(lines.length, 6); j++) {
    const words = lines[j].replace(/[^A-Za-z+#./ ]/g, " ").trim().split(/\s+/);
    if (words.length >= 2 && words.length <= 6) {
      const last = words[words.length - 1].toLowerCase();
      if (TITLE_WORDS.has(last)) return cleanTitle(words.join(" "));
    }
  }
  
  // 4) scan whole text for "<Modifier>? <Something> <TitleWord>" phrase
  const m3 = text.match(/\b((?:[A-Z][\w+#.]*\s+){1,3}(?:Engineer|Developer|Manager|Analyst|Architect|Consultant|Specialist|Designer|Scientist|Administrator|Recruiter|Accountant|Nurse|Technician|Coordinator|Director))\b/);
  if (m3) return cleanTitle(m3[1]);
  
  return "";
}

export function prettifySkill(skill: string) {
  const special: Record<string, string> = {
    aws: "AWS", gcp: "GCP", sql: "SQL", nosql: "NoSQL", php: "PHP", html: "HTML",
    css: "CSS", api: "API", "rest api": "REST API", "ci cd": "CI/CD", etl: "ETL",
    sap: "SAP", erp: "ERP", crm: "CRM", seo: "SEO", sem: "SEM", ppc: "PPC",
    nlp: "NLP", llm: "LLM", ios: "iOS", devops: "DevOps", nodejs: "Node.js",
    "react js": "React.js", "node js": "Node.js", "next js": "Next.js", "vue js": "Vue.js",
    "power bi": "Power BI", mysql: "MySQL", postgresql: "PostgreSQL", mongodb: "MongoDB",
    csharp: "C#", dotnet: ".NET", "asp net": "ASP.NET", "dot net": ".NET",
    sre: "SRE", vba: "VBA", sas: "SAS", spss: "SPSS", hipaa: "HIPAA",
    itil: "ITIL", pmp: "PMP", cpa: "CPA", cfa: "CFA", b2b: "B2B", b2c: "B2C",
    kpi: "KPI", roi: "ROI", saas: "SaaS", iot: "IoT", ehr: "EHR", emr: "EMR",
    "icd-10": "ICD-10", cpt: "CPT", osha: "OSHA", gmp: "GMP", fda: "FDA",
    gdpr: "GDPR", pci: "PCI", soc2: "SOC2", ceh: "CEH", cissp: "CISSP",
    ccna: "CCNA", shrm: "SHRM", hvac: "HVAC", "plc programming": "PLC Programming",
    "my sql": "MySQL", "postgre sql": "PostgreSQL", "sql server": "SQL Server",
    genai: "GenAI", gis: "GIS", cad: "CAD", bim: "BIM", "p&l": "P&L",
    tensorflow: "TensorFlow", pytorch: "PyTorch", numpy: "NumPy",
    graphql: "GraphQL", javascript: "JavaScript",
    typescript: "TypeScript", github: "GitHub", gitlab: "GitLab",
    linkedin: "LinkedIn", wordpress: "WordPress", woocommerce: "WooCommerce",
    quickbooks: "QuickBooks", hubspot: "HubSpot", fastapi: "FastAPI",
    autocad: "AutoCAD", solidworks: "SolidWorks", testng: "TestNG",
    junit: "JUnit", rabbitmq: "RabbitMQ"
  };
  
  if (special[skill]) return special[skill];
  return skill.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function extractSkills(text: string) {
  const lower = " " + text.toLowerCase().replace(/[^a-z0-9+#&\-]/g, " ").replace(/\s+/g, " ") + " ";
  const found: { text: string; score: number }[] = [];
  const seen = new Set<string>();

  // Pass 1: dictionary matching
  KNOWN_SKILLS.forEach((skill) => {
    const needle = " " + skill + " ";
    if (lower.indexOf(needle) !== -1 && !seen.has(skill)) {
      seen.add(skill);
      found.push({ text: prettifySkill(skill), score: 10 + skill.split(" ").length * 2 });
    }
  });

  // Pass 2: frequency-scored capitalized terms & acronyms not in dictionary
  const counts: Record<string, number> = {};
  const tokens = text.match(/\b[A-Z][A-Za-z0-9+#.]{1,24}\b/g) || [];
  const seenList = Array.from(seen);
  
  tokens.forEach((tok) => {
    const low = tok.toLowerCase().replace(/\./g, " ").trim();
    if (STOP.has(low) || TITLE_MODIFIERS.has(low) || TITLE_WORDS.has(low)) return;
    if (seen.has(low)) return;
    if (/^\d+$/.test(tok)) return;
    
    const isFragment = seenList.some((s) => s.split(" ").indexOf(low) !== -1);
    if (isFragment) return;
    
    counts[tok] = (counts[tok] || 0) + 1;
  });
  
  Object.keys(counts).forEach((tok) => {
    const isAcronym = /^[A-Z0-9]{2,6}$/.test(tok);
    const score = counts[tok] + (isAcronym ? 3 : 0);
    if (score >= 2) found.push({ text: tok, score: score });
  });

  found.sort((a, b) => b.score - a.score);

  // de-dup case-insensitively, cap at 14
  const out: string[] = [];
  const used = new Set<string>();
  
  for (let i = 0; i < found.length && out.length < 14; i++) {
    const key = found[i].text.toLowerCase();
    if (!used.has(key)) {
      used.add(key);
      out.push(found[i].text);
    }
  }
  
  return out;
}

export function q(term: string) {
  return /[\s/&.+#-]/.test(term) || term.indexOf(" ") !== -1 ? '"' + term + '"' : term;
}

export function generateTitleGroup(title: string) {
  if (!title) return "";
  const variants = [title];
  const lastWord = title.split(" ").pop()?.toLowerCase() || "";
  
  (TITLE_SYNONYMS[lastWord] || []).forEach((syn) => {
    const v = title.replace(new RegExp(lastWord + "$", "i"), "");
    variants.push((v + syn).replace(/\s+/g, " ").trim());
  });
  
  return "(" + variants.map(q).join(" OR ") + ")";
}
