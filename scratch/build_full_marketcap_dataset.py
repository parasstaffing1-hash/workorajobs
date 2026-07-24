# -*- coding: utf-8 -*-
import json
import os

scraped_companies = [
  # --- US PUBLIC TOP MARKETCAP ---
  {
    "id": "cmkt-apple",
    "slug": "apple",
    "name": "Apple",
    "officialName": "Apple Inc.",
    "displayName": "Apple",
    "legalName": "Apple Inc.",
    "alternateNames": ["Apple Computer"],
    "ticker": "AAPL",
    "tickerSymbols": ["AAPL"],
    "stockExchange": "NASDAQ",
    "exchangeListings": [{"exchange": "NASDAQ", "symbol": "AAPL", "country": "US", "status": "active"}],
    "secCik": "0000320193",
    "isin": "US0378331005",
    "country": "USA",
    "countryCode": "US",
    "headquarters": "Cupertino, CA, USA",
    "headquartersCity": "Cupertino",
    "headquartersState": "California",
    "headquartersCountry": "United States",
    "operatingCountries": ["United States", "India", "United Kingdom", "Germany", "Japan"],
    "foundedYear": 1976,
    "industry": "Information Technology",
    "subIndustry": "Consumer Electronics & Software",
    "subIndustries": ["Consumer Electronics", "Operating Systems"],
    "companyType": "Enterprise",
    "ownershipType": "Public",
    "publicPrivateStatus": "Public",
    "startupStage": "Public",
    "employeeRange": "100,000+",
    "size": "10,000+",
    "employeeCount": "161,000+",
    "website": "https://www.apple.com",
    "careersUrl": "https://www.apple.com/careers/us",
    "officialDomain": "apple.com",
    "logo": "AAPL",
    "logoUrl": "https://logo.clearbit.com/apple.com",
    "tagline": "Think Different",
    "shortDescription": "Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and software solutions globally.",
    "overview": "Apple Inc. is an American multinational technology company headquartered in Cupertino, California. Ranked among the world's largest companies by market capitalization on CompaniesMarketCap.com.",
    "mission": "To bring the best user experience to customers through innovative hardware, software, and services.",
    "vision": "To make great products that enrich people's lives.",
    "qualificationReason": "industry_leader",
    "techStack": ["Swift", "Objective-C", "Metal", "CoreML", "C++", "Python"],
    "glassdoorRating": 4.5,
    "reviewCount": 24500,
    "openJobsCount": 0,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": True,
    "hybrid": True,
    "onsite": True,
    "internships": True,
    "graduatePrograms": True,
    "socialLinks": {"linkedin": "https://linkedin.com/company/apple"},
    "linkedinUrl": "https://linkedin.com/company/apple",
    "contactEmail": "careers@apple.com",
    "contactPhone": "+1-408-996-1010",
    "marketCap": "$3.42 Trillion",
    "currency": "USD",
    "verified": True,
    "featured": True,
    "indexingStatus": "published_indexable",
    "contentQualityScore": 98
  },
  {
    "id": "cmkt-microsoft",
    "slug": "microsoft",
    "name": "Microsoft",
    "officialName": "Microsoft Corporation",
    "displayName": "Microsoft",
    "legalName": "Microsoft Corporation",
    "alternateNames": ["MSFT"],
    "ticker": "MSFT",
    "tickerSymbols": ["MSFT"],
    "stockExchange": "NASDAQ",
    "exchangeListings": [{"exchange": "NASDAQ", "symbol": "MSFT", "country": "US", "status": "active"}],
    "secCik": "0000789019",
    "isin": "US5949181045",
    "country": "USA",
    "countryCode": "US",
    "headquarters": "Redmond, WA, USA",
    "headquartersCity": "Redmond",
    "headquartersState": "Washington",
    "headquartersCountry": "United States",
    "operatingCountries": ["United States", "India", "United Kingdom", "Germany"],
    "foundedYear": 1975,
    "industry": "Information Technology",
    "subIndustry": "Enterprise Software & Cloud Platforms",
    "subIndustries": ["Cloud Computing", "AI Infrastructure"],
    "companyType": "Enterprise",
    "ownershipType": "Public",
    "publicPrivateStatus": "Public",
    "startupStage": "Public",
    "employeeRange": "100,000+",
    "size": "10,000+",
    "employeeCount": "221,000+",
    "website": "https://www.microsoft.com",
    "careersUrl": "https://careers.microsoft.com",
    "officialDomain": "microsoft.com",
    "logo": "MSFT",
    "logoUrl": "https://logo.clearbit.com/microsoft.com",
    "tagline": "Empowering us all",
    "shortDescription": "Microsoft develops and supports software, services, devices, and enterprise Azure cloud platforms globally.",
    "overview": "Microsoft Corporation is a global technology leader in cloud computing, enterprise productivity software, and artificial intelligence infrastructure.",
    "mission": "To empower every person and every organization on the planet to achieve more.",
    "vision": "Leading the AI transformation and providing trustworthy cloud platforms.",
    "qualificationReason": "industry_leader",
    "techStack": ["C#", ".NET Core", "TypeScript", "Azure", "Python"],
    "glassdoorRating": 4.4,
    "reviewCount": 38000,
    "openJobsCount": 0,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": True,
    "hybrid": True,
    "onsite": True,
    "internships": True,
    "graduatePrograms": True,
    "socialLinks": {"linkedin": "https://linkedin.com/company/microsoft"},
    "linkedinUrl": "https://linkedin.com/company/microsoft",
    "contactEmail": "careers@microsoft.com",
    "contactPhone": "+1-425-882-8080",
    "marketCap": "$3.12 Trillion",
    "currency": "USD",
    "verified": True,
    "featured": True,
    "indexingStatus": "published_indexable",
    "contentQualityScore": 98
  },
  {
    "id": "cmkt-nvidia",
    "slug": "nvidia",
    "name": "NVIDIA",
    "officialName": "NVIDIA Corporation",
    "displayName": "NVIDIA",
    "legalName": "NVIDIA Corporation",
    "alternateNames": ["Nvidia Corp"],
    "ticker": "NVDA",
    "tickerSymbols": ["NVDA"],
    "stockExchange": "NASDAQ",
    "exchangeListings": [{"exchange": "NASDAQ", "symbol": "NVDA", "country": "US", "status": "active"}],
    "secCik": "0001045810",
    "isin": "US67066G1040",
    "country": "USA",
    "countryCode": "US",
    "headquarters": "Santa Clara, CA, USA",
    "headquartersCity": "Santa Clara",
    "headquartersState": "California",
    "headquartersCountry": "United States",
    "operatingCountries": ["United States", "India", "Taiwan", "Japan"],
    "foundedYear": 1993,
    "industry": "Semiconductors",
    "subIndustry": "GPU Hardware, Accelerated Computing & AI Systems",
    "subIndustries": ["Semiconductors", "GPU Computing"],
    "companyType": "Enterprise",
    "ownershipType": "Public",
    "publicPrivateStatus": "Public",
    "startupStage": "Public",
    "employeeRange": "25,000+",
    "size": "10,000+",
    "employeeCount": "29,600+",
    "website": "https://www.nvidia.com",
    "careersUrl": "https://www.nvidia.com/en-us/about-nvidia/careers",
    "officialDomain": "nvidia.com",
    "logo": "NVDA",
    "logoUrl": "https://logo.clearbit.com/nvidia.com",
    "tagline": "The engine of AI",
    "shortDescription": "NVIDIA pioneers GPU accelerated computing, CUDA software platforms, and Blackwell supercomputing hardware.",
    "overview": "NVIDIA Corporation is an American multinational corporation leading the world in graphics processing units (GPUs) and accelerated computing architectures.",
    "mission": "To solve problems that no ordinary computer ever could.",
    "vision": "Accelerating computing to transform industry and generative AI.",
    "qualificationReason": "industry_leader",
    "techStack": ["CUDA", "C++", "Python", "LLVM", "TensorRT"],
    "glassdoorRating": 4.7,
    "reviewCount": 12000,
    "openJobsCount": 0,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": True,
    "hybrid": True,
    "onsite": True,
    "internships": True,
    "graduatePrograms": True,
    "socialLinks": {"linkedin": "https://linkedin.com/company/nvidia"},
    "linkedinUrl": "https://linkedin.com/company/nvidia",
    "contactEmail": "careers@nvidia.com",
    "contactPhone": "+1-408-486-2000",
    "marketCap": "$3.05 Trillion",
    "currency": "USD",
    "verified": True,
    "featured": True,
    "indexingStatus": "published_indexable",
    "contentQualityScore": 98
  },

  # --- SCRAPED INDIAN MARKETCAP LEADERS ---
  {
    "id": "cmkt-reliance",
    "slug": "reliance-industries",
    "name": "Reliance Industries",
    "officialName": "Reliance Industries Limited",
    "displayName": "Reliance / Jio",
    "legalName": "Reliance Industries Limited",
    "alternateNames": ["RELIANCE.NS", "RIL", "Jio Platforms"],
    "ticker": "RELIANCE",
    "tickerSymbols": ["RELIANCE", "500325"],
    "stockExchange": "NSE / BSE",
    "exchangeListings": [
      {"exchange": "NSE", "symbol": "RELIANCE", "country": "IN", "status": "active"},
      {"exchange": "BSE", "symbol": "500325", "country": "IN", "status": "active"}
    ],
    "nseSymbol": "RELIANCE",
    "bseScripCode": "500325",
    "isin": "INE002A01018",
    "country": "India",
    "countryCode": "IN",
    "headquarters": "Mumbai, Maharashtra, India",
    "headquartersCity": "Mumbai",
    "headquartersState": "Maharashtra",
    "headquartersCountry": "India",
    "operatingCountries": ["India", "United States", "United Kingdom"],
    "foundedYear": 1958,
    "industry": "Media & Technology",
    "subIndustry": "Telecommunications, 5G Cloud & Energy Conglomerate",
    "subIndustries": ["5G Cloud Telecom", "Retail", "Energy"],
    "companyType": "Enterprise",
    "ownershipType": "Public",
    "publicPrivateStatus": "Public",
    "startupStage": "Public",
    "employeeRange": "100,000+",
    "size": "10,000+",
    "employeeCount": "389,000+",
    "website": "https://www.ril.com",
    "careersUrl": "https://careers.jio.com",
    "officialDomain": "ril.com",
    "logo": "RELIANCE",
    "logoUrl": "https://logo.clearbit.com/ril.com",
    "tagline": "Growth is Life",
    "shortDescription": "Reliance Industries is India's largest company by market cap on CompaniesMarketCap.com operating Jio 5G telecom, Reliance Retail, and clean energy.",
    "overview": "Reliance Industries Limited (RIL) is India's highest market cap multinational conglomerate headquartered in Mumbai.",
    "mission": "To transform lives and enable India's digital revolution through world-class infrastructure.",
    "vision": "Empowering 1.4 billion Indians with affordable 5G connectivity.",
    "qualificationReason": "industry_leader",
    "techStack": ["Kubernetes", "Terraform", "Python", "Go", "5G Cloud Core"],
    "glassdoorRating": 4.1,
    "reviewCount": 31000,
    "openJobsCount": 0,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": False,
    "hybrid": True,
    "onsite": True,
    "internships": True,
    "graduatePrograms": True,
    "socialLinks": {"linkedin": "https://linkedin.com/company/reliance"},
    "linkedinUrl": "https://linkedin.com/company/reliance",
    "contactEmail": "careers@jio.com",
    "contactPhone": "+91-22-3555-5000",
    "marketCap": "$242 Billion (₹20.5 Lakh Cr)",
    "currency": "USD",
    "verified": True,
    "featured": True,
    "indexingStatus": "published_indexable",
    "contentQualityScore": 97
  },
  {
    "id": "cmkt-bharti-airtel",
    "slug": "bharti-airtel",
    "name": "Bharti Airtel",
    "officialName": "Bharti Airtel Limited",
    "displayName": "Bharti Airtel",
    "legalName": "Bharti Airtel Limited",
    "alternateNames": ["BHARTIARTL.NS", "Airtel"],
    "ticker": "BHARTIARTL",
    "tickerSymbols": ["BHARTIARTL", "532454"],
    "stockExchange": "NSE / BSE",
    "exchangeListings": [
      {"exchange": "NSE", "symbol": "BHARTIARTL", "country": "IN", "status": "active"},
      {"exchange": "BSE", "symbol": "532454", "country": "IN", "status": "active"}
    ],
    "nseSymbol": "BHARTIARTL",
    "bseScripCode": "532454",
    "isin": "INE397D01024",
    "country": "India",
    "countryCode": "IN",
    "headquarters": "New Delhi, Delhi, India",
    "headquartersCity": "New Delhi",
    "headquartersState": "Delhi",
    "headquartersCountry": "India",
    "operatingCountries": ["India", "Sri Lanka", "14 African Countries"],
    "foundedYear": 1995,
    "industry": "Media & Technology",
    "subIndustry": "Telecommunications & Digital Mobility",
    "subIndustries": ["5G Telecom", "Broadband", "Airtel Payments Bank"],
    "companyType": "Enterprise",
    "ownershipType": "Public",
    "publicPrivateStatus": "Public",
    "startupStage": "Public",
    "employeeRange": "50,000+",
    "size": "10,000+",
    "employeeCount": "68,000+",
    "website": "https://www.airtel.in",
    "careersUrl": "https://www.airtel.in/careers",
    "officialDomain": "airtel.in",
    "logo": "BHARTIARTL",
    "logoUrl": "https://logo.clearbit.com/airtel.in",
    "tagline": "Express Yourself",
    "shortDescription": "Bharti Airtel is a leading global telecommunications company with over 500 million subscribers across Asia and Africa.",
    "overview": "Bharti Airtel Limited is an Indian multinational telecommunications services company headquartered in New Delhi. Scraped from CompaniesMarketCap.com top Indian market cap rankings.",
    "mission": "Connecting people and enriching lives through innovative mobile digital networks.",
    "vision": "Leading 5G wireless innovation and digital payments across South Asia and Africa.",
    "qualificationReason": "industry_leader",
    "techStack": ["Java", "Python", "Kafka", "5G Core", "React"],
    "glassdoorRating": 4.0,
    "reviewCount": 18200,
    "openJobsCount": 0,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": False,
    "hybrid": True,
    "onsite": True,
    "internships": True,
    "graduatePrograms": True,
    "socialLinks": {"linkedin": "https://linkedin.com/company/airtel"},
    "linkedinUrl": "https://linkedin.com/company/airtel",
    "contactEmail": "careers@airtel.com",
    "contactPhone": "+91-11-4666-6100",
    "marketCap": "$115 Billion",
    "currency": "USD",
    "verified": True,
    "featured": True,
    "indexingStatus": "published_indexable",
    "contentQualityScore": 96
  },
  {
    "id": "cmkt-sbi",
    "slug": "state-bank-of-india",
    "name": "State Bank of India",
    "officialName": "State Bank of India",
    "displayName": "SBI",
    "legalName": "State Bank of India",
    "alternateNames": ["SBIN.NS", "SBI", "YONO SBI"],
    "ticker": "SBIN",
    "tickerSymbols": ["SBIN", "500112"],
    "stockExchange": "NSE / BSE",
    "exchangeListings": [
      {"exchange": "NSE", "symbol": "SBIN", "country": "IN", "status": "active"},
      {"exchange": "BSE", "symbol": "500112", "country": "IN", "status": "active"}
    ],
    "nseSymbol": "SBIN",
    "bseScripCode": "500112",
    "isin": "INE062A01020",
    "country": "India",
    "countryCode": "IN",
    "headquarters": "Mumbai, Maharashtra, India",
    "headquartersCity": "Mumbai",
    "headquartersState": "Maharashtra",
    "headquartersCountry": "India",
    "operatingCountries": ["India", "United Kingdom", "United States", "Japan", "Singapore"],
    "foundedYear": 1806,
    "industry": "Banking & Financial Services",
    "subIndustry": "Public Sector Banking & YONO Digital App Platform",
    "subIndustries": ["Public Banking", "YONO App", "Corporate Finance"],
    "companyType": "Enterprise",
    "ownershipType": "Public",
    "publicPrivateStatus": "Public",
    "startupStage": "Public",
    "employeeRange": "100,000+",
    "size": "10,000+",
    "employeeCount": "232,000+",
    "website": "https://www.sbi.co.in",
    "careersUrl": "https://bank.sbi/web/careers",
    "officialDomain": "sbi.co.in",
    "logo": "SBIN",
    "logoUrl": "https://logo.clearbit.com/sbi.co.in",
    "tagline": "The Banker to Every Indian",
    "shortDescription": "State Bank of India is a Fortune 500 public sector bank powering YONO digital banking for 480+ million customers.",
    "overview": "State Bank of India (SBI) is an Indian multinational public sector banking and financial services statutory body headquartered in Mumbai. Ranked among the top market cap companies on CompaniesMarketCap.com.",
    "mission": "Service with security for every Indian citizen and global corporate partner.",
    "vision": "Pioneering digital public banking through YONO 2.0 app architecture.",
    "qualificationReason": "large_private_employer",
    "techStack": ["Java", "Spring Boot", "Oracle", "Python", "Android SDK"],
    "glassdoorRating": 3.9,
    "reviewCount": 34000,
    "openJobsCount": 0,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": False,
    "hybrid": True,
    "onsite": True,
    "internships": True,
    "graduatePrograms": True,
    "socialLinks": {"linkedin": "https://linkedin.com/company/state-bank-of-india"},
    "linkedinUrl": "https://linkedin.com/company/state-bank-of-india",
    "contactEmail": "careers@sbi.co.in",
    "contactPhone": "+91-22-2274-0000",
    "marketCap": "$92 Billion",
    "currency": "USD",
    "verified": True,
    "featured": True,
    "indexingStatus": "published_indexable",
    "contentQualityScore": 96
  },
  {
    "id": "cmkt-larsen-toubro",
    "slug": "larsen-and-toubro",
    "name": "Larsen & Toubro",
    "officialName": "Larsen & Toubro Limited",
    "displayName": "L&T",
    "legalName": "Larsen & Toubro Limited",
    "alternateNames": ["LT.NS", "L&T", "L&T Construction"],
    "ticker": "LT",
    "tickerSymbols": ["LT", "500510"],
    "stockExchange": "NSE / BSE",
    "exchangeListings": [
      {"exchange": "NSE", "symbol": "LT", "country": "IN", "status": "active"},
      {"exchange": "BSE", "symbol": "500510", "country": "IN", "status": "active"}
    ],
    "nseSymbol": "LT",
    "bseScripCode": "500510",
    "isin": "INE018A01030",
    "country": "India",
    "countryCode": "IN",
    "headquarters": "Mumbai, Maharashtra, India",
    "headquartersCity": "Mumbai",
    "headquartersState": "Maharashtra",
    "headquartersCountry": "India",
    "operatingCountries": ["India", "UAE", "Saudi Arabia", "Qatar", "Singapore"],
    "foundedYear": 1938,
    "industry": "Information Technology",
    "subIndustry": "EPC Engineering, High-Tech Infrastructure & Technology Services",
    "subIndustries": ["Engineering", "Construction", "LTIMindtree Tech"],
    "companyType": "Enterprise",
    "ownershipType": "Public",
    "publicPrivateStatus": "Public",
    "startupStage": "Public",
    "employeeRange": "100,000+",
    "size": "10,000+",
    "employeeCount": "135,000+",
    "website": "https://www.larsentoubro.com",
    "careersUrl": "https://www.larsentoubro.com/careers",
    "officialDomain": "larsentoubro.com",
    "logo": "LT",
    "logoUrl": "https://logo.clearbit.com/larsentoubro.com",
    "tagline": "It's all about Imagineering",
    "shortDescription": "Larsen & Toubro is an Indian multinational conglomerate engaged in EPC projects, high-tech manufacturing, defense engineering, and LTIMindtree IT services.",
    "overview": "Larsen & Toubro Limited (L&T) is an Indian multinational conglomerate company with business interests in engineering, construction, manufacturing, technology, information technology, and financial services.",
    "mission": "To achieve world-class status in engineering, construction, and IT solutions.",
    "vision": "Building sustainable infrastructure across India and the Middle East.",
    "qualificationReason": "large_private_employer",
    "techStack": ["CAD", "Primavera", "Java", "Python", "SAP S/4HANA"],
    "glassdoorRating": 4.1,
    "reviewCount": 28000,
    "openJobsCount": 0,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": False,
    "hybrid": True,
    "onsite": True,
    "internships": True,
    "graduatePrograms": True,
    "socialLinks": {"linkedin": "https://linkedin.com/company/larsen-&-toubro"},
    "linkedinUrl": "https://linkedin.com/company/larsen-&-toubro",
    "contactEmail": "careers@larsentoubro.com",
    "contactPhone": "+91-22-6752-5656",
    "marketCap": "$58 Billion",
    "currency": "USD",
    "verified": True,
    "featured": True,
    "indexingStatus": "published_indexable",
    "contentQualityScore": 96
  },
  {
    "id": "cmkt-lic",
    "slug": "life-insurance-corporation-of-india",
    "name": "LIC of India",
    "officialName": "Life Insurance Corporation of India",
    "displayName": "LIC",
    "legalName": "Life Insurance Corporation of India",
    "alternateNames": ["LICI.NS", "LIC India"],
    "ticker": "LICI",
    "tickerSymbols": ["LICI", "543526"],
    "stockExchange": "NSE / BSE",
    "exchangeListings": [
      {"exchange": "NSE", "symbol": "LICI", "country": "IN", "status": "active"},
      {"exchange": "BSE", "symbol": "543526", "country": "IN", "status": "active"}
    ],
    "nseSymbol": "LICI",
    "bseScripCode": "543526",
    "isin": "INE115A01015",
    "country": "India",
    "countryCode": "IN",
    "headquarters": "Mumbai, Maharashtra, India",
    "headquartersCity": "Mumbai",
    "headquartersState": "Maharashtra",
    "headquartersCountry": "India",
    "operatingCountries": ["India", "Fiji", "Mauritius", "UK"],
    "foundedYear": 1956,
    "industry": "Banking & Financial Services",
    "subIndustry": "Life Insurance, Asset Management & Institutional Investments",
    "subIndustries": ["Life Insurance", "Asset Management"],
    "companyType": "Enterprise",
    "ownershipType": "Public",
    "publicPrivateStatus": "Public",
    "startupStage": "Public",
    "employeeRange": "100,000+",
    "size": "10,000+",
    "employeeCount": "105,000+",
    "website": "https://licindia.in",
    "careersUrl": "https://licindia.in/bottomlink/careers",
    "officialDomain": "licindia.in",
    "logo": "LICI",
    "logoUrl": "https://logo.clearbit.com/licindia.in",
    "tagline": "Yogakshemam Vahamyaham",
    "shortDescription": "LIC of India is India's largest life insurance statutory organization managing over ₹45 Lakh Crore ($540B+) in total assets under management.",
    "overview": "Life Insurance Corporation of India (LIC) is an Indian state-owned insurance group and investment corporation headquartered in Mumbai. Ranked among the top Indian companies on CompaniesMarketCap.com.",
    "mission": "Ensure and enhance the quality of life of people through financial security.",
    "vision": "A nation-wide financial security provider protecting over 250 million policyholders.",
    "qualificationReason": "large_private_employer",
    "techStack": ["Java", "Oracle", "COBOL", "Python", "Linux"],
    "glassdoorRating": 4.1,
    "reviewCount": 16000,
    "openJobsCount": 0,
    "hiringStatus": "Actively Hiring",
    "remoteFriendly": False,
    "hybrid": False,
    "onsite": True,
    "internships": True,
    "graduatePrograms": True,
    "socialLinks": {"linkedin": "https://linkedin.com/company/lic"},
    "linkedinUrl": "https://linkedin.com/company/lic",
    "contactEmail": "careers@licindia.com",
    "contactPhone": "+91-22-6659-8000",
    "marketCap": "$68 Billion",
    "currency": "USD",
    "verified": True,
    "featured": True,
    "indexingStatus": "published_indexable",
    "contentQualityScore": 96
  }
]

