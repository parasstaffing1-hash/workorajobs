/**
 * All-Country Global Company Import Pipeline Types
 */

export interface SourceCountryRecord {
  sourceRank: number;
  countryName: string;
  countrySlug: string;
  sourceCountryUrl: string;
  sourceCompanyCount: number;
  sourceTotalMarketCapText: string;
  isoAlpha2: string;
  isoAlpha3: string;
  discoveredAt: string;
  importStatus: "pending" | "discovering" | "discovered" | "verifying" | "enriching" | "applying" | "completed" | "partially_completed" | "failed" | "paused";
}

export interface CandidateCompanyRecord {
  sourceCompanyName: string;
  sourceCompanyUrl: string;
  sourceRankCountry: number;
  sourceTicker: string;
  sourceCountry: string;
  sourceMarketCapText: string;
  sourcePageNumber: number;
  sourceCountryUrl: string;
  sourceDiscoveredAt: string;
  exclusionReason?: string;
  isExcluded: boolean;
}

export interface VerifiedCompanyProfile {
  officialName: string;
  displayName: string;
  legalName: string;
  slug: string;
  aliases: string[];
  formerNames: string[];
  officialDomain: string;
  websiteUrl: string;
  careersUrl: string;
  country: string;
  isoAlpha2: string;
  isoAlpha3: string;
  headquartersCity: string;
  headquartersRegion: string;
  headquartersCountry: string;
  industry: string;
  subIndustries: string[];
  companyType: string;
  ownershipType: string;
  operatingStatus: "Active" | "Inactive" | "Acquired";
  tickerSymbols: string[];
  exchangeListings: Array<{ exchange: string; symbol: string; country: string; status: string }>;
  isin?: string;
  lei?: string;
  regulatoryIdentifiers: Record<string, string>;
  shortDescription: string;
  overview: string;
  logoUrl: string;
  logoSource: string;
  activeJobCount: number;
  verificationStatus: "VERIFIED" | "PENDING_REVIEW" | "UNVERIFIED";
  lastVerifiedAt: string;
  sourceProvenance: Record<string, any>;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  indexingStatus: "published_indexable" | "published_noindex" | "draft" | "review_required";

  contentQualityScore: number;
}

export interface CheckpointProgress {
  countrySlug: string;
  currentPage: number;
  lastCompanyUrl?: string;
  discoveredCount: number;
  verifiedCount: number;
  appliedCount: number;
  failedCount: number;
  reviewCount: number;
  lastRunAt: string;
  status: SourceCountryRecord["importStatus"];
}

export interface CLIImportOptions {
  country?: string;
  countries?: string[];
  allCountries?: boolean;
  startCountry?: string;
  maxCountries?: number;
  maxPagesPerCountry?: number;
  maxCompaniesPerCountry?: number;
  batchSize?: number;
  dryRun?: boolean;
  resume?: boolean;
  forceRefresh?: boolean;
  skipEnrichment?: boolean;
  skipExisting?: boolean;
  output?: "database" | "json" | "csv";
}

export interface GlobalImportReportData {
  countriesDiscovered: number;
  countryDetails: Array<{ name: string; slug: string; url: string; count: number; status: string }>;
  excludedAggregates: string[];
  sourceCompanyCountByCountry: Record<string, number>;
  pilotCountriesSelected: string[];
  pagesFetchedPerPilotCountry: Record<string, number>;
  companiesParsed: number;
  companiesVerified: number;
  existingCompaniesUpdated: number;
  newCompaniesCreated: number;
  duplicatesMerged: number;
  manualReviewRecords: number;
  excludedRecords: Array<{ name: string; reason: string }>;
  missingOfficialWebsites: number;
  missingCareersPages: number;
  pagesMarkedIndexable: number;
  pagesMarkedNoindex: number;
  countryLandingPagesCreated: string[];
  sitemapChanges: string[];
  testResults: string;
  buildResult: string;
  resumeCommands: string[];
  estimatedRemainingCountries: number;
  sourceRestrictionsNotice: string;
}
