# WorkoraJobs API Blueprint & Endpoint Audit (RC1)

This document maps the complete, unified REST API blueprint for **WorkoraJobs**, covering inputs parsing schemas, authentications, RBAC permissions, paginations, filter models, and JSON error responses.

---

## 1. Global API Design Conventions

### Input Validation
Every API endpoint validates incoming requests using strict **Zod** models, rejecting malformed formats before they enter service layers (HTTP 400 Bad Request).

### Response Format
All payloads return a standardized envelope structure to ensure frontend ease-of-integration:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional localized system message"
}
```

### Error Protocol
Errors are intercepted globally and returned as structured JSON:
```json
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "Resource requested was not found or has been soft-deleted."
}
```

---

## 2. API Endpoints Catalog

### Authentication & RBAC
- `POST /api/v1/auth/register` : Public candidates registration.
- `POST /api/v1/auth/login` : Authenticates users, returns bearer JWT tokens.
- `POST /api/v1/auth/logout` : Clears browser auth cookies/sessions.

### Programmatic SEO Keyword Engine
- `POST /api/v1/keywords/discover` : Seed discovery crawls (BullMQ queued).
- `POST /api/v1/clusters/build` : Semantic intent cluster builder.
- `GET  /api/v1/keywords/history` : Listing discovered keywords.

### XML Sitemaps & Crawling Controls
- `GET  /sitemap.xml` : Returns physical/dynamic XML sitemap list.
- `GET  /robots.txt` : Delivers dynamic crawler configuration index.
- `POST /api/v1/indexing/submit` : Sends immediate request to Google/Bing APIs.

### Technical SEO Site Health Audit
- `POST /api/v1/seo-audit/trigger` : Queues manual, scheduled, or n8n crawls.
- `GET  /api/v1/seo-audit/runs` : Retrieves historic audit run items.
- `GET  /api/v1/seo-audit/runs/:id` : Detailed audit scores, findings, recommendations.
- `GET  /api/v1/seo-audit/trends` : Historically computed trends analysis indexes.
- `GET  /api/v1/seo-audit/issues` : Filterable issue index with search & resolution filtering.
- `POST /api/v1/seo-audit/issues/:id/resolve` : Resolves specific diagnostic flag.
- `GET  /api/v1/seo-audit/export/:id` : Exports full audit reports for offline storage.

---

## 3. Pagination, Filtering, and Sorting Models

List APIs enforce a strict standard structure to allow client side query parameters:
- **Pagination**: Includes `page` and `limit` query parameters with standardized metadata responses:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```
- **Filtering**: Filters map to specific DB column matches (e.g. `status=SUCCESS`, `severity=HIGH`).
- **Search**: `search=software` applies case-insensitive `contains` parameters to optimize text search operations.
