# Workora Technical SEO Engine Documentation

## Architecture & Overview

The Workora Technical SEO Engine is an enterprise-grade, high-performance SEO platform built to serve dynamic metadata, Schema.org JSON-LD schemas, canonical URL management, dynamic `robots.txt` generation, Open Graph tags, Twitter Cards, pagination controls, and hreflang localization across both the **Go Backend (`backend-go`)** and **Next.js Frontend (`src/`)**.

---

## Key Features & Capabilities

### 1. Schema.org JSON-LD Generators
- **JobPosting Schema**: Generates Schema.org compliant `JobPosting` structured data with title, description, datePosted, validThrough, employmentType, baseSalary, jobLocation, and hiringOrganization logo/website.
- **Organization Schema**: Generates `Organization` structured data with official brand name, logo, social links (`sameAs`), and customer contact point.
- **FAQPage Schema**: Generates structured question and answer arrays for landing pages (remote jobs, freshers, walkins, salary benchmarks).
- **BreadcrumbList Schema**: Generates position-indexed breadcrumb chains for search engine hierarchy navigation.
- **WebSite & SearchAction Schema**: Connects Google Sitelinks Search Box (`/jobs?q={search_term_string}`).

### 2. Canonical URL Manager & Tracking Stripper
- Automatically strips tracking parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `fbclid`, `ref`, `sort`, `filter`) and redundant `page=1` from canonical URL declarations.

### 3. Dynamic Metadata & Title/Description Builder
- Dynamic title template formatting: `{Title} | WorkoraJobs`.
- Automated meta description enrichment with career keywords and location tags.
- Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`).
- Twitter Cards (`summary_large_image`, `@workorajobs`).

### 4. Dynamic Robots.txt Engine
- **Production Mode**: Allows search engine indexing while guarding sensitive administrative and private candidate/employer routes (`/admin/*`, `/api/*`, `/candidate/dashboard`, `/employer/dashboard`, `/auth/*`).
- **Development Mode**: Generates `User-agent: *\nDisallow: /` to prevent indexing staging environments.

### 5. Hreflang Localization Architecture
- Supports multi-region hreflang alternate declarations (`en-US`, `en-IN`, `en-GB`, `x-default`).

---

## Go Backend API Reference (`/api/v1/seo/*`)

| Endpoint | Method | Response Format | Description |
|---|---|---|---|
| `/api/v1/seo/metadata` | `GET` | `application/json` | Computed metadata, canonical URL, OpenGraph & Twitter tags. |
| `/api/v1/seo/schema/job/:id` | `GET` | `application/ld+json` | Schema.org `JobPosting` JSON-LD for specified job ID. |
| `/api/v1/seo/schema/organization` | `GET` | `application/ld+json` | Schema.org `Organization` JSON-LD. |
| `/api/v1/seo/schema/faq` | `GET` | `application/ld+json` | Schema.org `FAQPage` JSON-LD. |
| `/api/v1/seo/schema/breadcrumb` | `GET` | `application/ld+json` | Schema.org `BreadcrumbList` JSON-LD. |
| `/api/v1/seo/robots.txt` | `GET` | `text/plain` | Dynamic environment-aware `robots.txt`. |

---

## Next.js TypeScript Library Reference (`src/lib/seo/*`)

- `src/lib/seo/json-ld.ts`:
  - `generateJobPostingJsonLd(job)`
  - `generateOrganizationJsonLd()`
  - `generateFaqJsonLd(faqs)`
  - `generateBreadcrumbJsonLd(items)`
  - `generateWebSiteJsonLd()`
- `src/lib/site.ts`:
  - `createMetadata(input)` — Next.js `Metadata` generator with canonical cleaner and hreflang alternates.

---

## Verification & Test Results
- Go Backend Test Suite: `TestSeoEngineSchemaGenerators`, `TestCanonicalURLAndMetadataBuilder`, `TestDynamicRobotsTxt` (100% PASS).
