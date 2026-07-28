# Workora Programmatic SEO Engine Documentation

## Architecture & Overview

The Workora Programmatic SEO (pSEO) Engine is an enterprise-grade landing page generation system capable of generating millions of unique, search-optimized dynamic pages across **16 landing page dimensions** in both the **Go Backend (`backend-go`)** and **Next.js Frontend (`src/`)**.

---

## 16 Programmatic SEO Dimensions & Routing

| # | Dimension Name | Parameter Value | URL Pattern Example | Primary Schema.org Type |
|---|---|---|---|---|
| 1 | **Jobs** | `jobs` | `/jobs/senior-golang-developer` | `JobPosting` |
| 2 | **Companies** | `companies` | `/companies/google` | `Organization` |
| 3 | **Cities** | `cities` | `/jobs/location/bengaluru` | `CollectionPage` |
| 4 | **States** | `states` | `/jobs/location/state/karnataka` | `CollectionPage` |
| 5 | **Countries** | `countries` | `/companies/country/india` | `CollectionPage` |
| 6 | **Skills** | `skills` | `/skills/golang` | `ItemPage` |
| 7 | **Industries** | `industries` | `/industries/fintech` | `ItemPage` |
| 8 | **Salaries** | `salaries` | `/salary/golang-developer` | `FAQPage` |
| 9 | **Interview Questions** | `interview-questions` | `/prep/interview-questions/system-design` | `FAQPage` |
| 10 | **Career Paths** | `career-paths` | `/prep/career-paths/devops-engineer` | `ItemPage` |
| 11 | **Certifications** | `certifications` | `/prep/certifications/aws-solutions-architect` | `ItemPage` |
| 12 | **Remote Jobs** | `remote-jobs` | `/remote-jobs/fullstack-developer` | `CollectionPage` |
| 13 | **Government Jobs** | `govt-jobs` | `/govt-jobs/delhi` | `CollectionPage` |
| 14 | **Startup Jobs** | `startup-jobs` | `/companies/startups/ai` | `CollectionPage` |
| 15 | **Walk-in Jobs** | `walkin-jobs` | `/walkin-jobs/mumbai` | `CollectionPage` |
| 16 | **Visa Sponsorship** | `visa-sponsorship-jobs` | `/visa-sponsorship-jobs/data-scientist` | `JobPosting` |

---

## Per-Page Assets Generated

For every programmatic URL, the engine computes:
1. **Unique Title & Meta Description**: Tailored template formatting with target skill/location/company.
2. **Clean Canonical URL**: Sanitizes query parameters and tracking flags (`utm_*`, `gclid`, `fbclid`).
3. **Structured Schema.org JSON-LD**: `JobPosting`, `Organization`, `FAQPage`, `BreadcrumbList`, `ItemPage`, or `CollectionPage`.
4. **Open Graph & Twitter Cards**: Social preview images and meta properties.
5. **Breadcrumb Chain**: Structured hierarchy for search engine navigation.
6. **Cross-Linking Graph**: Programmatic related pages & internal linking mesh.

---

## API Reference (`/api/v1/pseo/*`)

### `GET /api/v1/pseo/page`
- **Query Params**:
  - `dimension`: Any of the 16 dimension keys (e.g., `cities`, `skills`, `visa-sponsorship-jobs`)
  - `slug`: Target slug (e.g., `bengaluru`, `golang`, `data-scientist`)
- **Response**: Full `PseoPageResponse` JSON containing metadata, canonical URL, JSON-LD, breadcrumbs, and cross-linking graph.

### `GET /api/v1/pseo/related`
- **Query Params**:
  - `dimension`: Target dimension
  - `slug`: Target slug
- **Response**: Related pages and contextual internal link suggestions.

---

## Verification & Test Results
- Go Backend Test Suite: `TestProgrammaticSeoEngineAllDimensions`, `TestProgrammaticSeoCrossLinkGraph` (100% PASS).
