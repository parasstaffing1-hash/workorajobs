# WorkoraJobs Database Architecture & Schema Audit (RC1)

This document contains the database schema layout, relational structure, indexing strategies, cascade deletion controls, and PostgreSQL-level connection pooling optimizations for **WorkoraJobs**.

---

## 1. Database Schema Overview

The database uses **PostgreSQL** orchestrated through the **Prisma ORM**. The data model is optimized for transactional reliability, RBAC enforcement, programmatic SEO crawls, and complex link graph mathematics.

```
+------------------------------------+
|               User                 | <--- Authenticated members (Candidates, Recruiters, Admins)
+------------------------------------+
                  |
                  v
+------------------------------------+
|             SeoPage                | <--- Core page model containing MD body, schemas, status
+------------------------------------+
     |            |            |
     |            |            v
     |            |    +-------------------------+
     |            |    |      InternalLink       | <--- Semantic adjacency mappings
     |            |    +-------------------------+
     |            v
     |    +-------------------------+
     |    |   TechnicalSeoAuditRun  | <--- Historical site audit runs
     |    +-------------------------+
     v
+------------------------------------+
|             Sitemap                | <--- XML Sitemap indexes mapping
+------------------------------------+
```

---

## 2. Integrity and Cascade Deletion Controls

To prevent orphan records or referential drift, we configure cascading deletion models directly in Prisma:
- **SEO Pages**: Cascading rules on links (`InternalLink`) ensure deleting an SEO page instantly removes all inbound and outbound link associations.
- **Audit Reports**: `TechnicalSeoAuditRun` utilizes cascade rules. Deleting an audit run automatically deletes all associated page audit results, issues, and recommendations.
- **Job Submissions**: Deleting a parent job listing cascades to remove application logs and candidates' resumes safely.

---

## 3. High-Performance Indexing Strategy

We enforce unique, non-clustered, and single-column indices on high-frequency query paths to secure millisecond database lookups:

| Table | Indexed Columns | Index Type | Query Target / Use Case |
| :--- | :--- | :---: | :--- |
| **SeoPage** | `slug` | UNIQUE B-Tree | URL routing lookups |
| **SeoPage** | `url` | UNIQUE B-Tree | Canonical and crawler matching |
| **Keyword** | `slug` | UNIQUE B-Tree | Keyword clustering and matching |
| **Category** | `slug` | UNIQUE B-Tree | Category directory lookups |
| **TechnicalSeoIssue**| `category`, `severity` | B-Tree Multi-Index | Issue explorer filtering |
| **InternalLink** | `sourcePageId`, `targetPageId` | B-Tree Multi-Index | Graph PageRank adjacency walks |

---

## 4. Production Connection Pooling Guidelines

For PostgreSQL deployment on serverless environments (e.g. Vercel, Cloud Run), configure connection bounds properly:
- **Pool Size**: Append `?connection_limit=10&pool_timeout=15` to your PostgreSQL database URL. This limits maximum concurrent database connections per container instance, preventing connection exhaust during request spikes.
- **PgBouncer**: If deploying across hundreds of highly-scalable container instances, place a PgBouncer layer between containers and database servers to safely manage pooling.
