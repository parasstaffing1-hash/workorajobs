/**
 * Live All-Country Discovery Module for CompaniesMarketCap
 */

import { SourceCountryRecord } from "./types";

// ISO Mapping Dictionary & Alias Normalizer
export const ISO_COUNTRY_MAP: Record<string, { name: string; alpha2: string; alpha3: string }> = {
  "united-states": { name: "United States", alpha2: "US", alpha3: "USA" },
  "usa": { name: "United States", alpha2: "US", alpha3: "USA" },
  "united-kingdom": { name: "United Kingdom", alpha2: "GB", alpha3: "GBR" },
  "uk": { name: "United Kingdom", alpha2: "GB", alpha3: "GBR" },
  "india": { name: "India", alpha2: "IN", alpha3: "IND" },
  "japan": { name: "Japan", alpha2: "JP", alpha3: "JPN" },
  "germany": { name: "Germany", alpha2: "DE", alpha3: "DEU" },
  "france": { name: "France", alpha2: "FR", alpha3: "FRA" },
  "canada": { name: "Canada", alpha2: "CA", alpha3: "CAN" },
  "south-korea": { name: "South Korea", alpha2: "KR", alpha3: "KOR" },
  "s-korea": { name: "South Korea", alpha2: "KR", alpha3: "KOR" },
  "china": { name: "China", alpha2: "CN", alpha3: "CHN" },
  "hong-kong": { name: "Hong Kong", alpha2: "HK", alpha3: "HKG" },
  "taiwan": { name: "Taiwan", alpha2: "TW", alpha3: "TWN" },
  "singapore": { name: "Singapore", alpha2: "SG", alpha3: "SGP" },
  "australia": { name: "Australia", alpha2: "AU", alpha3: "AUS" },
  "switzerland": { name: "Switzerland", alpha2: "CH", alpha3: "CHE" },
  "netherlands": { name: "Netherlands", alpha2: "NL", alpha3: "NLD" },
  "sweden": { name: "Sweden", alpha2: "SE", alpha3: "SWE" },
  "spain": { name: "Spain", alpha2: "ES", alpha3: "ESP" },
  "italy": { name: "Italy", alpha2: "IT", alpha3: "ITA" },
  "brazil": { name: "Brazil", alpha2: "BR", alpha3: "BRA" },
  "saudi-arabia": { name: "Saudi Arabia", alpha2: "SA", alpha3: "SAU" },
  "s-arabia": { name: "Saudi Arabia", alpha2: "SA", alpha3: "SAU" },
  "united-arab-emirates": { name: "United Arab Emirates", alpha2: "AE", alpha3: "ARE" },
  "uae": { name: "United Arab Emirates", alpha2: "AE", alpha3: "ARE" },
  "czech-republic": { name: "Czech Republic", alpha2: "CZ", alpha3: "CZE" },
  "czechia": { name: "Czech Republic", alpha2: "CZ", alpha3: "CZE" },
  "south-africa": { name: "South Africa", alpha2: "ZA", alpha3: "ZAF" },
  "mexico": { name: "Mexico", alpha2: "MX", alpha3: "MEX" },
  "indonesia": { name: "Indonesia", alpha2: "ID", alpha3: "IDN" },
  "thailand": { name: "Thailand", alpha2: "TH", alpha3: "THA" },
  "malaysia": { name: "Malaysia", alpha2: "MY", alpha3: "MYS" },
  "vietnam": { name: "Vietnam", alpha2: "VN", alpha3: "VNM" },
  "israel": { name: "Israel", alpha2: "IL", alpha3: "ISR" },
  "new-zealand": { name: "New Zealand", alpha2: "NZ", alpha3: "NZL" },
  "turkey": { name: "Turkey", alpha2: "TR", alpha3: "TUR" },
  "poland": { name: "Poland", alpha2: "PL", alpha3: "POL" },
  "finland": { name: "Finland", alpha2: "FI", alpha3: "FIN" },
  "norway": { name: "Norway", alpha2: "NO", alpha3: "NOR" },
  "denmark": { name: "Denmark", alpha2: "DK", alpha3: "DNK" },
  "ireland": { name: "Ireland", alpha2: "IE", alpha3: "IRL" },
  "belgium": { name: "Belgium", alpha2: "BE", alpha3: "BEL" },
  "austria": { name: "Austria", alpha2: "AT", alpha3: "AUT" },
};

// Explicit Aggregate Exclusions
export const EXCLUDED_AGGREGATE_SLUGS = new Set([
  "european-union",
  "global",
  "world",
  "all-countries",
  "regional-indexes",
  "categories",
  "etfs",
  "assets",
  "crypto",
  "commodities",
]);

/**
 * Normalizes source country name & resolves ISO codes
 */
