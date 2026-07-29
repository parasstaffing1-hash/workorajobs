# Workora SEO Automation Engine Documentation

## Architecture & Overview

The Workora SEO Automation Engine is a centralized background orchestration service that continuously auto-generates metadata, schemas, FAQs, and sitemaps, refreshes stale salary, company, skill, and job pages, recalculates internal links, optimizes search indexing, and exposes full configuration controls across the **Go Backend (`backend-go`)** and **Next.js Frontend (`src/`)**.

---

## Automated Background Task Matrix

| Task Name | Default Interval | Target Pages / Entities | Config Parameter |
|---|---|---|---|
| **Salary Pages Refresh** | 24 Hours | All `/salary/*` & `/salary-guides/*` | `RefreshSalaryIntervalHours` |
| **Company Pages Refresh** | 12 Hours | All `/companies/*` & `/company-guides/*` | `RefreshCompanyIntervalHours` |
| **Skill Pages Refresh** | 24 Hours | All `/skills/*` & `/skill-guides/*` | `RefreshSkillIntervalHours` |
| **Job Pages Refresh** | 6 Hours | All `/jobs/*` active listings | `RefreshJobIntervalHours` |
| **Stale Content Scan** | 7 Days | Pages with `updated_at > 7d` | `StalePageAgeDays` |
| **Sitemap Auto-Sync** | 1 Hour | 12 Category XML Sitemaps | `EnableSitemapSync` |
| **Metadata & Schema Gen** | Continuous | Dynamic landing pages | `EnableAutoMetadata` |
| **Search Indexing Sync** | Continuous | OpenSearch Queue | `EnableOpenSearchSync` |

---

## API Reference (`/api/v1/seo-auto/*`)

- `GET /api/v1/seo-auto/config`: Returns current configurable settings.
- `PUT /api/v1/seo-auto/config`: Updates automation intervals, batch sizes, and feature flags.
- `POST /api/v1/seo-auto/trigger-cycle`: Manually executes an immediate automation pass.
- `GET /api/v1/seo-auto/worker-status`: Returns live worker health and total processed stats.

---

## Verification & Test Results
- Go Backend Test Suite: `TestSeoAutomationEngineCycleAndConfig` (100% PASS across configuration updates and automation cycles).
