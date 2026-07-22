export type JobSortOption =
  | "MOST_RECENT"
  | "HIGHEST_SALARY"
  | "LOWEST_SALARY"
  | "RELEVANCE"
  | "COMPANY_NAME"
  | "CLOSING_DATE";

export type DatePostedFilter =
  | "ANYTIME"
  | "TODAY"
  | "LAST_3_DAYS"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS";

export interface JobSearchQueryParams {
  q?: string;
  company?: string;
  location?: string;
  country?: string;
  state?: string;
  city?: string;
  workMode?: "Remote" | "Hybrid" | "On-site";
  type?: string; // FULL_TIME, CONTRACT, INTERNSHIP, etc.
  experience?: string;
  minSalary?: number;
  maxSalary?: number;
  skills?: string[];
  department?: string;
  industry?: string;
  datePosted?: DatePostedFilter;
  sort?: JobSortOption;
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface JobSearchResultItem {
  id: string;
  title: string;
  companyName: string;
  companySlug: string;
  companyLogo?: string;
  location: string;
  salary: number;
  type: string;
  workMode: string;
  experience: string;
  postedAt: string;
  slug: string;
  relevanceScore?: number;
}

export interface JobSearchResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  nextCursor?: string;
  jobs: JobSearchResultItem[];
  tookMs: number;
}

export interface SearchAutocompleteSuggestion {
  text: string;
  type: "JOB_TITLE" | "COMPANY" | "SKILL" | "LOCATION";
  count?: number;
}

export interface SearchFilterFacets {
  companies: Array<{ name: string; count: number }>;
  locations: Array<{ name: string; count: number }>;
  workModes: Array<{ name: string; count: number }>;
  employmentTypes: Array<{ name: string; count: number }>;
  experienceLevels: Array<{ name: string; count: number }>;
  skills: Array<{ name: string; count: number }>;
}
