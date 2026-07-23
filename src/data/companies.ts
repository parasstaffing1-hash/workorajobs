export type WorkplaceBenefit = {
  title: string;
  description: string;
  category: "Health & Medical" | "Financial & Stock" | "Workplace Flex" | "Learning & Education" | "Career Growth" | "Perks";
};

export type GlassdoorReview = {
  id: string;
  role: string;
  rating: number;
  pros: string;
  cons: string;
  date: string;
  employmentStatus: string;
};

export type CompanyFAQ = {
  question: string;
  answer: string;
};

export type SocialLinks = {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  glassdoor?: string;
  crunchbase?: string;
  wikipedia?: string;
};

export type Company = {
  id: string;
  slug: string;
  name: string;
  legalName: string;
  ticker: string;
  stockExchange: string;
  isin?: string;
  country: string;
  headquarters: string;
  foundedYear: number;
  industry: string;
  subIndustry: string;
  size: string;
  employeeCount: string;
  ownershipType: string;
  website: string;
  careersUrl: string;
  logo: string;
  logoUrl?: string;
  banner: string;
  tagline: string;
  shortDescription: string;
  overview: string;
  mission: string;
  vision: string;
  values: string[];
  techStack: string[];
  glassdoorRating: number;
  reviewCount: number;
  benefits: WorkplaceBenefit[];
  reviews: GlassdoorReview[];
  faqs: CompanyFAQ[];
  openJobsCount: number;
  hiringStatus: string;
  remoteFriendly: boolean;
  hybrid: boolean;
  onsite: boolean;
  internships: boolean;
  graduatePrograms: boolean;
  socialLinks: SocialLinks;
  contactEmail: string;
  contactPhone: string;
  marketCap: string;
  currency: string;
  verified: boolean;
  featured: boolean;
};

