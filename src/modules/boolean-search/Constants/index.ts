import { Platform, Template, LearningItem, HistoryItem, SavedSearch, Activity } from '../Types';

export const PLATFORMS: Platform[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    iconName: 'Linkedin',
    placeholder: 'site:linkedin.com/in/ "Java Developer" AND "Spring Boot"',
    description: 'Target candidate profiles on LinkedIn with precise keywords and location titles.',
    domains: ['linkedin.com/in', 'linkedin.com/pub'],
    operators: ['AND', 'OR', 'NOT', '""', '()']
  },
  {
    id: 'google',
    name: 'Google X-Ray',
    iconName: 'Globe',
    placeholder: 'site:linkedin.com/in/ ("Product Manager" OR "Product Owner") "Agile"',
    description: 'Sourcing candidates across any domain using site:, intitle:, inurl: commands.',
    domains: [],
    operators: ['site:', 'intitle:', 'inurl:', 'filetype:', 'AND', 'OR', 'NOT', '""', '()']
  },
  {
    id: 'github',
    name: 'GitHub',
    iconName: 'Github',
    placeholder: 'site:github.com "joined on" "React" AND "TypeScript"',
    description: 'Find active software developers through public repositories, bios, and locations.',
    domains: ['github.com'],
    operators: ['site:', 'inurl:', '"joined on"', '"email"', 'AND', 'OR']
  },
  {
    id: 'stackoverflow',
    name: 'Stack Overflow',
    iconName: 'Layers',
    placeholder: 'site:stackoverflow.com/users "Python" AND "Data Scientist"',
    description: 'Sift through technical contributors and top answers on Stack Overflow.',
    domains: ['stackoverflow.com/users'],
    operators: ['site:', 'inurl:', 'AND', 'OR']
  },
  {
    id: 'naukri',
    name: 'Naukri',
    iconName: 'Briefcase',
    placeholder: 'site:resumes.naukri.com "Salesforce Developer" AND "Apex"',
    description: 'Source major Indian market resumes and candidate portfolios.',
    domains: ['resumes.naukri.com', 'naukri.com'],
    operators: ['site:', 'AND', 'OR', 'NOT']
  },
  {
    id: 'indeed',
    name: 'Indeed',
    iconName: 'Search',
    placeholder: 'site:indeed.com/r/ "Registered Nurse" AND "ICU"',
    description: 'X-Ray Indeed resume databases directly inside the browser search engines.',
    domains: ['indeed.com/r', 'indeed.com/resume'],
    operators: ['site:', 'AND', 'OR']
  },
  {
    id: 'dice',
    name: 'Dice',
    iconName: 'Database',
    placeholder: 'site:dice.com/jobs/ "Cyber Security" AND "CISSP"',
    description: 'Access premium technology resumes and candidate boards on Dice.',
    domains: ['dice.com/jobs', 'dice.com/candidates'],
    operators: ['site:', 'AND', 'OR']
  },
  {
    id: 'monster',
    name: 'Monster',
    iconName: 'ShieldAlert',
    placeholder: 'site:monster.com/profile "DevOps" AND "Terraform"',
    description: 'Source general profiles and resumes from Monster’s massive global network.',
    domains: ['monster.com/profile'],
    operators: ['site:', 'AND', 'OR']
  },
  {
    id: 'xing',
    name: 'Xing',
    iconName: 'Users',
    placeholder: 'site:xing.com/profile "SAP Consultant" "Munich"',
    description: 'Find professional candidates in Germany, Austria, and Switzerland (DACH).',
    domains: ['xing.com/profile'],
    operators: ['site:', 'AND', 'OR']
  },
  {
    id: 'dribbble',
    name: 'Dribbble',
    iconName: 'Palette',
    placeholder: 'site:dribbble.com "UI/UX Designer" "Figma" AND "London"',
    description: 'Sourcing world-class digital designers, illustrators, and artists.',
    domains: ['dribbble.com'],
    operators: ['site:', 'AND', 'OR']
  },
  {
    id: 'behance',
    name: 'Behance',
    iconName: 'Award',
    placeholder: 'site:behance.net "Art Director" AND "Photoshop"',
    description: 'Search creative portfolios, layout masters, and motion graphic designers.',
    domains: ['behance.net'],
    operators: ['site:', 'AND', 'OR']
  },
  {
    id: 'wellfound',
    name: 'Wellfound (AngelList)',
    iconName: 'Sparkles',
    placeholder: 'site:wellfound.com "Founding Engineer" AND "NextJS"',
    description: 'Find startup-ready builders, product minds, and early stage leaders.',
    domains: ['wellfound.com', 'angel.co'],
    operators: ['site:', 'AND', 'OR']
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    iconName: 'Gitlab',
    placeholder: 'site:gitlab.com "Golang Developer" AND "Kubernetes"',
    description: 'Look through software projects, open source code, and developer profiles on GitLab.',
    domains: ['gitlab.com'],
    operators: ['site:', 'AND', 'OR']
  },
  {
    id: 'bitbucket',
    name: 'BitBucket',
    iconName: 'Cpu',
    placeholder: 'site:bitbucket.org "Python" AND "CI/CD"',
    description: 'Find technology talents sharing code repositories on Atlassian Bitbucket.',
    domains: ['bitbucket.org'],
    operators: ['site:', 'AND', 'OR']
  },
  {
    id: 'careerbuilder',
    name: 'CareerBuilder',
    iconName: 'Compass',
    placeholder: 'site:careerbuilder.com/profiles "Account Manager" AND "Sales"',
    description: 'Source professional resumes and talent pools from CareerBuilder’s networks.',
    domains: ['careerbuilder.com/profiles', 'careerbuilder.com/resume'],
    operators: ['site:', 'AND', 'OR']
  }
];

