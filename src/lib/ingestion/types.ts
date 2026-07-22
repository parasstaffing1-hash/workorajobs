export type AtsProviderType =
  | "GREENHOUSE"
  | "LEVER"
  | "ASHBY"
  | "WORKDAY"
  | "SMARTRECRUITERS"
  | "BAMBOOHR"
  | "TEAMTAILOR"
  | "PERSONIO"
  | "RECRUITEE"
  | "ICIMS"
  | "ORACLE_CLOUD"
  | "SAP_SUCCESSFACTORS"
  | "GENERIC_XML"
  | "GENERIC_JSON"
  | "RSS_FEED"
  | "STATIC_CAREER_PAGE";

export interface RawJobPayload {
  sourceId?: string;
  title: string;
  companyName: string;
  companyDomain?: string;
  description: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  employmentType?: string;
  experienceLevel?: string;
  department?: string;
  workMode?: "Remote" | "Hybrid" | "On-site";
  visaSponsorship?: boolean;
  requiredSkills?: string[];
  benefits?: string[];
  applyUrl: string;
  sourceUrl?: string;
  publishedAt?: string;
  closingDate?: string;
}

export interface ProcessedJobPayload extends RawJobPayload {
  fingerprintHash: string;
  category: string;
  industry: string;
  techStack: string[];
  seniority: string;
  isAiEnriched: boolean;
  isValid: boolean;
  validationError?: string;
}

export interface CompanyCrawlTarget {
  id: string;
  companyName: string;
  domain: string;
  atsProvider: AtsProviderType;
  feedUrl?: string;
  lastCrawledAt?: Date;
  crawlStatus?: "IDLE" | "SUCCESS" | "FAILED" | "IN_PROGRESS";
}

export interface IngestionCrawlMetrics {
  totalCompaniesCrawled: number;
  successfulCrawls: number;
  failedCrawls: number;
  avgCrawlTimeMs: number;
  jobsFound: number;
  jobsAddedToday: number;
  jobsUpdatedToday: number;
  jobsSoftDeletedToday: number;
  successRate: number;
}
