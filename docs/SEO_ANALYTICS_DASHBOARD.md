# Workora SEO Analytics Dashboard Documentation

## Architecture & Overview

The Workora SEO Analytics Dashboard aggregates real-time metrics across all 8 enterprise SEO engines, tracking **13 core metrics**, generating interactive 30-day chart time series, REST APIs, and an admin UI page at `/admin/seo-dashboard`.

---

## 13 Tracked Core SEO Metrics

| Metric | Target / Healthy Value | Engine Provider | Primary Chart Type |
|---|---|---|---|
| 1. **Indexed Pages** | $95\%+$ of sitemap URLs | Search Indexing System | Area Chart |
| 2. **Non-Indexed Pages** | $< 5\%$ | Search Indexing System | Bar Chart |
| 3. **Broken Links** | $0$ | Crawl Optimization Engine | Issue Metric |
| 4. **Redirect Chains** | $0$ | Crawl Optimization Engine | Issue Metric |
| 5. **Duplicate Titles** | $0$ | AI Metadata Engine | Donut Chart |
| 6. **Duplicate Descriptions** | $0$ | AI Metadata Engine | Donut Chart |
| 7. **Missing Metadata** | $0$ | Technical SEO Engine | Gauge Chart |
| 8. **Missing Schema** | $0$ | Technical SEO Engine | Gauge Chart |
| 9. **Core Web Vitals** | LCP $< 2.5s$, INP $< 200ms$, CLS $< 0.1$ | Performance Engine | Speed Meter |
| 10. **Internal Links** | $\ge 13$ connections per entity | Internal Linking Engine | Network Graph |
| 11. **Orphan Pages** | $0$ | Internal Linking Engine | Issue Metric |
| 12. **Sitemap Status** | Active ($12/12$ categories synced) | XML Sitemap Engine | Status Badge |
| 13. **Search Performance** | Clicks, Impressions, CTR, Avg Position | Universal Search Engine | Line Chart |

---

## API Reference (`/api/v1/seo-analytics/*`)

- `GET /api/v1/seo-analytics/overview`: Returns 13 core metrics overview payload.
- `GET /api/v1/seo-analytics/charts`: Returns 30-day time series data for crawl health, clicks vs impressions, and issue distribution.
- `GET /api/v1/seo-analytics/performance`: Returns search performance metrics (clicks, impressions, CTR, average position).

---

## Verification & Test Results
- Go Backend Test Suite: `TestSeoAnalyticsDashboardMetricsAndCharts` (100% PASS across 13 metrics and chart series).
- Admin Dashboard UI: Available at `/admin/seo-dashboard`.
