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
    "id": "ent-apple",
    "slug": "apple",
    "name": "Apple",
    "legalName": "Apple Corporation",
    "ticker": "AAPL",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "Cupertino, CA, USA",
    "foundedYear": 1976,
    "industry": "Information Technology",
    "subIndustry": "Consumer Electronics & Software",
    "size": "10,000+",
    "employeeCount": "161,000+",
    "ownershipType": "Public",
    "website": "https://www.apple.com",
    "careersUrl": "https://www.apple.com",
    "logo": "AAPL",
    "logoUrl": "https://www.google.com/s2/favicons?domain=apple.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Consumer Electronics & Software.",
    "shortDescription": "Verified company profile and career opportunities at Apple.",
    "overview": "Apple is a global market leader operating in Information Technology with a focus on Consumer Electronics & Software. Headquartered in Cupertino, CA, USA and founded in 1976, Apple employs over 161,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-apple-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Apple.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Apple?",
        "answer": "You can explore active verified openings at Apple directly on WorkoraJobs or visit their official careers portal at https://www.apple.com."
      },
      {
        "question": "Does Apple offer remote work or internship roles?",
        "answer": "Yes, Apple offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/apple",
      "twitter": "https://x.com/apple",
      "wikipedia": "https://en.wikipedia.org/wiki/Apple"
    },
    "contactEmail": "careers@apple.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-microsoft",
    "slug": "microsoft",
    "name": "Microsoft",
    "legalName": "Microsoft Corporation",
    "ticker": "MSFT",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "Redmond, WA, USA",
    "foundedYear": 1975,
    "industry": "Information Technology",
    "subIndustry": "Enterprise Cloud & Software",
    "size": "10,000+",
    "employeeCount": "221,000+",
    "ownershipType": "Public",
    "website": "https://www.microsoft.com",
    "careersUrl": "https://www.microsoft.com",
    "logo": "MSFT",
    "logoUrl": "https://www.google.com/s2/favicons?domain=microsoft.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Enterprise Cloud & Software.",
    "shortDescription": "Verified company profile and career opportunities at Microsoft.",
    "overview": "Microsoft is a global market leader operating in Information Technology with a focus on Enterprise Cloud & Software. Headquartered in Redmond, WA, USA and founded in 1975, Microsoft employs over 221,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-microsoft-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Microsoft.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Microsoft?",
        "answer": "You can explore active verified openings at Microsoft directly on WorkoraJobs or visit their official careers portal at https://www.microsoft.com."
      },
      {
        "question": "Does Microsoft offer remote work or internship roles?",
        "answer": "Yes, Microsoft offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/microsoft",
      "twitter": "https://x.com/microsoft",
      "wikipedia": "https://en.wikipedia.org/wiki/Microsoft"
    },
    "contactEmail": "careers@microsoft.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-google",
    "slug": "google",
    "name": "Google",
    "legalName": "Google Corporation",
    "ticker": "GOOGL",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "Mountain View, CA, USA",
    "foundedYear": 1998,
    "industry": "Information Technology",
    "subIndustry": "Search, Cloud & Artificial Intelligence",
    "size": "10,000+",
    "employeeCount": "182,000+",
    "ownershipType": "Public",
    "website": "https://www.google.com",
    "careersUrl": "https://www.google.com",
    "logo": "GOOG",
    "logoUrl": "https://www.google.com/s2/favicons?domain=google.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Search, Cloud & Artificial Intelligence.",
    "shortDescription": "Verified company profile and career opportunities at Google.",
    "overview": "Google is a global market leader operating in Information Technology with a focus on Search, Cloud & Artificial Intelligence. Headquartered in Mountain View, CA, USA and founded in 1998, Google employs over 182,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-google-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Google.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Google?",
        "answer": "You can explore active verified openings at Google directly on WorkoraJobs or visit their official careers portal at https://www.google.com."
      },
      {
        "question": "Does Google offer remote work or internship roles?",
        "answer": "Yes, Google offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/google",
      "twitter": "https://x.com/google",
      "wikipedia": "https://en.wikipedia.org/wiki/Google"
    },
    "contactEmail": "careers@google.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-amazon",
    "slug": "amazon",
    "name": "Amazon",
    "legalName": "Amazon Corporation",
    "ticker": "AMZN",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "Seattle, WA, USA",
    "foundedYear": 1994,
    "industry": "E-Commerce & Cloud Computing",
    "subIndustry": "Cloud Services (AWS) & Logistics",
    "size": "10,000+",
    "employeeCount": "1,525,000+",
    "ownershipType": "Public",
    "website": "https://www.amazon.com",
    "careersUrl": "https://www.amazon.com",
    "logo": "AMZN",
    "logoUrl": "https://www.google.com/s2/favicons?domain=amazon.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Cloud Services (AWS) & Logistics.",
    "shortDescription": "Verified company profile and career opportunities at Amazon.",
    "overview": "Amazon is a global market leader operating in E-Commerce & Cloud Computing with a focus on Cloud Services (AWS) & Logistics. Headquartered in Seattle, WA, USA and founded in 1994, Amazon employs over 1,525,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in E-Commerce & Cloud Computing.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-amazon-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Amazon.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Amazon?",
        "answer": "You can explore active verified openings at Amazon directly on WorkoraJobs or visit their official careers portal at https://www.amazon.com."
      },
      {
        "question": "Does Amazon offer remote work or internship roles?",
        "answer": "Yes, Amazon offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/amazon",
      "twitter": "https://x.com/amazon",
      "wikipedia": "https://en.wikipedia.org/wiki/Amazon"
    },
    "contactEmail": "careers@amazon.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-meta",
    "slug": "meta",
    "name": "Meta",
    "legalName": "Meta Corporation",
    "ticker": "META",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "Menlo Park, CA, USA",
    "foundedYear": 2004,
    "industry": "Information Technology",
    "subIndustry": "Social Technologies & AI Infrastructure",
    "size": "10,000+",
    "employeeCount": "67,000+",
    "ownershipType": "Public",
    "website": "https://www.meta.com",
    "careersUrl": "https://www.meta.com",
    "logo": "META",
    "logoUrl": "https://www.google.com/s2/favicons?domain=meta.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Social Technologies & AI Infrastructure.",
    "shortDescription": "Verified company profile and career opportunities at Meta.",
    "overview": "Meta is a global market leader operating in Information Technology with a focus on Social Technologies & AI Infrastructure. Headquartered in Menlo Park, CA, USA and founded in 2004, Meta employs over 67,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-meta-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Meta.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Meta?",
        "answer": "You can explore active verified openings at Meta directly on WorkoraJobs or visit their official careers portal at https://www.meta.com."
      },
      {
        "question": "Does Meta offer remote work or internship roles?",
        "answer": "Yes, Meta offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/meta",
      "twitter": "https://x.com/meta",
      "wikipedia": "https://en.wikipedia.org/wiki/Meta"
    },
    "contactEmail": "careers@meta.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-nvidia",
    "slug": "nvidia",
    "name": "NVIDIA",
    "legalName": "NVIDIA Corporation",
    "ticker": "NVDA",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "Santa Clara, CA, USA",
    "foundedYear": 1993,
    "industry": "Semiconductors & AI Hardware",
    "subIndustry": "Accelerated Computing & GPUs",
    "size": "10,000+",
    "employeeCount": "29,600+",
    "ownershipType": "Public",
    "website": "https://www.nvidia.com",
    "careersUrl": "https://www.nvidia.com",
    "logo": "NVDA",
    "logoUrl": "https://www.google.com/s2/favicons?domain=nvidia.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Accelerated Computing & GPUs.",
    "shortDescription": "Verified company profile and career opportunities at NVIDIA.",
    "overview": "NVIDIA is a global market leader operating in Semiconductors & AI Hardware with a focus on Accelerated Computing & GPUs. Headquartered in Santa Clara, CA, USA and founded in 1993, NVIDIA employs over 29,600+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Semiconductors & AI Hardware.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-nvidia-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at NVIDIA.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at NVIDIA?",
        "answer": "You can explore active verified openings at NVIDIA directly on WorkoraJobs or visit their official careers portal at https://www.nvidia.com."
      },
      {
        "question": "Does NVIDIA offer remote work or internship roles?",
        "answer": "Yes, NVIDIA offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/nvidia",
      "twitter": "https://x.com/nvidia",
      "wikipedia": "https://en.wikipedia.org/wiki/NVIDIA"
    },
    "contactEmail": "careers@nvidia.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-adobe",
    "slug": "adobe",
    "name": "Adobe",
    "legalName": "Adobe Corporation",
    "ticker": "ADBE",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "San Jose, CA, USA",
    "foundedYear": 1982,
    "industry": "Information Technology",
    "subIndustry": "Digital Media & Creative Cloud Software",
    "size": "10,000+",
    "employeeCount": "29,000+",
    "ownershipType": "Public",
    "website": "https://www.adobe.com",
    "careersUrl": "https://www.adobe.com",
    "logo": "ADBE",
    "logoUrl": "https://www.google.com/s2/favicons?domain=adobe.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Digital Media & Creative Cloud Software.",
    "shortDescription": "Verified company profile and career opportunities at Adobe.",
    "overview": "Adobe is a global market leader operating in Information Technology with a focus on Digital Media & Creative Cloud Software. Headquartered in San Jose, CA, USA and founded in 1982, Adobe employs over 29,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-adobe-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Adobe.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Adobe?",
        "answer": "You can explore active verified openings at Adobe directly on WorkoraJobs or visit their official careers portal at https://www.adobe.com."
      },
      {
        "question": "Does Adobe offer remote work or internship roles?",
        "answer": "Yes, Adobe offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/adobe",
      "twitter": "https://x.com/adobe",
      "wikipedia": "https://en.wikipedia.org/wiki/Adobe"
    },
    "contactEmail": "careers@adobe.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-salesforce",
    "slug": "salesforce",
    "name": "Salesforce",
    "legalName": "Salesforce Corporation",
    "ticker": "CRM",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "San Francisco, CA, USA",
    "foundedYear": 1999,
    "industry": "Information Technology",
    "subIndustry": "Enterprise CRM & Cloud Solutions",
    "size": "10,000+",
    "employeeCount": "72,000+",
    "ownershipType": "Public",
    "website": "https://www.salesforce.com",
    "careersUrl": "https://www.salesforce.com",
    "logo": "CRM",
    "logoUrl": "https://www.google.com/s2/favicons?domain=salesforce.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Enterprise CRM & Cloud Solutions.",
    "shortDescription": "Verified company profile and career opportunities at Salesforce.",
    "overview": "Salesforce is a global market leader operating in Information Technology with a focus on Enterprise CRM & Cloud Solutions. Headquartered in San Francisco, CA, USA and founded in 1999, Salesforce employs over 72,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-salesforce-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Salesforce.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Salesforce?",
        "answer": "You can explore active verified openings at Salesforce directly on WorkoraJobs or visit their official careers portal at https://www.salesforce.com."
      },
      {
        "question": "Does Salesforce offer remote work or internship roles?",
        "answer": "Yes, Salesforce offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/salesforce",
      "twitter": "https://x.com/salesforce",
      "wikipedia": "https://en.wikipedia.org/wiki/Salesforce"
    },
    "contactEmail": "careers@salesforce.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-oracle",
    "slug": "oracle",
    "name": "Oracle",
    "legalName": "Oracle Corporation",
    "ticker": "ORCL",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Austin, TX, USA",
    "foundedYear": 1977,
    "industry": "Information Technology",
    "subIndustry": "Database Software & Cloud Infrastructure",
    "size": "10,000+",
    "employeeCount": "159,000+",
    "ownershipType": "Public",
    "website": "https://www.oracle.com",
    "careersUrl": "https://www.oracle.com",
    "logo": "ORCL",
    "logoUrl": "https://www.google.com/s2/favicons?domain=oracle.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Database Software & Cloud Infrastructure.",
    "shortDescription": "Verified company profile and career opportunities at Oracle.",
    "overview": "Oracle is a global market leader operating in Information Technology with a focus on Database Software & Cloud Infrastructure. Headquartered in Austin, TX, USA and founded in 1977, Oracle employs over 159,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-oracle-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Oracle.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Oracle?",
        "answer": "You can explore active verified openings at Oracle directly on WorkoraJobs or visit their official careers portal at https://www.oracle.com."
      },
      {
        "question": "Does Oracle offer remote work or internship roles?",
        "answer": "Yes, Oracle offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/oracle",
      "twitter": "https://x.com/oracle",
      "wikipedia": "https://en.wikipedia.org/wiki/Oracle"
    },
    "contactEmail": "careers@oracle.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-ibm",
    "slug": "ibm",
    "name": "IBM",
    "legalName": "IBM Corporation",
    "ticker": "IBM",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Armonk, NY, USA",
    "foundedYear": 1911,
    "industry": "Information Technology",
    "subIndustry": "Hybrid Cloud & Cognitive IT Systems",
    "size": "10,000+",
    "employeeCount": "282,000+",
    "ownershipType": "Public",
    "website": "https://www.ibm.com",
    "careersUrl": "https://www.ibm.com",
    "logo": "IBM",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ibm.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Hybrid Cloud & Cognitive IT Systems.",
    "shortDescription": "Verified company profile and career opportunities at IBM.",
    "overview": "IBM is a global market leader operating in Information Technology with a focus on Hybrid Cloud & Cognitive IT Systems. Headquartered in Armonk, NY, USA and founded in 1911, IBM employs over 282,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-ibm-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at IBM.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at IBM?",
        "answer": "You can explore active verified openings at IBM directly on WorkoraJobs or visit their official careers portal at https://www.ibm.com."
      },
      {
        "question": "Does IBM offer remote work or internship roles?",
        "answer": "Yes, IBM offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/ibm",
      "twitter": "https://x.com/ibm",
      "wikipedia": "https://en.wikipedia.org/wiki/IBM"
    },
    "contactEmail": "careers@ibm.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-intel",
    "slug": "intel",
    "name": "Intel",
    "legalName": "Intel Corporation",
    "ticker": "INTC",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "Santa Clara, CA, USA",
    "foundedYear": 1968,
    "industry": "Semiconductors",
    "subIndustry": "Silicon Processors & Semiconductor Foundry",
    "size": "10,000+",
    "employeeCount": "124,000+",
    "ownershipType": "Public",
    "website": "https://www.intel.com",
    "careersUrl": "https://www.intel.com",
    "logo": "INTC",
    "logoUrl": "https://www.google.com/s2/favicons?domain=intel.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Silicon Processors & Semiconductor Foundry.",
    "shortDescription": "Verified company profile and career opportunities at Intel.",
    "overview": "Intel is a global market leader operating in Semiconductors with a focus on Silicon Processors & Semiconductor Foundry. Headquartered in Santa Clara, CA, USA and founded in 1968, Intel employs over 124,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Semiconductors.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-intel-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Intel.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Intel?",
        "answer": "You can explore active verified openings at Intel directly on WorkoraJobs or visit their official careers portal at https://www.intel.com."
      },
      {
        "question": "Does Intel offer remote work or internship roles?",
        "answer": "Yes, Intel offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/intel",
      "twitter": "https://x.com/intel",
      "wikipedia": "https://en.wikipedia.org/wiki/Intel"
    },
    "contactEmail": "careers@intel.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-amd",
    "slug": "amd",
    "name": "AMD",
    "legalName": "AMD Corporation",
    "ticker": "AMD",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "Santa Clara, CA, USA",
    "foundedYear": 1969,
    "industry": "Semiconductors",
    "subIndustry": "High-Performance Processors & Graphics",
    "size": "10,000+",
    "employeeCount": "26,000+",
    "ownershipType": "Public",
    "website": "https://www.amd.com",
    "careersUrl": "https://www.amd.com",
    "logo": "AMD",
    "logoUrl": "https://www.google.com/s2/favicons?domain=amd.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in High-Performance Processors & Graphics.",
    "shortDescription": "Verified company profile and career opportunities at AMD.",
    "overview": "AMD is a global market leader operating in Semiconductors with a focus on High-Performance Processors & Graphics. Headquartered in Santa Clara, CA, USA and founded in 1969, AMD employs over 26,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Semiconductors.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-amd-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at AMD.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at AMD?",
        "answer": "You can explore active verified openings at AMD directly on WorkoraJobs or visit their official careers portal at https://www.amd.com."
      },
      {
        "question": "Does AMD offer remote work or internship roles?",
        "answer": "Yes, AMD offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/amd",
      "twitter": "https://x.com/amd",
      "wikipedia": "https://en.wikipedia.org/wiki/AMD"
    },
    "contactEmail": "careers@amd.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-cisco",
    "slug": "cisco",
    "name": "Cisco",
    "legalName": "Cisco Corporation",
    "ticker": "CSCO",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "San Jose, CA, USA",
    "foundedYear": 1984,
    "industry": "Telecommunications & IT",
    "subIndustry": "Enterprise Networking & Cybersecurity",
    "size": "10,000+",
    "employeeCount": "84,000+",
    "ownershipType": "Public",
    "website": "https://www.cisco.com",
    "careersUrl": "https://www.cisco.com",
    "logo": "CSCO",
    "logoUrl": "https://www.google.com/s2/favicons?domain=cisco.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Enterprise Networking & Cybersecurity.",
    "shortDescription": "Verified company profile and career opportunities at Cisco.",
    "overview": "Cisco is a global market leader operating in Telecommunications & IT with a focus on Enterprise Networking & Cybersecurity. Headquartered in San Jose, CA, USA and founded in 1984, Cisco employs over 84,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Telecommunications & IT.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "JavaScript",
      "SQL",
      "SAP",
      "Cloud Infrastructure",
      "React"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-cisco-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Cisco.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Cisco?",
        "answer": "You can explore active verified openings at Cisco directly on WorkoraJobs or visit their official careers portal at https://www.cisco.com."
      },
      {
        "question": "Does Cisco offer remote work or internship roles?",
        "answer": "Yes, Cisco offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/cisco",
      "twitter": "https://x.com/cisco",
      "wikipedia": "https://en.wikipedia.org/wiki/Cisco"
    },
    "contactEmail": "careers@cisco.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-dell",
    "slug": "dell",
    "name": "Dell Technologies",
    "legalName": "Dell Technologies Corporation",
    "ticker": "DELL",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Round Rock, TX, USA",
    "foundedYear": 1984,
    "industry": "Information Technology",
    "subIndustry": "Enterprise Servers & Personal Computers",
    "size": "10,000+",
    "employeeCount": "120,000+",
    "ownershipType": "Public",
    "website": "https://www.dell.com",
    "careersUrl": "https://www.dell.com",
    "logo": "DELL",
    "logoUrl": "https://www.google.com/s2/favicons?domain=dell.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Enterprise Servers & Personal Computers.",
    "shortDescription": "Verified company profile and career opportunities at Dell Technologies.",
    "overview": "Dell Technologies is a global market leader operating in Information Technology with a focus on Enterprise Servers & Personal Computers. Headquartered in Round Rock, TX, USA and founded in 1984, Dell Technologies employs over 120,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-dell-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Dell Technologies.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Dell Technologies?",
        "answer": "You can explore active verified openings at Dell Technologies directly on WorkoraJobs or visit their official careers portal at https://www.dell.com."
      },
      {
        "question": "Does Dell Technologies offer remote work or internship roles?",
        "answer": "Yes, Dell Technologies offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/dell",
      "twitter": "https://x.com/dell",
      "wikipedia": "https://en.wikipedia.org/wiki/Dell_Technologies"
    },
    "contactEmail": "careers@dell.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-hp",
    "slug": "hp",
    "name": "HP",
    "legalName": "HP Corporation",
    "ticker": "HPQ",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Palo Alto, CA, USA",
    "foundedYear": 1939,
    "industry": "Information Technology",
    "subIndustry": "Personal Computing & Printing Solutions",
    "size": "10,000+",
    "employeeCount": "58,000+",
    "ownershipType": "Public",
    "website": "https://www.hp.com",
    "careersUrl": "https://www.hp.com",
    "logo": "HPQ",
    "logoUrl": "https://www.google.com/s2/favicons?domain=hp.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Personal Computing & Printing Solutions.",
    "shortDescription": "Verified company profile and career opportunities at HP.",
    "overview": "HP is a global market leader operating in Information Technology with a focus on Personal Computing & Printing Solutions. Headquartered in Palo Alto, CA, USA and founded in 1939, HP employs over 58,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-hp-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at HP.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at HP?",
        "answer": "You can explore active verified openings at HP directly on WorkoraJobs or visit their official careers portal at https://www.hp.com."
      },
      {
        "question": "Does HP offer remote work or internship roles?",
        "answer": "Yes, HP offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/hp",
      "twitter": "https://x.com/hp",
      "wikipedia": "https://en.wikipedia.org/wiki/HP"
    },
    "contactEmail": "careers@hp.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-samsung",
    "slug": "samsung",
    "name": "Samsung Electronics",
    "legalName": "Samsung Electronics Corporation",
    "ticker": "005930",
    "stockExchange": "KRX",
    "country": "South Korea",
    "headquarters": "Suwon, South Korea",
    "foundedYear": 1969,
    "industry": "Consumer Electronics & Tech",
    "subIndustry": "Memory Chips, Displays & Smartphones",
    "size": "10,000+",
    "employeeCount": "270,000+",
    "ownershipType": "Public",
    "website": "https://www.samsung.com",
    "careersUrl": "https://www.samsung.com",
    "logo": "SAMS",
    "logoUrl": "https://www.google.com/s2/favicons?domain=samsung.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Memory Chips, Displays & Smartphones.",
    "shortDescription": "Verified company profile and career opportunities at Samsung Electronics.",
    "overview": "Samsung Electronics is a global market leader operating in Consumer Electronics & Tech with a focus on Memory Chips, Displays & Smartphones. Headquartered in Suwon, South Korea and founded in 1969, Samsung Electronics employs over 270,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Consumer Electronics & Tech.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-samsung-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Samsung Electronics.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Samsung Electronics?",
        "answer": "You can explore active verified openings at Samsung Electronics directly on WorkoraJobs or visit their official careers portal at https://www.samsung.com."
      },
      {
        "question": "Does Samsung Electronics offer remote work or internship roles?",
        "answer": "Yes, Samsung Electronics offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/samsung",
      "twitter": "https://x.com/samsung",
      "wikipedia": "https://en.wikipedia.org/wiki/Samsung_Electronics"
    },
    "contactEmail": "careers@samsung.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-sony",
    "slug": "sony",
    "name": "Sony",
    "legalName": "Sony Corporation",
    "ticker": "SONY",
    "stockExchange": "NYSE",
    "country": "Japan",
    "headquarters": "Tokyo, Japan",
    "foundedYear": 1946,
    "industry": "Consumer Electronics & Entertainment",
    "subIndustry": "Gaming, Music & Image Sensors",
    "size": "10,000+",
    "employeeCount": "113,000+",
    "ownershipType": "Public",
    "website": "https://www.sony.com",
    "careersUrl": "https://www.sony.com",
    "logo": "SONY",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sony.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Gaming, Music & Image Sensors.",
    "shortDescription": "Verified company profile and career opportunities at Sony.",
    "overview": "Sony is a global market leader operating in Consumer Electronics & Entertainment with a focus on Gaming, Music & Image Sensors. Headquartered in Tokyo, Japan and founded in 1946, Sony employs over 113,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Consumer Electronics & Entertainment.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "JavaScript",
      "SQL",
      "SAP",
      "Cloud Infrastructure",
      "React"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-sony-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Sony.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Sony?",
        "answer": "You can explore active verified openings at Sony directly on WorkoraJobs or visit their official careers portal at https://www.sony.com."
      },
      {
        "question": "Does Sony offer remote work or internship roles?",
        "answer": "Yes, Sony offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/sony",
      "twitter": "https://x.com/sony",
      "wikipedia": "https://en.wikipedia.org/wiki/Sony"
    },
    "contactEmail": "careers@sony.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-sap",
    "slug": "sap",
    "name": "SAP",
    "legalName": "SAP Corporation",
    "ticker": "SAP",
    "stockExchange": "NYSE",
    "country": "Germany",
    "headquarters": "Walldorf, Germany",
    "foundedYear": 1972,
    "industry": "Information Technology",
    "subIndustry": "Enterprise Resource Planning (ERP)",
    "size": "10,000+",
    "employeeCount": "107,000+",
    "ownershipType": "Public",
    "website": "https://www.sap.com",
    "careersUrl": "https://www.sap.com",
    "logo": "SAP",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sap.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Enterprise Resource Planning (ERP).",
    "shortDescription": "Verified company profile and career opportunities at SAP.",
    "overview": "SAP is a global market leader operating in Information Technology with a focus on Enterprise Resource Planning (ERP). Headquartered in Walldorf, Germany and founded in 1972, SAP employs over 107,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-sap-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at SAP.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at SAP?",
        "answer": "You can explore active verified openings at SAP directly on WorkoraJobs or visit their official careers portal at https://www.sap.com."
      },
      {
        "question": "Does SAP offer remote work or internship roles?",
        "answer": "Yes, SAP offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/sap",
      "twitter": "https://x.com/sap",
      "wikipedia": "https://en.wikipedia.org/wiki/SAP"
    },
    "contactEmail": "careers@sap.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-servicenow",
    "slug": "servicenow",
    "name": "ServiceNow",
    "legalName": "ServiceNow Corporation",
    "ticker": "NOW",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Santa Clara, CA, USA",
    "foundedYear": 2004,
    "industry": "Information Technology",
    "subIndustry": "Digital Workflow Automation",
    "size": "10,000+",
    "employeeCount": "23,000+",
    "ownershipType": "Public",
    "website": "https://www.servicenow.com",
    "careersUrl": "https://www.servicenow.com",
    "logo": "NOW",
    "logoUrl": "https://www.google.com/s2/favicons?domain=servicenow.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Digital Workflow Automation.",
    "shortDescription": "Verified company profile and career opportunities at ServiceNow.",
    "overview": "ServiceNow is a global market leader operating in Information Technology with a focus on Digital Workflow Automation. Headquartered in Santa Clara, CA, USA and founded in 2004, ServiceNow employs over 23,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-servicenow-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at ServiceNow.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at ServiceNow?",
        "answer": "You can explore active verified openings at ServiceNow directly on WorkoraJobs or visit their official careers portal at https://www.servicenow.com."
      },
      {
        "question": "Does ServiceNow offer remote work or internship roles?",
        "answer": "Yes, ServiceNow offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/servicenow",
      "twitter": "https://x.com/servicenow",
      "wikipedia": "https://en.wikipedia.org/wiki/ServiceNow"
    },
    "contactEmail": "careers@servicenow.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-shopify",
    "slug": "shopify",
    "name": "Shopify",
    "legalName": "Shopify Corporation",
    "ticker": "SHOP",
    "stockExchange": "NYSE",
    "country": "Canada",
    "headquarters": "Ottawa, Canada",
    "foundedYear": 2006,
    "industry": "E-Commerce & Tech",
    "subIndustry": "E-Commerce Infrastructure & Merchant Solutions",
    "size": "10,000+",
    "employeeCount": "8,300+",
    "ownershipType": "Public",
    "website": "https://www.shopify.com",
    "careersUrl": "https://www.shopify.com",
    "logo": "SHOP",
    "logoUrl": "https://www.google.com/s2/favicons?domain=shopify.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in E-Commerce Infrastructure & Merchant Solutions.",
    "shortDescription": "Verified company profile and career opportunities at Shopify.",
    "overview": "Shopify is a global market leader operating in E-Commerce & Tech with a focus on E-Commerce Infrastructure & Merchant Solutions. Headquartered in Ottawa, Canada and founded in 2006, Shopify employs over 8,300+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in E-Commerce & Tech.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-shopify-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Shopify.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Shopify?",
        "answer": "You can explore active verified openings at Shopify directly on WorkoraJobs or visit their official careers portal at https://www.shopify.com."
      },
      {
        "question": "Does Shopify offer remote work or internship roles?",
        "answer": "Yes, Shopify offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/shopify",
      "twitter": "https://x.com/shopify",
      "wikipedia": "https://en.wikipedia.org/wiki/Shopify"
    },
    "contactEmail": "careers@shopify.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-netflix",
    "slug": "netflix",
    "name": "Netflix",
    "legalName": "Netflix Corporation",
    "ticker": "NFLX",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "Los Gatos, CA, USA",
    "foundedYear": 1997,
    "industry": "Media & Technology",
    "subIndustry": "Streaming Entertainment & Content Engineering",
    "size": "10,000+",
    "employeeCount": "13,000+",
    "ownershipType": "Public",
    "website": "https://www.netflix.com",
    "careersUrl": "https://www.netflix.com",
    "logo": "NFLX",
    "logoUrl": "https://www.google.com/s2/favicons?domain=netflix.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Streaming Entertainment & Content Engineering.",
    "shortDescription": "Verified company profile and career opportunities at Netflix.",
    "overview": "Netflix is a global market leader operating in Media & Technology with a focus on Streaming Entertainment & Content Engineering. Headquartered in Los Gatos, CA, USA and founded in 1997, Netflix employs over 13,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Media & Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-netflix-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Netflix.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Netflix?",
        "answer": "You can explore active verified openings at Netflix directly on WorkoraJobs or visit their official careers portal at https://www.netflix.com."
      },
      {
        "question": "Does Netflix offer remote work or internship roles?",
        "answer": "Yes, Netflix offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/netflix",
      "twitter": "https://x.com/netflix",
      "wikipedia": "https://en.wikipedia.org/wiki/Netflix"
    },
    "contactEmail": "careers@netflix.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-spotify",
    "slug": "spotify",
    "name": "Spotify",
    "legalName": "Spotify Corporation",
    "ticker": "SPOT",
    "stockExchange": "NYSE",
    "country": "Sweden",
    "headquarters": "Stockholm, Sweden",
    "foundedYear": 2006,
    "industry": "Media & Technology",
    "subIndustry": "Audio Streaming & Content Personalization",
    "size": "10,000+",
    "employeeCount": "8,500+",
    "ownershipType": "Public",
    "website": "https://www.spotify.com",
    "careersUrl": "https://www.spotify.com",
    "logo": "SPOT",
    "logoUrl": "https://www.google.com/s2/favicons?domain=spotify.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Audio Streaming & Content Personalization.",
    "shortDescription": "Verified company profile and career opportunities at Spotify.",
    "overview": "Spotify is a global market leader operating in Media & Technology with a focus on Audio Streaming & Content Personalization. Headquartered in Stockholm, Sweden and founded in 2006, Spotify employs over 8,500+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Media & Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-spotify-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Spotify.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Spotify?",
        "answer": "You can explore active verified openings at Spotify directly on WorkoraJobs or visit their official careers portal at https://www.spotify.com."
      },
      {
        "question": "Does Spotify offer remote work or internship roles?",
        "answer": "Yes, Spotify offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/spotify",
      "twitter": "https://x.com/spotify",
      "wikipedia": "https://en.wikipedia.org/wiki/Spotify"
    },
    "contactEmail": "careers@spotify.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-uber",
    "slug": "uber",
    "name": "Uber",
    "legalName": "Uber Corporation",
    "ticker": "UBER",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "San Francisco, CA, USA",
    "foundedYear": 2009,
    "industry": "Mobility & Tech",
    "subIndustry": "Ridesharing, Delivery & Freight Platforms",
    "size": "10,000+",
    "employeeCount": "30,400+",
    "ownershipType": "Public",
    "website": "https://www.uber.com",
    "careersUrl": "https://www.uber.com",
    "logo": "UBER",
    "logoUrl": "https://www.google.com/s2/favicons?domain=uber.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Ridesharing, Delivery & Freight Platforms.",
    "shortDescription": "Verified company profile and career opportunities at Uber.",
    "overview": "Uber is a global market leader operating in Mobility & Tech with a focus on Ridesharing, Delivery & Freight Platforms. Headquartered in San Francisco, CA, USA and founded in 2009, Uber employs over 30,400+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Mobility & Tech.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-uber-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Uber.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Uber?",
        "answer": "You can explore active verified openings at Uber directly on WorkoraJobs or visit their official careers portal at https://www.uber.com."
      },
      {
        "question": "Does Uber offer remote work or internship roles?",
        "answer": "Yes, Uber offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/uber",
      "twitter": "https://x.com/uber",
      "wikipedia": "https://en.wikipedia.org/wiki/Uber"
    },
    "contactEmail": "careers@uber.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-airbnb",
    "slug": "airbnb",
    "name": "Airbnb",
    "legalName": "Airbnb Corporation",
    "ticker": "ABNB",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "San Francisco, CA, USA",
    "foundedYear": 2008,
    "industry": "Travel & Tech",
    "subIndustry": "Online Marketplace for Hospitality",
    "size": "10,000+",
    "employeeCount": "6,900+",
    "ownershipType": "Public",
    "website": "https://www.airbnb.com",
    "careersUrl": "https://www.airbnb.com",
    "logo": "ABNB",
    "logoUrl": "https://www.google.com/s2/favicons?domain=airbnb.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Online Marketplace for Hospitality.",
    "shortDescription": "Verified company profile and career opportunities at Airbnb.",
    "overview": "Airbnb is a global market leader operating in Travel & Tech with a focus on Online Marketplace for Hospitality. Headquartered in San Francisco, CA, USA and founded in 2008, Airbnb employs over 6,900+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Travel & Tech.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-airbnb-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Airbnb.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Airbnb?",
        "answer": "You can explore active verified openings at Airbnb directly on WorkoraJobs or visit their official careers portal at https://www.airbnb.com."
      },
      {
        "question": "Does Airbnb offer remote work or internship roles?",
        "answer": "Yes, Airbnb offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/airbnb",
      "twitter": "https://x.com/airbnb",
      "wikipedia": "https://en.wikipedia.org/wiki/Airbnb"
    },
    "contactEmail": "careers@airbnb.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-zoom",
    "slug": "zoom",
    "name": "Zoom",
    "legalName": "Zoom Corporation",
    "ticker": "ZM",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "San Jose, CA, USA",
    "foundedYear": 2011,
    "industry": "Information Technology",
    "subIndustry": "Unified Video & Enterprise Collaboration",
    "size": "10,000+",
    "employeeCount": "7,400+",
    "ownershipType": "Public",
    "website": "https://www.zoom.us",
    "careersUrl": "https://www.zoom.us",
    "logo": "ZM",
    "logoUrl": "https://www.google.com/s2/favicons?domain=zoom.us&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Unified Video & Enterprise Collaboration.",
    "shortDescription": "Verified company profile and career opportunities at Zoom.",
    "overview": "Zoom is a global market leader operating in Information Technology with a focus on Unified Video & Enterprise Collaboration. Headquartered in San Jose, CA, USA and founded in 2011, Zoom employs over 7,400+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-zoom-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Zoom.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Zoom?",
        "answer": "You can explore active verified openings at Zoom directly on WorkoraJobs or visit their official careers portal at https://www.zoom.us."
      },
      {
        "question": "Does Zoom offer remote work or internship roles?",
        "answer": "Yes, Zoom offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/zoom",
      "twitter": "https://x.com/zoom",
      "wikipedia": "https://en.wikipedia.org/wiki/Zoom"
    },
    "contactEmail": "careers@zoom.us",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-dropbox",
    "slug": "dropbox",
    "name": "Dropbox",
    "legalName": "Dropbox Corporation",
    "ticker": "DBX",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "San Francisco, CA, USA",
    "foundedYear": 2007,
    "industry": "Information Technology",
    "subIndustry": "Cloud Storage & Content Management",
    "size": "10,000+",
    "employeeCount": "2,600+",
    "ownershipType": "Public",
    "website": "https://www.dropbox.com",
    "careersUrl": "https://www.dropbox.com",
    "logo": "DBX",
    "logoUrl": "https://www.google.com/s2/favicons?domain=dropbox.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Cloud Storage & Content Management.",
    "shortDescription": "Verified company profile and career opportunities at Dropbox.",
    "overview": "Dropbox is a global market leader operating in Information Technology with a focus on Cloud Storage & Content Management. Headquartered in San Francisco, CA, USA and founded in 2007, Dropbox employs over 2,600+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-dropbox-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Dropbox.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Dropbox?",
        "answer": "You can explore active verified openings at Dropbox directly on WorkoraJobs or visit their official careers portal at https://www.dropbox.com."
      },
      {
        "question": "Does Dropbox offer remote work or internship roles?",
        "answer": "Yes, Dropbox offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/dropbox",
      "twitter": "https://x.com/dropbox",
      "wikipedia": "https://en.wikipedia.org/wiki/Dropbox"
    },
    "contactEmail": "careers@dropbox.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-slack",
    "slug": "slack",
    "name": "Slack",
    "legalName": "Slack Corporation",
    "ticker": "CRM",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "San Francisco, CA, USA",
    "foundedYear": 2009,
    "industry": "Information Technology",
    "subIndustry": "Enterprise Messaging & Productivity",
    "size": "10,000+",
    "employeeCount": "3,000+",
    "ownershipType": "Public",
    "website": "https://www.slack.com",
    "careersUrl": "https://www.slack.com",
    "logo": "CRM",
    "logoUrl": "https://www.google.com/s2/favicons?domain=slack.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Enterprise Messaging & Productivity.",
    "shortDescription": "Verified company profile and career opportunities at Slack.",
    "overview": "Slack is a global market leader operating in Information Technology with a focus on Enterprise Messaging & Productivity. Headquartered in San Francisco, CA, USA and founded in 2009, Slack employs over 3,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-slack-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Slack.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Slack?",
        "answer": "You can explore active verified openings at Slack directly on WorkoraJobs or visit their official careers portal at https://www.slack.com."
      },
      {
        "question": "Does Slack offer remote work or internship roles?",
        "answer": "Yes, Slack offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/slack",
      "twitter": "https://x.com/slack",
      "wikipedia": "https://en.wikipedia.org/wiki/Slack"
    },
    "contactEmail": "careers@slack.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-atlassian",
    "slug": "atlassian",
    "name": "Atlassian",
    "legalName": "Atlassian Corporation",
    "ticker": "TEAM",
    "stockExchange": "NASDAQ",
    "country": "Australia",
    "headquarters": "Sydney, Australia",
    "foundedYear": 2002,
    "industry": "Information Technology",
    "subIndustry": "Developer Tools & Agile Project Software",
    "size": "10,000+",
    "employeeCount": "11,000+",
    "ownershipType": "Public",
    "website": "https://www.atlassian.com",
    "careersUrl": "https://www.atlassian.com",
    "logo": "TEAM",
    "logoUrl": "https://www.google.com/s2/favicons?domain=atlassian.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Developer Tools & Agile Project Software.",
    "shortDescription": "Verified company profile and career opportunities at Atlassian.",
    "overview": "Atlassian is a global market leader operating in Information Technology with a focus on Developer Tools & Agile Project Software. Headquartered in Sydney, Australia and founded in 2002, Atlassian employs over 11,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-atlassian-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Atlassian.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Atlassian?",
        "answer": "You can explore active verified openings at Atlassian directly on WorkoraJobs or visit their official careers portal at https://www.atlassian.com."
      },
      {
        "question": "Does Atlassian offer remote work or internship roles?",
        "answer": "Yes, Atlassian offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/atlassian",
      "twitter": "https://x.com/atlassian",
      "wikipedia": "https://en.wikipedia.org/wiki/Atlassian"
    },
    "contactEmail": "careers@atlassian.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-github",
    "slug": "github",
    "name": "GitHub",
    "legalName": "GitHub Corporation",
    "ticker": "MSFT",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "San Francisco, CA, USA",
    "foundedYear": 2008,
    "industry": "Information Technology",
    "subIndustry": "Developer Platform & Code Collaboration",
    "size": "10,000+",
    "employeeCount": "3,000+",
    "ownershipType": "Public",
    "website": "https://www.github.com",
    "careersUrl": "https://www.github.com",
    "logo": "MSFT",
    "logoUrl": "https://www.google.com/s2/favicons?domain=github.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Developer Platform & Code Collaboration.",
    "shortDescription": "Verified company profile and career opportunities at GitHub.",
    "overview": "GitHub is a global market leader operating in Information Technology with a focus on Developer Platform & Code Collaboration. Headquartered in San Francisco, CA, USA and founded in 2008, GitHub employs over 3,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-github-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at GitHub.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at GitHub?",
        "answer": "You can explore active verified openings at GitHub directly on WorkoraJobs or visit their official careers portal at https://www.github.com."
      },
      {
        "question": "Does GitHub offer remote work or internship roles?",
        "answer": "Yes, GitHub offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/github",
      "twitter": "https://x.com/github",
      "wikipedia": "https://en.wikipedia.org/wiki/GitHub"
    },
    "contactEmail": "careers@github.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-cloudflare",
    "slug": "cloudflare",
    "name": "Cloudflare",
    "legalName": "Cloudflare Corporation",
    "ticker": "NET",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "San Francisco, CA, USA",
    "foundedYear": 2009,
    "industry": "Information Technology",
    "subIndustry": "Web Security, CDN & Edge Computing",
    "size": "10,000+",
    "employeeCount": "3,600+",
    "ownershipType": "Public",
    "website": "https://www.cloudflare.com",
    "careersUrl": "https://www.cloudflare.com",
    "logo": "NET",
    "logoUrl": "https://www.google.com/s2/favicons?domain=cloudflare.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Web Security, CDN & Edge Computing.",
    "shortDescription": "Verified company profile and career opportunities at Cloudflare.",
    "overview": "Cloudflare is a global market leader operating in Information Technology with a focus on Web Security, CDN & Edge Computing. Headquartered in San Francisco, CA, USA and founded in 2009, Cloudflare employs over 3,600+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-cloudflare-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Cloudflare.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Cloudflare?",
        "answer": "You can explore active verified openings at Cloudflare directly on WorkoraJobs or visit their official careers portal at https://www.cloudflare.com."
      },
      {
        "question": "Does Cloudflare offer remote work or internship roles?",
        "answer": "Yes, Cloudflare offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/cloudflare",
      "twitter": "https://x.com/cloudflare",
      "wikipedia": "https://en.wikipedia.org/wiki/Cloudflare"
    },
    "contactEmail": "careers@cloudflare.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-stripe",
    "slug": "stripe",
    "name": "Stripe",
    "legalName": "Stripe Corporation",
    "ticker": "PRIV",
    "stockExchange": "Private",
    "country": "USA",
    "headquarters": "San Francisco, CA, USA",
    "foundedYear": 2010,
    "industry": "Fintech & Software",
    "subIndustry": "Financial Infrastructure & Payment Gateway",
    "size": "10,000+",
    "employeeCount": "8,000+",
    "ownershipType": "Private",
    "website": "https://www.stripe.com",
    "careersUrl": "https://www.stripe.com",
    "logo": "PRIV",
    "logoUrl": "https://www.google.com/s2/favicons?domain=stripe.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Financial Infrastructure & Payment Gateway.",
    "shortDescription": "Verified company profile and career opportunities at Stripe.",
    "overview": "Stripe is a global market leader operating in Fintech & Software with a focus on Financial Infrastructure & Payment Gateway. Headquartered in San Francisco, CA, USA and founded in 2010, Stripe employs over 8,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Fintech & Software.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "Oracle",
      "Python",
      "Kafka",
      "SQL",
      "Microservices"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-stripe-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Stripe.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Stripe?",
        "answer": "You can explore active verified openings at Stripe directly on WorkoraJobs or visit their official careers portal at https://www.stripe.com."
      },
      {
        "question": "Does Stripe offer remote work or internship roles?",
        "answer": "Yes, Stripe offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/stripe",
      "twitter": "https://x.com/stripe",
      "wikipedia": "https://en.wikipedia.org/wiki/Stripe"
    },
    "contactEmail": "careers@stripe.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-paypal",
    "slug": "paypal",
    "name": "PayPal",
    "legalName": "PayPal Corporation",
    "ticker": "PYPL",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "San Jose, CA, USA",
    "foundedYear": 1998,
    "industry": "Fintech & Finance",
    "subIndustry": "Digital Payments & Merchant Services",
    "size": "10,000+",
    "employeeCount": "27,200+",
    "ownershipType": "Public",
    "website": "https://www.paypal.com",
    "careersUrl": "https://www.paypal.com",
    "logo": "PYPL",
    "logoUrl": "https://www.google.com/s2/favicons?domain=paypal.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Digital Payments & Merchant Services.",
    "shortDescription": "Verified company profile and career opportunities at PayPal.",
    "overview": "PayPal is a global market leader operating in Fintech & Finance with a focus on Digital Payments & Merchant Services. Headquartered in San Jose, CA, USA and founded in 1998, PayPal employs over 27,200+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Fintech & Finance.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "Oracle",
      "Python",
      "Kafka",
      "SQL",
      "Microservices"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-paypal-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at PayPal.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at PayPal?",
        "answer": "You can explore active verified openings at PayPal directly on WorkoraJobs or visit their official careers portal at https://www.paypal.com."
      },
      {
        "question": "Does PayPal offer remote work or internship roles?",
        "answer": "Yes, PayPal offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/paypal",
      "twitter": "https://x.com/paypal",
      "wikipedia": "https://en.wikipedia.org/wiki/PayPal"
    },
    "contactEmail": "careers@paypal.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-block",
    "slug": "block",
    "name": "Block",
    "legalName": "Block Corporation",
    "ticker": "SQ",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "San Francisco, CA, USA",
    "foundedYear": 2009,
    "industry": "Fintech & Software",
    "subIndustry": "Square POS & Cash App Financial Ecosystem",
    "size": "10,000+",
    "employeeCount": "12,000+",
    "ownershipType": "Public",
    "website": "https://www.block.xyz",
    "careersUrl": "https://www.block.xyz",
    "logo": "SQ",
    "logoUrl": "https://www.google.com/s2/favicons?domain=block.xyz&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Square POS & Cash App Financial Ecosystem.",
    "shortDescription": "Verified company profile and career opportunities at Block.",
    "overview": "Block is a global market leader operating in Fintech & Software with a focus on Square POS & Cash App Financial Ecosystem. Headquartered in San Francisco, CA, USA and founded in 2009, Block employs over 12,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Fintech & Software.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "Oracle",
      "Python",
      "Kafka",
      "SQL",
      "Microservices"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-block-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Block.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Block?",
        "answer": "You can explore active verified openings at Block directly on WorkoraJobs or visit their official careers portal at https://www.block.xyz."
      },
      {
        "question": "Does Block offer remote work or internship roles?",
        "answer": "Yes, Block offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/block",
      "twitter": "https://x.com/block",
      "wikipedia": "https://en.wikipedia.org/wiki/Block"
    },
    "contactEmail": "careers@block.xyz",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-canva",
    "slug": "canva",
    "name": "Canva",
    "legalName": "Canva Corporation",
    "ticker": "PRIV",
    "stockExchange": "Private",
    "country": "Australia",
    "headquarters": "Sydney, Australia",
    "foundedYear": 2013,
    "industry": "Information Technology",
    "subIndustry": "Visual Communication & Design Software",
    "size": "10,000+",
    "employeeCount": "4,000+",
    "ownershipType": "Private",
    "website": "https://www.canva.com",
    "careersUrl": "https://www.canva.com",
    "logo": "PRIV",
    "logoUrl": "https://www.google.com/s2/favicons?domain=canva.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Visual Communication & Design Software.",
    "shortDescription": "Verified company profile and career opportunities at Canva.",
    "overview": "Canva is a global market leader operating in Information Technology with a focus on Visual Communication & Design Software. Headquartered in Sydney, Australia and founded in 2013, Canva employs over 4,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-canva-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Canva.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Canva?",
        "answer": "You can explore active verified openings at Canva directly on WorkoraJobs or visit their official careers portal at https://www.canva.com."
      },
      {
        "question": "Does Canva offer remote work or internship roles?",
        "answer": "Yes, Canva offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/canva",
      "twitter": "https://x.com/canva",
      "wikipedia": "https://en.wikipedia.org/wiki/Canva"
    },
    "contactEmail": "careers@canva.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-hubspot",
    "slug": "hubspot",
    "name": "HubSpot",
    "legalName": "HubSpot Corporation",
    "ticker": "HUBS",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Cambridge, MA, USA",
    "foundedYear": 2006,
    "industry": "Information Technology",
    "subIndustry": "Inbound Marketing & Customer Service CRM",
    "size": "10,000+",
    "employeeCount": "7,600+",
    "ownershipType": "Public",
    "website": "https://www.hubspot.com",
    "careersUrl": "https://www.hubspot.com",
    "logo": "HUBS",
    "logoUrl": "https://www.google.com/s2/favicons?domain=hubspot.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Inbound Marketing & Customer Service CRM.",
    "shortDescription": "Verified company profile and career opportunities at HubSpot.",
    "overview": "HubSpot is a global market leader operating in Information Technology with a focus on Inbound Marketing & Customer Service CRM. Headquartered in Cambridge, MA, USA and founded in 2006, HubSpot employs over 7,600+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Information Technology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-hubspot-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at HubSpot.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at HubSpot?",
        "answer": "You can explore active verified openings at HubSpot directly on WorkoraJobs or visit their official careers portal at https://www.hubspot.com."
      },
      {
        "question": "Does HubSpot offer remote work or internship roles?",
        "answer": "Yes, HubSpot offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/hubspot",
      "twitter": "https://x.com/hubspot",
      "wikipedia": "https://en.wikipedia.org/wiki/HubSpot"
    },
    "contactEmail": "careers@hubspot.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-tesla",
    "slug": "tesla",
    "name": "Tesla",
    "legalName": "Tesla Corporation",
    "ticker": "TSLA",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "Austin, TX, USA",
    "foundedYear": 2003,
    "industry": "Automotive & Energy",
    "subIndustry": "Electric Vehicles & Clean Energy Systems",
    "size": "10,000+",
    "employeeCount": "140,000+",
    "ownershipType": "Public",
    "website": "https://www.tesla.com",
    "careersUrl": "https://www.tesla.com",
    "logo": "TSLA",
    "logoUrl": "https://www.google.com/s2/favicons?domain=tesla.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Electric Vehicles & Clean Energy Systems.",
    "shortDescription": "Verified company profile and career opportunities at Tesla.",
    "overview": "Tesla is a global market leader operating in Automotive & Energy with a focus on Electric Vehicles & Clean Energy Systems. Headquartered in Austin, TX, USA and founded in 2003, Tesla employs over 140,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Automotive & Energy.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "AUTOSAR",
      "Embedded Linux",
      "PyTorch",
      "MATLAB",
      "ROS"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-tesla-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Tesla.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Tesla?",
        "answer": "You can explore active verified openings at Tesla directly on WorkoraJobs or visit their official careers portal at https://www.tesla.com."
      },
      {
        "question": "Does Tesla offer remote work or internship roles?",
        "answer": "Yes, Tesla offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/tesla",
      "twitter": "https://x.com/tesla",
      "wikipedia": "https://en.wikipedia.org/wiki/Tesla"
    },
    "contactEmail": "careers@tesla.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-toyota",
    "slug": "toyota",
    "name": "Toyota",
    "legalName": "Toyota Corporation",
    "ticker": "TM",
    "stockExchange": "NYSE",
    "country": "Japan",
    "headquarters": "Toyota City, Japan",
    "foundedYear": 1937,
    "industry": "Automotive & Manufacturing",
    "subIndustry": "Hybrid Vehicles & Global Automotive OEM",
    "size": "10,000+",
    "employeeCount": "375,000+",
    "ownershipType": "Public",
    "website": "https://www.toyota-global.com",
    "careersUrl": "https://www.toyota-global.com",
    "logo": "TM",
    "logoUrl": "https://www.google.com/s2/favicons?domain=toyota-global.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Hybrid Vehicles & Global Automotive OEM.",
    "shortDescription": "Verified company profile and career opportunities at Toyota.",
    "overview": "Toyota is a global market leader operating in Automotive & Manufacturing with a focus on Hybrid Vehicles & Global Automotive OEM. Headquartered in Toyota City, Japan and founded in 1937, Toyota employs over 375,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Automotive & Manufacturing.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "AUTOSAR",
      "Embedded Linux",
      "PyTorch",
      "MATLAB",
      "ROS"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-toyota-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Toyota.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Toyota?",
        "answer": "You can explore active verified openings at Toyota directly on WorkoraJobs or visit their official careers portal at https://www.toyota-global.com."
      },
      {
        "question": "Does Toyota offer remote work or internship roles?",
        "answer": "Yes, Toyota offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/toyota",
      "twitter": "https://x.com/toyota",
      "wikipedia": "https://en.wikipedia.org/wiki/Toyota"
    },
    "contactEmail": "careers@toyota-global.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-volkswagen",
    "slug": "volkswagen",
    "name": "Volkswagen",
    "legalName": "Volkswagen Corporation",
    "ticker": "VOW3",
    "stockExchange": "XETRA",
    "country": "Germany",
    "headquarters": "Wolfsburg, Germany",
    "foundedYear": 1937,
    "industry": "Automotive & Manufacturing",
    "subIndustry": "Passenger Cars & Commercial Vehicles",
    "size": "10,000+",
    "employeeCount": "675,000+",
    "ownershipType": "Public",
    "website": "https://www.volkswagen-group.com",
    "careersUrl": "https://www.volkswagen-group.com",
    "logo": "VOW3",
    "logoUrl": "https://www.google.com/s2/favicons?domain=volkswagen-group.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Passenger Cars & Commercial Vehicles.",
    "shortDescription": "Verified company profile and career opportunities at Volkswagen.",
    "overview": "Volkswagen is a global market leader operating in Automotive & Manufacturing with a focus on Passenger Cars & Commercial Vehicles. Headquartered in Wolfsburg, Germany and founded in 1937, Volkswagen employs over 675,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Automotive & Manufacturing.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "AUTOSAR",
      "Embedded Linux",
      "PyTorch",
      "MATLAB",
      "ROS"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-volkswagen-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Volkswagen.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Volkswagen?",
        "answer": "You can explore active verified openings at Volkswagen directly on WorkoraJobs or visit their official careers portal at https://www.volkswagen-group.com."
      },
      {
        "question": "Does Volkswagen offer remote work or internship roles?",
        "answer": "Yes, Volkswagen offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/volkswagen",
      "twitter": "https://x.com/volkswagen",
      "wikipedia": "https://en.wikipedia.org/wiki/Volkswagen"
    },
    "contactEmail": "careers@volkswagen-group.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-bmw",
    "slug": "bmw",
    "name": "BMW",
    "legalName": "BMW Corporation",
    "ticker": "BMW",
    "stockExchange": "XETRA",
    "country": "Germany",
    "headquarters": "Munich, Germany",
    "foundedYear": 1916,
    "industry": "Automotive & Manufacturing",
    "subIndustry": "Premium Automobiles & Motorcycles",
    "size": "10,000+",
    "employeeCount": "149,000+",
    "ownershipType": "Public",
    "website": "https://www.bmwgroup.com",
    "careersUrl": "https://www.bmwgroup.com",
    "logo": "BMW",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bmwgroup.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Premium Automobiles & Motorcycles.",
    "shortDescription": "Verified company profile and career opportunities at BMW.",
    "overview": "BMW is a global market leader operating in Automotive & Manufacturing with a focus on Premium Automobiles & Motorcycles. Headquartered in Munich, Germany and founded in 1916, BMW employs over 149,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Automotive & Manufacturing.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "AUTOSAR",
      "Embedded Linux",
      "PyTorch",
      "MATLAB",
      "ROS"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-bmw-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at BMW.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at BMW?",
        "answer": "You can explore active verified openings at BMW directly on WorkoraJobs or visit their official careers portal at https://www.bmwgroup.com."
      },
      {
        "question": "Does BMW offer remote work or internship roles?",
        "answer": "Yes, BMW offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/bmw",
      "twitter": "https://x.com/bmw",
      "wikipedia": "https://en.wikipedia.org/wiki/BMW"
    },
    "contactEmail": "careers@bmwgroup.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-mercedes-benz",
    "slug": "mercedes-benz",
    "name": "Mercedes-Benz",
    "legalName": "Mercedes-Benz Corporation",
    "ticker": "MBG",
    "stockExchange": "XETRA",
    "country": "Germany",
    "headquarters": "Stuttgart, Germany",
    "foundedYear": 1926,
    "industry": "Automotive & Manufacturing",
    "subIndustry": "Luxury Vehicles & Commercial Mobility",
    "size": "10,000+",
    "employeeCount": "166,000+",
    "ownershipType": "Public",
    "website": "https://www.mercedes-benz.com",
    "careersUrl": "https://www.mercedes-benz.com",
    "logo": "MBG",
    "logoUrl": "https://www.google.com/s2/favicons?domain=mercedes-benz.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Luxury Vehicles & Commercial Mobility.",
    "shortDescription": "Verified company profile and career opportunities at Mercedes-Benz.",
    "overview": "Mercedes-Benz is a global market leader operating in Automotive & Manufacturing with a focus on Luxury Vehicles & Commercial Mobility. Headquartered in Stuttgart, Germany and founded in 1926, Mercedes-Benz employs over 166,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Automotive & Manufacturing.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "AUTOSAR",
      "Embedded Linux",
      "PyTorch",
      "MATLAB",
      "ROS"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-mercedes-benz-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Mercedes-Benz.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Mercedes-Benz?",
        "answer": "You can explore active verified openings at Mercedes-Benz directly on WorkoraJobs or visit their official careers portal at https://www.mercedes-benz.com."
      },
      {
        "question": "Does Mercedes-Benz offer remote work or internship roles?",
        "answer": "Yes, Mercedes-Benz offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/mercedes-benz",
      "twitter": "https://x.com/mercedes-benz",
      "wikipedia": "https://en.wikipedia.org/wiki/Mercedes-Benz"
    },
    "contactEmail": "careers@mercedes-benz.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-ford",
    "slug": "ford",
    "name": "Ford",
    "legalName": "Ford Corporation",
    "ticker": "F",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Dearborn, MI, USA",
    "foundedYear": 1903,
    "industry": "Automotive & Manufacturing",
    "subIndustry": "Trucks, SUVs & Electric Vehicles",
    "size": "10,000+",
    "employeeCount": "173,000+",
    "ownershipType": "Public",
    "website": "https://www.ford.com",
    "careersUrl": "https://www.ford.com",
    "logo": "F",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ford.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Trucks, SUVs & Electric Vehicles.",
    "shortDescription": "Verified company profile and career opportunities at Ford.",
    "overview": "Ford is a global market leader operating in Automotive & Manufacturing with a focus on Trucks, SUVs & Electric Vehicles. Headquartered in Dearborn, MI, USA and founded in 1903, Ford employs over 173,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Automotive & Manufacturing.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "AUTOSAR",
      "Embedded Linux",
      "PyTorch",
      "MATLAB",
      "ROS"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-ford-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Ford.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Ford?",
        "answer": "You can explore active verified openings at Ford directly on WorkoraJobs or visit their official careers portal at https://www.ford.com."
      },
      {
        "question": "Does Ford offer remote work or internship roles?",
        "answer": "Yes, Ford offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/ford",
      "twitter": "https://x.com/ford",
      "wikipedia": "https://en.wikipedia.org/wiki/Ford"
    },
    "contactEmail": "careers@ford.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-general-motors",
    "slug": "general-motors",
    "name": "General Motors",
    "legalName": "General Motors Corporation",
    "ticker": "GM",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Detroit, MI, USA",
    "foundedYear": 1908,
    "industry": "Automotive & Manufacturing",
    "subIndustry": "Automotive Engineering & Ultium Battery Tech",
    "size": "10,000+",
    "employeeCount": "163,000+",
    "ownershipType": "Public",
    "website": "https://www.gm.com",
    "careersUrl": "https://www.gm.com",
    "logo": "GM",
    "logoUrl": "https://www.google.com/s2/favicons?domain=gm.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Automotive Engineering & Ultium Battery Tech.",
    "shortDescription": "Verified company profile and career opportunities at General Motors.",
    "overview": "General Motors is a global market leader operating in Automotive & Manufacturing with a focus on Automotive Engineering & Ultium Battery Tech. Headquartered in Detroit, MI, USA and founded in 1908, General Motors employs over 163,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Automotive & Manufacturing.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "AUTOSAR",
      "Embedded Linux",
      "PyTorch",
      "MATLAB",
      "ROS"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-general-motors-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at General Motors.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at General Motors?",
        "answer": "You can explore active verified openings at General Motors directly on WorkoraJobs or visit their official careers portal at https://www.gm.com."
      },
      {
        "question": "Does General Motors offer remote work or internship roles?",
        "answer": "Yes, General Motors offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/general-motors",
      "twitter": "https://x.com/general-motors",
      "wikipedia": "https://en.wikipedia.org/wiki/General_Motors"
    },
    "contactEmail": "careers@gm.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-honda",
    "slug": "honda",
    "name": "Honda",
    "legalName": "Honda Corporation",
    "ticker": "HMC",
    "stockExchange": "NYSE",
    "country": "Japan",
    "headquarters": "Tokyo, Japan",
    "foundedYear": 1948,
    "industry": "Automotive & Manufacturing",
    "subIndustry": "Automobiles, Motorcycles & Power Products",
    "size": "10,000+",
    "employeeCount": "197,000+",
    "ownershipType": "Public",
    "website": "https://www.global.honda",
    "careersUrl": "https://www.global.honda",
    "logo": "HMC",
    "logoUrl": "https://www.google.com/s2/favicons?domain=global.honda&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Automobiles, Motorcycles & Power Products.",
    "shortDescription": "Verified company profile and career opportunities at Honda.",
    "overview": "Honda is a global market leader operating in Automotive & Manufacturing with a focus on Automobiles, Motorcycles & Power Products. Headquartered in Tokyo, Japan and founded in 1948, Honda employs over 197,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Automotive & Manufacturing.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "AUTOSAR",
      "Embedded Linux",
      "PyTorch",
      "MATLAB",
      "ROS"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-honda-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Honda.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Honda?",
        "answer": "You can explore active verified openings at Honda directly on WorkoraJobs or visit their official careers portal at https://www.global.honda."
      },
      {
        "question": "Does Honda offer remote work or internship roles?",
        "answer": "Yes, Honda offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/honda",
      "twitter": "https://x.com/honda",
      "wikipedia": "https://en.wikipedia.org/wiki/Honda"
    },
    "contactEmail": "careers@global.honda",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-hyundai",
    "slug": "hyundai",
    "name": "Hyundai",
    "legalName": "Hyundai Corporation",
    "ticker": "005380",
    "stockExchange": "KRX",
    "country": "South Korea",
    "headquarters": "Seoul, South Korea",
    "foundedYear": 1967,
    "industry": "Automotive & Manufacturing",
    "subIndustry": "Automobiles, EVs & Hydrogen Mobility",
    "size": "10,000+",
    "employeeCount": "120,000+",
    "ownershipType": "Public",
    "website": "https://www.hyundai.com",
    "careersUrl": "https://www.hyundai.com",
    "logo": "HYUN",
    "logoUrl": "https://www.google.com/s2/favicons?domain=hyundai.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Automobiles, EVs & Hydrogen Mobility.",
    "shortDescription": "Verified company profile and career opportunities at Hyundai.",
    "overview": "Hyundai is a global market leader operating in Automotive & Manufacturing with a focus on Automobiles, EVs & Hydrogen Mobility. Headquartered in Seoul, South Korea and founded in 1967, Hyundai employs over 120,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Automotive & Manufacturing.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "AUTOSAR",
      "Embedded Linux",
      "PyTorch",
      "MATLAB",
      "ROS"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-hyundai-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Hyundai.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Hyundai?",
        "answer": "You can explore active verified openings at Hyundai directly on WorkoraJobs or visit their official careers portal at https://www.hyundai.com."
      },
      {
        "question": "Does Hyundai offer remote work or internship roles?",
        "answer": "Yes, Hyundai offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/hyundai",
      "twitter": "https://x.com/hyundai",
      "wikipedia": "https://en.wikipedia.org/wiki/Hyundai"
    },
    "contactEmail": "careers@hyundai.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-volvo",
    "slug": "volvo",
    "name": "Volvo",
    "legalName": "Volvo Corporation",
    "ticker": "VOLV-B",
    "stockExchange": "Nasdaq Stockholm",
    "country": "Sweden",
    "headquarters": "Gothenburg, Sweden",
    "foundedYear": 1927,
    "industry": "Automotive & Heavy Industry",
    "subIndustry": "Commercial Trucks, Buses & Construction Equipment",
    "size": "10,000+",
    "employeeCount": "104,000+",
    "ownershipType": "Public",
    "website": "https://www.volvogroup.com",
    "careersUrl": "https://www.volvogroup.com",
    "logo": "VOLV",
    "logoUrl": "https://www.google.com/s2/favicons?domain=volvogroup.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Commercial Trucks, Buses & Construction Equipment.",
    "shortDescription": "Verified company profile and career opportunities at Volvo.",
    "overview": "Volvo is a global market leader operating in Automotive & Heavy Industry with a focus on Commercial Trucks, Buses & Construction Equipment. Headquartered in Gothenburg, Sweden and founded in 1927, Volvo employs over 104,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Automotive & Heavy Industry.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "AUTOSAR",
      "Embedded Linux",
      "PyTorch",
      "MATLAB",
      "ROS"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-volvo-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Volvo.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Volvo?",
        "answer": "You can explore active verified openings at Volvo directly on WorkoraJobs or visit their official careers portal at https://www.volvogroup.com."
      },
      {
        "question": "Does Volvo offer remote work or internship roles?",
        "answer": "Yes, Volvo offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/volvo",
      "twitter": "https://x.com/volvo",
      "wikipedia": "https://en.wikipedia.org/wiki/Volvo"
    },
    "contactEmail": "careers@volvogroup.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-porsche",
    "slug": "porsche",
    "name": "Porsche",
    "legalName": "Porsche Corporation",
    "ticker": "P911",
    "stockExchange": "XETRA",
    "country": "Germany",
    "headquarters": "Stuttgart, Germany",
    "foundedYear": 1931,
    "industry": "Automotive & Manufacturing",
    "subIndustry": "High-Performance Luxury Sports Cars",
    "size": "10,000+",
    "employeeCount": "39,000+",
    "ownershipType": "Public",
    "website": "https://www.porsche.com",
    "careersUrl": "https://www.porsche.com",
    "logo": "P911",
    "logoUrl": "https://www.google.com/s2/favicons?domain=porsche.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in High-Performance Luxury Sports Cars.",
    "shortDescription": "Verified company profile and career opportunities at Porsche.",
    "overview": "Porsche is a global market leader operating in Automotive & Manufacturing with a focus on High-Performance Luxury Sports Cars. Headquartered in Stuttgart, Germany and founded in 1931, Porsche employs over 39,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Automotive & Manufacturing.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "AUTOSAR",
      "Embedded Linux",
      "PyTorch",
      "MATLAB",
      "ROS"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-porsche-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Porsche.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Porsche?",
        "answer": "You can explore active verified openings at Porsche directly on WorkoraJobs or visit their official careers portal at https://www.porsche.com."
      },
      {
        "question": "Does Porsche offer remote work or internship roles?",
        "answer": "Yes, Porsche offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/porsche",
      "twitter": "https://x.com/porsche",
      "wikipedia": "https://en.wikipedia.org/wiki/Porsche"
    },
    "contactEmail": "careers@porsche.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-ferrari",
    "slug": "ferrari",
    "name": "Ferrari",
    "legalName": "Ferrari Corporation",
    "ticker": "RACE",
    "stockExchange": "NYSE",
    "country": "Italy",
    "headquarters": "Maranello, Italy",
    "foundedYear": 1939,
    "industry": "Automotive & Luxury",
    "subIndustry": "Ultra-Luxury Sports Cars & Formula 1",
    "size": "10,000+",
    "employeeCount": "5,000+",
    "ownershipType": "Public",
    "website": "https://www.ferrari.com",
    "careersUrl": "https://www.ferrari.com",
    "logo": "RACE",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ferrari.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Ultra-Luxury Sports Cars & Formula 1.",
    "shortDescription": "Verified company profile and career opportunities at Ferrari.",
    "overview": "Ferrari is a global market leader operating in Automotive & Luxury with a focus on Ultra-Luxury Sports Cars & Formula 1. Headquartered in Maranello, Italy and founded in 1939, Ferrari employs over 5,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Automotive & Luxury.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "AUTOSAR",
      "Embedded Linux",
      "PyTorch",
      "MATLAB",
      "ROS"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-ferrari-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Ferrari.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Ferrari?",
        "answer": "You can explore active verified openings at Ferrari directly on WorkoraJobs or visit their official careers portal at https://www.ferrari.com."
      },
      {
        "question": "Does Ferrari offer remote work or internship roles?",
        "answer": "Yes, Ferrari offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/ferrari",
      "twitter": "https://x.com/ferrari",
      "wikipedia": "https://en.wikipedia.org/wiki/Ferrari"
    },
    "contactEmail": "careers@ferrari.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-byd",
    "slug": "byd",
    "name": "BYD",
    "legalName": "BYD Corporation",
    "ticker": "002594",
    "stockExchange": "SZSE",
    "country": "China",
    "headquarters": "Shenzhen, China",
    "foundedYear": 1995,
    "industry": "Automotive & Battery Tech",
    "subIndustry": "Electric Vehicles & Blade Battery Storage",
    "size": "10,000+",
    "employeeCount": "570,000+",
    "ownershipType": "Public",
    "website": "https://www.byd.com",
    "careersUrl": "https://www.byd.com",
    "logo": "BYD",
    "logoUrl": "https://www.google.com/s2/favicons?domain=byd.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Electric Vehicles & Blade Battery Storage.",
    "shortDescription": "Verified company profile and career opportunities at BYD.",
    "overview": "BYD is a global market leader operating in Automotive & Battery Tech with a focus on Electric Vehicles & Blade Battery Storage. Headquartered in Shenzhen, China and founded in 1995, BYD employs over 570,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Automotive & Battery Tech.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-byd-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at BYD.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at BYD?",
        "answer": "You can explore active verified openings at BYD directly on WorkoraJobs or visit their official careers portal at https://www.byd.com."
      },
      {
        "question": "Does BYD offer remote work or internship roles?",
        "answer": "Yes, BYD offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/byd",
      "twitter": "https://x.com/byd",
      "wikipedia": "https://en.wikipedia.org/wiki/BYD"
    },
    "contactEmail": "careers@byd.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-boeing",
    "slug": "boeing",
    "name": "Boeing",
    "legalName": "Boeing Corporation",
    "ticker": "BA",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Arlington, VA, USA",
    "foundedYear": 1916,
    "industry": "Aerospace & Defense",
    "subIndustry": "Commercial Jets & Defense Systems",
    "size": "10,000+",
    "employeeCount": "171,000+",
    "ownershipType": "Public",
    "website": "https://www.boeing.com",
    "careersUrl": "https://www.boeing.com",
    "logo": "BA",
    "logoUrl": "https://www.google.com/s2/favicons?domain=boeing.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Commercial Jets & Defense Systems.",
    "shortDescription": "Verified company profile and career opportunities at Boeing.",
    "overview": "Boeing is a global market leader operating in Aerospace & Defense with a focus on Commercial Jets & Defense Systems. Headquartered in Arlington, VA, USA and founded in 1916, Boeing employs over 171,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Aerospace & Defense.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "JavaScript",
      "SQL",
      "SAP",
      "Cloud Infrastructure",
      "React"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-boeing-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Boeing.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Boeing?",
        "answer": "You can explore active verified openings at Boeing directly on WorkoraJobs or visit their official careers portal at https://www.boeing.com."
      },
      {
        "question": "Does Boeing offer remote work or internship roles?",
        "answer": "Yes, Boeing offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/boeing",
      "twitter": "https://x.com/boeing",
      "wikipedia": "https://en.wikipedia.org/wiki/Boeing"
    },
    "contactEmail": "careers@boeing.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-airbus",
    "slug": "airbus",
    "name": "Airbus",
    "legalName": "Airbus Corporation",
    "ticker": "AIR",
    "stockExchange": "Euronext Paris",
    "country": "France",
    "headquarters": "Blagnac, France",
    "foundedYear": 1970,
    "industry": "Aerospace & Defense",
    "subIndustry": "Commercial Aircraft & Space Engineering",
    "size": "10,000+",
    "employeeCount": "134,000+",
    "ownershipType": "Public",
    "website": "https://www.airbus.com",
    "careersUrl": "https://www.airbus.com",
    "logo": "AIR",
    "logoUrl": "https://www.google.com/s2/favicons?domain=airbus.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Commercial Aircraft & Space Engineering.",
    "shortDescription": "Verified company profile and career opportunities at Airbus.",
    "overview": "Airbus is a global market leader operating in Aerospace & Defense with a focus on Commercial Aircraft & Space Engineering. Headquartered in Blagnac, France and founded in 1970, Airbus employs over 134,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Aerospace & Defense.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "JavaScript",
      "SQL",
      "SAP",
      "Cloud Infrastructure",
      "React"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-airbus-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Airbus.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Airbus?",
        "answer": "You can explore active verified openings at Airbus directly on WorkoraJobs or visit their official careers portal at https://www.airbus.com."
      },
      {
        "question": "Does Airbus offer remote work or internship roles?",
        "answer": "Yes, Airbus offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/airbus",
      "twitter": "https://x.com/airbus",
      "wikipedia": "https://en.wikipedia.org/wiki/Airbus"
    },
    "contactEmail": "careers@airbus.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-walmart",
    "slug": "walmart",
    "name": "Walmart",
    "legalName": "Walmart Corporation",
    "ticker": "WMT",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Bentonville, AR, USA",
    "foundedYear": 1962,
    "industry": "Retail & Commerce",
    "subIndustry": "Hypermarkets, Grocery & Supply Chain",
    "size": "10,000+",
    "employeeCount": "2,100,000+",
    "ownershipType": "Public",
    "website": "https://www.walmart.com",
    "careersUrl": "https://www.walmart.com",
    "logo": "WMT",
    "logoUrl": "https://www.google.com/s2/favicons?domain=walmart.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Hypermarkets, Grocery & Supply Chain.",
    "shortDescription": "Verified company profile and career opportunities at Walmart.",
    "overview": "Walmart is a global market leader operating in Retail & Commerce with a focus on Hypermarkets, Grocery & Supply Chain. Headquartered in Bentonville, AR, USA and founded in 1962, Walmart employs over 2,100,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Retail & Commerce.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-walmart-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Walmart.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Walmart?",
        "answer": "You can explore active verified openings at Walmart directly on WorkoraJobs or visit their official careers portal at https://www.walmart.com."
      },
      {
        "question": "Does Walmart offer remote work or internship roles?",
        "answer": "Yes, Walmart offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/walmart",
      "twitter": "https://x.com/walmart",
      "wikipedia": "https://en.wikipedia.org/wiki/Walmart"
    },
    "contactEmail": "careers@walmart.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-costco",
    "slug": "costco",
    "name": "Costco",
    "legalName": "Costco Corporation",
    "ticker": "COST",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "Issaquah, WA, USA",
    "foundedYear": 1983,
    "industry": "Retail & Wholesale",
    "subIndustry": "Membership Warehouse Clubs",
    "size": "10,000+",
    "employeeCount": "316,000+",
    "ownershipType": "Public",
    "website": "https://www.costco.com",
    "careersUrl": "https://www.costco.com",
    "logo": "COST",
    "logoUrl": "https://www.google.com/s2/favicons?domain=costco.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Membership Warehouse Clubs.",
    "shortDescription": "Verified company profile and career opportunities at Costco.",
    "overview": "Costco is a global market leader operating in Retail & Wholesale with a focus on Membership Warehouse Clubs. Headquartered in Issaquah, WA, USA and founded in 1983, Costco employs over 316,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Retail & Wholesale.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-costco-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Costco.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Costco?",
        "answer": "You can explore active verified openings at Costco directly on WorkoraJobs or visit their official careers portal at https://www.costco.com."
      },
      {
        "question": "Does Costco offer remote work or internship roles?",
        "answer": "Yes, Costco offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/costco",
      "twitter": "https://x.com/costco",
      "wikipedia": "https://en.wikipedia.org/wiki/Costco"
    },
    "contactEmail": "careers@costco.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-target",
    "slug": "target",
    "name": "Target",
    "legalName": "Target Corporation",
    "ticker": "TGT",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Minneapolis, MN, USA",
    "foundedYear": 1902,
    "industry": "Retail & Commerce",
    "subIndustry": "Department Stores & Omnibus Merchandising",
    "size": "10,000+",
    "employeeCount": "440,000+",
    "ownershipType": "Public",
    "website": "https://www.target.com",
    "careersUrl": "https://www.target.com",
    "logo": "TGT",
    "logoUrl": "https://www.google.com/s2/favicons?domain=target.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Department Stores & Omnibus Merchandising.",
    "shortDescription": "Verified company profile and career opportunities at Target.",
    "overview": "Target is a global market leader operating in Retail & Commerce with a focus on Department Stores & Omnibus Merchandising. Headquartered in Minneapolis, MN, USA and founded in 1902, Target employs over 440,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Retail & Commerce.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-target-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Target.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Target?",
        "answer": "You can explore active verified openings at Target directly on WorkoraJobs or visit their official careers portal at https://www.target.com."
      },
      {
        "question": "Does Target offer remote work or internship roles?",
        "answer": "Yes, Target offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/target",
      "twitter": "https://x.com/target",
      "wikipedia": "https://en.wikipedia.org/wiki/Target"
    },
    "contactEmail": "careers@target.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-ikea",
    "slug": "ikea",
    "name": "IKEA",
    "legalName": "IKEA Corporation",
    "ticker": "PRIV",
    "stockExchange": "Private",
    "country": "Netherlands",
    "headquarters": "Delft, Netherlands",
    "foundedYear": 1943,
    "industry": "Retail & Furnishings",
    "subIndustry": "Ready-to-Assemble Furniture & Home Goods",
    "size": "10,000+",
    "employeeCount": "231,000+",
    "ownershipType": "Private",
    "website": "https://www.ikea.com",
    "careersUrl": "https://www.ikea.com",
    "logo": "PRIV",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ikea.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Ready-to-Assemble Furniture & Home Goods.",
    "shortDescription": "Verified company profile and career opportunities at IKEA.",
    "overview": "IKEA is a global market leader operating in Retail & Furnishings with a focus on Ready-to-Assemble Furniture & Home Goods. Headquartered in Delft, Netherlands and founded in 1943, IKEA employs over 231,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Retail & Furnishings.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-ikea-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at IKEA.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at IKEA?",
        "answer": "You can explore active verified openings at IKEA directly on WorkoraJobs or visit their official careers portal at https://www.ikea.com."
      },
      {
        "question": "Does IKEA offer remote work or internship roles?",
        "answer": "Yes, IKEA offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/ikea",
      "twitter": "https://x.com/ikea",
      "wikipedia": "https://en.wikipedia.org/wiki/IKEA"
    },
    "contactEmail": "careers@ikea.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-ebay",
    "slug": "ebay",
    "name": "eBay",
    "legalName": "eBay Corporation",
    "ticker": "EBAY",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "San Jose, CA, USA",
    "foundedYear": 1995,
    "industry": "E-Commerce & Tech",
    "subIndustry": "Global Consumer-to-Consumer Marketplace",
    "size": "10,000+",
    "employeeCount": "12,300+",
    "ownershipType": "Public",
    "website": "https://www.ebay.com",
    "careersUrl": "https://www.ebay.com",
    "logo": "EBAY",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ebay.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Global Consumer-to-Consumer Marketplace.",
    "shortDescription": "Verified company profile and career opportunities at eBay.",
    "overview": "eBay is a global market leader operating in E-Commerce & Tech with a focus on Global Consumer-to-Consumer Marketplace. Headquartered in San Jose, CA, USA and founded in 1995, eBay employs over 12,300+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in E-Commerce & Tech.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-ebay-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at eBay.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at eBay?",
        "answer": "You can explore active verified openings at eBay directly on WorkoraJobs or visit their official careers portal at https://www.ebay.com."
      },
      {
        "question": "Does eBay offer remote work or internship roles?",
        "answer": "Yes, eBay offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/ebay",
      "twitter": "https://x.com/ebay",
      "wikipedia": "https://en.wikipedia.org/wiki/eBay"
    },
    "contactEmail": "careers@ebay.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-alibaba",
    "slug": "alibaba",
    "name": "Alibaba",
    "legalName": "Alibaba Corporation",
    "ticker": "BABA",
    "stockExchange": "NYSE",
    "country": "China",
    "headquarters": "Hangzhou, China",
    "foundedYear": 1999,
    "industry": "E-Commerce & Tech",
    "subIndustry": "Global Wholesale & Cloud Intelligence",
    "size": "10,000+",
    "employeeCount": "219,000+",
    "ownershipType": "Public",
    "website": "https://www.alibabagroup.com",
    "careersUrl": "https://www.alibabagroup.com",
    "logo": "BABA",
    "logoUrl": "https://www.google.com/s2/favicons?domain=alibabagroup.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Global Wholesale & Cloud Intelligence.",
    "shortDescription": "Verified company profile and career opportunities at Alibaba.",
    "overview": "Alibaba is a global market leader operating in E-Commerce & Tech with a focus on Global Wholesale & Cloud Intelligence. Headquartered in Hangzhou, China and founded in 1999, Alibaba employs over 219,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in E-Commerce & Tech.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-alibaba-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Alibaba.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Alibaba?",
        "answer": "You can explore active verified openings at Alibaba directly on WorkoraJobs or visit their official careers portal at https://www.alibabagroup.com."
      },
      {
        "question": "Does Alibaba offer remote work or internship roles?",
        "answer": "Yes, Alibaba offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/alibaba",
      "twitter": "https://x.com/alibaba",
      "wikipedia": "https://en.wikipedia.org/wiki/Alibaba"
    },
    "contactEmail": "careers@alibabagroup.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-rakuten",
    "slug": "rakuten",
    "name": "Rakuten",
    "legalName": "Rakuten Corporation",
    "ticker": "4755",
    "stockExchange": "Tokyo Stock Exchange",
    "country": "Japan",
    "headquarters": "Tokyo, Japan",
    "foundedYear": 1997,
    "industry": "E-Commerce & Mobile",
    "subIndustry": "E-Commerce Ecosystem & 5G OpenRAN Networks",
    "size": "10,000+",
    "employeeCount": "32,000+",
    "ownershipType": "Public",
    "website": "https://www.rakuten.com",
    "careersUrl": "https://www.rakuten.com",
    "logo": "4755",
    "logoUrl": "https://www.google.com/s2/favicons?domain=rakuten.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in E-Commerce Ecosystem & 5G OpenRAN Networks.",
    "shortDescription": "Verified company profile and career opportunities at Rakuten.",
    "overview": "Rakuten is a global market leader operating in E-Commerce & Mobile with a focus on E-Commerce Ecosystem & 5G OpenRAN Networks. Headquartered in Tokyo, Japan and founded in 1997, Rakuten employs over 32,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in E-Commerce & Mobile.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "JavaScript",
      "SQL",
      "SAP",
      "Cloud Infrastructure",
      "React"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-rakuten-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Rakuten.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Rakuten?",
        "answer": "You can explore active verified openings at Rakuten directly on WorkoraJobs or visit their official careers portal at https://www.rakuten.com."
      },
      {
        "question": "Does Rakuten offer remote work or internship roles?",
        "answer": "Yes, Rakuten offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/rakuten",
      "twitter": "https://x.com/rakuten",
      "wikipedia": "https://en.wikipedia.org/wiki/Rakuten"
    },
    "contactEmail": "careers@rakuten.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-home-depot",
    "slug": "home-depot",
    "name": "Home Depot",
    "legalName": "Home Depot Corporation",
    "ticker": "HD",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Atlanta, GA, USA",
    "foundedYear": 1978,
    "industry": "Retail & Home Improvement",
    "subIndustry": "Building Materials & Pro Supply",
    "size": "10,000+",
    "employeeCount": "475,000+",
    "ownershipType": "Public",
    "website": "https://www.homedepot.com",
    "careersUrl": "https://www.homedepot.com",
    "logo": "HD",
    "logoUrl": "https://www.google.com/s2/favicons?domain=homedepot.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Building Materials & Pro Supply.",
    "shortDescription": "Verified company profile and career opportunities at Home Depot.",
    "overview": "Home Depot is a global market leader operating in Retail & Home Improvement with a focus on Building Materials & Pro Supply. Headquartered in Atlanta, GA, USA and founded in 1978, Home Depot employs over 475,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Retail & Home Improvement.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-home-depot-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Home Depot.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Home Depot?",
        "answer": "You can explore active verified openings at Home Depot directly on WorkoraJobs or visit their official careers portal at https://www.homedepot.com."
      },
      {
        "question": "Does Home Depot offer remote work or internship roles?",
        "answer": "Yes, Home Depot offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/home-depot",
      "twitter": "https://x.com/home-depot",
      "wikipedia": "https://en.wikipedia.org/wiki/Home_Depot"
    },
    "contactEmail": "careers@homedepot.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-lowes",
    "slug": "lowes",
    "name": "Lowe's",
    "legalName": "Lowe's Corporation",
    "ticker": "LOW",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Mooresville, NC, USA",
    "foundedYear": 1921,
    "industry": "Retail & Home Improvement",
    "subIndustry": "Home Improvement & Hardware Distribution",
    "size": "10,000+",
    "employeeCount": "300,000+",
    "ownershipType": "Public",
    "website": "https://www.lowes.com",
    "careersUrl": "https://www.lowes.com",
    "logo": "LOW",
    "logoUrl": "https://www.google.com/s2/favicons?domain=lowes.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Home Improvement & Hardware Distribution.",
    "shortDescription": "Verified company profile and career opportunities at Lowe's.",
    "overview": "Lowe's is a global market leader operating in Retail & Home Improvement with a focus on Home Improvement & Hardware Distribution. Headquartered in Mooresville, NC, USA and founded in 1921, Lowe's employs over 300,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Retail & Home Improvement.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-lowes-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Lowe's.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Lowe's?",
        "answer": "You can explore active verified openings at Lowe's directly on WorkoraJobs or visit their official careers portal at https://www.lowes.com."
      },
      {
        "question": "Does Lowe's offer remote work or internship roles?",
        "answer": "Yes, Lowe's offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/lowes",
      "twitter": "https://x.com/lowes",
      "wikipedia": "https://en.wikipedia.org/wiki/Lowe's"
    },
    "contactEmail": "careers@lowes.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-best-buy",
    "slug": "best-buy",
    "name": "Best Buy",
    "legalName": "Best Buy Corporation",
    "ticker": "BBY",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Richfield, MN, USA",
    "foundedYear": 1966,
    "industry": "Retail & Consumer Tech",
    "subIndustry": "Consumer Electronics & Geek Squad Tech Services",
    "size": "10,000+",
    "employeeCount": "90,000+",
    "ownershipType": "Public",
    "website": "https://www.bestbuy.com",
    "careersUrl": "https://www.bestbuy.com",
    "logo": "BBY",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bestbuy.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Consumer Electronics & Geek Squad Tech Services.",
    "shortDescription": "Verified company profile and career opportunities at Best Buy.",
    "overview": "Best Buy is a global market leader operating in Retail & Consumer Tech with a focus on Consumer Electronics & Geek Squad Tech Services. Headquartered in Richfield, MN, USA and founded in 1966, Best Buy employs over 90,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Retail & Consumer Tech.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "AWS",
      "Docker",
      "Kubernetes",
      "C++"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-best-buy-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Best Buy.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Best Buy?",
        "answer": "You can explore active verified openings at Best Buy directly on WorkoraJobs or visit their official careers portal at https://www.bestbuy.com."
      },
      {
        "question": "Does Best Buy offer remote work or internship roles?",
        "answer": "Yes, Best Buy offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/best-buy",
      "twitter": "https://x.com/best-buy",
      "wikipedia": "https://en.wikipedia.org/wiki/Best_Buy"
    },
    "contactEmail": "careers@bestbuy.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-jpmorgan-chase",
    "slug": "jpmorgan-chase",
    "name": "JPMorgan Chase",
    "legalName": "JPMorgan Chase Corporation",
    "ticker": "JPM",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "New York, NY, USA",
    "foundedYear": 1799,
    "industry": "Banking & Financial Services",
    "subIndustry": "Investment Banking & Wealth Management",
    "size": "10,000+",
    "employeeCount": "309,000+",
    "ownershipType": "Public",
    "website": "https://www.jpmorganchase.com",
    "careersUrl": "https://www.jpmorganchase.com",
    "logo": "JPM",
    "logoUrl": "https://www.google.com/s2/favicons?domain=jpmorganchase.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Investment Banking & Wealth Management.",
    "shortDescription": "Verified company profile and career opportunities at JPMorgan Chase.",
    "overview": "JPMorgan Chase is a global market leader operating in Banking & Financial Services with a focus on Investment Banking & Wealth Management. Headquartered in New York, NY, USA and founded in 1799, JPMorgan Chase employs over 309,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Banking & Financial Services.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "Oracle",
      "Python",
      "Kafka",
      "SQL",
      "Microservices"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-jpmorgan-chase-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at JPMorgan Chase.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at JPMorgan Chase?",
        "answer": "You can explore active verified openings at JPMorgan Chase directly on WorkoraJobs or visit their official careers portal at https://www.jpmorganchase.com."
      },
      {
        "question": "Does JPMorgan Chase offer remote work or internship roles?",
        "answer": "Yes, JPMorgan Chase offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/jpmorgan-chase",
      "twitter": "https://x.com/jpmorgan-chase",
      "wikipedia": "https://en.wikipedia.org/wiki/JPMorgan_Chase"
    },
    "contactEmail": "careers@jpmorganchase.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-bank-of-america",
    "slug": "bank-of-america",
    "name": "Bank of America",
    "legalName": "Bank of America Corporation",
    "ticker": "BAC",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Charlotte, NC, USA",
    "foundedYear": 1998,
    "industry": "Banking & Financial Services",
    "subIndustry": "Consumer Banking & Financial Markets",
    "size": "10,000+",
    "employeeCount": "213,000+",
    "ownershipType": "Public",
    "website": "https://www.bankofamerica.com",
    "careersUrl": "https://www.bankofamerica.com",
    "logo": "BAC",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bankofamerica.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Consumer Banking & Financial Markets.",
    "shortDescription": "Verified company profile and career opportunities at Bank of America.",
    "overview": "Bank of America is a global market leader operating in Banking & Financial Services with a focus on Consumer Banking & Financial Markets. Headquartered in Charlotte, NC, USA and founded in 1998, Bank of America employs over 213,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Banking & Financial Services.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "Oracle",
      "Python",
      "Kafka",
      "SQL",
      "Microservices"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-bank-of-america-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Bank of America.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Bank of America?",
        "answer": "You can explore active verified openings at Bank of America directly on WorkoraJobs or visit their official careers portal at https://www.bankofamerica.com."
      },
      {
        "question": "Does Bank of America offer remote work or internship roles?",
        "answer": "Yes, Bank of America offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/bank-of-america",
      "twitter": "https://x.com/bank-of-america",
      "wikipedia": "https://en.wikipedia.org/wiki/Bank_of_America"
    },
    "contactEmail": "careers@bankofamerica.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-goldman-sachs",
    "slug": "goldman-sachs",
    "name": "Goldman Sachs",
    "legalName": "Goldman Sachs Corporation",
    "ticker": "GS",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "New York, NY, USA",
    "foundedYear": 1869,
    "industry": "Banking & Financial Services",
    "subIndustry": "Global Investment Banking & Asset Management",
    "size": "10,000+",
    "employeeCount": "45,000+",
    "ownershipType": "Public",
    "website": "https://www.goldmansachs.com",
    "careersUrl": "https://www.goldmansachs.com",
    "logo": "GS",
    "logoUrl": "https://www.google.com/s2/favicons?domain=goldmansachs.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Global Investment Banking & Asset Management.",
    "shortDescription": "Verified company profile and career opportunities at Goldman Sachs.",
    "overview": "Goldman Sachs is a global market leader operating in Banking & Financial Services with a focus on Global Investment Banking & Asset Management. Headquartered in New York, NY, USA and founded in 1869, Goldman Sachs employs over 45,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Banking & Financial Services.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "Oracle",
      "Python",
      "Kafka",
      "SQL",
      "Microservices"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-goldman-sachs-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Goldman Sachs.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Goldman Sachs?",
        "answer": "You can explore active verified openings at Goldman Sachs directly on WorkoraJobs or visit their official careers portal at https://www.goldmansachs.com."
      },
      {
        "question": "Does Goldman Sachs offer remote work or internship roles?",
        "answer": "Yes, Goldman Sachs offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/goldman-sachs",
      "twitter": "https://x.com/goldman-sachs",
      "wikipedia": "https://en.wikipedia.org/wiki/Goldman_Sachs"
    },
    "contactEmail": "careers@goldmansachs.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-morgan-stanley",
    "slug": "morgan-stanley",
    "name": "Morgan Stanley",
    "legalName": "Morgan Stanley Corporation",
    "ticker": "MS",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "New York, NY, USA",
    "foundedYear": 1935,
    "industry": "Banking & Financial Services",
    "subIndustry": "Institutional Securities & Wealth Advisory",
    "size": "10,000+",
    "employeeCount": "80,000+",
    "ownershipType": "Public",
    "website": "https://www.morganstanley.com",
    "careersUrl": "https://www.morganstanley.com",
    "logo": "MS",
    "logoUrl": "https://www.google.com/s2/favicons?domain=morganstanley.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Institutional Securities & Wealth Advisory.",
    "shortDescription": "Verified company profile and career opportunities at Morgan Stanley.",
    "overview": "Morgan Stanley is a global market leader operating in Banking & Financial Services with a focus on Institutional Securities & Wealth Advisory. Headquartered in New York, NY, USA and founded in 1935, Morgan Stanley employs over 80,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Banking & Financial Services.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "Oracle",
      "Python",
      "Kafka",
      "SQL",
      "Microservices"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-morgan-stanley-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Morgan Stanley.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Morgan Stanley?",
        "answer": "You can explore active verified openings at Morgan Stanley directly on WorkoraJobs or visit their official careers portal at https://www.morganstanley.com."
      },
      {
        "question": "Does Morgan Stanley offer remote work or internship roles?",
        "answer": "Yes, Morgan Stanley offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/morgan-stanley",
      "twitter": "https://x.com/morgan-stanley",
      "wikipedia": "https://en.wikipedia.org/wiki/Morgan_Stanley"
    },
    "contactEmail": "careers@morganstanley.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-citigroup",
    "slug": "citigroup",
    "name": "Citigroup",
    "legalName": "Citigroup Corporation",
    "ticker": "C",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "New York, NY, USA",
    "foundedYear": 1812,
    "industry": "Banking & Financial Services",
    "subIndustry": "Global Corporate & Treasury Services",
    "size": "10,000+",
    "employeeCount": "239,000+",
    "ownershipType": "Public",
    "website": "https://www.citigroup.com",
    "careersUrl": "https://www.citigroup.com",
    "logo": "C",
    "logoUrl": "https://www.google.com/s2/favicons?domain=citigroup.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Global Corporate & Treasury Services.",
    "shortDescription": "Verified company profile and career opportunities at Citigroup.",
    "overview": "Citigroup is a global market leader operating in Banking & Financial Services with a focus on Global Corporate & Treasury Services. Headquartered in New York, NY, USA and founded in 1812, Citigroup employs over 239,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Banking & Financial Services.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "Oracle",
      "Python",
      "Kafka",
      "SQL",
      "Microservices"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-citigroup-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Citigroup.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Citigroup?",
        "answer": "You can explore active verified openings at Citigroup directly on WorkoraJobs or visit their official careers portal at https://www.citigroup.com."
      },
      {
        "question": "Does Citigroup offer remote work or internship roles?",
        "answer": "Yes, Citigroup offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/citigroup",
      "twitter": "https://x.com/citigroup",
      "wikipedia": "https://en.wikipedia.org/wiki/Citigroup"
    },
    "contactEmail": "careers@citigroup.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-visa",
    "slug": "visa",
    "name": "Visa",
    "legalName": "Visa Corporation",
    "ticker": "V",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "San Francisco, CA, USA",
    "foundedYear": 1958,
    "industry": "Financial Services & Payments",
    "subIndustry": "Digital Payment Processing & Card Security",
    "size": "10,000+",
    "employeeCount": "28,800+",
    "ownershipType": "Public",
    "website": "https://www.visa.com",
    "careersUrl": "https://www.visa.com",
    "logo": "V",
    "logoUrl": "https://www.google.com/s2/favicons?domain=visa.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Digital Payment Processing & Card Security.",
    "shortDescription": "Verified company profile and career opportunities at Visa.",
    "overview": "Visa is a global market leader operating in Financial Services & Payments with a focus on Digital Payment Processing & Card Security. Headquartered in San Francisco, CA, USA and founded in 1958, Visa employs over 28,800+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Financial Services & Payments.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "Oracle",
      "Python",
      "Kafka",
      "SQL",
      "Microservices"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-visa-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Visa.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Visa?",
        "answer": "You can explore active verified openings at Visa directly on WorkoraJobs or visit their official careers portal at https://www.visa.com."
      },
      {
        "question": "Does Visa offer remote work or internship roles?",
        "answer": "Yes, Visa offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/visa",
      "twitter": "https://x.com/visa",
      "wikipedia": "https://en.wikipedia.org/wiki/Visa"
    },
    "contactEmail": "careers@visa.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-mastercard",
    "slug": "mastercard",
    "name": "Mastercard",
    "legalName": "Mastercard Corporation",
    "ticker": "MA",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Purchase, NY, USA",
    "foundedYear": 1966,
    "industry": "Financial Services & Payments",
    "subIndustry": "Payment Processing & Cyber Intelligence",
    "size": "10,000+",
    "employeeCount": "33,400+",
    "ownershipType": "Public",
    "website": "https://www.mastercard.com",
    "careersUrl": "https://www.mastercard.com",
    "logo": "MA",
    "logoUrl": "https://www.google.com/s2/favicons?domain=mastercard.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Payment Processing & Cyber Intelligence.",
    "shortDescription": "Verified company profile and career opportunities at Mastercard.",
    "overview": "Mastercard is a global market leader operating in Financial Services & Payments with a focus on Payment Processing & Cyber Intelligence. Headquartered in Purchase, NY, USA and founded in 1966, Mastercard employs over 33,400+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Financial Services & Payments.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "Oracle",
      "Python",
      "Kafka",
      "SQL",
      "Microservices"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-mastercard-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Mastercard.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Mastercard?",
        "answer": "You can explore active verified openings at Mastercard directly on WorkoraJobs or visit their official careers portal at https://www.mastercard.com."
      },
      {
        "question": "Does Mastercard offer remote work or internship roles?",
        "answer": "Yes, Mastercard offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/mastercard",
      "twitter": "https://x.com/mastercard",
      "wikipedia": "https://en.wikipedia.org/wiki/Mastercard"
    },
    "contactEmail": "careers@mastercard.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-american-express",
    "slug": "american-express",
    "name": "American Express",
    "legalName": "American Express Corporation",
    "ticker": "AXP",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "New York, NY, USA",
    "foundedYear": 1850,
    "industry": "Financial Services & Credit",
    "subIndustry": "Premium Credit Cards & Merchant Services",
    "size": "10,000+",
    "employeeCount": "77,000+",
    "ownershipType": "Public",
    "website": "https://www.americanexpress.com",
    "careersUrl": "https://www.americanexpress.com",
    "logo": "AXP",
    "logoUrl": "https://www.google.com/s2/favicons?domain=americanexpress.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Premium Credit Cards & Merchant Services.",
    "shortDescription": "Verified company profile and career opportunities at American Express.",
    "overview": "American Express is a global market leader operating in Financial Services & Credit with a focus on Premium Credit Cards & Merchant Services. Headquartered in New York, NY, USA and founded in 1850, American Express employs over 77,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Financial Services & Credit.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "Oracle",
      "Python",
      "Kafka",
      "SQL",
      "Microservices"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-american-express-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at American Express.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at American Express?",
        "answer": "You can explore active verified openings at American Express directly on WorkoraJobs or visit their official careers portal at https://www.americanexpress.com."
      },
      {
        "question": "Does American Express offer remote work or internship roles?",
        "answer": "Yes, American Express offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/american-express",
      "twitter": "https://x.com/american-express",
      "wikipedia": "https://en.wikipedia.org/wiki/American_Express"
    },
    "contactEmail": "careers@americanexpress.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-hsbc",
    "slug": "hsbc",
    "name": "HSBC",
    "legalName": "HSBC Corporation",
    "ticker": "HSBC",
    "stockExchange": "NYSE",
    "country": "United Kingdom",
    "headquarters": "London, United Kingdom",
    "foundedYear": 1865,
    "industry": "Banking & Financial Services",
    "subIndustry": "International Trade & Commercial Banking",
    "size": "10,000+",
    "employeeCount": "220,000+",
    "ownershipType": "Public",
    "website": "https://www.hsbc.com",
    "careersUrl": "https://www.hsbc.com",
    "logo": "HSBC",
    "logoUrl": "https://www.google.com/s2/favicons?domain=hsbc.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in International Trade & Commercial Banking.",
    "shortDescription": "Verified company profile and career opportunities at HSBC.",
    "overview": "HSBC is a global market leader operating in Banking & Financial Services with a focus on International Trade & Commercial Banking. Headquartered in London, United Kingdom and founded in 1865, HSBC employs over 220,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Banking & Financial Services.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "Oracle",
      "Python",
      "Kafka",
      "SQL",
      "Microservices"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-hsbc-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at HSBC.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at HSBC?",
        "answer": "You can explore active verified openings at HSBC directly on WorkoraJobs or visit their official careers portal at https://www.hsbc.com."
      },
      {
        "question": "Does HSBC offer remote work or internship roles?",
        "answer": "Yes, HSBC offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/hsbc",
      "twitter": "https://x.com/hsbc",
      "wikipedia": "https://en.wikipedia.org/wiki/HSBC"
    },
    "contactEmail": "careers@hsbc.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-barclays",
    "slug": "barclays",
    "name": "Barclays",
    "legalName": "Barclays Corporation",
    "ticker": "BCS",
    "stockExchange": "NYSE",
    "country": "United Kingdom",
    "headquarters": "London, United Kingdom",
    "foundedYear": 1690,
    "industry": "Banking & Financial Services",
    "subIndustry": "Universal Banking & Capital Markets",
    "size": "10,000+",
    "employeeCount": "92,000+",
    "ownershipType": "Public",
    "website": "https://www.home.barclays",
    "careersUrl": "https://www.home.barclays",
    "logo": "BCS",
    "logoUrl": "https://www.google.com/s2/favicons?domain=home.barclays&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Universal Banking & Capital Markets.",
    "shortDescription": "Verified company profile and career opportunities at Barclays.",
    "overview": "Barclays is a global market leader operating in Banking & Financial Services with a focus on Universal Banking & Capital Markets. Headquartered in London, United Kingdom and founded in 1690, Barclays employs over 92,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Banking & Financial Services.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "Oracle",
      "Python",
      "Kafka",
      "SQL",
      "Microservices"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-barclays-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Barclays.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Barclays?",
        "answer": "You can explore active verified openings at Barclays directly on WorkoraJobs or visit their official careers portal at https://www.home.barclays."
      },
      {
        "question": "Does Barclays offer remote work or internship roles?",
        "answer": "Yes, Barclays offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/barclays",
      "twitter": "https://x.com/barclays",
      "wikipedia": "https://en.wikipedia.org/wiki/Barclays"
    },
    "contactEmail": "careers@home.barclays",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-coca-cola",
    "slug": "coca-cola",
    "name": "Coca-Cola",
    "legalName": "Coca-Cola Corporation",
    "ticker": "KO",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Atlanta, GA, USA",
    "foundedYear": 1892,
    "industry": "FMCG & Beverages",
    "subIndustry": "Non-Alcoholic Beverage Brands",
    "size": "10,000+",
    "employeeCount": "79,000+",
    "ownershipType": "Public",
    "website": "https://www.coca-colacompany.com",
    "careersUrl": "https://www.coca-colacompany.com",
    "logo": "KO",
    "logoUrl": "https://www.google.com/s2/favicons?domain=coca-colacompany.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Non-Alcoholic Beverage Brands.",
    "shortDescription": "Verified company profile and career opportunities at Coca-Cola.",
    "overview": "Coca-Cola is a global market leader operating in FMCG & Beverages with a focus on Non-Alcoholic Beverage Brands. Headquartered in Atlanta, GA, USA and founded in 1892, Coca-Cola employs over 79,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in FMCG & Beverages.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-coca-cola-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Coca-Cola.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Coca-Cola?",
        "answer": "You can explore active verified openings at Coca-Cola directly on WorkoraJobs or visit their official careers portal at https://www.coca-colacompany.com."
      },
      {
        "question": "Does Coca-Cola offer remote work or internship roles?",
        "answer": "Yes, Coca-Cola offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/coca-cola",
      "twitter": "https://x.com/coca-cola",
      "wikipedia": "https://en.wikipedia.org/wiki/Coca-Cola"
    },
    "contactEmail": "careers@coca-colacompany.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-pepsico",
    "slug": "pepsico",
    "name": "PepsiCo",
    "legalName": "PepsiCo Corporation",
    "ticker": "PEP",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "Purchase, NY, USA",
    "foundedYear": 1965,
    "industry": "FMCG & Food",
    "subIndustry": "Snack Foods (Frito-Lay) & Beverage Brands",
    "size": "10,000+",
    "employeeCount": "318,000+",
    "ownershipType": "Public",
    "website": "https://www.pepsico.com",
    "careersUrl": "https://www.pepsico.com",
    "logo": "PEP",
    "logoUrl": "https://www.google.com/s2/favicons?domain=pepsico.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Snack Foods (Frito-Lay) & Beverage Brands.",
    "shortDescription": "Verified company profile and career opportunities at PepsiCo.",
    "overview": "PepsiCo is a global market leader operating in FMCG & Food with a focus on Snack Foods (Frito-Lay) & Beverage Brands. Headquartered in Purchase, NY, USA and founded in 1965, PepsiCo employs over 318,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in FMCG & Food.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-pepsico-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at PepsiCo.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at PepsiCo?",
        "answer": "You can explore active verified openings at PepsiCo directly on WorkoraJobs or visit their official careers portal at https://www.pepsico.com."
      },
      {
        "question": "Does PepsiCo offer remote work or internship roles?",
        "answer": "Yes, PepsiCo offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/pepsico",
      "twitter": "https://x.com/pepsico",
      "wikipedia": "https://en.wikipedia.org/wiki/PepsiCo"
    },
    "contactEmail": "careers@pepsico.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-nestle",
    "slug": "nestle",
    "name": "Nestl\u00e9",
    "legalName": "Nestl\u00e9 Corporation",
    "ticker": "NESN",
    "stockExchange": "SIX Swiss Exchange",
    "country": "Switzerland",
    "headquarters": "Vevey, Switzerland",
    "foundedYear": 1866,
    "industry": "FMCG & Nutrition",
    "subIndustry": "Packaged Foods, Coffee & Health Science",
    "size": "10,000+",
    "employeeCount": "270,000+",
    "ownershipType": "Public",
    "website": "https://www.nestle.com",
    "careersUrl": "https://www.nestle.com",
    "logo": "NESN",
    "logoUrl": "https://www.google.com/s2/favicons?domain=nestle.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Packaged Foods, Coffee & Health Science.",
    "shortDescription": "Verified company profile and career opportunities at Nestl\u00e9.",
    "overview": "Nestl\u00e9 is a global market leader operating in FMCG & Nutrition with a focus on Packaged Foods, Coffee & Health Science. Headquartered in Vevey, Switzerland and founded in 1866, Nestl\u00e9 employs over 270,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in FMCG & Nutrition.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-nestle-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Nestl\u00e9.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Nestl\u00e9?",
        "answer": "You can explore active verified openings at Nestl\u00e9 directly on WorkoraJobs or visit their official careers portal at https://www.nestle.com."
      },
      {
        "question": "Does Nestl\u00e9 offer remote work or internship roles?",
        "answer": "Yes, Nestl\u00e9 offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/nestle",
      "twitter": "https://x.com/nestle",
      "wikipedia": "https://en.wikipedia.org/wiki/Nestl\u00e9"
    },
    "contactEmail": "careers@nestle.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-unilever",
    "slug": "unilever",
    "name": "Unilever",
    "legalName": "Unilever Corporation",
    "ticker": "UL",
    "stockExchange": "NYSE",
    "country": "United Kingdom",
    "headquarters": "London, United Kingdom",
    "foundedYear": 1929,
    "industry": "FMCG & Consumer Goods",
    "subIndustry": "Personal Care, Home Care & Nutrition",
    "size": "10,000+",
    "employeeCount": "128,000+",
    "ownershipType": "Public",
    "website": "https://www.unilever.com",
    "careersUrl": "https://www.unilever.com",
    "logo": "UL",
    "logoUrl": "https://www.google.com/s2/favicons?domain=unilever.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Personal Care, Home Care & Nutrition.",
    "shortDescription": "Verified company profile and career opportunities at Unilever.",
    "overview": "Unilever is a global market leader operating in FMCG & Consumer Goods with a focus on Personal Care, Home Care & Nutrition. Headquartered in London, United Kingdom and founded in 1929, Unilever employs over 128,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in FMCG & Consumer Goods.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-unilever-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Unilever.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Unilever?",
        "answer": "You can explore active verified openings at Unilever directly on WorkoraJobs or visit their official careers portal at https://www.unilever.com."
      },
      {
        "question": "Does Unilever offer remote work or internship roles?",
        "answer": "Yes, Unilever offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/unilever",
      "twitter": "https://x.com/unilever",
      "wikipedia": "https://en.wikipedia.org/wiki/Unilever"
    },
    "contactEmail": "careers@unilever.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-procter-gamble",
    "slug": "procter-gamble",
    "name": "Procter & Gamble",
    "legalName": "Procter & Gamble Corporation",
    "ticker": "PG",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Cincinnati, OH, USA",
    "foundedYear": 1837,
    "industry": "FMCG & Consumer Goods",
    "subIndustry": "Household Hygiene & Personal Care Products",
    "size": "10,000+",
    "employeeCount": "107,000+",
    "ownershipType": "Public",
    "website": "https://www.pg.com",
    "careersUrl": "https://www.pg.com",
    "logo": "PG",
    "logoUrl": "https://www.google.com/s2/favicons?domain=pg.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Household Hygiene & Personal Care Products.",
    "shortDescription": "Verified company profile and career opportunities at Procter & Gamble.",
    "overview": "Procter & Gamble is a global market leader operating in FMCG & Consumer Goods with a focus on Household Hygiene & Personal Care Products. Headquartered in Cincinnati, OH, USA and founded in 1837, Procter & Gamble employs over 107,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in FMCG & Consumer Goods.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-procter-gamble-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Procter & Gamble.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Procter & Gamble?",
        "answer": "You can explore active verified openings at Procter & Gamble directly on WorkoraJobs or visit their official careers portal at https://www.pg.com."
      },
      {
        "question": "Does Procter & Gamble offer remote work or internship roles?",
        "answer": "Yes, Procter & Gamble offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/procter-gamble",
      "twitter": "https://x.com/procter-gamble",
      "wikipedia": "https://en.wikipedia.org/wiki/Procter_&_Gamble"
    },
    "contactEmail": "careers@pg.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-mcdonalds",
    "slug": "mcdonalds",
    "name": "McDonald's",
    "legalName": "McDonald's Corporation",
    "ticker": "MCD",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Chicago, IL, USA",
    "foundedYear": 1940,
    "industry": "Hospitality & Restaurants",
    "subIndustry": "Global Quick Service Restaurants & Franchising",
    "size": "10,000+",
    "employeeCount": "150,000+",
    "ownershipType": "Public",
    "website": "https://www.mcdonalds.com",
    "careersUrl": "https://www.mcdonalds.com",
    "logo": "MCD",
    "logoUrl": "https://www.google.com/s2/favicons?domain=mcdonalds.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Global Quick Service Restaurants & Franchising.",
    "shortDescription": "Verified company profile and career opportunities at McDonald's.",
    "overview": "McDonald's is a global market leader operating in Hospitality & Restaurants with a focus on Global Quick Service Restaurants & Franchising. Headquartered in Chicago, IL, USA and founded in 1940, McDonald's employs over 150,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Hospitality & Restaurants.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "JavaScript",
      "SQL",
      "SAP",
      "Cloud Infrastructure",
      "React"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-mcdonalds-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at McDonald's.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at McDonald's?",
        "answer": "You can explore active verified openings at McDonald's directly on WorkoraJobs or visit their official careers portal at https://www.mcdonalds.com."
      },
      {
        "question": "Does McDonald's offer remote work or internship roles?",
        "answer": "Yes, McDonald's offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/mcdonalds",
      "twitter": "https://x.com/mcdonalds",
      "wikipedia": "https://en.wikipedia.org/wiki/McDonald's"
    },
    "contactEmail": "careers@mcdonalds.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-starbucks",
    "slug": "starbucks",
    "name": "Starbucks",
    "legalName": "Starbucks Corporation",
    "ticker": "SBUX",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "Seattle, WA, USA",
    "foundedYear": 1971,
    "industry": "Hospitality & Food",
    "subIndustry": "Specialty Coffee Roasting & Store Operations",
    "size": "10,000+",
    "employeeCount": "381,000+",
    "ownershipType": "Public",
    "website": "https://www.starbucks.com",
    "careersUrl": "https://www.starbucks.com",
    "logo": "SBUX",
    "logoUrl": "https://www.google.com/s2/favicons?domain=starbucks.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Specialty Coffee Roasting & Store Operations.",
    "shortDescription": "Verified company profile and career opportunities at Starbucks.",
    "overview": "Starbucks is a global market leader operating in Hospitality & Food with a focus on Specialty Coffee Roasting & Store Operations. Headquartered in Seattle, WA, USA and founded in 1971, Starbucks employs over 381,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Hospitality & Food.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "JavaScript",
      "SQL",
      "SAP",
      "Cloud Infrastructure",
      "React"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-starbucks-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Starbucks.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Starbucks?",
        "answer": "You can explore active verified openings at Starbucks directly on WorkoraJobs or visit their official careers portal at https://www.starbucks.com."
      },
      {
        "question": "Does Starbucks offer remote work or internship roles?",
        "answer": "Yes, Starbucks offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/starbucks",
      "twitter": "https://x.com/starbucks",
      "wikipedia": "https://en.wikipedia.org/wiki/Starbucks"
    },
    "contactEmail": "careers@starbucks.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-kfc",
    "slug": "kfc",
    "name": "KFC",
    "legalName": "KFC Corporation",
    "ticker": "YUM",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Louisville, KY, USA",
    "foundedYear": 1952,
    "industry": "Hospitality & Restaurants",
    "subIndustry": "Quick Service Fried Chicken Restaurants",
    "size": "10,000+",
    "employeeCount": "30,000+",
    "ownershipType": "Public",
    "website": "https://www.kfc.com",
    "careersUrl": "https://www.kfc.com",
    "logo": "YUM",
    "logoUrl": "https://www.google.com/s2/favicons?domain=kfc.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Quick Service Fried Chicken Restaurants.",
    "shortDescription": "Verified company profile and career opportunities at KFC.",
    "overview": "KFC is a global market leader operating in Hospitality & Restaurants with a focus on Quick Service Fried Chicken Restaurants. Headquartered in Louisville, KY, USA and founded in 1952, KFC employs over 30,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Hospitality & Restaurants.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "JavaScript",
      "SQL",
      "SAP",
      "Cloud Infrastructure",
      "React"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-kfc-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at KFC.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at KFC?",
        "answer": "You can explore active verified openings at KFC directly on WorkoraJobs or visit their official careers portal at https://www.kfc.com."
      },
      {
        "question": "Does KFC offer remote work or internship roles?",
        "answer": "Yes, KFC offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/kfc",
      "twitter": "https://x.com/kfc",
      "wikipedia": "https://en.wikipedia.org/wiki/KFC"
    },
    "contactEmail": "careers@kfc.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-dominos",
    "slug": "dominos",
    "name": "Domino's",
    "legalName": "Domino's Corporation",
    "ticker": "DPZ",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Ann Arbor, MI, USA",
    "foundedYear": 1960,
    "industry": "Hospitality & Food",
    "subIndustry": "Pizza Delivery & Digital Ordering Platforms",
    "size": "10,000+",
    "employeeCount": "14,000+",
    "ownershipType": "Public",
    "website": "https://www.dominos.com",
    "careersUrl": "https://www.dominos.com",
    "logo": "DPZ",
    "logoUrl": "https://www.google.com/s2/favicons?domain=dominos.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Pizza Delivery & Digital Ordering Platforms.",
    "shortDescription": "Verified company profile and career opportunities at Domino's.",
    "overview": "Domino's is a global market leader operating in Hospitality & Food with a focus on Pizza Delivery & Digital Ordering Platforms. Headquartered in Ann Arbor, MI, USA and founded in 1960, Domino's employs over 14,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Hospitality & Food.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "JavaScript",
      "SQL",
      "SAP",
      "Cloud Infrastructure",
      "React"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-dominos-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Domino's.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Domino's?",
        "answer": "You can explore active verified openings at Domino's directly on WorkoraJobs or visit their official careers portal at https://www.dominos.com."
      },
      {
        "question": "Does Domino's offer remote work or internship roles?",
        "answer": "Yes, Domino's offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/dominos",
      "twitter": "https://x.com/dominos",
      "wikipedia": "https://en.wikipedia.org/wiki/Domino's"
    },
    "contactEmail": "careers@dominos.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-mondelez",
    "slug": "mondelez",
    "name": "Mondelez International",
    "legalName": "Mondelez International Corporation",
    "ticker": "MDLZ",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "Chicago, IL, USA",
    "foundedYear": 2012,
    "industry": "FMCG & Confectionery",
    "subIndustry": "Snacks, Chocolates (Cadbury, Oreo) & Biscuits",
    "size": "10,000+",
    "employeeCount": "91,000+",
    "ownershipType": "Public",
    "website": "https://www.mondelezinternational.com",
    "careersUrl": "https://www.mondelezinternational.com",
    "logo": "MDLZ",
    "logoUrl": "https://www.google.com/s2/favicons?domain=mondelezinternational.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Snacks, Chocolates (Cadbury, Oreo) & Biscuits.",
    "shortDescription": "Verified company profile and career opportunities at Mondelez International.",
    "overview": "Mondelez International is a global market leader operating in FMCG & Confectionery with a focus on Snacks, Chocolates (Cadbury, Oreo) & Biscuits. Headquartered in Chicago, IL, USA and founded in 2012, Mondelez International employs over 91,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in FMCG & Confectionery.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-mondelez-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Mondelez International.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Mondelez International?",
        "answer": "You can explore active verified openings at Mondelez International directly on WorkoraJobs or visit their official careers portal at https://www.mondelezinternational.com."
      },
      {
        "question": "Does Mondelez International offer remote work or internship roles?",
        "answer": "Yes, Mondelez International offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/mondelez",
      "twitter": "https://x.com/mondelez",
      "wikipedia": "https://en.wikipedia.org/wiki/Mondelez_International"
    },
    "contactEmail": "careers@mondelezinternational.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-nike",
    "slug": "nike",
    "name": "Nike",
    "legalName": "Nike Corporation",
    "ticker": "NKE",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Beaverton, OR, USA",
    "foundedYear": 1964,
    "industry": "Apparel & Sportswear",
    "subIndustry": "Athletic Footwear, Apparel & Equipment",
    "size": "10,000+",
    "employeeCount": "83,700+",
    "ownershipType": "Public",
    "website": "https://www.nike.com",
    "careersUrl": "https://www.nike.com",
    "logo": "NKE",
    "logoUrl": "https://www.google.com/s2/favicons?domain=nike.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Athletic Footwear, Apparel & Equipment.",
    "shortDescription": "Verified company profile and career opportunities at Nike.",
    "overview": "Nike is a global market leader operating in Apparel & Sportswear with a focus on Athletic Footwear, Apparel & Equipment. Headquartered in Beaverton, OR, USA and founded in 1964, Nike employs over 83,700+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Apparel & Sportswear.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-nike-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Nike.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Nike?",
        "answer": "You can explore active verified openings at Nike directly on WorkoraJobs or visit their official careers portal at https://www.nike.com."
      },
      {
        "question": "Does Nike offer remote work or internship roles?",
        "answer": "Yes, Nike offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/nike",
      "twitter": "https://x.com/nike",
      "wikipedia": "https://en.wikipedia.org/wiki/Nike"
    },
    "contactEmail": "careers@nike.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-adidas",
    "slug": "adidas",
    "name": "Adidas",
    "legalName": "Adidas Corporation",
    "ticker": "ADS",
    "stockExchange": "XETRA",
    "country": "Germany",
    "headquarters": "Herzogenaurach, Germany",
    "foundedYear": 1949,
    "industry": "Apparel & Sportswear",
    "subIndustry": "Sports Shoes, Outdoor Apparel & Equipment",
    "size": "10,000+",
    "employeeCount": "59,000+",
    "ownershipType": "Public",
    "website": "https://www.adidas-group.com",
    "careersUrl": "https://www.adidas-group.com",
    "logo": "ADS",
    "logoUrl": "https://www.google.com/s2/favicons?domain=adidas-group.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Sports Shoes, Outdoor Apparel & Equipment.",
    "shortDescription": "Verified company profile and career opportunities at Adidas.",
    "overview": "Adidas is a global market leader operating in Apparel & Sportswear with a focus on Sports Shoes, Outdoor Apparel & Equipment. Headquartered in Herzogenaurach, Germany and founded in 1949, Adidas employs over 59,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Apparel & Sportswear.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-adidas-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Adidas.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Adidas?",
        "answer": "You can explore active verified openings at Adidas directly on WorkoraJobs or visit their official careers portal at https://www.adidas-group.com."
      },
      {
        "question": "Does Adidas offer remote work or internship roles?",
        "answer": "Yes, Adidas offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/adidas",
      "twitter": "https://x.com/adidas",
      "wikipedia": "https://en.wikipedia.org/wiki/Adidas"
    },
    "contactEmail": "careers@adidas-group.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-puma",
    "slug": "puma",
    "name": "Puma",
    "legalName": "Puma Corporation",
    "ticker": "PUM",
    "stockExchange": "XETRA",
    "country": "Germany",
    "headquarters": "Herzogenaurach, Germany",
    "foundedYear": 1948,
    "industry": "Apparel & Sportswear",
    "subIndustry": "Performance Athletic Footwear & Lifestyle",
    "size": "10,000+",
    "employeeCount": "20,000+",
    "ownershipType": "Public",
    "website": "https://www.puma.com",
    "careersUrl": "https://www.puma.com",
    "logo": "PUM",
    "logoUrl": "https://www.google.com/s2/favicons?domain=puma.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Performance Athletic Footwear & Lifestyle.",
    "shortDescription": "Verified company profile and career opportunities at Puma.",
    "overview": "Puma is a global market leader operating in Apparel & Sportswear with a focus on Performance Athletic Footwear & Lifestyle. Headquartered in Herzogenaurach, Germany and founded in 1948, Puma employs over 20,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Apparel & Sportswear.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-puma-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Puma.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Puma?",
        "answer": "You can explore active verified openings at Puma directly on WorkoraJobs or visit their official careers portal at https://www.puma.com."
      },
      {
        "question": "Does Puma offer remote work or internship roles?",
        "answer": "Yes, Puma offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/puma",
      "twitter": "https://x.com/puma",
      "wikipedia": "https://en.wikipedia.org/wiki/Puma"
    },
    "contactEmail": "careers@puma.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-zara",
    "slug": "zara",
    "name": "Zara",
    "legalName": "Zara Corporation",
    "ticker": "ITX",
    "stockExchange": "Bolsas y Mercados Espa\u00f1oles",
    "country": "Spain",
    "headquarters": "Arteixo, Spain",
    "foundedYear": 1975,
    "industry": "Apparel & Retail",
    "subIndustry": "Fast Fashion & Global Clothing Logistics",
    "size": "10,000+",
    "employeeCount": "160,000+",
    "ownershipType": "Public",
    "website": "https://www.inditex.com",
    "careersUrl": "https://www.inditex.com",
    "logo": "ITX",
    "logoUrl": "https://www.google.com/s2/favicons?domain=inditex.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Fast Fashion & Global Clothing Logistics.",
    "shortDescription": "Verified company profile and career opportunities at Zara.",
    "overview": "Zara is a global market leader operating in Apparel & Retail with a focus on Fast Fashion & Global Clothing Logistics. Headquartered in Arteixo, Spain and founded in 1975, Zara employs over 160,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Apparel & Retail.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-zara-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Zara.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Zara?",
        "answer": "You can explore active verified openings at Zara directly on WorkoraJobs or visit their official careers portal at https://www.inditex.com."
      },
      {
        "question": "Does Zara offer remote work or internship roles?",
        "answer": "Yes, Zara offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/zara",
      "twitter": "https://x.com/zara",
      "wikipedia": "https://en.wikipedia.org/wiki/Zara"
    },
    "contactEmail": "careers@inditex.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-hm",
    "slug": "hm",
    "name": "H&M",
    "legalName": "H&M Corporation",
    "ticker": "HM-B",
    "stockExchange": "Nasdaq Stockholm",
    "country": "Sweden",
    "headquarters": "Stockholm, Sweden",
    "foundedYear": 1947,
    "industry": "Apparel & Retail",
    "subIndustry": "Fashion Retail & Sustainable Garment Manufacturing",
    "size": "10,000+",
    "employeeCount": "100,000+",
    "ownershipType": "Public",
    "website": "https://www.hmgroup.com",
    "careersUrl": "https://www.hmgroup.com",
    "logo": "HM-B",
    "logoUrl": "https://www.google.com/s2/favicons?domain=hmgroup.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Fashion Retail & Sustainable Garment Manufacturing.",
    "shortDescription": "Verified company profile and career opportunities at H&M.",
    "overview": "H&M is a global market leader operating in Apparel & Retail with a focus on Fashion Retail & Sustainable Garment Manufacturing. Headquartered in Stockholm, Sweden and founded in 1947, H&M employs over 100,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Apparel & Retail.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-hm-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at H&M.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at H&M?",
        "answer": "You can explore active verified openings at H&M directly on WorkoraJobs or visit their official careers portal at https://www.hmgroup.com."
      },
      {
        "question": "Does H&M offer remote work or internship roles?",
        "answer": "Yes, H&M offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/hm",
      "twitter": "https://x.com/hm",
      "wikipedia": "https://en.wikipedia.org/wiki/H&M"
    },
    "contactEmail": "careers@hmgroup.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-uniqlo",
    "slug": "uniqlo",
    "name": "Uniqlo",
    "legalName": "Uniqlo Corporation",
    "ticker": "9983",
    "stockExchange": "Tokyo Stock Exchange",
    "country": "Japan",
    "headquarters": "Yamaguchi, Japan",
    "foundedYear": 1984,
    "industry": "Apparel & Retail",
    "subIndustry": "Casual Wear & Heattech Garment Technology",
    "size": "10,000+",
    "employeeCount": "58,000+",
    "ownershipType": "Public",
    "website": "https://www.fastretailing.com",
    "careersUrl": "https://www.fastretailing.com",
    "logo": "9983",
    "logoUrl": "https://www.google.com/s2/favicons?domain=fastretailing.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Casual Wear & Heattech Garment Technology.",
    "shortDescription": "Verified company profile and career opportunities at Uniqlo.",
    "overview": "Uniqlo is a global market leader operating in Apparel & Retail with a focus on Casual Wear & Heattech Garment Technology. Headquartered in Yamaguchi, Japan and founded in 1984, Uniqlo employs over 58,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Apparel & Retail.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-uniqlo-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Uniqlo.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Uniqlo?",
        "answer": "You can explore active verified openings at Uniqlo directly on WorkoraJobs or visit their official careers portal at https://www.fastretailing.com."
      },
      {
        "question": "Does Uniqlo offer remote work or internship roles?",
        "answer": "Yes, Uniqlo offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/uniqlo",
      "twitter": "https://x.com/uniqlo",
      "wikipedia": "https://en.wikipedia.org/wiki/Uniqlo"
    },
    "contactEmail": "careers@fastretailing.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-levi-strauss",
    "slug": "levi-strauss",
    "name": "Levi Strauss & Co.",
    "legalName": "Levi Strauss & Co. Corporation",
    "ticker": "LEVI",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "San Francisco, CA, USA",
    "foundedYear": 1853,
    "industry": "Apparel & Retail",
    "subIndustry": "Denim Jeans & Lifestyle Apparel",
    "size": "10,000+",
    "employeeCount": "19,000+",
    "ownershipType": "Public",
    "website": "https://www.levistrauss.com",
    "careersUrl": "https://www.levistrauss.com",
    "logo": "LEVI",
    "logoUrl": "https://www.google.com/s2/favicons?domain=levistrauss.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Denim Jeans & Lifestyle Apparel.",
    "shortDescription": "Verified company profile and career opportunities at Levi Strauss & Co..",
    "overview": "Levi Strauss & Co. is a global market leader operating in Apparel & Retail with a focus on Denim Jeans & Lifestyle Apparel. Headquartered in San Francisco, CA, USA and founded in 1853, Levi Strauss & Co. employs over 19,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Apparel & Retail.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "SAP HANA",
      "Python",
      "PowerBI",
      "React",
      "Azure",
      "Node.js",
      "Supply Chain AI"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-levi-strauss-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Levi Strauss & Co..",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Levi Strauss & Co.?",
        "answer": "You can explore active verified openings at Levi Strauss & Co. directly on WorkoraJobs or visit their official careers portal at https://www.levistrauss.com."
      },
      {
        "question": "Does Levi Strauss & Co. offer remote work or internship roles?",
        "answer": "Yes, Levi Strauss & Co. offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/levi-strauss",
      "twitter": "https://x.com/levi-strauss",
      "wikipedia": "https://en.wikipedia.org/wiki/Levi_Strauss_&_Co."
    },
    "contactEmail": "careers@levistrauss.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-gucci",
    "slug": "gucci",
    "name": "Gucci",
    "legalName": "Gucci Corporation",
    "ticker": "KER",
    "stockExchange": "Euronext Paris",
    "country": "Italy",
    "headquarters": "Florence, Italy",
    "foundedYear": 1921,
    "industry": "Luxury & Fashion",
    "subIndustry": "High Fashion Leather Goods & Apparel",
    "size": "10,000+",
    "employeeCount": "20,000+",
    "ownershipType": "Public",
    "website": "https://www.kering.com",
    "careersUrl": "https://www.kering.com",
    "logo": "KER",
    "logoUrl": "https://www.google.com/s2/favicons?domain=kering.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in High Fashion Leather Goods & Apparel.",
    "shortDescription": "Verified company profile and career opportunities at Gucci.",
    "overview": "Gucci is a global market leader operating in Luxury & Fashion with a focus on High Fashion Leather Goods & Apparel. Headquartered in Florence, Italy and founded in 1921, Gucci employs over 20,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Luxury & Fashion.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "JavaScript",
      "SQL",
      "SAP",
      "Cloud Infrastructure",
      "React"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-gucci-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Gucci.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Gucci?",
        "answer": "You can explore active verified openings at Gucci directly on WorkoraJobs or visit their official careers portal at https://www.kering.com."
      },
      {
        "question": "Does Gucci offer remote work or internship roles?",
        "answer": "Yes, Gucci offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/gucci",
      "twitter": "https://x.com/gucci",
      "wikipedia": "https://en.wikipedia.org/wiki/Gucci"
    },
    "contactEmail": "careers@kering.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-louis-vuitton",
    "slug": "louis-vuitton",
    "name": "Louis Vuitton",
    "legalName": "Louis Vuitton Corporation",
    "ticker": "MC",
    "stockExchange": "Euronext Paris",
    "country": "France",
    "headquarters": "Paris, France",
    "foundedYear": 1854,
    "industry": "Luxury & Fashion",
    "subIndustry": "Ultra-Luxury Leather Trunks & High Fashion",
    "size": "10,000+",
    "employeeCount": "213,000+",
    "ownershipType": "Public",
    "website": "https://www.lvmh.com",
    "careersUrl": "https://www.lvmh.com",
    "logo": "MC",
    "logoUrl": "https://www.google.com/s2/favicons?domain=lvmh.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Ultra-Luxury Leather Trunks & High Fashion.",
    "shortDescription": "Verified company profile and career opportunities at Louis Vuitton.",
    "overview": "Louis Vuitton is a global market leader operating in Luxury & Fashion with a focus on Ultra-Luxury Leather Trunks & High Fashion. Headquartered in Paris, France and founded in 1854, Louis Vuitton employs over 213,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Luxury & Fashion.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "JavaScript",
      "SQL",
      "SAP",
      "Cloud Infrastructure",
      "React"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-louis-vuitton-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Louis Vuitton.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Louis Vuitton?",
        "answer": "You can explore active verified openings at Louis Vuitton directly on WorkoraJobs or visit their official careers portal at https://www.lvmh.com."
      },
      {
        "question": "Does Louis Vuitton offer remote work or internship roles?",
        "answer": "Yes, Louis Vuitton offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/louis-vuitton",
      "twitter": "https://x.com/louis-vuitton",
      "wikipedia": "https://en.wikipedia.org/wiki/Louis_Vuitton"
    },
    "contactEmail": "careers@lvmh.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-rolex",
    "slug": "rolex",
    "name": "Rolex",
    "legalName": "Rolex Corporation",
    "ticker": "PRIV",
    "stockExchange": "Private Foundation",
    "country": "Switzerland",
    "headquarters": "Geneva, Switzerland",
    "foundedYear": 1905,
    "industry": "Luxury & Horology",
    "subIndustry": "Precision Mechanical Wristwatches",
    "size": "10,000+",
    "employeeCount": "14,000+",
    "ownershipType": "Public",
    "website": "https://www.rolex.com",
    "careersUrl": "https://www.rolex.com",
    "logo": "PRIV",
    "logoUrl": "https://www.google.com/s2/favicons?domain=rolex.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Precision Mechanical Wristwatches.",
    "shortDescription": "Verified company profile and career opportunities at Rolex.",
    "overview": "Rolex is a global market leader operating in Luxury & Horology with a focus on Precision Mechanical Wristwatches. Headquartered in Geneva, Switzerland and founded in 1905, Rolex employs over 14,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Luxury & Horology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
    "values": [
      "Innovation",
      "Excellence",
      "Integrity",
      "Customer Focus",
      "Diversity & Inclusion"
    ],
    "techStack": [
      "Python",
      "JavaScript",
      "SQL",
      "SAP",
      "Cloud Infrastructure",
      "React"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-rolex-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Rolex.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Rolex?",
        "answer": "You can explore active verified openings at Rolex directly on WorkoraJobs or visit their official careers portal at https://www.rolex.com."
      },
      {
        "question": "Does Rolex offer remote work or internship roles?",
        "answer": "Yes, Rolex offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/rolex",
      "twitter": "https://x.com/rolex",
      "wikipedia": "https://en.wikipedia.org/wiki/Rolex"
    },
    "contactEmail": "careers@rolex.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-pfizer",
    "slug": "pfizer",
    "name": "Pfizer",
    "legalName": "Pfizer Corporation",
    "ticker": "PFE",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "New York, NY, USA",
    "foundedYear": 1849,
    "industry": "Healthcare & Pharmaceuticals",
    "subIndustry": "mRNA Vaccines, Oncology & Specialty Medicines",
    "size": "10,000+",
    "employeeCount": "88,000+",
    "ownershipType": "Public",
    "website": "https://www.pfizer.com",
    "careersUrl": "https://www.pfizer.com",
    "logo": "PFE",
    "logoUrl": "https://www.google.com/s2/favicons?domain=pfizer.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in mRNA Vaccines, Oncology & Specialty Medicines.",
    "shortDescription": "Verified company profile and career opportunities at Pfizer.",
    "overview": "Pfizer is a global market leader operating in Healthcare & Pharmaceuticals with a focus on mRNA Vaccines, Oncology & Specialty Medicines. Headquartered in New York, NY, USA and founded in 1849, Pfizer employs over 88,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Healthcare & Pharmaceuticals.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "SAP",
      "AWS",
      "SQL",
      "Clinical Analytics"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-pfizer-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Pfizer.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Pfizer?",
        "answer": "You can explore active verified openings at Pfizer directly on WorkoraJobs or visit their official careers portal at https://www.pfizer.com."
      },
      {
        "question": "Does Pfizer offer remote work or internship roles?",
        "answer": "Yes, Pfizer offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/pfizer",
      "twitter": "https://x.com/pfizer",
      "wikipedia": "https://en.wikipedia.org/wiki/Pfizer"
    },
    "contactEmail": "careers@pfizer.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-johnson-johnson",
    "slug": "johnson-johnson",
    "name": "Johnson & Johnson",
    "legalName": "Johnson & Johnson Corporation",
    "ticker": "JNJ",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "New Brunswick, NJ, USA",
    "foundedYear": 1886,
    "industry": "Healthcare & Pharmaceuticals",
    "subIndustry": "Pharmaceuticals & MedTech Surgical Robotics",
    "size": "10,000+",
    "employeeCount": "131,000+",
    "ownershipType": "Public",
    "website": "https://www.jnj.com",
    "careersUrl": "https://www.jnj.com",
    "logo": "JNJ",
    "logoUrl": "https://www.google.com/s2/favicons?domain=jnj.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Pharmaceuticals & MedTech Surgical Robotics.",
    "shortDescription": "Verified company profile and career opportunities at Johnson & Johnson.",
    "overview": "Johnson & Johnson is a global market leader operating in Healthcare & Pharmaceuticals with a focus on Pharmaceuticals & MedTech Surgical Robotics. Headquartered in New Brunswick, NJ, USA and founded in 1886, Johnson & Johnson employs over 131,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Healthcare & Pharmaceuticals.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "SAP",
      "AWS",
      "SQL",
      "Clinical Analytics"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-johnson-johnson-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Johnson & Johnson.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Johnson & Johnson?",
        "answer": "You can explore active verified openings at Johnson & Johnson directly on WorkoraJobs or visit their official careers portal at https://www.jnj.com."
      },
      {
        "question": "Does Johnson & Johnson offer remote work or internship roles?",
        "answer": "Yes, Johnson & Johnson offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/johnson-johnson",
      "twitter": "https://x.com/johnson-johnson",
      "wikipedia": "https://en.wikipedia.org/wiki/Johnson_&_Johnson"
    },
    "contactEmail": "careers@jnj.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-roche",
    "slug": "roche",
    "name": "Roche",
    "legalName": "Roche Corporation",
    "ticker": "ROG",
    "stockExchange": "SIX Swiss Exchange",
    "country": "Switzerland",
    "headquarters": "Basel, Switzerland",
    "foundedYear": 1896,
    "industry": "Healthcare & Pharmaceuticals",
    "subIndustry": "In-Vitro Diagnostics & Targeted Cancer Therapies",
    "size": "10,000+",
    "employeeCount": "103,000+",
    "ownershipType": "Public",
    "website": "https://www.roche.com",
    "careersUrl": "https://www.roche.com",
    "logo": "ROG",
    "logoUrl": "https://www.google.com/s2/favicons?domain=roche.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in In-Vitro Diagnostics & Targeted Cancer Therapies.",
    "shortDescription": "Verified company profile and career opportunities at Roche.",
    "overview": "Roche is a global market leader operating in Healthcare & Pharmaceuticals with a focus on In-Vitro Diagnostics & Targeted Cancer Therapies. Headquartered in Basel, Switzerland and founded in 1896, Roche employs over 103,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Healthcare & Pharmaceuticals.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "SAP",
      "AWS",
      "SQL",
      "Clinical Analytics"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-roche-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Roche.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Roche?",
        "answer": "You can explore active verified openings at Roche directly on WorkoraJobs or visit their official careers portal at https://www.roche.com."
      },
      {
        "question": "Does Roche offer remote work or internship roles?",
        "answer": "Yes, Roche offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/roche",
      "twitter": "https://x.com/roche",
      "wikipedia": "https://en.wikipedia.org/wiki/Roche"
    },
    "contactEmail": "careers@roche.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-novartis",
    "slug": "novartis",
    "name": "Novartis",
    "legalName": "Novartis Corporation",
    "ticker": "NVS",
    "stockExchange": "NYSE",
    "country": "Switzerland",
    "headquarters": "Basel, Switzerland",
    "foundedYear": 1996,
    "industry": "Healthcare & Pharmaceuticals",
    "subIndustry": "Gene Therapies, Cardiovascular & Immunology",
    "size": "10,000+",
    "employeeCount": "76,000+",
    "ownershipType": "Public",
    "website": "https://www.novartis.com",
    "careersUrl": "https://www.novartis.com",
    "logo": "NVS",
    "logoUrl": "https://www.google.com/s2/favicons?domain=novartis.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Gene Therapies, Cardiovascular & Immunology.",
    "shortDescription": "Verified company profile and career opportunities at Novartis.",
    "overview": "Novartis is a global market leader operating in Healthcare & Pharmaceuticals with a focus on Gene Therapies, Cardiovascular & Immunology. Headquartered in Basel, Switzerland and founded in 1996, Novartis employs over 76,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Healthcare & Pharmaceuticals.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "SAP",
      "AWS",
      "SQL",
      "Clinical Analytics"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-novartis-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Novartis.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Novartis?",
        "answer": "You can explore active verified openings at Novartis directly on WorkoraJobs or visit their official careers portal at https://www.novartis.com."
      },
      {
        "question": "Does Novartis offer remote work or internship roles?",
        "answer": "Yes, Novartis offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/novartis",
      "twitter": "https://x.com/novartis",
      "wikipedia": "https://en.wikipedia.org/wiki/Novartis"
    },
    "contactEmail": "careers@novartis.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-astrazeneca",
    "slug": "astrazeneca",
    "name": "AstraZeneca",
    "legalName": "AstraZeneca Corporation",
    "ticker": "AZN",
    "stockExchange": "NASDAQ",
    "country": "United Kingdom",
    "headquarters": "Cambridge, United Kingdom",
    "foundedYear": 1999,
    "industry": "Healthcare & Pharmaceuticals",
    "subIndustry": "Oncology, Respiratory & Biopharmaceuticals",
    "size": "10,000+",
    "employeeCount": "89,000+",
    "ownershipType": "Public",
    "website": "https://www.astrazeneca.com",
    "careersUrl": "https://www.astrazeneca.com",
    "logo": "AZN",
    "logoUrl": "https://www.google.com/s2/favicons?domain=astrazeneca.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Oncology, Respiratory & Biopharmaceuticals.",
    "shortDescription": "Verified company profile and career opportunities at AstraZeneca.",
    "overview": "AstraZeneca is a global market leader operating in Healthcare & Pharmaceuticals with a focus on Oncology, Respiratory & Biopharmaceuticals. Headquartered in Cambridge, United Kingdom and founded in 1999, AstraZeneca employs over 89,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Healthcare & Pharmaceuticals.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "SAP",
      "AWS",
      "SQL",
      "Clinical Analytics"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-astrazeneca-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at AstraZeneca.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at AstraZeneca?",
        "answer": "You can explore active verified openings at AstraZeneca directly on WorkoraJobs or visit their official careers portal at https://www.astrazeneca.com."
      },
      {
        "question": "Does AstraZeneca offer remote work or internship roles?",
        "answer": "Yes, AstraZeneca offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/astrazeneca",
      "twitter": "https://x.com/astrazeneca",
      "wikipedia": "https://en.wikipedia.org/wiki/AstraZeneca"
    },
    "contactEmail": "careers@astrazeneca.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-merck",
    "slug": "merck",
    "name": "Merck",
    "legalName": "Merck Corporation",
    "ticker": "MRK",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Rahway, NJ, USA",
    "foundedYear": 1891,
    "industry": "Healthcare & Pharmaceuticals",
    "subIndustry": "Immuno-Oncology & Infectious Disease Vaccines",
    "size": "10,000+",
    "employeeCount": "72,000+",
    "ownershipType": "Public",
    "website": "https://www.merck.com",
    "careersUrl": "https://www.merck.com",
    "logo": "MRK",
    "logoUrl": "https://www.google.com/s2/favicons?domain=merck.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Immuno-Oncology & Infectious Disease Vaccines.",
    "shortDescription": "Verified company profile and career opportunities at Merck.",
    "overview": "Merck is a global market leader operating in Healthcare & Pharmaceuticals with a focus on Immuno-Oncology & Infectious Disease Vaccines. Headquartered in Rahway, NJ, USA and founded in 1891, Merck employs over 72,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Healthcare & Pharmaceuticals.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "SAP",
      "AWS",
      "SQL",
      "Clinical Analytics"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-merck-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Merck.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Merck?",
        "answer": "You can explore active verified openings at Merck directly on WorkoraJobs or visit their official careers portal at https://www.merck.com."
      },
      {
        "question": "Does Merck offer remote work or internship roles?",
        "answer": "Yes, Merck offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/merck",
      "twitter": "https://x.com/merck",
      "wikipedia": "https://en.wikipedia.org/wiki/Merck"
    },
    "contactEmail": "careers@merck.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-moderna",
    "slug": "moderna",
    "name": "Moderna",
    "legalName": "Moderna Corporation",
    "ticker": "MRNA",
    "stockExchange": "NASDAQ",
    "country": "USA",
    "headquarters": "Cambridge, MA, USA",
    "foundedYear": 2010,
    "industry": "Healthcare & Biotechnology",
    "subIndustry": "mRNA Therapeutics & Preventive Vaccines",
    "size": "10,000+",
    "employeeCount": "5,600+",
    "ownershipType": "Public",
    "website": "https://www.modernatx.com",
    "careersUrl": "https://www.modernatx.com",
    "logo": "MRNA",
    "logoUrl": "https://www.google.com/s2/favicons?domain=modernatx.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in mRNA Therapeutics & Preventive Vaccines.",
    "shortDescription": "Verified company profile and career opportunities at Moderna.",
    "overview": "Moderna is a global market leader operating in Healthcare & Biotechnology with a focus on mRNA Therapeutics & Preventive Vaccines. Headquartered in Cambridge, MA, USA and founded in 2010, Moderna employs over 5,600+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Healthcare & Biotechnology.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "SAP",
      "AWS",
      "SQL",
      "Clinical Analytics"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-moderna-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Moderna.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Moderna?",
        "answer": "You can explore active verified openings at Moderna directly on WorkoraJobs or visit their official careers portal at https://www.modernatx.com."
      },
      {
        "question": "Does Moderna offer remote work or internship roles?",
        "answer": "Yes, Moderna offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/moderna",
      "twitter": "https://x.com/moderna",
      "wikipedia": "https://en.wikipedia.org/wiki/Moderna"
    },
    "contactEmail": "careers@modernatx.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-abbott",
    "slug": "abbott",
    "name": "Abbott",
    "legalName": "Abbott Corporation",
    "ticker": "ABT",
    "stockExchange": "NYSE",
    "country": "USA",
    "headquarters": "Abbott Park, IL, USA",
    "foundedYear": 1888,
    "industry": "Healthcare & Medical Devices",
    "subIndustry": "Diagnostic Testing, Continuous Glucose Monitors & Nutrition",
    "size": "10,000+",
    "employeeCount": "114,000+",
    "ownershipType": "Public",
    "website": "https://www.abbott.com",
    "careersUrl": "https://www.abbott.com",
    "logo": "ABT",
    "logoUrl": "https://www.google.com/s2/favicons?domain=abbott.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Diagnostic Testing, Continuous Glucose Monitors & Nutrition.",
    "shortDescription": "Verified company profile and career opportunities at Abbott.",
    "overview": "Abbott is a global market leader operating in Healthcare & Medical Devices with a focus on Diagnostic Testing, Continuous Glucose Monitors & Nutrition. Headquartered in Abbott Park, IL, USA and founded in 1888, Abbott employs over 114,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Healthcare & Medical Devices.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "SAP",
      "AWS",
      "SQL",
      "Clinical Analytics"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-abbott-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Abbott.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Abbott?",
        "answer": "You can explore active verified openings at Abbott directly on WorkoraJobs or visit their official careers portal at https://www.abbott.com."
      },
      {
        "question": "Does Abbott offer remote work or internship roles?",
        "answer": "Yes, Abbott offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/abbott",
      "twitter": "https://x.com/abbott",
      "wikipedia": "https://en.wikipedia.org/wiki/Abbott"
    },
    "contactEmail": "careers@abbott.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-medtronic",
    "slug": "medtronic",
    "name": "Medtronic",
    "legalName": "Medtronic Corporation",
    "ticker": "MDT",
    "stockExchange": "NYSE",
    "country": "Ireland",
    "headquarters": "Dublin, Ireland",
    "foundedYear": 1949,
    "industry": "Healthcare & Medical Devices",
    "subIndustry": "Pacemakers, Insulin Pumps & MedTech Systems",
    "size": "10,000+",
    "employeeCount": "95,000+",
    "ownershipType": "Public",
    "website": "https://www.medtronic.com",
    "careersUrl": "https://www.medtronic.com",
    "logo": "MDT",
    "logoUrl": "https://www.google.com/s2/favicons?domain=medtronic.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in Pacemakers, Insulin Pumps & MedTech Systems.",
    "shortDescription": "Verified company profile and career opportunities at Medtronic.",
    "overview": "Medtronic is a global market leader operating in Healthcare & Medical Devices with a focus on Pacemakers, Insulin Pumps & MedTech Systems. Headquartered in Dublin, Ireland and founded in 1949, Medtronic employs over 95,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Healthcare & Medical Devices.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "SAP",
      "AWS",
      "SQL",
      "Clinical Analytics"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-medtronic-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Medtronic.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Medtronic?",
        "answer": "You can explore active verified openings at Medtronic directly on WorkoraJobs or visit their official careers portal at https://www.medtronic.com."
      },
      {
        "question": "Does Medtronic offer remote work or internship roles?",
        "answer": "Yes, Medtronic offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/medtronic",
      "twitter": "https://x.com/medtronic",
      "wikipedia": "https://en.wikipedia.org/wiki/Medtronic"
    },
    "contactEmail": "careers@medtronic.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
    "verified": true,
    "featured": true
  },
  {
    "id": "ent-siemens-healthineers",
    "slug": "siemens-healthineers",
    "name": "Siemens Healthineers",
    "legalName": "Siemens Healthineers Corporation",
    "ticker": "SHL",
    "stockExchange": "XETRA",
    "country": "Germany",
    "headquarters": "Erlangen, Germany",
    "foundedYear": 2017,
    "industry": "Healthcare & Medical Imaging",
    "subIndustry": "MRI, CT Scanners & Precision Diagnostics",
    "size": "10,000+",
    "employeeCount": "71,000+",
    "ownershipType": "Public",
    "website": "https://www.siemens-healthineers.com",
    "careersUrl": "https://www.siemens-healthineers.com",
    "logo": "SHL",
    "logoUrl": "https://www.google.com/s2/favicons?domain=siemens-healthineers.com&sz=128",
    "banner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "tagline": "Leading global enterprise in MRI, CT Scanners & Precision Diagnostics.",
    "shortDescription": "Verified company profile and career opportunities at Siemens Healthineers.",
    "overview": "Siemens Healthineers is a global market leader operating in Healthcare & Medical Imaging with a focus on MRI, CT Scanners & Precision Diagnostics. Headquartered in Erlangen, Germany and founded in 2017, Siemens Healthineers employs over 71,000+ professionals worldwide. The company offers structured career development, competitive compensation packages, global mobility opportunities, and engineering innovation across distributed workforce hubs.",
    "mission": "To drive global innovation and excellence in Healthcare & Medical Imaging.",
    "vision": "Empowering people and businesses through sustainable enterprise solutions.",
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
      "SAP",
      "AWS",
      "SQL",
      "Clinical Analytics"
    ],
    "glassdoorRating": 4.3,
    "reviewCount": 1250,
    "benefits": [
      {
        "title": "Competitive Salary & Bonus",
        "description": "Market-leading base pay with performance bonuses.",
        "category": "Financial & Stock"
      },
      {
        "title": "Comprehensive Health Insurance",
        "description": "Medical, dental, and vision coverage for employees and dependents.",
        "category": "Health & Medical"
      },
      {
        "title": "Flexible Work Arrangements",
        "description": "Hybrid and remote options available for eligible positions.",
        "category": "Workplace Flex"
      },
      {
        "title": "Learning & Development",
        "description": "Tuition reimbursement, technical certifications, and skill workshops.",
        "category": "Learning & Education"
      }
    ],
    "reviews": [
      {
        "id": "rev-siemens-healthineers-1",
        "role": "Senior Software Engineer",
        "rating": 4.5,
        "pros": "Great engineering culture, high compensation, and smart colleagues at Siemens Healthineers.",
        "cons": "Large organization size can lead to cross-team coordination overhead.",
        "date": "2026-01-15",
        "employmentStatus": "Current Employee"
      }
    ],
    "faqs": [
      {
        "question": "How do I apply for jobs at Siemens Healthineers?",
        "answer": "You can explore active verified openings at Siemens Healthineers directly on WorkoraJobs or visit their official careers portal at https://www.siemens-healthineers.com."
      },
      {
        "question": "Does Siemens Healthineers offer remote work or internship roles?",
        "answer": "Yes, Siemens Healthineers offers hybrid and remote opportunities depending on role requirements, along with structured university internship and graduate programs."
      }
    ],
    "openJobsCount": 12,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": true,
    "hybrid": true,
    "onsite": true,
    "internships": true,
    "graduatePrograms": true,
    "socialLinks": {
      "linkedin": "https://www.linkedin.com/company/siemens-healthineers",
      "twitter": "https://x.com/siemens-healthineers",
      "wikipedia": "https://en.wikipedia.org/wiki/Siemens_Healthineers"
    },
    "contactEmail": "careers@siemens-healthineers.com",
    "contactPhone": "+1 (800) 555-0199",
    "marketCap": "Enterprise Giant",
    "currency": "USD",
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
    (c) =>
      c.slug === clean ||
      c.id === clean ||
      c.slug.replace(/-inc$|-corporation$|-group$/g, "") === clean ||
      slugifyCompany(c.name) === clean
  );
}
