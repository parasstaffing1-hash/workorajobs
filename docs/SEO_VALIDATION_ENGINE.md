# Workora SEO Validation Engine Documentation

## Architecture & Overview

The Workora SEO Validation Engine is an enterprise-grade auditing service evaluating **15 specialized SEO rules**, computing a weighted SEO Health Score ($0 - 100$), generating page-level and site-wide diagnostic reports, and providing REST APIs across the **Go Backend (`backend-go`)** and **Next.js Frontend (`src/`)**.

---

## 15 Specialized Audit Rules Matrix

| # | Audit Rule | Validation Condition | Weight | Severity |
|---|---|---|---|---|
| 1 | **Canonical** | Valid `<link rel="canonical">` self-referential URL | 8 pts | Critical |
| 2 | **Meta Title** | Present, non-duplicate, length $30 - 60$ chars | 8 pts | Critical |
| 3 | **Meta Description** | Present, non-duplicate, length $120 - 160$ chars | 8 pts | Critical |
| 4 | **Open Graph** | Valid `og:title`, `og:description`, `og:image`, `og:url` | 6 pts | Warning |
| 5 | **Twitter Cards** | Valid `twitter:card`, `twitter:title`, `twitter:image` | 6 pts | Warning |
| 6 | **Schema JSON-LD** | Valid Schema.org syntax & type matching | 8 pts | Critical |
| 7 | **Internal Links** | $\ge 2$ healthy internal links with anchor text | 6 pts | Warning |
| 8 | **External Links** | No 404 targets, valid `rel="nofollow"` on ads | 5 pts | Info |
| 9 | **Broken Images** | No 404 image sources & all `<img>` have `alt` tags | 6 pts | Warning |
| 10 | **Page Speed** | TTFB $< 500ms$ & page payload $< 1.5MB$ | 8 pts | Critical |
| 11 | **Mobile Friendly** | Viewport meta present & touch target spacing | 7 pts | Critical |
| 12 | **Duplicate Metadata** | SHA256 title/desc hash unique across site | 6 pts | Warning |
| 13 | **Duplicate Content** | Body text hash unique across site | 6 pts | Warning |
| 14 | **Thin Content** | Word count $\ge 250$ words | 6 pts | Warning |
| 15 | **Orphan Pages** | Inbound internal links $\ge 1$ | 6 pts | Warning |

---

## API Reference (`/api/v1/seo-val/*`)

- `GET /api/v1/seo-val/report`: Returns latest site-wide validation report.
- `POST /api/v1/seo-val/validate-url`: Validates a single URL across all 15 audit rules.
- `POST /api/v1/seo-val/audit-site`: Triggers an immediate site-wide validation audit.

---

## Verification & Test Results
- Go Backend Test Suite: `TestSeoValidationEngine15Rules` (100% PASS across all 15 audit rules).
