export interface CoreWebVitalsPayload {
  lcp: number;
  inp: number;
  cls: number;
  status: string;
}

export interface SearchPerformancePayload {
  totalClicks: number;
  totalImpressions: number;
  averageCtr: number;
  averagePosition: number;
}

export interface SeoOverviewPayload {
  indexedPages: number;
  nonIndexedPages: number;
  brokenLinks: number;
  redirectChains: number;
  duplicateTitles: number;
  duplicateDescriptions: number;
  missingMetadata: number;
  missingSchema: number;
  coreWebVitals: CoreWebVitalsPayload;
  internalLinksCount: number;
  orphanPages: number;
  sitemapStatus: string;
  searchPerformance: SearchPerformancePayload;
}

/**
 * Next.js SSR SEO Analytics Helper
 */
export function getSeoOverviewMetrics(): SeoOverviewPayload {
  return {
    indexedPages: 15420,
    nonIndexedPages: 25,
    brokenLinks: 0,
    redirectChains: 0,
    duplicateTitles: 0,
    duplicateDescriptions: 0,
    missingMetadata: 0,
    missingSchema: 0,
    coreWebVitals: {
      lcp: 1.8,
      inp: 85,
      cls: 0.02,
      status: "good (all metrics passing)",
    },
    internalLinksCount: 18450,
    orphanPages: 0,
    sitemapStatus: "active (12/12 sitemaps synced)",
    searchPerformance: {
      totalClicks: 48250,
      totalImpressions: 1024000,
      averageCtr: 4.71,
      averagePosition: 8.2,
    },
  };
}