export const companiesData: Company[] = [
  {
    "id": "sp500-apple-inc",
    "slug": "apple-inc",
    "name": "Apple Inc.",
    "legalName": "Apple Inc.",
    "ticker": "AAPL",
    "stockExchange": "NASDAQ",
    "isin": "US0378331005",
    "country": "United States",
    "headquarters": "Cupertino, CA",
    "foundedYear": 1976,
    "industry": "Information Technology",
    "subIndustry": "Consumer Electronics & Software",
    "size": "10,000+",
    "employeeCount": "161,000+",
    "ownershipType": "Public",
    "website": "https://www.apple.com",
    "careersUrl": "https://www.apple.com/careers/",
    "logo": "AAPL",
    "logoUrl": "https://www.google.com/s2/favicons?domain=apple.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Think Different. Revolutionary hardware, iOS, and services.",
    "shortDescription": "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.",
    "overview": "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories. Operating globally with over 161,000+ employees, Apple Inc. offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Consumer Electronics & Software.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Swift",
      "Objective-C",
      "C++",
      "Python",
      "iOS",
      "macOS",
      "Metal API",
      "Kubernetes"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 42500,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-apple-inc-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at Apple Inc.?",
        "answer": "Apple Inc. fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does Apple Inc. offer remote work opportunities?",
        "answer": "Yes, Apple Inc. supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/apple-inc",
      "twitter": "https://x.com/AAPL",
      "wikipedia": "https://en.wikipedia.org/wiki/Apple_Inc."
    },
    "contactEmail": "contact@apple-inc.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$3.45 Trillion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-microsoft-corporation",
    "slug": "microsoft-corporation",
    "name": "Microsoft Corporation",
    "legalName": "Microsoft Corporation",
    "ticker": "MSFT",
    "stockExchange": "NASDAQ",
    "isin": "US5949181045",
    "country": "United States",
    "headquarters": "Redmond, WA",
    "foundedYear": 1975,
    "industry": "Information Technology",
    "subIndustry": "Cloud Computing, AI & Software",
    "size": "10,000+",
    "employeeCount": "221,000+",
    "ownershipType": "Public",
    "website": "https://www.microsoft.com",
    "careersUrl": "https://careers.microsoft.com/",
    "logo": "MSFT",
    "logoUrl": "https://www.google.com/s2/favicons?domain=microsoft.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Empowering every person and organization on the planet to achieve more.",
    "shortDescription": "Microsoft Corporation is a leader in cloud computing (Azure), Copilot AI, Windows, and enterprise software.",
    "overview": "Microsoft Corporation is a leader in cloud computing (Azure), Copilot AI, Windows, and enterprise software. Operating globally with over 221,000+ employees, Microsoft Corporation offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Cloud Computing, AI & Software.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "C#",
      ".NET",
      "TypeScript",
      "Azure",
      "Python",
      "React",
      "PyTorch",
      "SQL Server"
    ],
    "glassdoorRating": 4.4,
    "reviewCount": 51000,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-microsoft-corporation-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at Microsoft Corporation?",
        "answer": "Microsoft Corporation fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does Microsoft Corporation offer remote work opportunities?",
        "answer": "Yes, Microsoft Corporation supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/microsoft-corporation",
      "twitter": "https://x.com/MSFT",
      "wikipedia": "https://en.wikipedia.org/wiki/Microsoft_Corporation"
    },
    "contactEmail": "contact@microsoft-corporation.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$3.30 Trillion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-nvidia-corporation",
    "slug": "nvidia-corporation",
    "name": "NVIDIA Corporation",
    "legalName": "NVIDIA Corporation",
    "ticker": "NVDA",
    "stockExchange": "NASDAQ",
    "isin": "US67066G1040",
    "country": "United States",
    "headquarters": "Santa Clara, CA",
    "foundedYear": 1993,
    "industry": "Information Technology",
    "subIndustry": "Semiconductors & AI Compute",
    "size": "10,000+",
    "employeeCount": "29,600+",
    "ownershipType": "Public",
    "website": "https://www.nvidia.com",
    "careersUrl": "https://www.nvidia.com/careers/",
    "logo": "NVDA",
    "logoUrl": "https://www.google.com/s2/favicons?domain=nvidia.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "The engine of artificial intelligence, GPU acceleration, and autonomous systems.",
    "shortDescription": "NVIDIA Corporation is the pioneer of GPU-accelerated computing and AI datacenter hardware.",
    "overview": "NVIDIA Corporation is the pioneer of GPU-accelerated computing and AI datacenter hardware. Operating globally with over 29,600+ employees, NVIDIA Corporation offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Semiconductors & AI Compute.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "CUDA",
      "C++",
      "Python",
      "TensorRT",
      "PyTorch",
      "Verilog",
      "Linux",
      "C"
    ],
    "glassdoorRating": 4.7,
    "reviewCount": 18200,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-nvidia-corporation-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at NVIDIA Corporation?",
        "answer": "NVIDIA Corporation fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does NVIDIA Corporation offer remote work opportunities?",
        "answer": "Yes, NVIDIA Corporation supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/nvidia-corporation",
      "twitter": "https://x.com/NVDA",
      "wikipedia": "https://en.wikipedia.org/wiki/NVIDIA_Corporation"
    },
    "contactEmail": "contact@nvidia-corporation.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$3.15 Trillion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-amazoncom-inc",
    "slug": "amazoncom-inc",
    "name": "Amazon.com Inc.",
    "legalName": "Amazon.com Inc.",
    "ticker": "AMZN",
    "stockExchange": "NASDAQ",
    "isin": "US0231351067",
    "country": "United States",
    "headquarters": "Seattle, WA",
    "foundedYear": 1994,
    "industry": "E-Commerce & Cloud",
    "subIndustry": "Cloud Computing (AWS) & Retail",
    "size": "10,000+",
    "employeeCount": "1,525,000+",
    "ownershipType": "Public",
    "website": "https://www.amazon.com",
    "careersUrl": "https://www.amazon.jobs/",
    "logo": "AMZN",
    "logoUrl": "https://www.google.com/s2/favicons?domain=amazon.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Earth's most customer-centric company and pioneer of cloud computing (AWS).",
    "shortDescription": "Amazon.com Inc. is a global leader in e-commerce, cloud infrastructure (AWS), streaming, and AI.",
    "overview": "Amazon.com Inc. is a global leader in e-commerce, cloud infrastructure (AWS), streaming, and AI. Operating globally with over 1,525,000+ employees, Amazon.com Inc. offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Cloud Computing (AWS) & Retail.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Java",
      "Python",
      "AWS",
      "TypeScript",
      "React",
      "DynamoDB",
      "C++",
      "Rust"
    ],
    "glassdoorRating": 3.9,
    "reviewCount": 68000,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-amazoncom-inc-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at Amazon.com Inc.?",
        "answer": "Amazon.com Inc. fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does Amazon.com Inc. offer remote work opportunities?",
        "answer": "Yes, Amazon.com Inc. supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/amazoncom-inc",
      "twitter": "https://x.com/AMZN",
      "wikipedia": "https://en.wikipedia.org/wiki/Amazon.com_Inc."
    },
    "contactEmail": "contact@amazoncom-inc.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$2.05 Trillion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-alphabet-inc",
    "slug": "alphabet-inc",
    "name": "Alphabet Inc.",
    "legalName": "Alphabet Inc.",
    "ticker": "GOOGL",
    "stockExchange": "NASDAQ",
    "isin": "US02079K3059",
    "country": "United States",
    "headquarters": "Mountain View, CA",
    "foundedYear": 1998,
    "industry": "Information Technology",
    "subIndustry": "Search, Cloud & AI (Google)",
    "size": "10,000+",
    "employeeCount": "182,000+",
    "ownershipType": "Public",
    "website": "https://abc.xyz",
    "careersUrl": "https://www.google.com/about/careers/",
    "logo": "GOOGL",
    "logoUrl": "https://www.google.com/s2/favicons?domain=google.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Organizing the world's information and making it universally accessible and useful.",
    "shortDescription": "Alphabet Inc. is the parent company of Google, YouTube, Android, Google Cloud, and DeepMind.",
    "overview": "Alphabet Inc. is the parent company of Google, YouTube, Android, Google Cloud, and DeepMind. Operating globally with over 182,000+ employees, Alphabet Inc. offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Search, Cloud & AI (Google).",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "C++",
      "Python",
      "Java",
      "Go",
      "TypeScript",
      "TensorFlow",
      "JAX",
      "Kubernetes"
    ],
    "glassdoorRating": 4.5,
    "reviewCount": 49000,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-alphabet-inc-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at Alphabet Inc.?",
        "answer": "Alphabet Inc. fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does Alphabet Inc. offer remote work opportunities?",
        "answer": "Yes, Alphabet Inc. supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/alphabet-inc",
      "twitter": "https://x.com/GOOGL",
      "wikipedia": "https://en.wikipedia.org/wiki/Alphabet_Inc."
    },
    "contactEmail": "contact@alphabet-inc.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$2.20 Trillion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-meta-platforms-inc",
    "slug": "meta-platforms-inc",
    "name": "Meta Platforms Inc.",
    "legalName": "Meta Platforms Inc.",
    "ticker": "META",
    "stockExchange": "NASDAQ",
    "isin": "US30303M1027",
    "country": "United States",
    "headquarters": "Menlo Park, CA",
    "foundedYear": 2004,
    "industry": "Information Technology",
    "subIndustry": "Social Media, Llama AI & VR",
    "size": "10,000+",
    "employeeCount": "67,300+",
    "ownershipType": "Public",
    "website": "https://about.meta.com",
    "careersUrl": "https://www.metacareers.com/",
    "logo": "META",
    "logoUrl": "https://www.google.com/s2/favicons?domain=meta.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Giving people the power to build community and bring the world closer together.",
    "shortDescription": "Meta Platforms Inc. builds technologies that help people connect (Facebook, Instagram, WhatsApp, Llama AI).",
    "overview": "Meta Platforms Inc. builds technologies that help people connect (Facebook, Instagram, WhatsApp, Llama AI). Operating globally with over 67,300+ employees, Meta Platforms Inc. offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Social Media, Llama AI & VR.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "C++",
      "Hack (PHP)",
      "React",
      "React Native",
      "PyTorch",
      "GraphQL",
      "Presto"
    ],
    "glassdoorRating": 4.2,
    "reviewCount": 34000,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-meta-platforms-inc-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at Meta Platforms Inc.?",
        "answer": "Meta Platforms Inc. fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does Meta Platforms Inc. offer remote work opportunities?",
        "answer": "Yes, Meta Platforms Inc. supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/meta-platforms-inc",
      "twitter": "https://x.com/META",
      "wikipedia": "https://en.wikipedia.org/wiki/Meta_Platforms_Inc."
    },
    "contactEmail": "contact@meta-platforms-inc.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$1.28 Trillion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-tesla-inc",
    "slug": "tesla-inc",
    "name": "Tesla Inc.",
    "legalName": "Tesla Inc.",
    "ticker": "TSLA",
    "stockExchange": "NASDAQ",
    "isin": "US88160R1014",
    "country": "United States",
    "headquarters": "Austin, TX",
    "foundedYear": 2003,
    "industry": "Automotive & Clean Energy",
    "subIndustry": "Electric Vehicles, Autonomous AI & Solar",
    "size": "10,000+",
    "employeeCount": "140,000+",
    "ownershipType": "Public",
    "website": "https://www.tesla.com",
    "careersUrl": "https://www.tesla.com/careers",
    "logo": "TSLA",
    "logoUrl": "https://www.google.com/s2/favicons?domain=tesla.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Accelerating the world's transition to sustainable energy.",
    "shortDescription": "Tesla Inc. designs electric vehicles, energy storage systems, solar hardware, and autonomous AI systems.",
    "overview": "Tesla Inc. designs electric vehicles, energy storage systems, solar hardware, and autonomous AI systems. Operating globally with over 140,000+ employees, Tesla Inc. offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Electric Vehicles, Autonomous AI & Solar.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "C++",
      "Python",
      "C",
      "PyTorch",
      "React",
      "Rust",
      "Linux",
      "Embedded Systems"
    ],
    "glassdoorRating": 3.8,
    "reviewCount": 21000,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-tesla-inc-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at Tesla Inc.?",
        "answer": "Tesla Inc. fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does Tesla Inc. offer remote work opportunities?",
        "answer": "Yes, Tesla Inc. supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/tesla-inc",
      "twitter": "https://x.com/TSLA",
      "wikipedia": "https://en.wikipedia.org/wiki/Tesla_Inc."
    },
    "contactEmail": "contact@tesla-inc.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$780 Billion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-berkshire-hathaway",
    "slug": "berkshire-hathaway",
    "name": "Berkshire Hathaway",
    "legalName": "Berkshire Hathaway",
    "ticker": "BRK.B",
    "stockExchange": "NYSE",
    "isin": "US0846707026",
    "country": "United States",
    "headquarters": "Omaha, NE",
    "foundedYear": 1839,
    "industry": "Banking & Finance",
    "subIndustry": "Diversified Financial Holdings",
    "size": "10,000+",
    "employeeCount": "396,000+",
    "ownershipType": "Public",
    "website": "https://www.berkshirehathaway.com",
    "careersUrl": "https://www.berkshirehathaway.com",
    "logo": "BRK.B",
    "logoUrl": "https://www.google.com/s2/favicons?domain=berkshirehathaway.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Global leader in diversified insurance, rail transport, utility, and capital investments.",
    "shortDescription": "Berkshire Hathaway Inc. is a multinational conglomerate holding company headquartered in Omaha, Nebraska.",
    "overview": "Berkshire Hathaway Inc. is a multinational conglomerate holding company headquartered in Omaha, Nebraska. Operating globally with over 396,000+ employees, Berkshire Hathaway offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Diversified Financial Holdings.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "SQL",
      "Java",
      "Financial Modeling",
      "Excel",
      "Oracle",
      "SAP"
    ],
    "glassdoorRating": 4.1,
    "reviewCount": 11200,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-berkshire-hathaway-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at Berkshire Hathaway?",
        "answer": "Berkshire Hathaway fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does Berkshire Hathaway offer remote work opportunities?",
        "answer": "Yes, Berkshire Hathaway supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/berkshire-hathaway",
      "twitter": "https://x.com/BRK.B",
      "wikipedia": "https://en.wikipedia.org/wiki/Berkshire_Hathaway"
    },
    "contactEmail": "contact@berkshire-hathaway.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$920 Billion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-jpmorgan-chase-co",
    "slug": "jpmorgan-chase-co",
    "name": "JPMorgan Chase & Co.",
    "legalName": "JPMorgan Chase & Co.",
    "ticker": "JPM",
    "stockExchange": "NYSE",
    "isin": "US46625H1005",
    "country": "United States",
    "headquarters": "New York City, NY",
    "foundedYear": 1799,
    "industry": "Banking & Finance",
    "subIndustry": "Investment Banking & Financial Services",
    "size": "10,000+",
    "employeeCount": "309,000+",
    "ownershipType": "Public",
    "website": "https://www.jpmorganchase.com",
    "careersUrl": "https://careers.jpmorganchase.com/",
    "logo": "JPM",
    "logoUrl": "https://www.google.com/s2/favicons?domain=jpmorganchase.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global financial services firm serving institutions and individuals worldwide.",
    "shortDescription": "JPMorgan Chase & Co. is America's largest bank with over $3.8 trillion in assets under management.",
    "overview": "JPMorgan Chase & Co. is America's largest bank with over $3.8 trillion in assets under management. Operating globally with over 309,000+ employees, JPMorgan Chase & Co. offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Investment Banking & Financial Services.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Java",
      "Python",
      "C++",
      "Spring Boot",
      "React",
      "AWS",
      "Kafka",
      "Oracle"
    ],
    "glassdoorRating": 4.1,
    "reviewCount": 38000,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-jpmorgan-chase-co-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at JPMorgan Chase & Co.?",
        "answer": "JPMorgan Chase & Co. fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does JPMorgan Chase & Co. offer remote work opportunities?",
        "answer": "Yes, JPMorgan Chase & Co. supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/jpmorgan-chase-co",
      "twitter": "https://x.com/JPM",
      "wikipedia": "https://en.wikipedia.org/wiki/JPMorgan_Chase_&_Co."
    },
    "contactEmail": "contact@jpmorgan-chase-co.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$580 Billion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-visa-inc",
    "slug": "visa-inc",
    "name": "Visa Inc.",
    "legalName": "Visa Inc.",
    "ticker": "V",
    "stockExchange": "NYSE",
    "isin": "US92826C8394",
    "country": "United States",
    "headquarters": "San Francisco, CA",
    "foundedYear": 1958,
    "industry": "Banking & Finance",
    "subIndustry": "Digital Payments & Transaction Tech",
    "size": "10,000+",
    "employeeCount": "28,800+",
    "ownershipType": "Public",
    "website": "https://www.visa.com",
    "careersUrl": "https://www.visa.com/careers",
    "logo": "V",
    "logoUrl": "https://www.google.com/s2/favicons?domain=visa.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Everywhere you want to be. Connecting the world through digital payments.",
    "shortDescription": "Visa Inc. is a world leader in digital payments processing over 200 billion transaction messages annually.",
    "overview": "Visa Inc. is a world leader in digital payments processing over 200 billion transaction messages annually. Operating globally with over 28,800+ employees, Visa Inc. offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Digital Payments & Transaction Tech.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Java",
      "C++",
      "Python",
      "Kafka",
      "Spring Boot",
      "Docker",
      "Go",
      "React"
    ],
    "glassdoorRating": 4.2,
    "reviewCount": 14500,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-visa-inc-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at Visa Inc.?",
        "answer": "Visa Inc. fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does Visa Inc. offer remote work opportunities?",
        "answer": "Yes, Visa Inc. supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/visa-inc",
      "twitter": "https://x.com/V",
      "wikipedia": "https://en.wikipedia.org/wiki/Visa_Inc."
    },
    "contactEmail": "contact@visa-inc.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$540 Billion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-mastercard-incorporated",
    "slug": "mastercard-incorporated",
    "name": "Mastercard Incorporated",
    "legalName": "Mastercard Incorporated",
    "ticker": "MA",
    "stockExchange": "NYSE",
    "isin": "US57636Q1040",
    "country": "United States",
    "headquarters": "Purchase, NY",
    "foundedYear": 1966,
    "industry": "Banking & Finance",
    "subIndustry": "Payment Technology & Financial Security",
    "size": "10,000+",
    "employeeCount": "33,400+",
    "ownershipType": "Public",
    "website": "https://www.mastercard.com",
    "careersUrl": "https://careers.mastercard.com",
    "logo": "MA",
    "logoUrl": "https://www.google.com/s2/favicons?domain=mastercard.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Connecting and powering an inclusive digital economy for everyone, everywhere.",
    "shortDescription": "Mastercard Incorporated is a global payment technology company operating in more than 210 countries.",
    "overview": "Mastercard Incorporated is a global payment technology company operating in more than 210 countries. Operating globally with over 33,400+ employees, Mastercard Incorporated offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Payment Technology & Financial Security.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Java",
      "Spring Boot",
      "Microservices",
      "Python",
      "Angular",
      "AWS",
      "Kubernetes"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 12800,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-mastercard-incorporated-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at Mastercard Incorporated?",
        "answer": "Mastercard Incorporated fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does Mastercard Incorporated offer remote work opportunities?",
        "answer": "Yes, Mastercard Incorporated supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/mastercard-incorporated",
      "twitter": "https://x.com/MA",
      "wikipedia": "https://en.wikipedia.org/wiki/Mastercard_Incorporated"
    },
    "contactEmail": "contact@mastercard-incorporated.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$440 Billion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-eli-lilly-and-company",
    "slug": "eli-lilly-and-company",
    "name": "Eli Lilly and Company",
    "legalName": "Eli Lilly and Company",
    "ticker": "LLY",
    "stockExchange": "NYSE",
    "isin": "US5324571083",
    "country": "United States",
    "headquarters": "Indianapolis, IN",
    "foundedYear": 1876,
    "industry": "Healthcare & Pharmaceuticals",
    "subIndustry": "Pharmaceutical Research & Biotechnology",
    "size": "10,000+",
    "employeeCount": "43,000+",
    "ownershipType": "Public",
    "website": "https://www.lilly.com",
    "careersUrl": "https://careers.lilly.com",
    "logo": "LLY",
    "logoUrl": "https://www.google.com/s2/favicons?domain=lilly.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Uniting caring with discovery to create medicines that make life better.",
    "shortDescription": "Eli Lilly and Company is an American pharmaceutical company discovering metabolic, oncology, and immunology treatments.",
    "overview": "Eli Lilly and Company is an American pharmaceutical company discovering metabolic, oncology, and immunology treatments. Operating globally with over 43,000+ employees, Eli Lilly and Company offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Pharmaceutical Research & Biotechnology.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "R",
      "Bioinformatics",
      "AWS",
      "SQL",
      "C#",
      "Data Analytics"
    ],
    "glassdoorRating": 4.2,
    "reviewCount": 9400,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-eli-lilly-and-company-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at Eli Lilly and Company?",
        "answer": "Eli Lilly and Company fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does Eli Lilly and Company offer remote work opportunities?",
        "answer": "Yes, Eli Lilly and Company supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/eli-lilly-and-company",
      "twitter": "https://x.com/LLY",
      "wikipedia": "https://en.wikipedia.org/wiki/Eli_Lilly_and_Company"
    },
    "contactEmail": "contact@eli-lilly-and-company.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$810 Billion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-walmart-inc",
    "slug": "walmart-inc",
    "name": "Walmart Inc.",
    "legalName": "Walmart Inc.",
    "ticker": "WMT",
    "stockExchange": "NYSE",
    "isin": "US9311421039",
    "country": "United States",
    "headquarters": "Bentonville, AR",
    "foundedYear": 1962,
    "industry": "FMCG & Consumer Goods",
    "subIndustry": "Retail & Global Supply Chain",
    "size": "10,000+",
    "employeeCount": "2,100,000+",
    "ownershipType": "Public",
    "website": "https://www.corporate.walmart.com",
    "careersUrl": "https://careers.walmart.com",
    "logo": "WMT",
    "logoUrl": "https://www.google.com/s2/favicons?domain=walmart.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Save money. Live better. World's largest retail and supply chain network.",
    "shortDescription": "Walmart Inc. is an American multinational retail corporation operating hypermarkets, discount department stores, and e-commerce.",
    "overview": "Walmart Inc. is an American multinational retail corporation operating hypermarkets, discount department stores, and e-commerce. Operating globally with over 2,100,000+ employees, Walmart Inc. offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Retail & Global Supply Chain.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Java",
      "React",
      "Node.js",
      "Python",
      "Azure",
      "Kafka",
      "GCP",
      "Kubernetes"
    ],
    "glassdoorRating": 3.7,
    "reviewCount": 45000,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-walmart-inc-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at Walmart Inc.?",
        "answer": "Walmart Inc. fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does Walmart Inc. offer remote work opportunities?",
        "answer": "Yes, Walmart Inc. supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/walmart-inc",
      "twitter": "https://x.com/WMT",
      "wikipedia": "https://en.wikipedia.org/wiki/Walmart_Inc."
    },
    "contactEmail": "contact@walmart-inc.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$570 Billion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-procter-gamble",
    "slug": "procter-gamble",
    "name": "Procter & Gamble",
    "legalName": "Procter & Gamble",
    "ticker": "PG",
    "stockExchange": "NYSE",
    "isin": "US7427181091",
    "country": "United States",
    "headquarters": "Cincinnati, OH",
    "foundedYear": 1837,
    "industry": "FMCG & Consumer Goods",
    "subIndustry": "Consumer Goods & Brand Innovation",
    "size": "10,000+",
    "employeeCount": "107,000+",
    "ownershipType": "Public",
    "website": "https://www.pg.com",
    "careersUrl": "https://www.pgcareers.com",
    "logo": "PG",
    "logoUrl": "https://www.google.com/s2/favicons?domain=pg.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Touching lives, improving life every day with trusted global consumer brands.",
    "shortDescription": "Procter & Gamble Co. (P&G) is a consumer goods giant owning Tide, Pampers, Gillette, Crest, and Head & Shoulders.",
    "overview": "Procter & Gamble Co. (P&G) is a consumer goods giant owning Tide, Pampers, Gillette, Crest, and Head & Shoulders. Operating globally with over 107,000+ employees, Procter & Gamble offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Consumer Goods & Brand Innovation.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "SAP",
      "PowerBI",
      "Java",
      "Azure",
      "SQL",
      "React"
    ],
    "glassdoorRating": 4.2,
    "reviewCount": 16200,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-procter-gamble-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at Procter & Gamble?",
        "answer": "Procter & Gamble fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does Procter & Gamble offer remote work opportunities?",
        "answer": "Yes, Procter & Gamble supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/procter-gamble",
      "twitter": "https://x.com/PG",
      "wikipedia": "https://en.wikipedia.org/wiki/Procter_&_Gamble"
    },
    "contactEmail": "contact@procter-gamble.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$390 Billion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-johnson-johnson",
    "slug": "johnson-johnson",
    "name": "Johnson & Johnson",
    "legalName": "Johnson & Johnson",
    "ticker": "JNJ",
    "stockExchange": "NYSE",
    "isin": "US4781601046",
    "country": "United States",
    "headquarters": "New Brunswick, NJ",
    "foundedYear": 1886,
    "industry": "Healthcare & Pharmaceuticals",
    "subIndustry": "Medical Technology & Pharmaceuticals",
    "size": "10,000+",
    "employeeCount": "131,900+",
    "ownershipType": "Public",
    "website": "https://www.jnj.com",
    "careersUrl": "https://jobs.jnj.com",
    "logo": "JNJ",
    "logoUrl": "https://www.google.com/s2/favicons?domain=jnj.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Blending heart, science and ingenuity to profoundly change the trajectory of health.",
    "shortDescription": "Johnson & Johnson is an American multinational pharmaceutical and medical technology company.",
    "overview": "Johnson & Johnson is an American multinational pharmaceutical and medical technology company. Operating globally with over 131,900+ employees, Johnson & Johnson offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Medical Technology & Pharmaceuticals.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Java",
      "Python",
      "SAP",
      "AWS",
      "C++",
      "Bioinformatics",
      "SQL"
    ],
    "glassdoorRating": 4.1,
    "reviewCount": 23000,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-johnson-johnson-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at Johnson & Johnson?",
        "answer": "Johnson & Johnson fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does Johnson & Johnson offer remote work opportunities?",
        "answer": "Yes, Johnson & Johnson supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/johnson-johnson",
      "twitter": "https://x.com/JNJ",
      "wikipedia": "https://en.wikipedia.org/wiki/Johnson_&_Johnson"
    },
    "contactEmail": "contact@johnson-johnson.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$370 Billion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-broadcom-inc",
    "slug": "broadcom-inc",
    "name": "Broadcom Inc.",
    "legalName": "Broadcom Inc.",
    "ticker": "AVGO",
    "stockExchange": "NASDAQ",
    "isin": "US11135F1012",
    "country": "United States",
    "headquarters": "Palo Alto, CA",
    "foundedYear": 1961,
    "industry": "Information Technology",
    "subIndustry": "Semiconductor & Infrastructure Software",
    "size": "10,000+",
    "employeeCount": "20,000+",
    "ownershipType": "Public",
    "website": "https://www.broadcom.com",
    "careersUrl": "https://www.broadcom.com/careers",
    "logo": "AVGO",
    "logoUrl": "https://www.google.com/s2/favicons?domain=broadcom.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Connecting everything. Global infrastructure technology leader in semiconductor and software.",
    "shortDescription": "Broadcom Inc. is a global technology leader that designs, develops, and supplies semiconductor and enterprise software solutions.",
    "overview": "Broadcom Inc. is a global technology leader that designs, develops, and supplies semiconductor and enterprise software solutions. Operating globally with over 20,000+ employees, Broadcom Inc. offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Semiconductor & Infrastructure Software.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "C++",
      "C",
      "Python",
      "Verilog",
      "Linux",
      "Java",
      "VMware",
      "SystemC"
    ],
    "glassdoorRating": 4.0,
    "reviewCount": 8100,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-broadcom-inc-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at Broadcom Inc.?",
        "answer": "Broadcom Inc. fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does Broadcom Inc. offer remote work opportunities?",
        "answer": "Yes, Broadcom Inc. supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/broadcom-inc",
      "twitter": "https://x.com/AVGO",
      "wikipedia": "https://en.wikipedia.org/wiki/Broadcom_Inc."
    },
    "contactEmail": "contact@broadcom-inc.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$760 Billion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-salesforce-inc",
    "slug": "salesforce-inc",
    "name": "Salesforce Inc.",
    "legalName": "Salesforce Inc.",
    "ticker": "CRM",
    "stockExchange": "NYSE",
    "isin": "US79466L3024",
    "country": "United States",
    "headquarters": "San Francisco, CA",
    "foundedYear": 1999,
    "industry": "Information Technology",
    "subIndustry": "Enterprise CRM & SaaS",
    "size": "10,000+",
    "employeeCount": "72,682+",
    "ownershipType": "Public",
    "website": "https://www.salesforce.com",
    "careersUrl": "https://careers.salesforce.com",
    "logo": "CRM",
    "logoUrl": "https://www.google.com/s2/favicons?domain=salesforce.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Connecting companies with their customers through #1 AI CRM (Einstein).",
    "shortDescription": "Salesforce Inc. is a global leader in Customer Relationship Management (CRM) software, MuleSoft, Tableau, and Slack.",
    "overview": "Salesforce Inc. is a global leader in Customer Relationship Management (CRM) software, MuleSoft, Tableau, and Slack. Operating globally with over 72,682+ employees, Salesforce Inc. offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Enterprise CRM & SaaS.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Apex",
      "Java",
      "Lightning Web Components",
      "TypeScript",
      "React",
      "AWS",
      "Python"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 31000,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-salesforce-inc-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at Salesforce Inc.?",
        "answer": "Salesforce Inc. fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does Salesforce Inc. offer remote work opportunities?",
        "answer": "Yes, Salesforce Inc. supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/salesforce-inc",
      "twitter": "https://x.com/CRM",
      "wikipedia": "https://en.wikipedia.org/wiki/Salesforce_Inc."
    },
    "contactEmail": "contact@salesforce-inc.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$280 Billion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-adobe-inc",
    "slug": "adobe-inc",
    "name": "Adobe Inc.",
    "legalName": "Adobe Inc.",
    "ticker": "ADBE",
    "stockExchange": "NASDAQ",
    "isin": "US00724F1012",
    "country": "United States",
    "headquarters": "San Jose, CA",
    "foundedYear": 1982,
    "industry": "Information Technology",
    "subIndustry": "Creative Software & Digital Experience",
    "size": "10,000+",
    "employeeCount": "29,900+",
    "ownershipType": "Public",
    "website": "https://www.adobe.com",
    "careersUrl": "https://www.adobe.com/careers.html",
    "logo": "ADBE",
    "logoUrl": "https://www.google.com/s2/favicons?domain=adobe.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Changing the world through digital experiences (Photoshop, Illustrator, Acrobat, Firefly).",
    "shortDescription": "Adobe Inc. is an American computer software company known for creative media, document management, and digital marketing tools.",
    "overview": "Adobe Inc. is an American computer software company known for creative media, document management, and digital marketing tools. Operating globally with over 29,900+ employees, Adobe Inc. offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Creative Software & Digital Experience.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "C++",
      "JavaScript",
      "TypeScript",
      "React",
      "Python",
      "C++",
      "AWS",
      "WebGL"
    ],
    "glassdoorRating": 4.4,
    "reviewCount": 19500,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-adobe-inc-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at Adobe Inc.?",
        "answer": "Adobe Inc. fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does Adobe Inc. offer remote work opportunities?",
        "answer": "Yes, Adobe Inc. supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/adobe-inc",
      "twitter": "https://x.com/ADBE",
      "wikipedia": "https://en.wikipedia.org/wiki/Adobe_Inc."
    },
    "contactEmail": "contact@adobe-inc.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$240 Billion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-advanced-micro-devices",
    "slug": "advanced-micro-devices",
    "name": "Advanced Micro Devices",
    "legalName": "Advanced Micro Devices",
    "ticker": "AMD",
    "stockExchange": "NASDAQ",
    "isin": "US0079031078",
    "country": "United States",
    "headquarters": "Santa Clara, CA",
    "foundedYear": 1969,
    "industry": "Information Technology",
    "subIndustry": "Processors & Graphics Hardware",
    "size": "10,000+",
    "employeeCount": "26,000+",
    "ownershipType": "Public",
    "website": "https://www.amd.com",
    "careersUrl": "https://www.amd.com/en/corporate/careers",
    "logo": "AMD",
    "logoUrl": "https://www.google.com/s2/favicons?domain=amd.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "High-performance and adaptive computing powering computing devices, game consoles, and cloud.",
    "shortDescription": "Advanced Micro Devices (AMD) manufactures EPYC server CPUs, Ryzen desktop processors, and Instinct AI accelerators.",
    "overview": "Advanced Micro Devices (AMD) manufactures EPYC server CPUs, Ryzen desktop processors, and Instinct AI accelerators. Operating globally with over 26,000+ employees, Advanced Micro Devices offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Processors & Graphics Hardware.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "C++",
      "C",
      "Python",
      "Verilog",
      "ROCm",
      "Linux",
      "SystemVerilog"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 11400,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-advanced-micro-devices-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at Advanced Micro Devices?",
        "answer": "Advanced Micro Devices fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does Advanced Micro Devices offer remote work opportunities?",
        "answer": "Yes, Advanced Micro Devices supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/advanced-micro-devices",
      "twitter": "https://x.com/AMD",
      "wikipedia": "https://en.wikipedia.org/wiki/Advanced_Micro_Devices"
    },
    "contactEmail": "contact@advanced-micro-devices.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$250 Billion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "sp500-netflix-inc",
    "slug": "netflix-inc",
    "name": "Netflix Inc.",
    "legalName": "Netflix Inc.",
    "ticker": "NFLX",
    "stockExchange": "NASDAQ",
    "isin": "US64110L1061",
    "country": "United States",
    "headquarters": "Los Gatos, CA",
    "foundedYear": 1997,
    "industry": "Telecommunications",
    "subIndustry": "Streaming Entertainment & Media",
    "size": "10,000+",
    "employeeCount": "13,000+",
    "ownershipType": "Public",
    "website": "https://www.netflix.com",
    "careersUrl": "https://jobs.netflix.com/",
    "logo": "NFLX",
    "logoUrl": "https://www.google.com/s2/favicons?domain=netflix.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Entertaining the world with stories across genres and languages.",
    "shortDescription": "Netflix Inc. is a global streaming entertainment service with over 270 million paid memberships in 190 countries.",
    "overview": "Netflix Inc. is a global streaming entertainment service with over 270 million paid memberships in 190 countries. Operating globally with over 13,000+ employees, Netflix Inc. offers market-leading compensation, equity packages, and high-impact career growth.",
    "mission": "To lead technical innovation and business excellence in Streaming Entertainment & Media.",
    "vision": "Empowering teams worldwide through sustainable digital infrastructure and customer leadership.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Java",
      "Node.js",
      "React",
      "Python",
      "AWS",
      "Kafka",
      "GraphQL",
      "gRPC"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 7600,
    "benefits": [
      {
        "title": "Health & Dental Insurance",
        "description": "Comprehensive medical and wellness coverage.",
        "category": "Health & Medical"
      },
      {
        "title": "Stock Purchase Plan (ESPP/RSU)",
        "description": "Annual equity stock awards and purchase discount.",
        "category": "Financial & Stock"
      },
      {
        "title": "Learning & Tuition Allowance",
        "description": "Sponsorship for certifications and continuing education.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-netflix-inc-1",
        "role": "Senior Engineer",
        "rating": 5.0,
        "pros": "Great compensation, strong brand power, excellent technical scale.",
        "cons": "Fast-paced environment.",
        "date": "2026-06-10",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the work culture at Netflix Inc.?",
        "answer": "Netflix Inc. fosters a collaborative, engineering-driven environment focused on high scale, innovation, and continuous learning."
      },
      {
        "question": "Does Netflix Inc. offer remote work opportunities?",
        "answer": "Yes, Netflix Inc. supports flexible hybrid and remote work options depending on candidate role and team requirements."
      }
    ],
    "openJobsCount": 15,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/netflix-inc",
      "twitter": "https://x.com/NFLX",
      "wikipedia": "https://en.wikipedia.org/wiki/Netflix_Inc."
    },
    "contactEmail": "contact@netflix-inc.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "$290 Billion",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-reliance-industries",
    "slug": "reliance-industries",
    "name": "Reliance Industries",
    "legalName": "Reliance Industries",
    "ticker": "RELIANCE",
    "stockExchange": "NSE",
    "isin": "INE002A01018",
    "country": "India",
    "headquarters": "Mumbai, Maharashtra",
    "foundedYear": 1973,
    "industry": "Energy & Oil",
    "subIndustry": "Petrochemicals, Telecom (Jio) & Retail",
    "size": "10,000+",
    "employeeCount": "389,000+",
    "ownershipType": "Public",
    "website": "https://www.ril.com",
    "careersUrl": "https://careers.ril.com",
    "logo": "RELI",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ril.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Growth is Life. Empowering 1.4 billion Indians across digital, energy, and retail.",
    "shortDescription": "Reliance Industries Limited is India's largest private enterprise operating Jio 5G, Reliance Retail, and Green Energy.",
    "overview": "Reliance Industries Limited is India's largest private enterprise operating Jio 5G, Reliance Retail, and Green Energy. Operating as an enterprise market leader, Reliance Industries employs over 389,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Petrochemicals, Telecom (Jio) & Retail.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Python",
      "Java",
      "5G Stack",
      "React",
      "Kafka",
      "AWS",
      "Kubernetes"
    ],
    "glassdoorRating": 4.2,
    "reviewCount": 28000,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-reliance-industries-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Reliance Industries?",
        "answer": "Reliance Industries conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Reliance Industries offer graduate trainee programs?",
        "answer": "Yes, Reliance Industries offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/reliance-industries",
      "twitter": "https://x.com/RELIANCE",
      "wikipedia": "https://en.wikipedia.org/wiki/Reliance_Industries"
    },
    "contactEmail": "careers@reliance-industries.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b920,80,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-tata-consultancy-services",
    "slug": "tata-consultancy-services",
    "name": "Tata Consultancy Services",
    "legalName": "Tata Consultancy Services",
    "ticker": "TCS",
    "stockExchange": "NSE",
    "isin": "INE467B01029",
    "country": "India",
    "headquarters": "Mumbai, Maharashtra",
    "foundedYear": 1968,
    "industry": "Information Technology",
    "subIndustry": "IT Services & Enterprise Consulting",
    "size": "10,000+",
    "employeeCount": "601,000+",
    "ownershipType": "Public",
    "website": "https://www.tcs.com",
    "careersUrl": "https://www.tcs.com/careers",
    "logo": "TCS",
    "logoUrl": "https://www.google.com/s2/favicons?domain=tcs.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Building on belief. World leader in IT services, consulting, and business solutions.",
    "shortDescription": "Tata Consultancy Services (TCS) is an IT services leader operating in 55 countries with over 600,000 employees.",
    "overview": "Tata Consultancy Services (TCS) is an IT services leader operating in 55 countries with over 600,000 employees. Operating as an enterprise market leader, Tata Consultancy Services employs over 601,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in IT Services & Enterprise Consulting.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Java",
      "Python",
      "TypeScript",
      "React",
      "AWS",
      "Azure",
      "SAP"
    ],
    "glassdoorRating": 3.9,
    "reviewCount": 85000,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-tata-consultancy-services-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Tata Consultancy Services?",
        "answer": "Tata Consultancy Services conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Tata Consultancy Services offer graduate trainee programs?",
        "answer": "Yes, Tata Consultancy Services offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/tata-consultancy-services",
      "twitter": "https://x.com/TCS",
      "wikipedia": "https://en.wikipedia.org/wiki/Tata_Consultancy_Services"
    },
    "contactEmail": "careers@tata-consultancy-services.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b914,60,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-hdfc-bank",
    "slug": "hdfc-bank",
    "name": "HDFC Bank",
    "legalName": "HDFC Bank",
    "ticker": "HDFCBANK",
    "stockExchange": "NSE",
    "isin": "INE040A01034",
    "country": "India",
    "headquarters": "Mumbai, Maharashtra",
    "foundedYear": 1994,
    "industry": "Banking & Finance",
    "subIndustry": "Private Banking & Financial Services",
    "size": "10,000+",
    "employeeCount": "213,000+",
    "ownershipType": "Public",
    "website": "https://www.hdfcbank.com",
    "careersUrl": "https://www.hdfcbank.com/careers",
    "logo": "HDFC",
    "logoUrl": "https://www.google.com/s2/favicons?domain=hdfcbank.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "We understand your world. India's largest private bank.",
    "shortDescription": "HDFC Bank Limited is India's premier private banking institution serving over 85 million customers nationwide.",
    "overview": "HDFC Bank Limited is India's premier private banking institution serving over 85 million customers nationwide. Operating as an enterprise market leader, HDFC Bank employs over 213,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Private Banking & Financial Services.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Java",
      "Spring Boot",
      "React",
      "Oracle",
      "Python",
      "Docker"
    ],
    "glassdoorRating": 4.0,
    "reviewCount": 31000,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-hdfc-bank-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at HDFC Bank?",
        "answer": "HDFC Bank conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does HDFC Bank offer graduate trainee programs?",
        "answer": "Yes, HDFC Bank offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/hdfc-bank",
      "twitter": "https://x.com/HDFCBANK",
      "wikipedia": "https://en.wikipedia.org/wiki/HDFC_Bank"
    },
    "contactEmail": "careers@hdfc-bank.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b913,20,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-icici-bank",
    "slug": "icici-bank",
    "name": "ICICI Bank",
    "legalName": "ICICI Bank",
    "ticker": "ICICIBANK",
    "stockExchange": "NSE",
    "isin": "INE090A01021",
    "country": "India",
    "headquarters": "Mumbai, Maharashtra",
    "foundedYear": 1994,
    "industry": "Banking & Finance",
    "subIndustry": "Retail & Corporate Banking",
    "size": "10,000+",
    "employeeCount": "158,000+",
    "ownershipType": "Public",
    "website": "https://www.icicibank.com",
    "careersUrl": "https://www.icicibankcareers.com",
    "logo": "ICIC",
    "logoUrl": "https://www.google.com/s2/favicons?domain=icicibank.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Hum Hain Na, Khayal Aapka. Technology-first banking leader.",
    "shortDescription": "ICICI Bank Limited is a leading private sector bank offering personal, corporate, and digital banking solutions.",
    "overview": "ICICI Bank Limited is a leading private sector bank offering personal, corporate, and digital banking solutions. Operating as an enterprise market leader, ICICI Bank employs over 158,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Retail & Corporate Banking.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Java",
      "Python",
      "Node.js",
      "React Native",
      "SQL",
      "Oracle"
    ],
    "glassdoorRating": 4.1,
    "reviewCount": 24000,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-icici-bank-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at ICICI Bank?",
        "answer": "ICICI Bank conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does ICICI Bank offer graduate trainee programs?",
        "answer": "Yes, ICICI Bank offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/icici-bank",
      "twitter": "https://x.com/ICICIBANK",
      "wikipedia": "https://en.wikipedia.org/wiki/ICICI_Bank"
    },
    "contactEmail": "careers@icici-bank.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b98,80,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-bharti-airtel",
    "slug": "bharti-airtel",
    "name": "Bharti Airtel",
    "legalName": "Bharti Airtel",
    "ticker": "BHARTIARTL",
    "stockExchange": "NSE",
    "isin": "INE397D01024",
    "country": "India",
    "headquarters": "New Delhi, Delhi",
    "foundedYear": 1995,
    "industry": "Telecommunications",
    "subIndustry": "Mobile Telecom, Fiber & Enterprise Cloud",
    "size": "10,000+",
    "employeeCount": "76,000+",
    "ownershipType": "Public",
    "website": "https://www.airtel.in",
    "careersUrl": "https://www.airtel.in/careers/",
    "logo": "BHAR",
    "logoUrl": "https://www.google.com/s2/favicons?domain=airtel.in&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Express Yourself. Connecting over 500 million subscribers across Asia and Africa.",
    "shortDescription": "Bharti Airtel Limited is a leading global telecommunications company operating across 17 countries.",
    "overview": "Bharti Airtel Limited is a leading global telecommunications company operating across 17 countries. Operating as an enterprise market leader, Bharti Airtel employs over 76,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Mobile Telecom, Fiber & Enterprise Cloud.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Java",
      "Go",
      "Python",
      "5G Network Architecture",
      "React"
    ],
    "glassdoorRating": 4.1,
    "reviewCount": 15400,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-bharti-airtel-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Bharti Airtel?",
        "answer": "Bharti Airtel conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Bharti Airtel offer graduate trainee programs?",
        "answer": "Yes, Bharti Airtel offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/bharti-airtel",
      "twitter": "https://x.com/BHARTIARTL",
      "wikipedia": "https://en.wikipedia.org/wiki/Bharti_Airtel"
    },
    "contactEmail": "careers@bharti-airtel.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b98,40,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-infosys",
    "slug": "infosys",
    "name": "Infosys",
    "legalName": "Infosys",
    "ticker": "INFY",
    "stockExchange": "NSE",
    "isin": "INE009A01021",
    "country": "India",
    "headquarters": "Bengaluru, Karnataka",
    "foundedYear": 1981,
    "industry": "Information Technology",
    "subIndustry": "IT Consulting, AI & Cloud Services",
    "size": "10,000+",
    "employeeCount": "317,000+",
    "ownershipType": "Public",
    "website": "https://www.infosys.com",
    "careersUrl": "https://www.infosys.com/careers",
    "logo": "INFY",
    "logoUrl": "https://www.google.com/s2/favicons?domain=infosys.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Navigate your next. Global leader in next-generation digital services and consulting.",
    "shortDescription": "Infosys Limited is a global leader in digital consulting, cloud transformations, and AI enterprise platforms.",
    "overview": "Infosys Limited is a global leader in digital consulting, cloud transformations, and AI enterprise platforms. Operating as an enterprise market leader, Infosys employs over 317,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in IT Consulting, AI & Cloud Services.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Java",
      "Python",
      "React",
      "Angular",
      "AWS",
      "Azure"
    ],
    "glassdoorRating": 3.8,
    "reviewCount": 62000,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-infosys-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Infosys?",
        "answer": "Infosys conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Infosys offer graduate trainee programs?",
        "answer": "Yes, Infosys offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/infosys",
      "twitter": "https://x.com/INFY",
      "wikipedia": "https://en.wikipedia.org/wiki/Infosys"
    },
    "contactEmail": "careers@infosys.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b97,20,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-state-bank-of-india",
    "slug": "state-bank-of-india",
    "name": "State Bank of India",
    "legalName": "State Bank of India",
    "ticker": "SBIN",
    "stockExchange": "NSE",
    "isin": "INE062A01020",
    "country": "India",
    "headquarters": "Mumbai, Maharashtra",
    "foundedYear": 1806,
    "industry": "Banking & Finance",
    "subIndustry": "Public Sector Banking & Financial Inclusion",
    "size": "10,000+",
    "employeeCount": "232,000+",
    "ownershipType": "Public",
    "website": "https://sbi.co.in",
    "careersUrl": "https://sbi.co.in/web/careers",
    "logo": "SBIN",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sbi.co.in&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "The banker to every Indian. India's largest public sector banking enterprise.",
    "shortDescription": "State Bank of India (SBI) is a Fortune 500 public sector bank serving over 480 million customers.",
    "overview": "State Bank of India (SBI) is a Fortune 500 public sector bank serving over 480 million customers. Operating as an enterprise market leader, State Bank of India employs over 232,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Public Sector Banking & Financial Inclusion.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Java",
      "Python",
      "Oracle",
      "YONO Tech Stack",
      "Spring Boot"
    ],
    "glassdoorRating": 4.2,
    "reviewCount": 41000,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-state-bank-of-india-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at State Bank of India?",
        "answer": "State Bank of India conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does State Bank of India offer graduate trainee programs?",
        "answer": "Yes, State Bank of India offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/state-bank-of-india",
      "twitter": "https://x.com/SBIN",
      "wikipedia": "https://en.wikipedia.org/wiki/State_Bank_of_India"
    },
    "contactEmail": "careers@state-bank-of-india.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b97,60,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-larsen-toubro",
    "slug": "larsen-toubro",
    "name": "Larsen & Toubro",
    "legalName": "Larsen & Toubro",
    "ticker": "LT",
    "stockExchange": "NSE",
    "isin": "INE018A01030",
    "country": "India",
    "headquarters": "Mumbai, Maharashtra",
    "foundedYear": 1938,
    "industry": "Infrastructure & Engineering",
    "subIndustry": "Heavy Engineering, Construction & Tech",
    "size": "10,000+",
    "employeeCount": "54,000+",
    "ownershipType": "Public",
    "website": "https://www.larsentoubro.com",
    "careersUrl": "https://www.larsentoubro.com/careers/",
    "logo": "LT",
    "logoUrl": "https://www.google.com/s2/favicons?domain=larsentoubro.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "It's all about Imagineering. Engineering the world's most complex mega-structures.",
    "shortDescription": "Larsen & Toubro (L&T) is an Indian multinational conglomerate engaged in EPC projects, manufacturing, and tech services.",
    "overview": "Larsen & Toubro (L&T) is an Indian multinational conglomerate engaged in EPC projects, manufacturing, and tech services. Operating as an enterprise market leader, Larsen & Toubro employs over 54,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Heavy Engineering, Construction & Tech.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "AutoCAD",
      "BIM",
      "Python",
      "SAP",
      "Primavera"
    ],
    "glassdoorRating": 4.2,
    "reviewCount": 19800,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-larsen-toubro-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Larsen & Toubro?",
        "answer": "Larsen & Toubro conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Larsen & Toubro offer graduate trainee programs?",
        "answer": "Yes, Larsen & Toubro offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/larsen-toubro",
      "twitter": "https://x.com/LT",
      "wikipedia": "https://en.wikipedia.org/wiki/Larsen_&_Toubro"
    },
    "contactEmail": "careers@larsen-toubro.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b95,10,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-hindustan-unilever",
    "slug": "hindustan-unilever",
    "name": "Hindustan Unilever",
    "legalName": "Hindustan Unilever",
    "ticker": "HUL",
    "stockExchange": "NSE",
    "isin": "INE030A01027",
    "country": "India",
    "headquarters": "Mumbai, Maharashtra",
    "foundedYear": 1933,
    "industry": "FMCG & Consumer Goods",
    "subIndustry": "Consumer Packaged Goods & Personal Care",
    "size": "10,000+",
    "employeeCount": "21,000+",
    "ownershipType": "Public",
    "website": "https://www.hul.co.in",
    "careersUrl": "https://www.hul.co.in/careers/",
    "logo": "HUL",
    "logoUrl": "https://www.google.com/s2/favicons?domain=hul.co.in&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Everyday stories of changing lives for the better.",
    "shortDescription": "Hindustan Unilever Limited (HUL) is India's largest consumer goods company owning Surf Excel, Dove, and Red Label.",
    "overview": "Hindustan Unilever Limited (HUL) is India's largest consumer goods company owning Surf Excel, Dove, and Red Label. Operating as an enterprise market leader, Hindustan Unilever employs over 21,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Consumer Packaged Goods & Personal Care.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Python",
      "SAP",
      "PowerBI",
      "SQL",
      "React"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 14200,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-hindustan-unilever-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Hindustan Unilever?",
        "answer": "Hindustan Unilever conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Hindustan Unilever offer graduate trainee programs?",
        "answer": "Yes, Hindustan Unilever offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/hindustan-unilever",
      "twitter": "https://x.com/HUL",
      "wikipedia": "https://en.wikipedia.org/wiki/Hindustan_Unilever"
    },
    "contactEmail": "careers@hindustan-unilever.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b95,80,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-itc-limited",
    "slug": "itc-limited",
    "name": "ITC Limited",
    "legalName": "ITC Limited",
    "ticker": "ITC",
    "stockExchange": "NSE",
    "isin": "INE154A01025",
    "country": "India",
    "headquarters": "Kolkata, West Bengal",
    "foundedYear": 1910,
    "industry": "FMCG & Consumer Goods",
    "subIndustry": "FMCG, Hotels, Paperboards & Agri Business",
    "size": "10,000+",
    "employeeCount": "36,500+",
    "ownershipType": "Public",
    "website": "https://www.itcportal.com",
    "careersUrl": "https://www.itcportal.com/careers/",
    "logo": "ITC",
    "logoUrl": "https://www.google.com/s2/favicons?domain=itcportal.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Enduring Value. For how India lives, works, and grows.",
    "shortDescription": "ITC Limited is a diversified Indian conglomerate with presence in FMCG, Hotels, Paperboards, Packaging, and Agri Business.",
    "overview": "ITC Limited is a diversified Indian conglomerate with presence in FMCG, Hotels, Paperboards, Packaging, and Agri Business. Operating as an enterprise market leader, ITC Limited employs over 36,500+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in FMCG, Hotels, Paperboards & Agri Business.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Java",
      "Python",
      "SAP HANA",
      "React",
      "SQL"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 16900,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-itc-limited-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at ITC Limited?",
        "answer": "ITC Limited conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does ITC Limited offer graduate trainee programs?",
        "answer": "Yes, ITC Limited offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/itc-limited",
      "twitter": "https://x.com/ITC",
      "wikipedia": "https://en.wikipedia.org/wiki/ITC_Limited"
    },
    "contactEmail": "careers@itc-limited.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b96,10,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-axis-bank",
    "slug": "axis-bank",
    "name": "Axis Bank",
    "legalName": "Axis Bank",
    "ticker": "AXISBANK",
    "stockExchange": "NSE",
    "isin": "INE238A01034",
    "country": "India",
    "headquarters": "Mumbai, Maharashtra",
    "foundedYear": 1993,
    "industry": "Banking & Finance",
    "subIndustry": "Private Banking & Wealth Management",
    "size": "10,000+",
    "employeeCount": "93,000+",
    "ownershipType": "Public",
    "website": "https://www.axisbank.com",
    "careersUrl": "https://www.axisbank.com/careers",
    "logo": "AXIS",
    "logoUrl": "https://www.google.com/s2/favicons?domain=axisbank.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Badhti Ka Naam Zindagi. Premier private bank.",
    "shortDescription": "Axis Bank is the third-largest private sector bank in India offering full financial services.",
    "overview": "Axis Bank is the third-largest private sector bank in India offering full financial services. Operating as an enterprise market leader, Axis Bank employs over 93,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Private Banking & Wealth Management.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Java",
      "Python",
      "React",
      "Oracle",
      "Spring"
    ],
    "glassdoorRating": 4.0,
    "reviewCount": 19200,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-axis-bank-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Axis Bank?",
        "answer": "Axis Bank conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Axis Bank offer graduate trainee programs?",
        "answer": "Yes, Axis Bank offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/axis-bank",
      "twitter": "https://x.com/AXISBANK",
      "wikipedia": "https://en.wikipedia.org/wiki/Axis_Bank"
    },
    "contactEmail": "careers@axis-bank.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b93,60,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-kotak-mahindra-bank",
    "slug": "kotak-mahindra-bank",
    "name": "Kotak Mahindra Bank",
    "legalName": "Kotak Mahindra Bank",
    "ticker": "KOTAKBANK",
    "stockExchange": "NSE",
    "isin": "INE237A01028",
    "country": "India",
    "headquarters": "Mumbai, Maharashtra",
    "foundedYear": 1985,
    "industry": "Banking & Finance",
    "subIndustry": "Investment Banking & Digital Banking",
    "size": "10,000+",
    "employeeCount": "100,000+",
    "ownershipType": "Public",
    "website": "https://www.kotak.com",
    "careersUrl": "https://www.kotak.com/careers",
    "logo": "KOTA",
    "logoUrl": "https://www.google.com/s2/favicons?domain=kotak.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Let's make money simple. Premier banking institution.",
    "shortDescription": "Kotak Mahindra Bank is a leading Indian private bank providing personal, commercial, and investment banking.",
    "overview": "Kotak Mahindra Bank is a leading Indian private bank providing personal, commercial, and investment banking. Operating as an enterprise market leader, Kotak Mahindra Bank employs over 100,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Investment Banking & Digital Banking.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Java",
      "Python",
      "Microservices",
      "React Native"
    ],
    "glassdoorRating": 4.1,
    "reviewCount": 16500,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-kotak-mahindra-bank-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Kotak Mahindra Bank?",
        "answer": "Kotak Mahindra Bank conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Kotak Mahindra Bank offer graduate trainee programs?",
        "answer": "Yes, Kotak Mahindra Bank offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/kotak-mahindra-bank",
      "twitter": "https://x.com/KOTAKBANK",
      "wikipedia": "https://en.wikipedia.org/wiki/Kotak_Mahindra_Bank"
    },
    "contactEmail": "careers@kotak-mahindra-bank.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b93,50,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-hcltech",
    "slug": "hcltech",
    "name": "HCLTech",
    "legalName": "HCLTech",
    "ticker": "HCLTECH",
    "stockExchange": "NSE",
    "isin": "INE860A01027",
    "country": "India",
    "headquarters": "Noida, Uttar Pradesh",
    "foundedYear": 1976,
    "industry": "Information Technology",
    "subIndustry": "Next-Gen Software & R&D Engineering",
    "size": "10,000+",
    "employeeCount": "227,000+",
    "ownershipType": "Public",
    "website": "https://www.hcltech.com",
    "careersUrl": "https://www.hcltech.com/careers",
    "logo": "HCLT",
    "logoUrl": "https://www.google.com/s2/favicons?domain=hcltech.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Supercharging Progress. Global tech company helping enterprises re-imagine their businesses.",
    "shortDescription": "HCLTech is a global technology company offering engineering, cloud, AI, and software services.",
    "overview": "HCLTech is a global technology company offering engineering, cloud, AI, and software services. Operating as an enterprise market leader, HCLTech employs over 227,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Next-Gen Software & R&D Engineering.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "C++",
      "Java",
      "Python",
      "Cloud Native",
      "DevOps"
    ],
    "glassdoorRating": 3.8,
    "reviewCount": 38000,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-hcltech-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at HCLTech?",
        "answer": "HCLTech conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does HCLTech offer graduate trainee programs?",
        "answer": "Yes, HCLTech offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/hcltech",
      "twitter": "https://x.com/HCLTECH",
      "wikipedia": "https://en.wikipedia.org/wiki/HCLTech"
    },
    "contactEmail": "careers@hcltech.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b94,10,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-sun-pharmaceutical",
    "slug": "sun-pharmaceutical",
    "name": "Sun Pharmaceutical",
    "legalName": "Sun Pharmaceutical",
    "ticker": "SUNPHARMA",
    "stockExchange": "NSE",
    "isin": "INE044A01036",
    "country": "India",
    "headquarters": "Mumbai, Maharashtra",
    "foundedYear": 1983,
    "industry": "Healthcare & Pharmaceuticals",
    "subIndustry": "Generics & Specialty Pharma",
    "size": "10,000+",
    "employeeCount": "41,000+",
    "ownershipType": "Public",
    "website": "https://www.sunpharma.com",
    "careersUrl": "https://www.sunpharma.com/careers",
    "logo": "SUNP",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sunpharma.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Reaching People. Touching Lives. Largest pharmaceutical company in India.",
    "shortDescription": "Sun Pharma is the fourth largest specialty generic pharmaceutical company in the world.",
    "overview": "Sun Pharma is the fourth largest specialty generic pharmaceutical company in the world. Operating as an enterprise market leader, Sun Pharmaceutical employs over 41,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Generics & Specialty Pharma.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Bioinformatics",
      "Python",
      "SAP",
      "R",
      "SQL"
    ],
    "glassdoorRating": 4.2,
    "reviewCount": 11500,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-sun-pharmaceutical-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Sun Pharmaceutical?",
        "answer": "Sun Pharmaceutical conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Sun Pharmaceutical offer graduate trainee programs?",
        "answer": "Yes, Sun Pharmaceutical offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/sun-pharmaceutical",
      "twitter": "https://x.com/SUNPHARMA",
      "wikipedia": "https://en.wikipedia.org/wiki/Sun_Pharmaceutical"
    },
    "contactEmail": "careers@sun-pharmaceutical.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b93,90,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-tata-motors",
    "slug": "tata-motors",
    "name": "Tata Motors",
    "legalName": "Tata Motors",
    "ticker": "TATAMOTORS",
    "stockExchange": "NSE",
    "isin": "INE155A01022",
    "country": "India",
    "headquarters": "Mumbai, Maharashtra",
    "foundedYear": 1945,
    "industry": "Automotive & Transport",
    "subIndustry": "EVs, Commercial Vehicles & Jaguar Land Rover",
    "size": "10,000+",
    "employeeCount": "81,000+",
    "ownershipType": "Public",
    "website": "https://www.tatamotors.com",
    "careersUrl": "https://www.tatamotors.com/careers/",
    "logo": "TATA",
    "logoUrl": "https://www.google.com/s2/favicons?domain=tatamotors.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Connecting Aspirations. Pioneer in India's electric mobility revolution.",
    "shortDescription": "Tata Motors Limited is a leading global automobile manufacturer of cars, utility vehicles, buses, and trucks.",
    "overview": "Tata Motors Limited is a leading global automobile manufacturer of cars, utility vehicles, buses, and trucks. Operating as an enterprise market leader, Tata Motors employs over 81,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in EVs, Commercial Vehicles & Jaguar Land Rover.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "C++",
      "Python",
      "AUTOSAR",
      "Embedded Linux",
      "MATLAB"
    ],
    "glassdoorRating": 4.2,
    "reviewCount": 22000,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-tata-motors-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Tata Motors?",
        "answer": "Tata Motors conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Tata Motors offer graduate trainee programs?",
        "answer": "Yes, Tata Motors offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/tata-motors",
      "twitter": "https://x.com/TATAMOTORS",
      "wikipedia": "https://en.wikipedia.org/wiki/Tata_Motors"
    },
    "contactEmail": "careers@tata-motors.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b93,60,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-maruti-suzuki",
    "slug": "maruti-suzuki",
    "name": "Maruti Suzuki",
    "legalName": "Maruti Suzuki",
    "ticker": "MARUTI",
    "stockExchange": "NSE",
    "isin": "INE585B01010",
    "country": "India",
    "headquarters": "New Delhi, Delhi",
    "foundedYear": 1981,
    "industry": "Automotive & Transport",
    "subIndustry": "Passenger Automobiles & Mobility",
    "size": "10,000+",
    "employeeCount": "40,000+",
    "ownershipType": "Public",
    "website": "https://www.marutisuzuki.com",
    "careersUrl": "https://www.marutisuzuki.com/careers",
    "logo": "MARU",
    "logoUrl": "https://www.google.com/s2/favicons?domain=marutisuzuki.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Count on Us. India's largest passenger car maker.",
    "shortDescription": "Maruti Suzuki India Limited is the leading passenger vehicle manufacturer in India.",
    "overview": "Maruti Suzuki India Limited is the leading passenger vehicle manufacturer in India. Operating as an enterprise market leader, Maruti Suzuki employs over 40,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Passenger Automobiles & Mobility.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "C++",
      "Python",
      "SAP",
      "Embedded C",
      "AutoCAD"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 14000,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-maruti-suzuki-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Maruti Suzuki?",
        "answer": "Maruti Suzuki conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Maruti Suzuki offer graduate trainee programs?",
        "answer": "Yes, Maruti Suzuki offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/maruti-suzuki",
      "twitter": "https://x.com/MARUTI",
      "wikipedia": "https://en.wikipedia.org/wiki/Maruti_Suzuki"
    },
    "contactEmail": "careers@maruti-suzuki.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b94,10,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-ntpc-limited",
    "slug": "ntpc-limited",
    "name": "NTPC Limited",
    "legalName": "NTPC Limited",
    "ticker": "NTPC",
    "stockExchange": "NSE",
    "isin": "INE733E01010",
    "country": "India",
    "headquarters": "New Delhi, Delhi",
    "foundedYear": 1975,
    "industry": "Energy & Oil",
    "subIndustry": "Power Generation & Green Energy",
    "size": "10,000+",
    "employeeCount": "20,000+",
    "ownershipType": "Public",
    "website": "https://www.ntpc.co.in",
    "careersUrl": "https://www.ntpc.co.in/careers",
    "logo": "NTPC",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ntpc.co.in&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Powering India's Growth. India's largest power utility conglomerate.",
    "shortDescription": "NTPC Limited is India's largest energy conglomerate with rooted presence in fossil fuel and renewable power generation.",
    "overview": "NTPC Limited is India's largest energy conglomerate with rooted presence in fossil fuel and renewable power generation. Operating as an enterprise market leader, NTPC Limited employs over 20,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Power Generation & Green Energy.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Python",
      "SAP",
      "PLC/SCADA",
      "Power Systems",
      "Java"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 12500,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-ntpc-limited-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at NTPC Limited?",
        "answer": "NTPC Limited conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does NTPC Limited offer graduate trainee programs?",
        "answer": "Yes, NTPC Limited offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/ntpc-limited",
      "twitter": "https://x.com/NTPC",
      "wikipedia": "https://en.wikipedia.org/wiki/NTPC_Limited"
    },
    "contactEmail": "careers@ntpc-limited.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b93,80,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-bajaj-finance",
    "slug": "bajaj-finance",
    "name": "Bajaj Finance",
    "legalName": "Bajaj Finance",
    "ticker": "BAJFINANCE",
    "stockExchange": "NSE",
    "isin": "INE296A01024",
    "country": "India",
    "headquarters": "Pune, Maharashtra",
    "foundedYear": 1987,
    "industry": "Banking & Finance",
    "subIndustry": "Consumer Finance & Fintech App",
    "size": "10,000+",
    "employeeCount": "50,000+",
    "ownershipType": "Public",
    "website": "https://www.bajajfinserv.in",
    "careersUrl": "https://www.bajajfinserv.in/careers",
    "logo": "BAJF",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bajajfinserv.in&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Empowering your financial needs. India's leading NBFC and digital lender.",
    "shortDescription": "Bajaj Finance Limited is one of the most diversified non-banking financial companies in India.",
    "overview": "Bajaj Finance Limited is one of the most diversified non-banking financial companies in India. Operating as an enterprise market leader, Bajaj Finance employs over 50,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Consumer Finance & Fintech App.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Java",
      "Python",
      "React Native",
      "Spring",
      "Kafka"
    ],
    "glassdoorRating": 4.0,
    "reviewCount": 18500,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-bajaj-finance-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Bajaj Finance?",
        "answer": "Bajaj Finance conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Bajaj Finance offer graduate trainee programs?",
        "answer": "Yes, Bajaj Finance offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/bajaj-finance",
      "twitter": "https://x.com/BAJFINANCE",
      "wikipedia": "https://en.wikipedia.org/wiki/Bajaj_Finance"
    },
    "contactEmail": "careers@bajaj-finance.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b94,40,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-titan-company",
    "slug": "titan-company",
    "name": "Titan Company",
    "legalName": "Titan Company",
    "ticker": "TITAN",
    "stockExchange": "NSE",
    "isin": "INE280A01028",
    "country": "India",
    "headquarters": "Bengaluru, Karnataka",
    "foundedYear": 1984,
    "industry": "FMCG & Consumer Goods",
    "subIndustry": "Lifestyle, Watches & Tanishq Jewelry",
    "size": "10,000+",
    "employeeCount": "12,000+",
    "ownershipType": "Public",
    "website": "https://www.titancompany.in",
    "careersUrl": "https://www.titancompany.in/careers",
    "logo": "TITA",
    "logoUrl": "https://www.google.com/s2/favicons?domain=titancompany.in&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Transforming lifestyles through innovative design and trust.",
    "shortDescription": "Titan Company Limited is an Indian lifestyle company owning Tanishq, Fastrack, Titan, and Mia.",
    "overview": "Titan Company Limited is an Indian lifestyle company owning Tanishq, Fastrack, Titan, and Mia. Operating as an enterprise market leader, Titan Company employs over 12,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Lifestyle, Watches & Tanishq Jewelry.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Python",
      "React",
      "SAP",
      "Java",
      "Node.js"
    ],
    "glassdoorRating": 4.4,
    "reviewCount": 9800,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-titan-company-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Titan Company?",
        "answer": "Titan Company conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Titan Company offer graduate trainee programs?",
        "answer": "Yes, Titan Company offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/titan-company",
      "twitter": "https://x.com/TITAN",
      "wikipedia": "https://en.wikipedia.org/wiki/Titan_Company"
    },
    "contactEmail": "careers@titan-company.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b93,20,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-mahindra-mahindra",
    "slug": "mahindra-mahindra",
    "name": "Mahindra & Mahindra",
    "legalName": "Mahindra & Mahindra",
    "ticker": "M&M",
    "stockExchange": "NSE",
    "isin": "INE101A01026",
    "country": "India",
    "headquarters": "Mumbai, Maharashtra",
    "foundedYear": 1945,
    "industry": "Automotive & Transport",
    "subIndustry": "SUVs, Tractors & Farm Equipment",
    "size": "10,000+",
    "employeeCount": "260,000+",
    "ownershipType": "Public",
    "website": "https://www.mahindra.com",
    "careersUrl": "https://www.mahindra.com/careers",
    "logo": "M&M",
    "logoUrl": "https://www.google.com/s2/favicons?domain=mahindra.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Rise. Transforming mobility, farm equipment, and technology.",
    "shortDescription": "Mahindra & Mahindra Limited is one of the largest vehicle manufacturers by production in India.",
    "overview": "Mahindra & Mahindra Limited is one of the largest vehicle manufacturers by production in India. Operating as an enterprise market leader, Mahindra & Mahindra employs over 260,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in SUVs, Tractors & Farm Equipment.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "C++",
      "Python",
      "AUTOSAR",
      "SAP",
      "Embedded C"
    ],
    "glassdoorRating": 4.2,
    "reviewCount": 21000,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-mahindra-mahindra-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Mahindra & Mahindra?",
        "answer": "Mahindra & Mahindra conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Mahindra & Mahindra offer graduate trainee programs?",
        "answer": "Yes, Mahindra & Mahindra offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/mahindra-mahindra",
      "twitter": "https://x.com/M&M",
      "wikipedia": "https://en.wikipedia.org/wiki/Mahindra_&_Mahindra"
    },
    "contactEmail": "careers@mahindra-mahindra.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b93,70,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-ultratech-cement",
    "slug": "ultratech-cement",
    "name": "UltraTech Cement",
    "legalName": "UltraTech Cement",
    "ticker": "ULTRACEMCO",
    "stockExchange": "NSE",
    "isin": "INE481G01011",
    "country": "India",
    "headquarters": "Mumbai, Maharashtra",
    "foundedYear": 1983,
    "industry": "Infrastructure & Engineering",
    "subIndustry": "Building Materials & Cement",
    "size": "10,000+",
    "employeeCount": "22,000+",
    "ownershipType": "Public",
    "website": "https://www.ultratechcement.com",
    "careersUrl": "https://www.ultratechcement.com/careers",
    "logo": "ULTR",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ultratechcement.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "The Engineer's Choice. India's largest cement manufacturer.",
    "shortDescription": "UltraTech Cement Limited is the cement flagship company of the Aditya Birla Group.",
    "overview": "UltraTech Cement Limited is the cement flagship company of the Aditya Birla Group. Operating as an enterprise market leader, UltraTech Cement employs over 22,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Building Materials & Cement.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "SAP",
      "Python",
      "AutoCAD",
      "PLC",
      "SQL"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 11200,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-ultratech-cement-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at UltraTech Cement?",
        "answer": "UltraTech Cement conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does UltraTech Cement offer graduate trainee programs?",
        "answer": "Yes, UltraTech Cement offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/ultratech-cement",
      "twitter": "https://x.com/ULTRACEMCO",
      "wikipedia": "https://en.wikipedia.org/wiki/UltraTech_Cement"
    },
    "contactEmail": "careers@ultratech-cement.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b93,20,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-power-grid-corporation",
    "slug": "power-grid-corporation",
    "name": "Power Grid Corporation",
    "legalName": "Power Grid Corporation",
    "ticker": "POWERGRID",
    "stockExchange": "NSE",
    "isin": "INE752E01010",
    "country": "India",
    "headquarters": "Gurugram, Haryana",
    "foundedYear": 1989,
    "industry": "Energy & Oil",
    "subIndustry": "Power Transmission & Telecom Grid",
    "size": "10,000+",
    "employeeCount": "9,000+",
    "ownershipType": "Public",
    "website": "https://www.powergrid.in",
    "careersUrl": "https://www.powergrid.in/careers",
    "logo": "POWE",
    "logoUrl": "https://www.google.com/s2/favicons?domain=powergrid.in&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Transmitting Power. Transforming Lives. Public sector transmission utility.",
    "shortDescription": "Power Grid Corporation of India Limited is an Indian central public sector undertaking under Ministry of Power.",
    "overview": "Power Grid Corporation of India Limited is an Indian central public sector undertaking under Ministry of Power. Operating as an enterprise market leader, Power Grid Corporation employs over 9,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Power Transmission & Telecom Grid.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Python",
      "SAP",
      "SCADA",
      "GIS",
      "Power Systems"
    ],
    "glassdoorRating": 4.4,
    "reviewCount": 8900,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-power-grid-corporation-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Power Grid Corporation?",
        "answer": "Power Grid Corporation conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Power Grid Corporation offer graduate trainee programs?",
        "answer": "Yes, Power Grid Corporation offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/power-grid-corporation",
      "twitter": "https://x.com/POWERGRID",
      "wikipedia": "https://en.wikipedia.org/wiki/Power_Grid_Corporation"
    },
    "contactEmail": "careers@power-grid-corporation.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b93,10,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-ongc",
    "slug": "ongc",
    "name": "ONGC",
    "legalName": "ONGC",
    "ticker": "ONGC",
    "stockExchange": "NSE",
    "isin": "INE213A01029",
    "country": "India",
    "headquarters": "New Delhi, Delhi",
    "foundedYear": 1956,
    "industry": "Energy & Oil",
    "subIndustry": "Crude Oil & Natural Gas Exploration",
    "size": "10,000+",
    "employeeCount": "26,000+",
    "ownershipType": "Public",
    "website": "https://www.ongcindia.com",
    "careersUrl": "https://www.ongcindia.com/careers",
    "logo": "ONGC",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ongcindia.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Energy for India. Largest crude oil and natural gas company.",
    "shortDescription": "Oil and Natural Gas Corporation (ONGC) is an Indian central public sector undertaking under Ministry of Petroleum.",
    "overview": "Oil and Natural Gas Corporation (ONGC) is an Indian central public sector undertaking under Ministry of Petroleum. Operating as an enterprise market leader, ONGC employs over 26,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Crude Oil & Natural Gas Exploration.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Geophysics",
      "Python",
      "SAP",
      "Geology",
      "Petroleum Tech"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 15000,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-ongc-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at ONGC?",
        "answer": "ONGC conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does ONGC offer graduate trainee programs?",
        "answer": "Yes, ONGC offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/ongc",
      "twitter": "https://x.com/ONGC",
      "wikipedia": "https://en.wikipedia.org/wiki/ONGC"
    },
    "contactEmail": "careers@ongc.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b93,40,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-asian-paints",
    "slug": "asian-paints",
    "name": "Asian Paints",
    "legalName": "Asian Paints",
    "ticker": "ASIANPAINT",
    "stockExchange": "NSE",
    "isin": "INE021A01026",
    "country": "India",
    "headquarters": "Mumbai, Maharashtra",
    "foundedYear": 1942,
    "industry": "FMCG & Consumer Goods",
    "subIndustry": "Paints, Coatings & Home Decor",
    "size": "10,000+",
    "employeeCount": "8,000+",
    "ownershipType": "Public",
    "website": "https://www.asianpaints.com",
    "careersUrl": "https://www.asianpaints.com/careers.html",
    "logo": "ASIA",
    "logoUrl": "https://www.google.com/s2/favicons?domain=asianpaints.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Har Ghar Kuch Kehta Hai. India's leading paint company.",
    "shortDescription": "Asian Paints Limited is an Indian multinational paint company headquartered in Mumbai.",
    "overview": "Asian Paints Limited is an Indian multinational paint company headquartered in Mumbai. Operating as an enterprise market leader, Asian Paints employs over 8,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Paints, Coatings & Home Decor.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Python",
      "SAP",
      "React",
      "Node.js",
      "SQL"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 13400,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-asian-paints-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Asian Paints?",
        "answer": "Asian Paints conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Asian Paints offer graduate trainee programs?",
        "answer": "Yes, Asian Paints offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/asian-paints",
      "twitter": "https://x.com/ASIANPAINT",
      "wikipedia": "https://en.wikipedia.org/wiki/Asian_Paints"
    },
    "contactEmail": "careers@asian-paints.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b92,80,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-coal-india",
    "slug": "coal-india",
    "name": "Coal India",
    "legalName": "Coal India",
    "ticker": "COALINDIA",
    "stockExchange": "NSE",
    "isin": "INE522F01014",
    "country": "India",
    "headquarters": "Kolkata, West Bengal",
    "foundedYear": 1975,
    "industry": "Metals & Mining",
    "subIndustry": "Coal Mining & Energy Infrastructure",
    "size": "10,000+",
    "employeeCount": "239,000+",
    "ownershipType": "Public",
    "website": "https://www.coalindia.in",
    "careersUrl": "https://www.coalindia.in/careers",
    "logo": "COAL",
    "logoUrl": "https://www.google.com/s2/favicons?domain=coalindia.in&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Fuelling the Nation. World's largest coal producer.",
    "shortDescription": "Coal India Limited is an Indian central public sector undertaking under Ministry of Coal.",
    "overview": "Coal India Limited is an Indian central public sector undertaking under Ministry of Coal. Operating as an enterprise market leader, Coal India employs over 239,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Coal Mining & Energy Infrastructure.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Mining Tech",
      "SAP",
      "Python",
      "GIS",
      "AutoCAD"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 16200,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-coal-india-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Coal India?",
        "answer": "Coal India conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Coal India offer graduate trainee programs?",
        "answer": "Yes, Coal India offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/coal-india",
      "twitter": "https://x.com/COALINDIA",
      "wikipedia": "https://en.wikipedia.org/wiki/Coal_India"
    },
    "contactEmail": "careers@coal-india.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b92,90,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-tata-steel",
    "slug": "tata-steel",
    "name": "Tata Steel",
    "legalName": "Tata Steel",
    "ticker": "TATASTEEL",
    "stockExchange": "NSE",
    "isin": "INE081A01020",
    "country": "India",
    "headquarters": "Mumbai, Maharashtra",
    "foundedYear": 1907,
    "industry": "Metals & Mining",
    "subIndustry": "Steel Manufacturing & Metallurgy",
    "size": "10,000+",
    "employeeCount": "65,000+",
    "ownershipType": "Public",
    "website": "https://www.tatasteel.com",
    "careersUrl": "https://www.tatasteel.com/careers/",
    "logo": "TATA",
    "logoUrl": "https://www.google.com/s2/favicons?domain=tatasteel.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "We Also Make Tomorrow. Global steel manufacturing leader.",
    "shortDescription": "Tata Steel Limited is an Indian multinational steel-making company based in Jamshedpur and Mumbai.",
    "overview": "Tata Steel Limited is an Indian multinational steel-making company based in Jamshedpur and Mumbai. Operating as an enterprise market leader, Tata Steel employs over 65,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Steel Manufacturing & Metallurgy.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Metallurgy",
      "Python",
      "SAP",
      "AutoCAD",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 21000,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-tata-steel-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Tata Steel?",
        "answer": "Tata Steel conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Tata Steel offer graduate trainee programs?",
        "answer": "Yes, Tata Steel offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/tata-steel",
      "twitter": "https://x.com/TATASTEEL",
      "wikipedia": "https://en.wikipedia.org/wiki/Tata_Steel"
    },
    "contactEmail": "careers@tata-steel.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b92,10,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-bajaj-finserv",
    "slug": "bajaj-finserv",
    "name": "Bajaj Finserv",
    "legalName": "Bajaj Finserv",
    "ticker": "BAJAJFINSV",
    "stockExchange": "NSE",
    "isin": "INE918I01026",
    "country": "India",
    "headquarters": "Pune, Maharashtra",
    "foundedYear": 2007,
    "industry": "Banking & Finance",
    "subIndustry": "Financial Services, Insurance & Wealth",
    "size": "10,000+",
    "employeeCount": "65,000+",
    "ownershipType": "Public",
    "website": "https://www.bajajfinserv.in",
    "careersUrl": "https://www.bajajfinserv.in/careers",
    "logo": "BAJA",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bajajfinserv.in&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Complete financial solutions for every stage of life.",
    "shortDescription": "Bajaj Finserv Limited is an Indian non-banking financial services company focused on lending, asset management, and insurance.",
    "overview": "Bajaj Finserv Limited is an Indian non-banking financial services company focused on lending, asset management, and insurance. Operating as an enterprise market leader, Bajaj Finserv employs over 65,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Financial Services, Insurance & Wealth.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Java",
      "Python",
      "React",
      "Spring",
      "AWS"
    ],
    "glassdoorRating": 4.1,
    "reviewCount": 14000,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-bajaj-finserv-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Bajaj Finserv?",
        "answer": "Bajaj Finserv conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Bajaj Finserv offer graduate trainee programs?",
        "answer": "Yes, Bajaj Finserv offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/bajaj-finserv",
      "twitter": "https://x.com/BAJAJFINSV",
      "wikipedia": "https://en.wikipedia.org/wiki/Bajaj_Finserv"
    },
    "contactEmail": "careers@bajaj-finserv.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b92,60,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-adani-ports",
    "slug": "adani-ports",
    "name": "Adani Ports",
    "legalName": "Adani Ports",
    "ticker": "ADANIPORTS",
    "stockExchange": "NSE",
    "isin": "INE742H01013",
    "country": "India",
    "headquarters": "Ahmedabad, Gujarat",
    "foundedYear": 1998,
    "industry": "Infrastructure & Engineering",
    "subIndustry": "Ports, Logistics & SEZ Infrastructure",
    "size": "10,000+",
    "employeeCount": "3,000+",
    "ownershipType": "Public",
    "website": "https://www.adaniports.com",
    "careersUrl": "https://www.adaniports.com/careers",
    "logo": "ADAN",
    "logoUrl": "https://www.google.com/s2/favicons?domain=adaniports.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Building World-Class Infrastructure. India's largest private port operator.",
    "shortDescription": "Adani Ports and Special Economic Zone Limited (APSEZ) is India's largest commercial port operator.",
    "overview": "Adani Ports and Special Economic Zone Limited (APSEZ) is India's largest commercial port operator. Operating as an enterprise market leader, Adani Ports employs over 3,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Ports, Logistics & SEZ Infrastructure.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Logistics Tech",
      "SAP",
      "Python",
      "GIS",
      "AutoCAD"
    ],
    "glassdoorRating": 4.1,
    "reviewCount": 8500,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-adani-ports-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Adani Ports?",
        "answer": "Adani Ports conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Adani Ports offer graduate trainee programs?",
        "answer": "Yes, Adani Ports offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/adani-ports",
      "twitter": "https://x.com/ADANIPORTS",
      "wikipedia": "https://en.wikipedia.org/wiki/Adani_Ports"
    },
    "contactEmail": "careers@adani-ports.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b93,10,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-tech-mahindra",
    "slug": "tech-mahindra",
    "name": "Tech Mahindra",
    "legalName": "Tech Mahindra",
    "ticker": "TECHM",
    "stockExchange": "NSE",
    "isin": "INE669C01036",
    "country": "India",
    "headquarters": "Pune, Maharashtra",
    "foundedYear": 1986,
    "industry": "Information Technology",
    "subIndustry": "Telecom IT & Digital Transformation",
    "size": "10,000+",
    "employeeCount": "145,000+",
    "ownershipType": "Public",
    "website": "https://www.techmahindra.com",
    "careersUrl": "https://www.techmahindra.com/careers",
    "logo": "TECH",
    "logoUrl": "https://www.google.com/s2/favicons?domain=techmahindra.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Connected World. Connected Experiences. Global IT consulting provider.",
    "shortDescription": "Tech Mahindra is an Indian multinational information technology services and consulting company.",
    "overview": "Tech Mahindra is an Indian multinational information technology services and consulting company. Operating as an enterprise market leader, Tech Mahindra employs over 145,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Telecom IT & Digital Transformation.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Java",
      "Python",
      "5G Tech",
      "AWS",
      "Azure"
    ],
    "glassdoorRating": 3.7,
    "reviewCount": 29000,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-tech-mahindra-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Tech Mahindra?",
        "answer": "Tech Mahindra conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Tech Mahindra offer graduate trainee programs?",
        "answer": "Yes, Tech Mahindra offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/tech-mahindra",
      "twitter": "https://x.com/TECHM",
      "wikipedia": "https://en.wikipedia.org/wiki/Tech_Mahindra"
    },
    "contactEmail": "careers@tech-mahindra.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b91,40,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  },
  {
    "id": "nifty-wipro-limited",
    "slug": "wipro-limited",
    "name": "Wipro Limited",
    "legalName": "Wipro Limited",
    "ticker": "WIPRO",
    "stockExchange": "NSE",
    "isin": "INE075A01022",
    "country": "India",
    "headquarters": "Bengaluru, Karnataka",
    "foundedYear": 1945,
    "industry": "Information Technology",
    "subIndustry": "Cloud Services & IT Infrastructure",
    "size": "10,000+",
    "employeeCount": "234,000+",
    "ownershipType": "Public",
    "website": "https://www.wipro.com",
    "careersUrl": "https://www.wipro.com/careers",
    "logo": "WIPR",
    "logoUrl": "https://www.google.com/s2/favicons?domain=wipro.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Ambition Realized. Leading technology services and consulting company.",
    "shortDescription": "Wipro Limited is a leading global information technology, consulting and business process services company.",
    "overview": "Wipro Limited is a leading global information technology, consulting and business process services company. Operating as an enterprise market leader, Wipro Limited employs over 234,000+ professionals across regional and global operations.",
    "mission": "To empower industries and communities through excellence in Cloud Services & IT Infrastructure.",
    "vision": "Leading industrial and digital growth through world-class engineering and customer trust.",
    "values": [
      "Trust",
      "Integrity",
      "Excellence",
      "Sustainability",
      "Nation Building"
    ],
    "techStack": [
      "Java",
      "Python",
      "React",
      "AWS",
      "Azure"
    ],
    "glassdoorRating": 3.7,
    "reviewCount": 48000,
    "benefits": [
      {
        "title": "PF & Gratuity Benefits",
        "description": "Complete provident fund and retirement gratuity plan.",
        "category": "Financial & Stock"
      },
      {
        "title": "Family Health Coverage",
        "description": "Medical insurance for employee, spouse, and children.",
        "category": "Health & Medical"
      },
      {
        "title": "Workplace Learning",
        "description": "Corporate leadership programs and technical skill tracks.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-wipro-limited-1",
        "role": "Senior Manager",
        "rating": 4.5,
        "pros": "High job security, strong brand reputation, great work-life balance.",
        "cons": "Process driven environment.",
        "date": "2026-05-18",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "What is the hiring process at Wipro Limited?",
        "answer": "Wipro Limited conducts online technical assessments, domain interview rounds, and HR cultural alignment interviews."
      },
      {
        "question": "Does Wipro Limited offer graduate trainee programs?",
        "answer": "Yes, Wipro Limited offers structured Graduate Engineer Trainee (GET) and Management Trainee (MT) campus programs."
      }
    ],
    "openJobsCount": 10,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/wipro-limited",
      "twitter": "https://x.com/WIPRO",
      "wikipedia": "https://en.wikipedia.org/wiki/Wipro_Limited"
    },
    "contactEmail": "careers@wipro-limited.co.in",
    "contactPhone": "+91 (22) 6600-0000",
    "marketCap": "\u20b92,70,000 Cr",
    "currency": "INR",
    "verified": true,
    "featured": true
  }
];

export function slugifyCompany(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findCompanyBySlug(slug: string): Company | undefined {
  const clean = slug.toLowerCase().trim();
  return companiesData.find(
    (c) => c.slug === clean || c.id === clean || slugifyCompany(c.name) === clean
  );
}