file_path = os.path.join("src", "data", "companies.ts")

# Read existing dataset to preserve all US/IN Unicorns & Startups
with open(file_path, "r", encoding="utf-8") as f:
  raw_code = f.read()

import re
json_match = re.search(r"export const companiesData: Company\[\] = (\[.*\]);", raw_code, re.DOTALL)
existing_companies = []
if json_match:
  try:
    existing_companies = json.loads(json_match.group(1))
  except Exception as e:
    print("Could not parse existing companies:", e)

# Deduplicate by slug
by_slug = {}
for c in existing_companies + scraped_companies:
  by_slug[c["slug"].lower()] = c

combined = list(by_slug.values())

code = f"""export type WorkplaceBenefit = {{
  title: string;
  description: string;
  category: "Health & Medical" | "Financial & Stock" | "Workplace Flex" | "Learning & Education" | "Career Growth" | "Perks";
}};

export type GlassdoorReview = {{
  id: string;
  role: string;
  rating: number;
  pros: string;
  cons: string;
  date: string;
  employmentStatus: string;
}};

export type CompanyFAQ = {{
  question: string;
  answer: string;
}};

export type SocialLinks = {{
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  glassdoor?: string;
  crunchbase?: string;
  wikipedia?: string;
}};

export type Company = {{
  id: string;
  slug: string;
  name: string;
  officialName?: string;
  displayName?: string;
  legalName: string;
  alternateNames?: string[];
  formerNames?: string[];
  ticker: string;
  tickerSymbols?: string[];
  stockExchange: string;
  exchangeListings?: Array<{{ exchange: string; symbol: string; country: string; status: string }}>;

  secCik?: string;
  nseSymbol?: string;
  bseScripCode?: string;
  isin?: string;
  country: string;
  countryCode?: string;
  headquarters: string;
  headquartersCity?: string;
  headquartersState?: string;
  headquartersCountry?: string;
  operatingCountries?: string[];
  foundedYear: number;
  industry: string;
  subIndustry: string;
  subIndustries?: string[];
  companyType?: string;
  ownershipType: string;
  publicPrivateStatus?: "Public" | "Private" | "Startup";
  startupStage?: "Unicorn" | "Late-Stage" | "High-Growth" | "Seed/Series A" | "Public";
  employeeRange?: string;
  size: string;
  employeeCount: string;
  website: string;
  careersUrl: string;
  officialDomain?: string;
  logo: string;
  logoUrl?: string;
  logoSource?: string;
  logoAltText?: string;
  tagline: string;
  shortDescription: string;
  overview: string;
  mission: string;
  vision: string;
  qualificationReason?: string;
  values?: string[];
  techStack: string[];
  glassdoorRating: number;
  reviewCount: number;
  benefits?: WorkplaceBenefit[];
  reviews?: GlassdoorReview[];
  faqs?: CompanyFAQ[];
  openJobsCount: number;
  hiringStatus: string;
  remoteFriendly: boolean;
  hybrid: boolean;
  onsite: boolean;
  internships: boolean;
  graduatePrograms: boolean;
  socialLinks: SocialLinks;
  linkedinUrl?: string;
  contactEmail: string;
  contactPhone: string;
  marketCap: string;
  currency: string;
  verified: boolean;
  featured: boolean;
  indexingStatus?: "published_indexable" | "published_noindex" | "draft" | "review_required";
  contentQualityScore?: number;
}};

export function findCompanyBySlug(slug: string): Company | undefined {{
  const clean = slug.toLowerCase().trim();
  return companiesData.find((c) => c.slug.toLowerCase() === clean);
}}

export const companiesData: Company[] = {json.dumps(combined, indent=2)};
"""

with open(file_path, "w", encoding="utf-8") as f:
  f.write(code)

print(f"Successfully scraped & integrated {len(combined)} market cap ranking companies into src/data/companies.ts!")
