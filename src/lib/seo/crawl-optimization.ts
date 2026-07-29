export interface CrawlIssuePayload {
  id: string;
  type: string;
  url: string;
  severity: "critical" | "warning" | "info";
  description: string;
  remedy: string;
}

export interface CrawlDiagnosticReportPayload {
  timestamp: string;
  totalAudited: number;
  crawlHealth: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  issues: CrawlIssuePayload[];
  recommendations: string[];
}

/**
 * TypeScript Helper for Crawl Optimization Engine Diagnostics & Audits
 */
export function getCrawlDiagnosticReport(): CrawlDiagnosticReportPayload {
  return {
    timestamp: new Date().toISOString(),
    totalAudited: 4200,
    crawlHealth: 94,
    criticalCount: 2,
    warningCount: 8,
    infoCount: 12,
    issues: [
      {
        id: "sft_101",
        type: "Soft 404 Error",
        url: "https://workorajobs.com/jobs/expired-listing",
        severity: "critical",
        description: "Page returns HTTP 200 OK status but body contains expired notice.",
        remedy: "Return explicit HTTP 404 or 410 Gone header.",
      },
      {
        id: "cb_102",
        type: "Crawl Budget Waste",
        url: "https://workorajobs.com/jobs?utm_campaign=social",
        severity: "warning",
        description: "Parametric tracking URL consumed search crawler quota.",
        remedy: "Block tracking parameters in robots.txt.",
      },
    ],
    recommendations: [
      "Fix Soft 404 pages by returning proper 404 headers",
      "Eliminate infinite URL recursion paths in router configuration",
      "Enrich thin content pages (< 250 words) using AI metadata engine",
      "Block tracking query parameters in robots.txt to preserve crawl budget",
    ],
  };
}
