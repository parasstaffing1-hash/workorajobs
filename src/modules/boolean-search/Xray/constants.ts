export interface PlatformItem {
  name: string;
  domain: string;
  category: 'professional' | 'tech' | 'design' | 'community';
}

export const PLATFORMS: PlatformItem[] = [
  { name: 'LinkedIn', domain: 'linkedin.com/in', category: 'professional' },
  { name: 'LinkedIn Public', domain: 'linkedin.com/pub OR linkedin.com/in', category: 'professional' },
  { name: 'GitHub', domain: 'github.com', category: 'tech' },
  { name: 'GitLab', domain: 'gitlab.com', category: 'tech' },
  { name: 'Stack Overflow', domain: 'stackoverflow.com/users', category: 'tech' },
  { name: 'Indeed', domain: 'indeed.com/r', category: 'professional' },
  { name: 'Naukri', domain: 'naukri.com', category: 'professional' },
  { name: 'Monster', domain: 'monster.com/resumes', category: 'professional' },
  { name: 'Dice', domain: 'dice.com/profiles', category: 'professional' },
  { name: 'CareerBuilder', domain: 'careerbuilder.com', category: 'professional' },
  { name: 'CV Library', domain: 'cv-library.co.uk', category: 'professional' },
  { name: 'Reed', domain: 'reed.co.uk/profiles', category: 'professional' },
  { name: 'Wellfound', domain: 'wellfound.com', category: 'professional' },
  { name: 'AngelList', domain: 'angel.co', category: 'professional' },
  { name: 'Dribbble', domain: 'dribbble.com', category: 'design' },
  { name: 'Behance', domain: 'behance.net', category: 'design' },
  { name: 'Medium', domain: 'medium.com', category: 'community' },
  { name: 'Kaggle', domain: 'kaggle.com', category: 'tech' },
  { name: 'Dev.to', domain: 'dev.to', category: 'tech' },
  { name: 'Reddit', domain: 'reddit.com/user', category: 'community' },
  { name: 'Quora', domain: 'quora.com/profile', category: 'community' },
  { name: 'YouTube', domain: 'youtube.com', category: 'design' },
  { name: 'Twitter/X', domain: 'twitter.com OR x.com', category: 'community' },
  { name: 'Facebook', domain: 'facebook.com', category: 'community' },
  { name: 'Instagram', domain: 'instagram.com', category: 'design' },
  { name: 'Pinterest', domain: 'pinterest.com', category: 'design' },
  { name: 'ResearchGate', domain: 'researchgate.net/profile', category: 'tech' },
  { name: 'SourceForge', domain: 'sourceforge.net', category: 'tech' },
  { name: 'Bitbucket', domain: 'bitbucket.org', category: 'tech' }
];

export interface XrayPreset {
  name: string;
  description: string;
  selectedSites: string[];
  selectedProfileTypes: string[];
  requiredKeywords: string;
  optionalKeywords: string;
  excludeKeywords: string;
  filters: {
    location?: string;
    company?: string;
    currentCompany?: string;
    previousCompany?: string;
    experience?: string;
    education?: string;
    degree?: string;
    certification?: string;
    technology?: string;
    industry?: string;
    language?: string;
    remote?: string;
    hybrid?: string;
  };
}

