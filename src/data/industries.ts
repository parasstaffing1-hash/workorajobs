export type IndustrySector = {
  id: string;
  slug: string;
  name: string;
  category: string;
  iconName: string;
  tagline: string;
  shortDescription: string;
  overview: string;
  keySkills: string[];
  topCompanies: string[];
  openJobsCount: number;
  averageSalaryRange: string;
  growthRate: string;
  hiringHotspots: string[];
  faqs: { question: string; answer: string }[];
};

export function slugifyIndustry(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const industriesData: IndustrySector[] = [
  {
    id: "ind-it",
    slug: "information-technology",
    name: "Information Technology",
    category: "Technology & Software",
    iconName: "Code2",
    tagline: "Building scalable cloud systems, AI LLMs, and enterprise software.",
    shortDescription: "Software engineering, cloud infrastructure, AI platforms, and enterprise digital transformations.",
    overview: "The Information Technology sector drives global enterprise innovation through cloud computing, artificial intelligence, cybersecurity, and full-stack software development. Companies in this sector offer competitive compensation, remote flexibility, and high-impact engineering careers.",
    keySkills: ["Python", "Java", "TypeScript", "React", "AWS", "Azure", "CUDA", "C++", "Kubernetes", "Docker"],
    topCompanies: ["Apple Inc.", "Microsoft Corporation", "NVIDIA Corporation", "Alphabet Inc.", "Meta Platforms Inc.", "Tata Consultancy Services", "Infosys", "HCLTech", "Wipro Limited"],
    openJobsCount: 1420,
    averageSalaryRange: "$120,000 - $220,000 / yr (₹14 - ₹35 LPA)",
    growthRate: "+18.4% YoY",
    hiringHotspots: ["Cupertino, CA", "Redmond, WA", "Santa Clara, CA", "Bengaluru, India", "Hyderabad, India", "Mumbai, India"],
    faqs: [
      {
        question: "What are the most in-demand roles in Information Technology?",
        answer: "Cloud Architects, AI/ML Engineers, Senior Full-Stack Developers, DevOps Engineers, and Cybersecurity Specialists are in highest demand."
      },
      {
        question: "Does the IT sector support remote and hybrid work?",
        answer: "Yes, over 75% of Information Technology roles offer flexible hybrid or 100% remote work arrangements."
      }
    ]
  },
  {
    id: "ind-banking",
    slug: "banking-finance",
    name: "Banking & Financial Services",
    category: "Finance & Fintech",
    iconName: "CircleDollarSign",
    tagline: "Powering digital payments, UPI infrastructure, and wealth management.",
    shortDescription: "Retail banking, digital payments, wealth management, fintech UPI gateways, and investment banking.",
    overview: "Banking and Financial Services represent the bedrock of global capital allocation and payment technologies. High-scale microservices, real-time fraud detection, and mobile UPI payment systems drive rapid fintech innovation.",
    keySkills: ["Java", "Spring Boot", "Oracle", "Python", "Kafka", "Fintech API Security", "SQL", "Microservices"],
    topCompanies: ["JPMorgan Chase & Co.", "Visa Inc.", "Mastercard Incorporated", "Berkshire Hathaway", "HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra Bank", "Bajaj Finance"],
    openJobsCount: 890,
    averageSalaryRange: "$110,000 - $210,000 / yr (₹15 - ₹32 LPA)",
    growthRate: "+14.2% YoY",
    hiringHotspots: ["New York, NY", "San Francisco, CA", "Mumbai, India", "Bengaluru, India", "London, UK"],
    faqs: [
      {
        question: "What technology stack is used in modern banking software?",
        answer: "Enterprise banking systems rely heavily on Java Spring Boot microservices, Kafka event streaming, Oracle/PostgreSQL databases, and high-security OAuth2 gateways."
      }
    ]
  },
  {
    id: "ind-healthcare",
    slug: "healthcare-pharmaceuticals",
    name: "Healthcare & Pharmaceuticals",
    category: "Life Sciences & Biotech",
    iconName: "HeartPulse",
    tagline: "Pioneering life-saving biotech research, clinical trials, and specialty medicines.",
    shortDescription: "Biotechnology research, clinical trial analytics, specialty generics, and digital health devices.",
    overview: "Healthcare and Pharmaceuticals combine medical discovery with digital telemetry, bioinformatics data science, and global manufacturing. The industry focuses on long-term wellness, oncology, and metabolic disease research.",
    keySkills: ["Bioinformatics", "Python", "R", "SAP", "Clinical Data Analytics", "AWS", "SQL"],
    topCompanies: ["Eli Lilly and Company", "Johnson & Johnson", "Sun Pharmaceutical"],
    openJobsCount: 450,
    averageSalaryRange: "$105,000 - $195,000 / yr (₹12 - ₹28 LPA)",
    growthRate: "+12.8% YoY",
    hiringHotspots: ["Indianapolis, IN", "New Brunswick, NJ", "Mumbai, India", "Hyderabad, India"],
    faqs: [
      {
        question: "How is technology transforming healthcare careers?",
        answer: "AI drug discovery models, genomic sequencing data analytics, and cloud EHR health systems are rapidly expanding tech roles in pharmaceuticals."
      }
    ]
  },
  {
    id: "ind-fmcg",
    slug: "fmcg-consumer-goods",
    name: "FMCG & Consumer Goods",
    category: "Retail & Consumer",
    iconName: "Building2",
    tagline: "Connecting global supply chains and consumer brand innovation.",
    shortDescription: "Retail supply chains, consumer packaged goods, lifestyle brands, and e-commerce distribution networks.",
    overview: "Fast-Moving Consumer Goods (FMCG) and retail giants manage hyper-scaled global supply chains, e-commerce platforms, and direct-to-consumer digital channels.",
    keySkills: ["SAP HANA", "Python", "PowerBI", "React", "Node.js", "Azure", "Supply Chain Analytics"],
    topCompanies: ["Walmart Inc.", "Procter & Gamble", "Hindustan Unilever", "ITC Limited", "Titan Company"],
    openJobsCount: 620,
    averageSalaryRange: "$95,000 - $175,000 / yr (₹10 - ₹25 LPA)",
    growthRate: "+10.5% YoY",
    hiringHotspots: ["Bentonville, AR", "Cincinnati, OH", "Mumbai, India", "Kolkata, India", "Bengaluru, India"],
    faqs: [
      {
        question: "What key technical skillsets are needed in FMCG enterprises?",
        answer: "SAP ERP systems, predictive supply chain analytics with Python/PowerBI, and scalable e-commerce frontend engineering."
      }
    ]
  },
  {
    id: "ind-automotive",
    slug: "automotive-clean-energy",
    name: "Automotive & Clean Energy",
    category: "Mobility & EV Tech",
    iconName: "HardHat",
    tagline: "Accelerating electric vehicles, autonomous AI, and sustainable energy.",
    shortDescription: "Electric vehicles, autonomous driving AI, battery energy storage, and commercial mobility.",
    overview: "Automotive engineering is undergoing an electric revolution, combining embedded microcontrollers, autonomous vision neural networks, and battery management platforms.",
    keySkills: ["C++", "Python", "AUTOSAR", "Embedded Linux", "PyTorch", "MATLAB", "CUDA"],
    topCompanies: ["Tesla Inc.", "Tata Motors", "Maruti Suzuki", "Mahindra & Mahindra"],
    openJobsCount: 510,
    averageSalaryRange: "$115,000 - $225,000 / yr (₹14 - ₹30 LPA)",
    growthRate: "+22.1% YoY",
    hiringHotspots: ["Austin, TX", "Palo Alto, CA", "Mumbai, India", "New Delhi, India", "Pune, India"],
    faqs: [
      {
        question: "What software languages power electric vehicle development?",
        answer: "C++ and Embedded C drive low-level ECU firmware, while Python and PyTorch power autonomous neural networks."
      }
    ]
  },
  {
    id: "ind-telecom",
    slug: "telecommunications",
    name: "Telecommunications",
    category: "Connectivity & Media",
    iconName: "Network",
    tagline: "Scaling 5G network slicing, optical fiber, and streaming media.",
    shortDescription: "5G network slicing, mobile broadband, optical fiber infrastructure, and streaming media distribution.",
    overview: "Telecommunications companies operate high-throughput broadband backbones, standalone 5G core networks, and media streaming platforms reaching hundreds of millions of concurrent users.",
    keySkills: ["5G Stack", "Java", "Go", "Python", "Kafka", "AWS", "gRPC", "React"],
    topCompanies: ["Bharti Airtel", "Netflix Inc.", "Tech Mahindra"],
    openJobsCount: 410,
    averageSalaryRange: "$110,000 - $200,000 / yr (₹12 - ₹28 LPA)",
    growthRate: "+15.0% YoY",
    hiringHotspots: ["Los Gatos, CA", "New Delhi, India", "Mumbai, India", "Pune, India"],
    faqs: [
      {
        question: "What technologies drive 5G telecom innovation?",
        answer: "Cloud-native Kubernetes microservices, OpenRAN architectures, low-latency gRPC APIs, and automated network slicing."
      }
    ]
  }
];

export function findIndustryBySlug(slug: string): IndustrySector | undefined {
  const clean = slug.toLowerCase().trim();
  return industriesData.find(
    (ind) => ind.slug === clean || ind.id === clean || slugifyIndustry(ind.name) === clean
  );
}
