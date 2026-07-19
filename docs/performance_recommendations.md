# WorkoraJobs: Database Performance & Scalability Recommendations

This document outlines key strategies for scaling the WorkoraJobs database layer to support millions of programmatic SEO landing pages, thousands of background jobs, and millions of page sessions.

---

## 1. Preventing N+1 Query Problems

Prisma handles relation loads explicitly. An N+1 query problem occurs when the system queries a parent table (e.g. 100 Job postings) and then performs 100 separate sub-queries to fetch the company logo or skills for each job.

### ❌ The Bad Pattern (Triggers N+1 Queries):
```typescript
// Query 1
const jobs = await prisma.job.findMany({ take: 50 });

// Triggering 50 additional queries in a loop:
for (const job of jobs) {
  const company = await prisma.company.findUnique({
    where: { id: job.companyId }
  });
}
```

### ✅ The Good Pattern (Single Query with Join):
```typescript
const jobs = await prisma.job.findMany({
  take: 50,
  include: {
    company: {
      select: { name: true, logoUrl: true }
    },
    skills: {
      include: { skill: true }
    }
  }
});
```
* **Enforced Code Standard:** All repositories must explicitly define their selections and relation fetches within a single transaction using nested `include` or `select` parameters.

---

## 2. Connection Pooling & Transaction Management

With thousands of background worker queues running in Docker containers, direct database connections can exhaust PostgreSQL limits (usually `max_connections = 100`).

### Best Practices:
1. **Use Prisma Accelerated Connection Pooling (Accelerate / PgBouncer):**
   * Prepend your database connection URL with PgBouncer query parameters:
     `DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true&connection_limit=10"`
2. **Dispose Prisma Clients:**
   * Ensure standard Lambda/Serverless environments spin up a single, shared global Prisma client instead of re-instantiating inside request controllers.

---

## 3. High-Volume Bulk Insert / Import Optimization

During keyword cluster mapping or daily job ingest runs (e.g. importing 20,000 new jobs), standard single-line `prisma.create()` calls will overwhelm the transaction system.

### Recommended Operations:
* **`prisma.job.createMany()`**:
  * Bundles items into a single `INSERT INTO ... VALUES (...)` SQL statement.
  * Splits payload inputs into batches of 5,000 items to avoid PostgreSQL parameter limit boundaries (65,535 parameters).
* **Bypassing the ORM for extreme bulk loads (100k+ records):**
  * When executing massive imports, bypass Prisma and use native PostgreSQL COPY commands or fast CSV insertion protocols.

---

## 4. Query Caching with Redis

Programmatic SEO pages (e.g. `/jobs/senior-react-developer`) have static properties. We should never fetch them from PostgreSQL on every user request.

### Recommended Caching Layers:
1. **Read-Through Cache:**
   * Check Redis first. If a page exists under cache-key `seo:page:<slug>`, return it immediately.
   * If not, query PostgreSQL, populate Redis, and return.
2. **Active Job boards caching:**
   * Store active aggregate boards (e.g. top 20 React jobs) as cached JSON in Redis with a short 5-minute Time-To-Live (TTL).
3. **Invalidation Strategy:**
   * When an administrator edits a Job Posting or Company profile, emit an event that triggers immediate deletion of that specific Redis cache key.
