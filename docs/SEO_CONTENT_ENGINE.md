# Workora SEO Content Engine Documentation

## Architecture & Overview

The Workora SEO Content Engine generates **9 high-authority guide categories** equipped with dynamic content sections, Table of Contents, automated FAQs, live related jobs/companies widgets, contextual internal links mesh, and Schema.org JSON-LD structured data (`Article`, `TechArticle`, `FAQPage`, `BreadcrumbList`).

---

## 9 High-Authority Guide Categories & Dynamic Routing

```
1. Company Guides      --> /company-guides/[slug]
2. Salary Guides       --> /salary-guides/[slug]
3. Skill Guides        --> /skill-guides/[slug]
4. Interview Guides    --> /interview-guides/[slug]
5. Industry Guides     --> /industry-guides/[slug]
6. Career Guides       --> /career-guides/[slug]
7. City Guides         --> /city-guides/[slug]
8. Certification Guides --> /certification-guides/[slug]
9. Remote Work Guides  --> /remote-work-guides/[slug]
```

---

## Mandatory Modules Enforced on Every Page

1. **Table of Contents (ToC)**: Anchor link jump array for seamless UX.
2. **Dynamic Content Sections**: Dynamic text, table, and key takeaway modules.
3. **FAQ Module**: Schema.org `FAQPage` compliant question/answer items.
4. **Related Jobs Widget**: Real-time matching active job cards.
5. **Related Companies Widget**: Verified employers hiring in that sector.
6. **Internal Links Mesh**: Cross-linking recommendations.
7. **Schema.org Structured Data**: JSON-LD scripts embedded in the HTML head.
8. **Automated Background Update Queue**: Periodic background refresh worker.

---

## API Reference (`/api/v1/seo-content/*`)

- `GET /api/v1/seo-content/guide?category=salary-guides&slug=golang-developer`: Returns complete guide payload.
- `POST /api/v1/seo-content/refresh`: Triggers background content metrics refresh.

---

## Verification & Test Results
- Go Backend Test Suite: `TestSeoContentEngineAllGuideCategories`, `TestSeoContentAutoUpdateContent` (100% PASS across all 9 guide categories).
