# Workora Crawl Optimization Engine Documentation

## Architecture & Overview

The Workora Crawl Optimization Engine is an enterprise-grade SEO diagnostic suite featuring **10 specialized detectors**, automated Crawl Health Scoring (0 - 100), diagnostic reporting, and REST APIs across the **Go Backend (`backend-go`)** and **Next.js Frontend (`src/`)**.

---

## 10 Diagnostic Detectors & Evaluation Logic

| # | Detector | Evaluation Logic | Severity | Action / Remedy |
|---|---|---|---|---|
| 1 | **Crawl Budget** | Parametric URL filtering & header optimization | Warning | Block tracking parameters in `robots.txt` |
| 2 | **Exact Duplicate** | SHA256 body content hash comparison | Critical | Apply `rel="canonical"` or 301 redirect |
| 3 | **Canonical Validation** | Checks if `<link rel="canonical">` is self-referential | Warning | Strip `utm_*` and tracking query parameters |
| 4 | **Redirect Validation** | Detects redirect chains $> 2$ hops or circular loops | Critical | Flatten redirect chains to 1 hop |
| 5 | **Broken Link Detection** | Evaluates HTTP status codes of internal links | Critical | Remove or update 404/500 target links |
| 6 | **Orphan Page Detection** | Identifies pages with 0 internal inbound links | Warning | Inject contextual link into sitemap mesh |
| 7 | **Thin Content** | Flags pages with word count $< 250$ words | Warning | Auto-expand content with AI metadata |
| 8 | **Near Duplicate** | MinHash / Jaccard text similarity score $> 85\%$ | Warning | Consolidate variants into parent topic |
| 9 | **Soft 404 Detection** | Identifies HTTP 200 OK responses with "not found" text | Critical | Return true HTTP 404 Not Found header |
| 10 | **Infinite URL Loop** | Detects repeated path segments or recursive query strings | Critical | Enforce strict pattern matching rules in router |

---

## API Reference (`/api/v1/crawl-opt/*`)

- `GET /api/v1/crawl-opt/report`: Returns latest crawl diagnostic report with health score.
- `POST /api/v1/crawl-opt/audit`: Triggers manual full crawl health audit.
- `GET /api/v1/crawl-opt/issues?severity=critical`: Lists issues filtered by severity (`critical`, `warning`, `info`).

---

## Verification & Test Results
- Go Backend Test Suite: `TestCrawlOptimizationEngineAllDetectors` (100% PASS across all 10 detectors).
