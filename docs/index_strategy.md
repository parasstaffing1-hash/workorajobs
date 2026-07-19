# WorkoraJobs: Database Indexing Strategy

To support **millions of programmatic SEO pages** and keywords with sub-millisecond query delivery, we use a highly optimized indexing scheme. This document details the role of each index defined in our Prisma schema.

---

## 1. Single-Column Indexing

Standard B-Tree indexes are created automatically on primary keys (`@id`) and fields annotated with `@unique`. We explicitly specify single-column indexes on key search and filter predicates:

* **`User(email)`**: Guarantees fast user lookup during logins and session verification.
* **`SeoPage(slug)`**: Essential for the dynamic URL routing engine. Ensures web requests resolve instantly.
* **`Job(slug)`, `Company(slug)`, `JobCategory(slug)`, `Location(slug)`**: All canonical programmatic slugs are indexed to guarantee ultra-fast detail page lookups.
* **`Keyword(keyword)`**: Speeds up direct term queries and de-duplication checks during keyword discovery pipelines.

---

## 2. Composite Indexing (Multi-Column)

Many database queries in WorkoraJobs filter on multiple attributes simultaneously. Standard indexes would require PostgreSQL to perform costly Index Intersections. Composite indexes optimize these specific read paths:

### A. Keyword Filtering and Discovery
```prisma
model Keyword {
  ...
  @@index([searchVolume, difficulty])
}
```
* **Why:** The Keyword discovery pipeline regularly queries for "low-hanging fruit" keywords, sorting by search volume (descending) and filtering by low keyword difficulty (e.g. difficulty < 30). This composite index satisfies this query natively without executing a full table sort.

### B. Job Search Filters
```prisma
model Job {
  ...
  @@index([employmentType, experienceLevel])
}
```
* **Why:** Job seekers filter job boards using facets like "Full-Time Senior Roles". Indexing these columns together enables extremely fast facet navigation and bento-grid loading.

### C. BullMQ Queue Performance
```prisma
model QueueJob {
  ...
  @@index([queueName, status])
}
```
* **Why:** Background workers frequently fetch jobs from a specific queue that are in a `WAITING` or `ACTIVE` status. This index keeps queue pulling latency to `< 1ms`.

---

## 3. Covering Indexes & Foreign Key Joins

Prisma requires explicit indexing of foreign keys to prevent costly sequential scans on parent-child table joins. Every relationship model in our schema includes targeted foreign-key indexing:

* **`UserRole(userId)` / `UserRole(roleId)`**: Speeds up Role-Based Access Control checks during routing.
* **`RolePermission(roleId)` / `RolePermission(permissionId)`**: Instant permission map lookup on every authenticated request.
* **`InternalLink(sourcePageId)` / `InternalLink(targetPageId)`**: Powers the automated programmatic inner linking crawler which analyzes and displays context vectors dynamically.
* **`Job(companyId)` / `Job(categoryId)`**: Resolves company profile views with their active listings instantly.

---

## 4. Full-Text Search Optimization (Recommendation)

For keyword searches on jobs (e.g. searching "React Engineer in Texas"), standard B-Tree `LIKE %term%` queries trigger slow Sequential Scans at scale. 

### Recommended Enterprise Migration:
We recommend creating a GIN index on PostgreSQL `tsvector` columns for full-text searches. In a future Prisma migration, execute:

```sql
-- Create full-text search vector column
ALTER TABLE "Job" ADD COLUMN "searchVector" tsvector;

-- Create trigger to automatically compile vectors
CREATE TRIGGER job_vector_update BEFORE INSERT OR UPDATE
ON "Job" FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger("searchVector", 'pg_catalog.english', "title", "descriptionHtml");

-- Create GIN index
CREATE INDEX job_search_vector_idx ON "Job" USING gin("searchVector");
```
This is fully supported in standard Google Cloud SQL and AWS RDS instances.