export const TEMPLATES: Template[] = [
  {
    id: 'java-dev',
    name: 'Java Developer',
    role: 'Java Developer / Software Engineer',
    category: 'Tech',
    description: 'Sourcing backend Java engineers with experience in modern frameworks, SQL, and microservices.',
    keywords: ['Java', 'Spring', 'Spring Boot', 'Hibernate', 'Microservices', 'REST API', 'SQL'],
    skills: ['Java 17', 'Docker', 'PostgreSQL', 'JUnit', 'AWS', 'Maven'],
    popular: true
  },
  {
    id: 'python-dev',
    name: 'Python Developer',
    role: 'Python Developer / Backend Engineer',
    category: 'Tech',
    description: 'Sourcing Python backend engineers skilled in Django, Flask, FastAPI, and data structures.',
    keywords: ['Python', 'Django', 'Flask', 'FastAPI', 'RESTful', 'SQL', 'NoSQL'],
    skills: ['Python 3.x', 'Docker', 'Celery', 'Redis', 'PostgreSQL', 'Git'],
    popular: true
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    role: 'Data Scientist / ML Researcher',
    category: 'Tech',
    description: 'Finding analytical experts specialized in statistical analysis, machine learning algorithms, and visualization tools.',
    keywords: ['Data Scientist', 'Data Science', 'Machine Learning', 'ML', 'Python', 'SQL', 'R'],
    skills: ['TensorFlow', 'PyTorch', 'Pandas', 'Scikit-Learn', 'Tableau', 'BigQuery'],
    popular: true
  },
  {
    id: 'devops',
    name: 'DevOps Engineer',
    role: 'DevOps Engineer / Site Reliability Engineer (SRE)',
    category: 'Tech',
    description: 'Targeting automation and infrastructure wizards, specialists in CI/CD pipelines, containerization, and cloud orchestration.',
    keywords: ['DevOps', 'SRE', 'Site Reliability', 'Platform Engineer', 'CI/CD', 'Docker', 'Kubernetes'],
    skills: ['Terraform', 'AWS', 'Ansible', 'Jenkins', 'Linux', 'Bash', 'Prometheus'],
    popular: true
  },
  {
    id: 'react-dev',
    name: 'React Developer',
    role: 'React Frontend Engineer / UI Engineer',
    category: 'Tech',
    description: 'Sourcing frontend React developers specializing in state management, TypeScript, and responsive CSS.',
    keywords: ['React', 'React.js', 'ReactJS', 'Redux', 'TypeScript', 'JavaScript', 'CSS'],
    skills: ['Next.js', 'TailwindCSS', 'HTML5', 'ES6', 'Webpack', 'Jest'],
    popular: true
  },
  {
    id: 'nodejs',
    name: 'NodeJS Developer',
    role: 'NodeJS / Full Stack Engineer',
    category: 'Tech',
    description: 'Targeting backend developers who leverage JavaScript/TypeScript with Express, NestJS, and Mongo/SQL.',
    keywords: ['Node', 'NodeJS', 'Node.js', 'Express', 'NestJS', 'TypeScript', 'REST API'],
    skills: ['MongoDB', 'Mongoose', 'Redis', 'Jest', 'PostgreSQL', 'Prisma'],
    popular: true
  },
  {
    id: 'sap-abap',
    name: 'SAP ABAP',
    role: 'SAP ABAP Consultant / Developer',
    category: 'SAP',
    description: 'Find ABAP developers specialized in SAP NetWeaver, custom development, and reports.',
    keywords: ['SAP', 'ABAP', 'NetWeaver', 'BADI', 'BAPI', 'RFC', 'OO-ABAP', 'ALV'],
    skills: ['Web Dynpro', 'SAP HANA', 'CDS Views', 'AMDP', 'Fiori'],
    popular: false
  },
  {
    id: 'sap-fico',
    name: 'SAP FICO',
    role: 'SAP FICO Consultant',
    category: 'SAP',
    description: 'Sourcing SAP Finance and Controlling experts with deep ledger configurations.',
    keywords: ['SAP', 'FICO', 'FI-CO', 'General Ledger', 'Accounts Payable', 'AP', 'AR', 'Asset Accounting'],
    skills: ['SAP S/4HANA', 'Controlling', 'Profitability Analysis', 'Cost Center'],
    popular: false
  },
  {
    id: 'sap-hana',
    name: 'SAP HANA',
    role: 'SAP HANA Consultant / Architect',
    category: 'SAP',
    description: 'Targeting HANA database developers, modelers, and architects.',
    keywords: ['SAP HANA', 'S/4HANA', 'HANA Studio', 'CDS Views', 'AMDP', 'SQLScript'],
    skills: ['Database Modeling', 'SAP BASIS', 'BW on HANA', 'Migration'],
    popular: false
  },
  {
    id: 'salesforce',
    name: 'Salesforce Developer',
    role: 'Salesforce Developer / Administrator',
    category: 'Salesforce & CRM',
    description: 'Find CRM experts specialized in Apex, Visualforce, and Lightning Web Components (LWC).',
    keywords: ['Salesforce', 'SFDC', 'Apex', 'Visualforce', 'LWC', 'Lightning', 'SaaS', 'CRM'],
    skills: ['SOQL', 'Triggers', 'Sales Cloud', 'Service Cloud', 'Copado', 'REST APIs'],
    popular: true
  },
  {
    id: 'workday',
    name: 'Workday Consultant',
    role: 'Workday Functional Consultant / Integrations Developer',
    category: 'Salesforce & CRM',
    description: 'Find human capital management ERP experts with Studio and EIB knowledge.',
    keywords: ['Workday', 'HCM', 'EIB', 'Workday Studio', 'Calculated Fields', 'Report Writer', 'Core Connector'],
    skills: ['XSLT', 'XML', 'Payroll', 'Benefits Config', 'Security Groups'],
    popular: false
  },
  {
    id: 'servicenow',
    name: 'ServiceNow Developer',
    role: 'ServiceNow Developer / Administrator',
    category: 'Salesforce & CRM',
    description: 'Sourcing enterprise workflow engineers skilled in ITSM, ITOM, and custom business scripts.',
    keywords: ['ServiceNow', 'ITSM', 'ITOM', 'GlideRecord', 'Service Portal', 'Business Rules', 'Client Scripts'],
    skills: ['JavaScript', 'REST Integrations', 'Workflow Engine', 'CMDB', 'SAFe'],
    popular: false
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security Specialist',
    role: 'Cyber Security Analyst / Engineer / Pentester',
    category: 'Tech',
    description: 'Finding certified security defenders, ethical hackers, and vulnerability managers.',
    keywords: ['Cyber Security', 'Pentest', 'Information Security', 'CEH', 'CISSP', 'Vulnerability', 'Firewall'],
    skills: ['Wireshark', 'Metasploit', 'OWASP', 'Kali Linux', 'SIEM', 'Network Sentry'],
    popular: true
  },
  {
    id: 'cloud-engineer',
    name: 'Cloud Engineer',
    role: 'Cloud Architect / Cloud Systems Engineer',
    category: 'Tech',
    description: 'Source certified AWS, Azure, or GCP specialists to architect highly scalable cloud systems.',
    keywords: ['Cloud Engineer', 'Cloud Architect', 'AWS', 'Azure', 'GCP', 'Cloud Computing', 'IAM', 'VPC'],
    skills: ['IAM Policies', 'Terraform', 'Route53', 'Azure DevOps', 'CloudFormation'],
    popular: true
  },
  {
    id: 'network-engineer',
    name: 'Network Engineer',
    role: 'Network Infrastructure Engineer / Cisco Architect',
    category: 'Tech',
    description: 'Sourcing routing, switching, and hardware firewall configuration specialists.',
    keywords: ['Network Engineer', 'Cisco', 'CCNA', 'CCNP', 'Routing', 'Switching', 'BGP', 'OSPF', 'WAN'],
    skills: ['Juniper', 'Firewalls', 'VPN IPsec', 'VLAN', 'Wireshark', 'SD-WAN'],
    popular: false
  },
  {
    id: 'soc-analyst',
    name: 'SOC Analyst',
    role: 'SOC Analyst / Security Operations Specialist',
    category: 'Tech',
    description: 'Sourcing security operations center specialists who track, triage, and counter active threats.',
    keywords: ['SOC', 'Security Operations', 'SIEM', 'Splunk', 'Incident Response', 'Threat Intel', 'Logs'],
    skills: ['Splunk ES', 'QRadar', 'Wireshark', 'Malware Analysis', 'Phishing Triage'],
    popular: false
  },
  {
    id: 'business-analyst',
    name: 'Business Analyst',
    role: 'Business Analyst / Business Systems Analyst',
    category: 'Business',
    description: 'Finding bridge leaders between technology departments and commercial units.',
    keywords: ['Business Analyst', 'Requirements Gathering', 'User Stories', 'Agile', 'SQL', 'UML', 'BRD'],
    skills: ['Jira', 'Confluence', 'Visio', 'Excel Pivot', 'Data Modeling'],
    popular: false
  },
  {
    id: 'project-manager',
    name: 'Project Manager',
    role: 'Project Manager / Scrum Master',
    category: 'Management',
    description: 'Finding project delivery coordinators, budget keepers, and Agile facilitators.',
    keywords: ['Project Manager', 'PMP', 'Scrum Master', 'Agile', 'Sprint', 'Budgeting', 'Project Delivery'],
    skills: ['MS Project', 'Jira', 'Asana', 'Risk Matrix', 'Resource Allocation'],
    popular: true
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    role: 'Product Manager / Product Owner',
    category: 'Management',
    description: 'Sourcing commercial leaders who own product roadmap, KPIs, user stories, and strategic growth.',
    keywords: ['Product Manager', 'Product Owner', 'Roadmap', 'Product Backlog', 'User Stories', 'KPIs', 'Market Research'],
    skills: ['Figma (View)', 'Mixpanel', 'Google Analytics', 'A/B Testing', 'Jira'],
    popular: true
  },
  {
    id: 'ui-ux-designer',
    name: 'UI UX Designer',
    role: 'UI/UX Designer / Product Designer',
    category: 'Non-Tech',
    description: 'Sourcing design professionals who build elegant user interfaces, wireframes, and design systems.',
    keywords: ['UI UX', 'UI/UX', 'Product Designer', 'Figma', 'Sketch', 'Wireframe', 'Prototyping', 'User Research'],
    skills: ['Figma', 'Adobe XD', 'Illustrator', 'Design Tokens', 'Usability Testing'],
    popular: true
  },
  {
    id: 'qa-automation',
    name: 'QA Automation Engineer',
    role: 'QA Automation Engineer / SDET',
    category: 'Tech',
    description: 'Finding Software Developers in Test (SDET) experienced in automated browser testing, API suites, and CI integrations.',
    keywords: ['QA Automation', 'SDET', 'Selenium', 'Playwright', 'Cypress', 'Appium', 'Java', 'Python'],
    skills: ['Selenium WebDriver', 'Jenkins', 'CypressJS', 'Postman', 'Cucumber'],
    popular: true
  },
  {
    id: 'android',
    name: 'Android Developer',
    role: 'Android Engineer / Mobile App Developer',
    category: 'Tech',
    description: 'Find mobile app engineers focused on Kotlin, Java, Gradle and Android SDKs.',
    keywords: ['Android', 'Kotlin', 'Android SDK', 'Java', 'Jetpack Compose', 'Retrofit', 'Mobile App'],
    skills: ['Room Database', 'Coroutines', 'Dagger Hilt', 'Play Store Console', 'Git'],
    popular: false
  },
  {
    id: 'ios',
    name: 'iOS Developer',
    role: 'iOS Engineer / Swift Developer',
    category: 'Tech',
    description: 'Find Apple ecosystem developers proficient in Swift, SwiftUI, Objective-C, and Xcode.',
    keywords: ['iOS', 'Swift', 'SwiftUI', 'Objective-C', 'Xcode', 'Cocoapods', 'UIKit', 'Mobile App'],
    skills: ['Combine', 'CoreData', 'TestFlight', 'App Store Connect', 'MVVM'],
    popular: false
  },
  {
    id: 'flutter',
    name: 'Flutter Developer',
    role: 'Flutter Developer / Dart Engineer',
    category: 'Tech',
    description: 'Sourcing cross-platform hybrid mobile app specialists using Google Flutter.',
    keywords: ['Flutter', 'Dart', 'Widget', 'Bloc', 'Provider', 'Cross-Platform', 'Mobile App', 'Android AND iOS'],
    skills: ['State Management', 'REST Integration', 'Map SDK', 'Firebase Integration'],
    popular: false
  },
  {
    id: 'golang',
    name: 'Golang Developer',
    role: 'Go / Golang Software Engineer',
    category: 'Tech',
    description: 'Find backend experts focused on super high performance concurrency utilizing Go routines.',
    keywords: ['Golang', 'Go Developer', 'Go Language', 'Goroutines', 'Microservices', 'REST', 'gRPC'],
    skills: ['Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'Gin Framework'],
    popular: false
  },
  {
    id: 'rust',
    name: 'Rust Developer',
    role: 'Rust Systems Programmer',
    category: 'Tech',
    description: 'Find memory-safe, high-concurrency bare metal and systems developers.',
    keywords: ['Rust', 'Cargo', 'Wasm', 'WebAssembly', 'Systems Programmer', 'Tokio', 'Memory Safety'],
    skills: ['C++', 'Concurrency', 'Linux Kernel', 'Performance Optimization'],
    popular: false
  },
  {
    id: 'php',
    name: 'PHP Developer',
    role: 'PHP Backend Engineer / Laravel Specialist',
    category: 'Tech',
    description: 'Targeting PHP backend engineers who specialize in modern MVC frameworks.',
    keywords: ['PHP', 'Laravel', 'Symfony', 'Composer', 'MySQL', 'OOP', 'REST API'],
    skills: ['Laravel Mix', 'Eloquent ORM', 'PHPUnit', 'Docker', 'Redis'],
    popular: false
  },
  {
    id: 'wordpress',
    name: 'WordPress Developer',
    role: 'WordPress CMS Developer',
    category: 'Non-Tech',
    description: 'Sourcing custom theme and plugin PHP developers for the world’s biggest CMS platform.',
    keywords: ['WordPress', 'PHP', 'WooCommerce', 'Theme Developer', 'Plugin Developer', 'HTML5', 'CSS3'],
    skills: ['Elementor', 'Gutenberg Blocks', 'ACF Pro', 'MySQL', 'SEO Optimization'],
    popular: false
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    role: 'Talent Acquisition Specialist / Recruiter',
    category: 'HR & Recruiting',
    description: 'Find sourcing pros, candidate builders, and corporate headhunters.',
    keywords: ['Recruiter', 'Talent Acquisition', 'Sourcing', 'Sourcing Specialist', 'ATS', 'Headhunter', 'Interviewing'],
    skills: ['LinkedIn Recruiter', 'Boolean Search', 'Negotiation', 'Employer Branding'],
    popular: false
  },
  {
    id: 'hr',
    name: 'HR Manager',
    role: 'HR Manager / HR Generalist',
    category: 'HR & Recruiting',
    description: 'Sourcing human resources leaders who manage compliance, payroll, onboarding, and employee relations.',
    keywords: ['HR Manager', 'Human Resources', 'HR Generalist', 'Employee Relations', 'Onboarding', 'Compliance', 'Payroll'],
    skills: ['Employment Law', 'Workday', 'SHRM', 'Conflict Resolution'],
    popular: false
  },
  {
    id: 'finance',
    name: 'Finance Analyst',
    role: 'Financial Analyst / Accountant',
    category: 'Business',
    description: 'Finding budget planners, tax auditors, and investment forecasting specialists.',
    keywords: ['Financial Analyst', 'Finance', 'Accountant', 'CPA', 'Auditing', 'Financial Modeling', 'Excel'],
    skills: ['Valuation', 'Pivot Tables', 'SAP FI', 'Hyperion', 'GAAP'],
    popular: false
  },
  {
    id: 'marketing',
    name: 'Marketing Specialist',
    role: 'Marketing Manager / Brand Strategist',
    category: 'Business',
    description: 'Find brand managers, PR coordinators, and copywriters.',
    keywords: ['Marketing Manager', 'Brand Specialist', 'Public Relations', 'Copywriting', 'Campaign', 'B2B Marketing'],
    skills: ['HubSpot', 'AdWords', 'Market Copy', 'Event Coordination'],
    popular: false
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing Specialist',
    role: 'SEO & PPC Specialist / Growth Marketer',
    category: 'Business',
    description: 'Sourcing digital traffic acquisition drivers and performance marketing specialists.',
    keywords: ['Digital Marketing', 'SEO', 'PPC', 'Google Ads', 'Google Analytics', 'Growth Hacker', 'Social Media Marketing'],
    skills: ['SEMrush', 'Meta Ads Manager', 'A/B Testing', 'Copywriting', 'Tag Manager'],
    popular: false
  },
  {
    id: 'healthcare',
    name: 'Healthcare Administrator',
    role: 'Healthcare Manager / Medical Coordinator',
    category: 'Healthcare',
    description: 'Source compliance directors, clinic managers, and hospital workflow officers.',
    keywords: ['Healthcare Administrator', 'Clinical Coordinator', 'Medical Administration', 'HIPAA', 'EHR', 'Billing'],
    skills: ['HIPAA Compliance', 'Epic Systems', 'Scheduling', 'Healthcare Audit'],
    popular: false
  },
  {
    id: 'nurse',
    name: 'Registered Nurse (RN)',
    role: 'Registered Nurse / ICU Nurse / ER Specialist',
    category: 'Healthcare',
    description: 'Finding licensed nursing staff with urgent care or intensive care unit credentials.',
    keywords: ['Registered Nurse', 'RN', 'ICU', 'Emergency Room', 'ER', 'BLS', 'ACLS', 'Patient Care'],
    skills: ['Patient Triage', 'Medication Admin', 'Electronic Health Records', 'BSN'],
    popular: true
  },
  {
    id: 'doctor',
    name: 'Medical Doctor',
    role: 'Physician / Medical Consultant',
    category: 'Healthcare',
    description: 'Find licensed general practitioners, medical consultants, and clinical leads.',
    keywords: ['Physician', 'Medical Doctor', 'MD', 'GP', 'Clinical Medicine', 'Pediatrician', 'Cardiologist'],
    skills: ['Diagnosis', 'EHR', 'Clinical Consultation', 'Board Certified'],
    popular: false
  },
  {
    id: 'mechanical-engineer',
    name: 'Mechanical Engineer',
    role: 'Mechanical Design Engineer',
    category: 'Other',
    description: 'Find physical product designers, thermal specialists, and CAD modelers.',
    keywords: ['Mechanical Engineer', 'CAD', 'SolidWorks', 'AutoCAD', 'Ansys', 'Thermodynamics', 'Prototyping'],
    skills: ['GD&T', 'Material Sourcing', 'FEA Analysis', '3D Printing'],
    popular: false
  },
  {
    id: 'civil-engineer',
    name: 'Civil Engineer',
    role: 'Civil / Structural Engineering Specialist',
    category: 'Other',
    description: 'Sourcing bridge designers, construction site leads, and municipal structural inspectors.',
    keywords: ['Civil Engineer', 'Structural Engineer', 'AutoCAD Civil 3D', 'Concrete', 'Site Inspection', 'BIM'],
    skills: ['Structural Calculations', 'Project Estimating', 'GIS Software', 'PE License'],
    popular: false
  },
  {
    id: 'electrical-engineer',
    name: 'Electrical Engineer',
    role: 'Electrical / Hardware Engineer',
    category: 'Other',
    description: 'Find circuit board designers, electrical grid managers, and schematic specialists.',
    keywords: ['Electrical Engineer', 'Circuit Design', 'PCB', 'Altium', 'Microcontroller', 'Schematics', 'Power Distribution'],
    skills: ['Oscilloscope', 'Verilog', 'FPGA', 'High Voltage Safety'],
    popular: false
  },
  {
    id: 'embedded-engineer',
    name: 'Embedded Systems Engineer',
    role: 'Embedded Software Engineer / Firmware Developer',
    category: 'Tech',
    description: 'Targeting programmers who write code closest to physical microchips, using C/C++.',
    keywords: ['Embedded Systems', 'Firmware', 'C++', 'C Language', 'RTOS', 'Microcontroller', 'I2C', 'SPI'],
    skills: ['Assembly', 'Device Drivers', 'Linux Kernel', 'Hardware Debugging'],
    popular: false
  },
  {
    id: 'ai-engineer',
    name: 'AI Engineer',
    role: 'AI / LLM Application Developer',
    category: 'Tech',
    description: 'Find engineers who construct applications on top of generative AI, vector indexers, and LLMs.',
    keywords: ['AI Engineer', 'Generative AI', 'LLM', 'LangChain', 'LlamaIndex', 'Vector Database', 'Python'],
    skills: ['Pinecone', 'HuggingFace', 'Semantic Search', 'Prompt Chaining', 'RAG'],
    popular: true
  },
  {
    id: 'ml-engineer',
    name: 'Machine Learning Engineer',
    role: 'MLOps / Machine Learning Infrastructure Engineer',
    category: 'Tech',
    description: 'Sourcing training engineers, pipeline builders, and machine learning infrastructure managers.',
    keywords: ['Machine Learning Engineer', 'MLE', 'MLOps', 'Kubeflow', 'MLflow', 'PyTorch', 'TensorFlow', 'Model Slicing'],
    skills: ['CUDA', 'GPU Slicing', 'Distributed Slicing', 'Python', 'Docker'],
    popular: true
  },
  {
    id: 'prompt-engineer',
    name: 'Prompt Engineer',
    role: 'AI Prompt Designer / Conversational UX Designer',
    category: 'Other',
    description: 'Finding cognitive prompt designers who write instruction templates, jailbreak protections, and system rules.',
    keywords: ['Prompt Engineer', 'Prompt Engineering', 'Prompt Design', 'In-Context Learning', 'Few-Shot Prompting'],
    skills: ['Text Crafting', 'System Prompt Tuning', 'Evaluation Frameworks', 'Python (basic)'],
    popular: false
  },
  {
    id: 'blockchain',
    name: 'Blockchain Developer',
    role: 'Smart Contract Developer / Web3 Engineer',
    category: 'Tech',
    description: 'Finding cryptography specialists, Solidity programmers, and consensus engine architects.',
    keywords: ['Blockchain', 'Web3', 'Smart Contract', 'Solidity', 'Rust', 'Ethereum', 'Cryptography', 'EVM'],
    skills: ['Hardhat', 'Truffle', 'Go-Ethereum', 'Web3.js', 'DeFi Protocols'],
    popular: false
  }
];

export const LEARNING_ITEMS: LearningItem[] = [
  {
    id: 'basics-and-or',
    title: 'The Core Operators: AND, OR, NOT',
    level: 'Beginner',
    category: 'Syntax',
    description: 'Master the building blocks of Boolean logic: narrow with AND, expand with OR, and exclude with NOT.',
    readingTime: '3 min read',
    content: `Boolean searching is a type of search that allows recruiters to combine keywords with operators such as **AND**, **OR**, and **NOT** to produce highly relevant search results.

### 1. The AND Operator (The Narrower)
- **What it does:** Requires ALL terms in your query to appear on the candidate's profile.
- **When to use:** When you need a combination of non-negotiable skills.
- **Example:** \`Java AND Spring\`
- **Result:** Profiles that have *both* Java and Spring. If a profile only has Java, it is excluded.

### 2. The OR Operator (The Expander)
- **What it does:** Requires AT LEAST ONE of the connected terms to appear on the profile.
- **When to use:** For synonyms, alternative spellings, or equivalent job titles.
- **Example:** \`("Software Developer" OR "Software Engineer" OR Programmer)\`
- **Result:** Profiles that contain any one of these titles, widening your talent pool.

### 3. The NOT Operator (The Excluder)
- **What it does:** Excludes profiles that contain the specified term.
- **When to use:** To filter out irrelevant roles, overqualified candidates, or common false matches.
- **Example:** \`Developer NOT (Lead OR Manager OR Director)\`
- **Result:** Focuses purely on individual contributor profiles.

*Tip: Always capitalize operators (AND, OR, NOT) to ensure search engines recognize them as commands rather than standard search words.*`
  },
  {
    id: 'parentheses-quotes',
    title: 'Nesting with Parentheses & Exact Phrases',
    level: 'Beginner',
    category: 'Syntax',
    description: 'Learn how to group terms using brackets and force exact phrase matching with quotation marks.',
    readingTime: '4 min read',
    content: `When building complex sourcing strings, the order of operations matters. This is where quotation marks and parentheses become essential.

### 1. Quotation Marks \`""\` (Exact Phrases)
- **Purpose:** Searches for a multiple-word keyword in the *exact order* specified.
- **Why use it:** If you search \`Product Manager\` without quotes, the engine will search for "Product" and "Manager" anywhere on the page (e.g., a "Retail Manager selling a Product"). Using \`"Product Manager"\` ensures those two words are stuck together as a single phrase.
- **Examples:**
  - \`"Spring Boot"\`
  - \`"Data Scientist"\`
  - \`"React Developer"\`

### 2. Parentheses \`()\` (Grouping & Nesting)
- **Purpose:** Controls the search engine's order of operations. It acts exactly like brackets in mathematical equations.
- **Why use it:** If you write \`Java AND Developer OR Programmer\`, the search engine doesn't know if you want:
  1. (Java AND Developer) OR Programmer (which would give you *any* programmer, even a Python one!)
  2. Java AND (Developer OR Programmer)
- **Correct Nested Sourcing String:**
  - \`Java AND (Developer OR Engineer OR Programmer) AND ("Spring Boot" OR Spring)\`
  
*Best Practice: Always group your "synonyms" inside parentheses separated by OR, then join those groups together using AND.*`
  },
  {
    id: 'google-xray-sourcing',
    title: 'Demystifying Google X-Ray Search',
    level: 'Intermediate',
    category: 'X-Ray',
    description: 'Sourcing candidate profiles directly on LinkedIn, GitHub, or Behance from standard Google searches.',
    keywords: [],
    readingTime: '6 min read',
    content: `Google X-Ray search is a powerful recruiting technique that uses advanced Google operators to "x-ray" specific websites (like LinkedIn, GitHub, or StackOverflow) to find public profiles.

This is highly effective because it bypasses the search limitations of free LinkedIn accounts and searches public-facing profiles with Google's robust indexing.

### The Power Operators

1. **\`site:\`** — Directs Google to only return results from a specific website or domain.
   - *Example:* \`site:linkedin.com/in/\` (Returns only LinkedIn personal profiles).
   - *Example:* \`site:github.com "joined on"\` (Finds GitHub user pages).

2. **\`intitle:\`** — Tells Google to search only within the HTML title tag of the web page.
   - *Example:* \`site:linkedin.com/in/ intitle:Recruiter\` (Title must contain "Recruiter").

3. **\`inurl:\`** — Searches for specific keywords inside the URL path.
   - *Example:* \`site:github.com inurl:resume\` (Finds resumes hosted on GitHub).

4. **\`filetype:\`** — Finds files of a specific extension. Extremely useful for finding uploaded CVs.
   - *Example:* \`site:example.com/resumes filetype:pdf "Java"\`

### Combining Into a Sourcing String
To find front-end developers in Chicago on LinkedIn:
\`site:linkedin.com/in/ ("React Developer" OR "Frontend Engineer") "Chicago" "TypeScript"\`

*Recruiter Hack: Google limits your search queries to 32 words, so make every word count!*`
  },
  {
    id: 'sourcing-github-sof',
    title: 'Sourcing Technical Talent on GitHub & Stack Overflow',
    level: 'Advanced',
    category: 'Platform',
    description: 'Find active programmers, contributors, and local tech talent through unique site footprints.',
    keywords: [],
    readingTime: '5 min read',
    content: `Software engineers are often passive candidates who are not active on LinkedIn, but they write code on GitHub and answer questions on Stack Overflow daily. Here is how to find them.

### GitHub Sourcing Hacks
GitHub profiles have specific textual blueprints you can exploit in search engines:
- **Footprint:** \`"joined on"\` appears on every developer's GitHub profile.
- **Footprint:** \`"email"\` or \`"@"\` can help you find reachable contacts.

**Boolean Sourcing Strings for GitHub:**
- Find Python developers in Berlin:
  \`site:github.com "Berlin" "Python" "joined on"\`
- Find developers with public emails:
  \`site:github.com "London" "TypeScript" "gmail.com" "joined on"\`

### Stack Overflow Sourcing Hacks
Stack Overflow users have high-quality technical scores (reputation) and tags.
- **Footprint:** \`site:stackoverflow.com/users\` searches user profiles.

**Boolean Sourcing Strings for Stack Overflow:**
- Find React experts:
  \`site:stackoverflow.com/users "React" "location: United Kingdom"\`
- Look for users answering Node.js questions:
  \`site:stackoverflow.com/users "NodeJS" "answers" "New York"\`

*Pro Tip: Once you find a username on GitHub/Stack Overflow, search that username on other social channels! Most developers use the same handle everywhere.*`
  }
];

export const DEFAULT_HISTORY: HistoryItem[] = [
  {
    id: 'hist-1',
    query: '(Java OR "Spring Boot" OR Hibernate) AND (Developer OR Engineer) AND "Chicago"',
    platform: 'linkedin',
    date: '2026-07-19 12:15:30',
    length: 83,
    copied: true,
    exported: false,
    favorite: true,
    label: 'Chicago Java Devs'
  },
  {
    id: 'hist-2',
    query: 'site:github.com "joined on" "Berlin" "React" "TypeScript"',
    platform: 'github',
    date: '2026-07-19 11:42:10',
    length: 59,
    copied: false,
    exported: true,
    favorite: false,
    label: 'Berlin React GitHub'
  },
  {
    id: 'hist-3',
    query: 'site:stackoverflow.com/users ("Data Scientist" OR "Machine Learning") AND "Python"',
    platform: 'stackoverflow',
    date: '2026-07-19 10:05:15',
    length: 90,
    copied: true,
    exported: false,
    favorite: false,
    label: 'SO Data Scientists'
  },
  {
    id: 'hist-4',
    query: '(Salesforce OR SFDC OR Apex) AND (Developer OR Architect) AND ("LWC" OR Lightning)',
    platform: 'linkedin',
    date: '2026-07-18 16:30:22',
    length: 92,
    copied: true,
    exported: false,
    favorite: true,
    label: 'Salesforce Sourcing'
  }
];

export const DEFAULT_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: 'save-1',
    title: 'Senior DevOps (AWS + Kubernetes)',
    query: '(DevOps OR SRE OR "Site Reliability") AND (AWS OR "Amazon Web Services") AND Kubernetes AND Terraform',
    platform: 'linkedin',
    date: '2026-07-15 14:20:00',
    tags: ['DevOps', 'AWS', 'Urgent']
  },
  {
    id: 'save-2',
    title: 'Nurse Practitioner NY',
    query: '("Nurse Practitioner" OR "NP" OR "Family Nurse") AND "New York" AND "licensed"',
    platform: 'google',
    date: '2026-07-14 09:12:45',
    tags: ['Healthcare', 'NY']
  },
  {
    id: 'save-3',
    title: 'SAP FICO Germany',
    query: 'site:xing.com/profile "SAP" AND "FICO" AND ("Munich" OR "Berlin" OR "Frankfurt")',
    platform: 'xing',
    date: '2026-07-12 11:30:00',
    tags: ['SAP', 'Germany', 'Europe']
  }
];

export const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    type: 'copy',
    description: 'Copied LinkedIn Java Developer Sourcing query',
    timestamp: '5 minutes ago',
    detail: 'Copied to clipboard'
  },
  {
    id: 'act-2',
    type: 'generate',
    description: 'Generated Google X-Ray query for Python Sourcing',
    timestamp: '20 minutes ago',
    detail: 'site:linkedin.com/in/ Python AND FastAPI'
  },
  {
    id: 'act-3',
    type: 'export',
    description: 'Exported Sourcing Templates Pack to CSV',
    timestamp: '1 hour ago',
    detail: 'Export Center'
  },
  {
    id: 'act-4',
    type: 'save_favorite',
    description: 'Added "React Developer" Sourcing Template to Favorites',
    timestamp: '3 hours ago',
    detail: 'React Developer'
  },
  {
    id: 'act-5',
    type: 'create_template',
    description: 'Created Custom Template: Node.js Microservices',
    timestamp: 'Yesterday',
    detail: 'Saved in local database'
  }
];
