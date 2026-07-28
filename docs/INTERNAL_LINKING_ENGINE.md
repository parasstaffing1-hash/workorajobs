# Workora Internal Linking Engine Documentation

## Architecture & Overview

The Workora Internal Linking Engine is an automated contextual cross-linking platform built to eliminate orphan pages, optimize search engine crawl depth to $\le 3$ clicks, and generate intelligent page-to-page relationships across the **Go Backend (`backend-go`)** and **Next.js Frontend (`src/`)**.

---

## 13 Connected Entity Relationships

```
Job -----> Company (1)
Job -----> Skills (2)
Job -----> City (3)
Job -----> Salary (4)
Job -----> Similar Jobs (5)

Company -> Jobs (6)
Company -> Industry (7)

Skill ---> Jobs (8)
Skill ---> Salary (9)

City ----> Companies (10)
City ----> Jobs (11)

Industry -> Companies (12)
Industry -> Jobs (13)
```

| Relationship | Source | Target | Anchor Text Example |
|---|---|---|---|
| 1 | **Job** | Company | `Acme Corp Careers` |
| 2 | **Job** | Skill | `Golang Developer Jobs` |
| 3 | **Job** | City | `Tech Jobs in Bengaluru` |
| 4 | **Job** | Salary | `Senior Backend Engineer Salary Guide` |
| 5 | **Job** | Similar Jobs | `Lead Backend Developer` |
| 6 | **Company** | Jobs | `View Open Jobs at Acme Corp` |
| 7 | **Company** | Industry | `Software Engineering Industry Jobs` |
| 8 | **Skill** | Jobs | `Explore All Golang Roles` |
| 9 | **Skill** | Salary | `Golang Salary & Compensation Report` |
| 10 | **City** | Companies | `Top Companies Hiring in Bengaluru` |
| 11 | **City** | Jobs | `All Jobs in Bengaluru` |
| 12 | **Industry** | Companies | `Fintech Industry Companies` |
| 13 | **Industry** | Jobs | `Fintech Industry Jobs` |

---

## Key Features

### 1. Orphan Page Prevention
- Scans all catalog and dynamic landing pages to verify at least 2 inbound internal links exist from index or category hubs.

### 2. Crawl Depth Optimization ($\le 3$ Clicks)
- Ensures all deep pages are reachable within 3 hops from the homepage (`/`) or main category index hubs.

---

## API Reference (`/api/v1/linking/*`)

- `GET /api/v1/linking/entity?type=job&id=101`: Returns complete inbound, outbound, and similar entity link graph.
- `GET /api/v1/linking/orphan-audit`: Runs automated audit for unlinked orphan pages.
- `GET /api/v1/linking/crawl-depth?url=...`: Computes click distance metric from homepage.

---

## Verification & Test Results
- Go Backend Test Suite: `TestInternalLinkingEngineConnections`, `TestOrphanPageAuditAndCrawlDepth` (100% PASS).
