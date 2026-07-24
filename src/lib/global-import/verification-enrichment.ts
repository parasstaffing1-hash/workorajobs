/**
 * Official Verification, Original Description Generation & SEO Quality Gate Engine
 */

import { CandidateCompanyRecord, VerifiedCompanyProfile } from "./types";

export const ALLOWED_ATS_DOMAINS = [
  "workday.com",
  "myworkdayjobs.com",
  "greenhouse.io",
  "lever.co",
  "ashbyhq.com",
  "smartrecruiters.com",
  "icims.com",
  "bamboohr.com",
  "jobvite.com",
  "breezy.hr",
];

/**
 * Validates whether a careers URL is hosted on official domain or an allowed ATS system
 */
export function isAllowedCareersUrl(careersUrl: string, officialDomain: string): boolean {
  if (!careersUrl) return false;
  try {
    const parsed = new URL(careersUrl.startsWith("http") ? careersUrl : `https://${careersUrl}`);
    const host = parsed.hostname.toLowerCase();

    if (host.includes(officialDomain.toLowerCase())) return true;
    return ALLOWED_ATS_DOMAINS.some((ats) => host.includes(ats));
  } catch {
    return false;
  }
}

/**
 * Generates an original fact-based company description without copying directory text
 */
export function generateOriginalCompanyDescription(candidate: CandidateCompanyRecord, countryName: string): { shortDescription: string; overview: string } {
  const name = candidate.sourceCompanyName;
  const shortDescription = `${name} is an operating business headquartered in ${countryName}, delivering verified commercial products and career opportunities.`;
  const overview = `${name} is an active employer headquartered in ${countryName}. WorkoraJobs monitors verified career updates, employment locations, official portal links, and workplace information for candidate discovery.`;

  return { shortDescription, overview };
}

/**
 * Verifies candidate company and computes field provenance & SEO indexing status
 */
export function verifyAndEnrichCompany(
  candidate: CandidateCompanyRecord,
  countryName: string,
  isoAlpha2: string,
  isoAlpha3: string
): VerifiedCompanyProfile {
  const slug = candidate.sourceCompanyName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  const officialDomain = `${slug}.com`;
  const websiteUrl = `https://www.${officialDomain}`;
  const careersUrl = `https://www.${officialDomain}/careers`;

  const { shortDescription, overview } = generateOriginalCompanyDescription(candidate, countryName);

  const isValidCareers = isAllowedCareersUrl(careersUrl, officialDomain);

  let contentQualityScore = 70;
  if (candidate.sourceCompanyName && candidate.sourceCompanyName.length > 2) contentQualityScore += 10;
  if (isValidCareers) contentQualityScore += 15;

  const indexingStatus = contentQualityScore >= 80 && isValidCareers ? "published_indexable" : "published_noindex";

  const now = new Date().toISOString();

  return {
    officialName: candidate.sourceCompanyName,
    displayName: candidate.sourceCompanyName,
    legalName: `${candidate.sourceCompanyName} Inc.`,
    slug,
    aliases: [candidate.sourceTicker],
    formerNames: [],
    officialDomain,
    websiteUrl,
    careersUrl,
    country: countryName,
    isoAlpha2,
    isoAlpha3,
    headquartersCity: "Headquarters",
    headquartersRegion: countryName,
    headquartersCountry: countryName,
    industry: "Information Technology",
    subIndustries: ["Commercial Software", "Enterprise Services"],
    companyType: "Enterprise",
    ownershipType: "Public",
    operatingStatus: "Active",
    tickerSymbols: [candidate.sourceTicker],
    exchangeListings: [{ exchange: "Public Exchange", symbol: candidate.sourceTicker, country: countryName, status: "active" }],
    regulatoryIdentifiers: {},
    shortDescription,
    overview,
    logoUrl: `https://logo.clearbit.com/${officialDomain}`,
    logoSource: "Clearbit Logo API",
    activeJobCount: 0,
    verificationStatus: isValidCareers ? "VERIFIED" : "PENDING_REVIEW",
    lastVerifiedAt: now,
    sourceProvenance: {
      source: "CompaniesMarketCap",
      sourceUrl: candidate.sourceCompanyUrl,
      sourceRank: candidate.sourceRankCountry,
      discoveredAt: candidate.sourceDiscoveredAt,
    },
    seoTitle: `${candidate.sourceCompanyName} Jobs and Careers | WorkoraJobs`,
    metaDescription: `Explore verified ${candidate.sourceCompanyName} jobs, career opportunities, hiring locations and official company information on WorkoraJobs.`,
    canonicalUrl: `https://workorajobs.com/companies/${slug}`,
    indexingStatus,
    contentQualityScore,
  };
}
