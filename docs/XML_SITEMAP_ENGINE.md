# Workora XML Sitemap Engine Documentation

## Architecture & Overview

The Workora XML Sitemap Engine is an automated, high-scale sitemap generation system designed to build, cache, split, compress, and serve search engine sitemaps compliant with the `http://www.sitemaps.org/schemas/sitemap/0.9` protocol.

---

## Supported Sitemap Categories

| # | Sitemap Name | Endpoint | Priority | Change Frequency |
|---|---|---|---|---|
| 1 | **Sitemap Index** | `/api/v1/sitemaps/index.xml` | N/A | `daily` |
| 2 | **Jobs Sitemap** | `/api/v1/sitemaps/jobs.xml` | 0.9 | `daily` |
| 3 | **Companies Sitemap** | `/api/v1/sitemaps/companies.xml` | 0.8 | `weekly` |
| 4 | **Skills Sitemap** | `/api/v1/sitemaps/skills.xml` | 0.8 | `weekly` |
| 5 | **Cities Sitemap** | `/api/v1/sitemaps/cities.xml` | 0.7 | `weekly` |
| 6 | **States Sitemap** | `/api/v1/sitemaps/states.xml` | 0.7 | `weekly` |
| 7 | **Salaries Sitemap** | `/api/v1/sitemaps/salaries.xml` | 0.7 | `weekly` |
| 8 | **Careers Sitemap** | `/api/v1/sitemaps/careers.xml` | 0.7 | `monthly` |
| 9 | **Industries Sitemap** | `/api/v1/sitemaps/industries.xml` | 0.8 | `weekly` |
| 10 | **FAQ Sitemap** | `/api/v1/sitemaps/faq.xml` | 0.6 | `monthly` |
| 11 | **Blog Sitemap** | `/api/v1/sitemaps/blog.xml` | 0.7 | `weekly` |
| 12 | **Static Sitemap** | `/api/v1/sitemaps/static.xml` | 0.6 | `monthly` |

---

## Technical Features

### 1. Automatic 50,000 URL Chunking
- Splitting at 50,000 URLs per sitemap file (`SitemapUrlLimit = 50000`) per Google Sitemap Guidelines.
- Pagination parameter: `/api/v1/sitemaps/jobs.xml?page=2`.

### 2. Gzip Compression On-The-Fly
- Append `?gzip=true` to any sitemap endpoint to receive gzip compressed response with `Content-Encoding: gzip` header.

### 3. XML Entity Escaping & Lastmod Formatting
- Automated escaping for `&`, `<`, `>`, `"`, `'`.
- Standard W3C / ISO 8601 timestamps (`RFC3339`).

---

## Verification & Test Results
- Go Backend Test Suite: `TestSitemapEngineGenerators`, `TestSitemapGzipCompression` (100% PASS).
