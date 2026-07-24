/**
 * Company Duplicate Detection and Name Normalization Engine
 * Handles company name normalization, ticker matching, domain matching, and alias resolution.
 */

export interface CompanyMatchTarget {
  id?: string;
  name: string;
  legalName?: string;
  officialDomain?: string;
  websiteUrl?: string;
  tickerSymbols?: string[];
  secCik?: string;
  nseSymbol?: string;
  bseScripCode?: string;
  isin?: string;
}

/**
 * Normalizes company names by stripping common corporate suffixes and lowercasing
 */
export function normalizeCompanyName(name: string): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/\b(inc|incorporated|corporation|corp|ltd|limited|pvt|private|plc|holdings|group|technologies|tech|llc|co|company)\b\.?/gi, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Normalizes domain names (e.g., https://www.apple.com/careers -> apple.com)
 */
export function normalizeDomain(urlOrDomain?: string): string {
  if (!urlOrDomain) return "";
  try {
    const raw = urlOrDomain.startsWith("http") ? urlOrDomain : `https://${urlOrDomain}`;
    const parsed = new URL(raw);
    return parsed.hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return urlOrDomain.toLowerCase().replace(/^www\./i, "").trim();
  }
}

/**
 * Calculates duplication match confidence score between candidate and existing company (0.0 to 1.0)
 */
export function calculateMatchConfidence(candidate: CompanyMatchTarget, existing: CompanyMatchTarget): number {
  // Direct Identifier Matches (100% confidence)
  if (candidate.secCik && existing.secCik && candidate.secCik === existing.secCik) return 1.0;
  if (candidate.isin && existing.isin && candidate.isin === existing.isin) return 1.0;
  if (candidate.nseSymbol && existing.nseSymbol && candidate.nseSymbol === existing.nseSymbol) return 1.0;
  if (candidate.bseScripCode && existing.bseScripCode && candidate.bseScripCode === existing.bseScripCode) return 1.0;

  // Domain Match
  const candidateDomain = normalizeDomain(candidate.officialDomain || candidate.websiteUrl);
  const existingDomain = normalizeDomain(existing.officialDomain || existing.websiteUrl);

  if (candidateDomain && existingDomain && candidateDomain === existingDomain) {
    return 0.95;
  }

  // Ticker Overlap
  if (candidate.tickerSymbols?.length && existing.tickerSymbols?.length) {
    const hasTickerOverlap = candidate.tickerSymbols.some((t) => existing.tickerSymbols?.includes(t));
    if (hasTickerOverlap) return 0.9;
  }

  // Normalized Name Exact Match
  const normCandidate = normalizeCompanyName(candidate.name);
  const normExisting = normalizeCompanyName(existing.name);

  if (normCandidate && normExisting && normCandidate === normExisting) {
    return 0.85;
  }

  return 0.0;
}