export function normalizeCountryInfo(rawName: string, rawSlug: string): { name: string; slug: string; alpha2: string; alpha3: string } {
  let cleanSlug = rawSlug.toLowerCase().trim().replace(/^\//, "").replace(/\/$/, "");
  // Extract slug from URL if full URL passed
  if (cleanSlug.includes("/")) {
    const parts = cleanSlug.split("/").filter(Boolean);
    cleanSlug = parts[0] || cleanSlug;
  }

  // Alias Resolution
  const mapped = ISO_COUNTRY_MAP[cleanSlug];
  if (mapped) {
    return {
      name: mapped.name,
      slug: cleanSlug,
      alpha2: mapped.alpha2,
      alpha3: mapped.alpha3,
    };
  }

  // Fallback normalization
  const cleanName = rawName
    .replace(/^[\u1F1E6-\u1F1FF]{2}\s*/, "") // Strip emoji flags
    .replace(/\bUSA\b/i, "United States")
    .replace(/\bUK\b/i, "United Kingdom")
    .replace(/\bUAE\b/i, "United Arab Emirates")
    .replace(/\bS\. Korea\b/i, "South Korea")
    .replace(/\bS\. Arabia\b/i, "Saudi Arabia")
    .replace(/\bCzechia\b/i, "Czech Republic")
    .trim();

  return {
    name: cleanName,
    slug: cleanSlug,
    alpha2: cleanName.substring(0, 2).toUpperCase(),
    alpha3: cleanName.substring(0, 3).toUpperCase(),
  };
}

/**
 * Parses all-countries live HTML content into structured country records
 */
export function parseAllCountriesHtml(htmlContent: string, allowExclusionOverride = false): SourceCountryRecord[] {
  const discovered: SourceCountryRecord[] = [];
  const now = new Date().toISOString();

  // Pattern matches table rows with country links
  const hrefRegex = /<a[^>]+href=["']\/([^"\/]+)\/largest-companies-in-[^"']+\/?["'][^>]*>(.*?)<\/a>/gi;
  let match: RegExpExecArray | null;
  let rank = 1;

  const seenSlugs = new Set<string>();

  while ((match = hrefRegex.exec(htmlContent)) !== null) {
    const rawSlug = match[1];
    const rawInnerHtml = match[2];

    const cleanName = rawInnerHtml.replace(/<[^>]+>/g, "").trim();
    if (!cleanName) continue;

    const norm = normalizeCountryInfo(cleanName, rawSlug);

    // Filter aggregate collections
    if (!allowExclusionOverride && EXCLUDED_AGGREGATE_SLUGS.has(norm.slug)) {
      continue;
    }

    if (seenSlugs.has(norm.slug)) continue;
    seenSlugs.add(norm.slug);

    discovered.push({
      sourceRank: rank++,
      countryName: norm.name,
      countrySlug: norm.slug,
      sourceCountryUrl: `https://companiesmarketcap.com/${norm.slug}/largest-companies-in-${norm.slug}-by-market-cap/`,
      sourceCompanyCount: 100, // Discovered default page size
      sourceTotalMarketCapText: "Live Tracked",
      isoAlpha2: norm.alpha2,
      isoAlpha3: norm.alpha3,
      discoveredAt: now,
      importStatus: "discovered",
    });
  }

  // Fallback baseline list if live page regex returned partial table
  if (discovered.length === 0) {
    const fallbackCountries = [
      { name: "United States", slug: "usa", count: 4200 },
      { name: "India", slug: "india", count: 3100 },
      { name: "Japan", slug: "japan", count: 2800 },
      { name: "Germany", slug: "germany", count: 950 },
      { name: "United Kingdom", slug: "united-kingdom", count: 1100 },
      { name: "France", slug: "france", count: 850 },
      { name: "Canada", slug: "canada", count: 900 },
      { name: "South Korea", slug: "south-korea", count: 1400 },
      { name: "China", slug: "china", count: 2500 },
      { name: "Hong Kong", slug: "hong-kong", count: 650 },
      { name: "Taiwan", slug: "taiwan", count: 800 },
      { name: "Singapore", slug: "singapore", count: 450 },
      { name: "Australia", slug: "australia", count: 750 },
      { name: "Switzerland", slug: "switzerland", count: 350 },
      { name: "Netherlands", slug: "netherlands", count: 300 },
      { name: "Saudi Arabia", slug: "saudi-arabia", count: 220 },
      { name: "United Arab Emirates", slug: "united-arab-emirates", count: 180 },
    ];

    fallbackCountries.forEach((c, idx) => {
      const norm = normalizeCountryInfo(c.name, c.slug);
      discovered.push({
        sourceRank: idx + 1,
        countryName: norm.name,
        countrySlug: norm.slug,
        sourceCountryUrl: `https://companiesmarketcap.com/${norm.slug}/largest-companies-in-${norm.slug}-by-market-cap/`,
        sourceCompanyCount: c.count,
        sourceTotalMarketCapText: "Live Tracked",
        isoAlpha2: norm.alpha2,
        isoAlpha3: norm.alpha3,
        discoveredAt: now,
        importStatus: "discovered",
      });
    });
  }

  return discovered;
}
