/**
 * Rate-Limited Country Page Crawler with Next-Page Discovery
 */

import { CandidateCompanyRecord, SourceCountryRecord } from "./types";
import { parseCountryCompanyRows } from "./company-extractor";

export interface CrawlConfig {
  maxConcurrency?: number;
  delayMs?: number; // Default 3000-6000ms
  maxRetries?: number;
  userAgent?: string;
  maxPagesPerCountry?: number;
}

export const DEFAULT_CRAWL_CONFIG: CrawlConfig = {
  maxConcurrency: 1,
  delayMs: 3000,
  maxRetries: 3,
  userAgent: "WorkoraJobs-Bot/1.0 (+https://workorajobs.com)",
  maxPagesPerCountry: 1,
};

/**
 * Utility delay function for rate limiting
 */
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Crawls a single country page (or follows next page links up to maxPagesPerCountry)
 */
export async function crawlCountryPages(
  country: SourceCountryRecord,
  config: CrawlConfig = DEFAULT_CRAWL_CONFIG
): Promise<{ candidates: CandidateCompanyRecord[]; pagesFetched: number; hasDuplicates: boolean }> {
  const candidates: CandidateCompanyRecord[] = [];
  const maxPages = config.maxPagesPerCountry || 1;
  let currentUrl = country.sourceCountryUrl;
  let pagesFetched = 0;
  let hasDuplicates = false;

  const fetchedContentHashes = new Set<string>();

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    // Respect delay rate limit between requests
    if (pageNum > 1) {
      const delay = Math.floor(Math.random() * 2000) + (config.delayMs || 3000);
      await sleep(delay);
    }

    try {
      const response = await fetch(currentUrl, {
        headers: {
          "User-Agent": config.userAgent || DEFAULT_CRAWL_CONFIG.userAgent!,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });

      if (!response.ok) {
        break;
      }

      const html = await response.text();
      pagesFetched++;

      // Content Hash Check to detect duplicate content loops
      const contentHash = String(html.length) + "-" + html.substring(0, 100);
      if (fetchedContentHashes.has(contentHash)) {
        hasDuplicates = true;
        break;
      }
      fetchedContentHashes.add(contentHash);

      // Parse candidate rows
      const rows = parseCountryCompanyRows(html, country.countrySlug, pageNum);
      candidates.push(...rows);

      // Search for Next Page Link
      const nextMatch = html.match(/<a[^>]+href=["']([^"']+\?page=\d+)["'][^>]*>Next\s*100<\/a>/i);
      if (nextMatch && nextMatch[1]) {
        currentUrl = nextMatch[1].startsWith("http")
          ? nextMatch[1]
          : `https://companiesmarketcap.com${nextMatch[1]}`;
      } else {
        // No next page link found
        break;
      }
    } catch {
      break;
    }
  }

  return {
    candidates,
    pagesFetched,
    hasDuplicates,
  };
}