export const PRESETS: XrayPreset[] = [
  {
    name: 'LinkedIn Profile Search',
    description: 'Find public LinkedIn profiles for software engineers.',
    selectedSites: ['LinkedIn'],
    selectedProfileTypes: ['Public Profiles'],
    requiredKeywords: 'Software Engineer',
    optionalKeywords: 'React, TypeScript, Node',
    excludeKeywords: 'Manager, Lead, Director',
    filters: { location: 'United States', remote: 'yes' }
  },
  {
    name: 'LinkedIn Recruiter Search',
    description: 'Find internal & agency recruiters and talent sourcers.',
    selectedSites: ['LinkedIn Public'],
    selectedProfileTypes: ['Public Profiles'],
    requiredKeywords: 'Recruiter OR Sourcer',
    optionalKeywords: 'Technical Recruiting, Talent Acquisition',
    excludeKeywords: 'Assistant, Coordinator',
    filters: { location: 'United States' }
  },
  {
    name: 'GitHub Developer Search',
    description: 'Find active software developers with public repositories.',
    selectedSites: ['GitHub'],
    selectedProfileTypes: ['Repositories', 'Public Profiles'],
    requiredKeywords: 'Python',
    optionalKeywords: 'Django, Flask, FastAPI',
    excludeKeywords: 'Course, Bootcamp',
    filters: { location: 'San Francisco' }
  },
  {
    name: 'GitHub Repository Search',
    description: 'Search for machine learning repositories and projects.',
    selectedSites: ['GitHub'],
    selectedProfileTypes: ['Repositories'],
    requiredKeywords: '"machine learning"',
    optionalKeywords: 'PyTorch, TensorFlow',
    excludeKeywords: 'homework, assignment',
    filters: { technology: 'Python' }
  },
  {
    name: 'PDF Resume Search',
    description: 'Sourcing uploaded PDF resumes from general web index.',
    selectedSites: [],
    selectedProfileTypes: ['PDFs', 'Resumes'],
    requiredKeywords: '"Software Developer"',
    optionalKeywords: 'AWS, Docker, Kubernetes',
    excludeKeywords: 'template, sample',
    filters: { location: 'Remote' }
  },
  {
    name: 'DOC Resume Search',
    description: 'Search for Word document format resumes.',
    selectedSites: [],
    selectedProfileTypes: ['DOCX Files', 'Resumes'],
    requiredKeywords: '"Product Manager"',
    optionalKeywords: 'Roadmap, Agile, Jira',
    excludeKeywords: 'sample, download',
    filters: { certification: 'PMP' }
  },
  {
    name: 'Stack Overflow Search',
    description: 'Find developers on Stack Overflow answering specific tech.',
    selectedSites: ['Stack Overflow'],
    selectedProfileTypes: ['Public Profiles'],
    requiredKeywords: 'JavaScript',
    optionalKeywords: 'CSS, HTML, DOM',
    excludeKeywords: 'spam',
    filters: { location: 'London' }
  },
  {
    name: 'Portfolio Search',
    description: 'Find designers on Behance and Dribbble.',
    selectedSites: ['Dribbble', 'Behance'],
    selectedProfileTypes: ['Portfolios'],
    requiredKeywords: '"UI/UX Designer"',
    optionalKeywords: 'Figma, Sketch, Adobe XD',
    excludeKeywords: 'intern, junior',
    filters: { location: 'New York' }
  },
  {
    name: 'Research Paper Search',
    description: 'Search for AI / Deep Learning research papers on ResearchGate.',
    selectedSites: ['ResearchGate'],
    selectedProfileTypes: ['Research Papers', 'PDFs'],
    requiredKeywords: '"Deep Learning"',
    optionalKeywords: 'Transformers, BERT, GPT',
    excludeKeywords: 'introductory, basics',
    filters: { degree: 'PhD' }
  },
  {
    name: 'Open Source Contributor',
    description: 'Find developers who contribute to large orchestrators.',
    selectedSites: ['GitHub', 'GitLab'],
    selectedProfileTypes: ['Repositories', 'Projects'],
    requiredKeywords: 'Kubernetes',
    optionalKeywords: 'Go, Docker, Helm',
    excludeKeywords: 'forked',
    filters: { certification: 'CKA' }
  },
  {
    name: 'Cloud Engineer Search',
    description: 'Find Cloud and DevOps Engineers on LinkedIn.',
    selectedSites: ['LinkedIn'],
    selectedProfileTypes: ['Public Profiles'],
    requiredKeywords: '"Cloud Engineer"',
    optionalKeywords: 'AWS, Azure, GCP, Terraform',
    excludeKeywords: 'trainee, student',
    filters: { location: 'Texas' }
  },
  {
    name: 'SAP Search',
    description: 'Sourcing SAP certified specialists.',
    selectedSites: ['LinkedIn'],
    selectedProfileTypes: ['Public Profiles'],
    requiredKeywords: '"SAP Consultant"',
    optionalKeywords: 'ABAP, S/4HANA, FICO',
    excludeKeywords: 'end-user',
    filters: { certification: 'SAP Certified' }
  },
  {
    name: 'Salesforce Search',
    description: 'Sourcing Salesforce technical architects and developers.',
    selectedSites: ['LinkedIn'],
    selectedProfileTypes: ['Public Profiles'],
    requiredKeywords: '"Salesforce Developer"',
    optionalKeywords: 'Apex, LWC, Visualforce',
    excludeKeywords: 'admin',
    filters: { certification: 'Platform Developer II' }
  },
  {
    name: 'Workday Search',
    description: 'Find Workday consultants and integration developers.',
    selectedSites: ['LinkedIn'],
    selectedProfileTypes: ['Public Profiles'],
    requiredKeywords: '"Workday Consultant"',
    optionalKeywords: 'HCM, Workday Studio, PECI',
    excludeKeywords: 'hr generalist',
    filters: { location: 'Chicago' }
  },
  {
    name: 'Healthcare Search',
    description: 'Find Registered Nurses or Healthcare leaders.',
    selectedSites: ['LinkedIn'],
    selectedProfileTypes: ['Public Profiles'],
    requiredKeywords: '"Registered Nurse" OR RN',
    optionalKeywords: 'ICU, ER, Clinical, Hospital',
    excludeKeywords: 'receptionist',
    filters: { location: 'California' }
  },
  {
    name: 'Cyber Security Search',
    description: 'Find certified penetration testers and security analysts.',
    selectedSites: ['LinkedIn'],
    selectedProfileTypes: ['Public Profiles'],
    requiredKeywords: '"Cyber Security" OR "Information Security"',
    optionalKeywords: 'Penetration Testing, CISSP, CEH',
    excludeKeywords: 'sales',
    filters: { location: 'Washington DC' }
  }
];

