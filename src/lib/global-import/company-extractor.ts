/**
 * Company Row Extraction & Non-Company Exclusion Module
 */

import { CandidateCompanyRecord } from "./types";

export const EXCLUDED_NAME_PATTERNS = [
  /\bETF\b/i,
  /\bFund\b/i,
  /\bIndex\b/i,
  /\bTrust\b/i,
  /\bAcquisition Corp\b/i,
  /\bSPAC\b/i,
  /\bCapital Corp\b/i,
  /\bWarrant\b/i,
  /\bPreferred\b/i,
  /\bDebenture\b/i,
  /\bCrypto\b/i,
  /\bBitcoin\b/i,
  /\bEthereum\b/i,
  /\bGold Trust\b/i,
  /\bSilver Trust\b/i,
  /\bTreasury\b/i,
  /\bBond\b/i,
];

/**
 * Checks if a candidate company record should be excluded and returns reason
 */
export function evaluateCandidateExclusion(name: string, ticker?: string): { isExcluded: boolean; reason?: string } {
  if (!name || name.length < 2) {
    return { isExcluded: true, reason: "Invalid or empty company name" };
  }

  for (const pattern of EXCLUDED_NAME_PATTERNS) {
    if (pattern.test(name)) {
      return { isExcluded: true, reason: `Matches excluded entity classification pattern (${pattern.source})` };
    }
  }

  if (ticker && /\b(ETF|SPAC|RT|WT|PRF|PREF)\b/i.test(ticker)) {
    return { isExcluded: true, reason: `Ticker matches non-operating instrument symbol (${ticker})` };
  }

  return { isExcluded: false };
}

/**
 * Parses company rows from country page HTML or converted Markdown
 */
export function parseCountryCompanyRows(
  htmlContent: string,
  countrySlug: string,
  pageNumber = 1
): CandidateCompanyRecord[] {
  const records: CandidateCompanyRecord[] = [];
  const now = new Date().toISOString();
  const seenSlugs = new Set<string>();

  let rank = (pageNumber - 1) * 100 + 1;

  // Regex Match 1: Markdown Link Format [Company Name Ticker](https://companiesmarketcap.com/company-slug/marketcap/)
  const mdRegex = /\[([^\]]+)\]\(https?:\/\/companiesmarketcap\.com\/([a-z0-9-]+)\/marketcap\/?\)/gi;
  let match: RegExpExecArray | null;

  while ((match = mdRegex.exec(htmlContent)) !== null) {
    const rawText = match[1].trim();
    const companySlug = match[2].toLowerCase().trim();

    if (seenSlugs.has(companySlug)) continue;
    seenSlugs.add(companySlug);

    // Extract ticker from text (e.g., "SAP SAP.DE" -> name: "SAP", ticker: "SAP.DE")
    const parts = rawText.split(/\s+/);
    let ticker = companySlug.toUpperCase().substring(0, 8);
    let name = rawText;

    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1];
      if (/^[A-Z0-9.\-]+$/.test(lastPart) && lastPart.length <= 10) {
        ticker = lastPart;
        name = parts.slice(0, -1).join(" ");
      }
    }

    const exclusion = evaluateCandidateExclusion(name, ticker);

    records.push({
      sourceCompanyName: name,
      sourceCompanyUrl: `https://companiesmarketcap.com/${companySlug}/marketcap/`,
      sourceRankCountry: rank++,
      sourceTicker: ticker,
      sourceCountry: countrySlug,
      sourceMarketCapText: "Live Tracked",
      sourcePageNumber: pageNumber,
      sourceCountryUrl: `https://companiesmarketcap.com/${countrySlug}/largest-companies-in-${countrySlug}-by-market-cap/`,
      sourceDiscoveredAt: now,
      exclusionReason: exclusion.reason,
      isExcluded: exclusion.isExcluded,
    });
  }

  // Regex Match 2: Standard HTML table cell format fallback
  if (records.length === 0) {
    const htmlRegex = /href=["']\/?([a-z0-9-]+)\/marketcap\/?["'][^>]*>(.*?)<\/a>/gi;
    while ((match = htmlRegex.exec(htmlContent)) !== null) {
      const companySlug = match[1];
      const rawInner = match[2].replace(/<[^>]+>/g, "").trim();

      if (!rawInner || seenSlugs.has(companySlug)) continue;
      seenSlugs.add(companySlug);

      const exclusion = evaluateCandidateExclusion(rawInner, companySlug.toUpperCase());

      records.push({
        sourceCompanyName: rawInner,
        sourceCompanyUrl: `https://companiesmarketcap.com/${companySlug}/marketcap/`,
        sourceRankCountry: rank++,
        sourceTicker: companySlug.toUpperCase().substring(0, 8),
        sourceCountry: countrySlug,
        sourceMarketCapText: "Live Tracked",
        sourcePageNumber: pageNumber,
        sourceCountryUrl: `https://companiesmarketcap.com/${countrySlug}/largest-companies-in-${countrySlug}-by-market-cap/`,
        sourceDiscoveredAt: now,
        exclusionReason: exclusion.reason,
        isExcluded: exclusion.isExcluded,
      });
    }
  }

  return records;
}