export const OPERATORS = [
  { symbol: 'site:', desc: 'Restricts search to a specific domain or website.' },
  { symbol: 'filetype:', desc: 'Finds documents of specific formats (pdf, docx, etc.).' },
  { symbol: 'intitle:', desc: 'Requires keywords to exist in page title.' },
  { symbol: 'inurl:', desc: 'Requires keywords to exist in the URL string.' },
  { symbol: 'cache:', desc: 'Displays Google\'s cached version of the page.' },
  { symbol: 'related:', desc: 'Finds sites similar to the specified site URL.' },
  { symbol: 'before:', desc: 'Finds results indexed before a specific date.' },
  { symbol: 'after:', desc: 'Finds results indexed after a specific date.' },
  { symbol: 'AROUND(N)', desc: 'Finds terms within N words distance of each other.' },
  { symbol: 'AND', desc: 'Combines terms; both must appear in search results.' },
  { symbol: 'OR', desc: 'Provides options; at least one term must appear.' },
  { symbol: 'NOT / -', desc: 'Excludes terms from search results.' },
  { symbol: '""', desc: 'Enforces exact match of the enclosed phrase.' },
  { symbol: '*', desc: 'Acts as wildcard operator to fill in unknown words.' },
  { symbol: '()', desc: 'Groups sub-expressions to control operator order.' }
];

export const ENGINES = [
  { name: 'Google', base: 'https://www.google.com/search?q=' },
  { name: 'Bing', base: 'https://www.bing.com/search?q=' },
  { name: 'Yahoo', base: 'https://search.yahoo.com/search?p=' },
  { name: 'DuckDuckGo', base: 'https://duckduckgo.com/?q=' },
  { name: 'Brave Search', base: 'https://search.brave.com/search?q=' },
  { name: 'Yandex', base: 'https://yandex.com/search/?text=' },
  { name: 'Baidu', base: 'https://www.baidu.com/s?wd=' }
];

export const COMPATIBILITY = [
  { op: 'site:', google: '✅ Full', bing: '✅ Full', yahoo: '✅ Full', brave: '✅ Full', ddg: '✅ Full' },
  { op: 'filetype:', google: '✅ Full', bing: '✅ Full', yahoo: '⚠️ Partial', brave: '❌ None', ddg: '❌ None' },
  { op: 'intitle:', google: '✅ Full', bing: '✅ Full', yahoo: '✅ Full', brave: '✅ Full', ddg: '✅ Full' },
  { op: 'inurl:', google: '✅ Full', bing: '✅ Full', yahoo: '✅ Full', brave: '✅ Full', ddg: '✅ Full' },
  { op: 'AROUND(N)', google: '✅ Full', bing: '⚠️ NEAR', yahoo: '❌ None', brave: '❌ None', ddg: '❌ None' },
  { op: 'before:/after:', google: '✅ Full', bing: '⚠️ Limited', yahoo: '❌ None', brave: '❌ None', ddg: '❌ None' },
  { op: 'Quotes ""', google: '✅ Full', bing: '✅ Full', yahoo: '✅ Full', brave: '✅ Full', ddg: '✅ Full' },
  { op: 'Wildcard *', google: '✅ Full', bing: '✅ Full', yahoo: '⚠️ Partial', brave: '⚠️ Partial', ddg: '⚠️ Partial' }
];
