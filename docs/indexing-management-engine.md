# Enterprise Google Indexing, Search Engine Submission & Crawl Management Engine

The **Enterprise Google Indexing, Search Engine Submission & Crawl Management Engine** is a high-performance, provider-agnostic, queue-driven subsystem in **WorkoraJobs**. It is built specifically to automate index submission and real-time crawl directives management for millions of target URLs, handling high-throughput indexing jobs via background worker workers, with automated backoff retries and deep audit compliance trails.

---

## 1. System Architecture

The engine operates on a clean, decoupled pipe-and-filter model using an asynchronous background pipeline.

```
[SeoPage Events / Admin Request] 
               │
               ▼
   ┌───────────────────────┐
   │  Eligibility Engine   │ ◄─── Checks Robots.txt, Meta Robots, Canonical,
   └───────────┬───────────┘      Sitemaps, and Schema Markup completeness
               │
               ▼ (IF ELIGIBLE)
   ┌───────────────────────┐
   │    Provider Router    │ ◄─── Formulates Google vs. Bing Adapters
   └───────────┬───────────┘
               │
               ▼
   ┌───────────────────────┐
   │  BullMQ Queue (Redis) │ ◄─── Spawns persistent jobs; increments pending stats
   └───────────┬───────────┘
               │
         ┌─────┴─────┐
         ▼           ▼ (Concurrent Workers)
   ┌───────────┐┌───────────┐
   │  Worker   ││  Worker   │ ◄─── Performs exponential backoff retries
   └─────┬─────┘└─────┬─────┘
         │            │
         └─────┬──────┘
               ▼
  ┌─────────────────────────┐
  │ Google / Bing API RESTs │ ◄─── Dispatches secure provider requests
  └─────────────────────────┘
```

---

## 2. Core Eligibility Checklist

Before queuing a URL for index submission, it must clear a rigid, multi-point SEO checklist. This prevents crawl waste, minimizes Google Search Console crawl errors, and maintains search engine goodwill:

1. **Canonical URL Validation**: Verifies that the page contains an explicit canonical tag, and that the requested submission matches the canonical URL.
2. **Page Status Auditing**: Ensures the page is successfully published (`isPublished === true`) and not soft-deleted (`isDeleted === false`).
3. **Robots.txt Crawl Allowance**: Interacts with the `RobotsEngineService` to confirm robots rules allow crawls.
4. **HTML Meta Robots Verification**: Analyzes the page metadata for any `noindex` blocks.
5. **Schema.org Structured Data Completeness**: Requires that JSON-LD schema markup has been successfully compiled and validated.
6. **Sitemap Registry Mapped**: Checks that the URL is registered in one of the active sitemap files (`sitemapId` is set).

*Note: Deletion requests (`URL_DELETED`) are exempt from standard eligibility checks and are queued immediately to expedite removal from search indices.*

---

## 3. Database Schema Definitions

We updated `/prisma/schema.prisma` to register two persistent data tables:

### IndexingSubmission Table
Tracks individual search engine API calls, request statuses, processing times, and failure responses.

```prisma
model IndexingSubmission {
  id                 String   @id @default(uuid())
  url                String
  provider           String   // e.g. "GOOGLE_INDEXING", "GOOGLE_SCON_SITEMAP", "BING_WEBMASTER"
  submissionType     String   // e.g. "URL_UPDATED", "URL_DELETED", "SITEMAP_SUBMIT"
  status             String   // e.g. "PENDING", "SUCCESS", "FAILED"
  responseCode       Int?
  errorDetails       String?
  retryCount         Int      @default(0)
  processingDuration Int      @default(0) // in milliseconds
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@index([url])
  @@index([provider])
  @@index([status])
  @@index([createdAt])
}
```

### CrawlMetadata Table
Maintains cumulative health data, crawl frequency recommendations, and cumulative statuses per target URL.

```prisma
model CrawlMetadata {
  id                       String    @id @default(uuid())
  url                      String    @unique
  firstSubmittedAt         DateTime  @default(now())
  lastSubmittedAt          DateTime  @default(now())
  lastSuccessSubmittedAt   DateTime?
  pendingSubmissionsCount  Int       @default(0)
  failedSubmissionsCount   Int       @default(0)
  crawlPriority            Float     @default(0.5)
  crawlFrequencyRec        String    @default("daily")
  lastCrawledAt            DateTime?
  lastHttpStatusCode       Int?
  createdAt                DateTime  @default(now())
  updatedAt                DateTime  @updatedAt

  @@index([url])
}
```

---

## 4. Background Queue Architecture & Workers

We integrated BullMQ with horizontal scale readiness:
- **Queue name**: `search-engine-indexing`
- **Job Concurrency**: Set to `2` by default (can scale to N container instances).
- **Manual Backoff Retry Logic**: Failed API calls trigger an exponential backoff retry. Rescheduling calculations:
  - Attempt 1: 2,000 ms delay
  - Attempt 2: 4,000 ms delay
  - Attempt 3+: Hard fail, marked `FAILED` in historical records, and audited.

---

## 5. REST APIs (Express Router)

All endpoints reside in the `/api` namespace and are secured via authentication.

### Single URL Submission
- **Route**: `POST /api/indexing/submit`
- **Headers**: `Authorization: Bearer <JWT>`
- **Request Body**:
  ```json
  {
    "url": "https://workorajobs.com/jobs/react-engineer",
    "submissionType": "URL_UPDATED",
    "bypassEligibility": false
  }
  ```
- **Response (202 Accepted)**:
  ```json
  {
    "success": true,
    "message": "Indexing submission queued successfully in background pipeline.",
    "data": {
      "submissionId": "sub_16892520_k2g6b",
      "queued": true
    }
  }
  ```

### Batch URL Submission
- **Route**: `POST /api/indexing/submit-batch`
- **Request Body**:
  ```json
  {
    "urls": [
      "https://workorajobs.com/jobs/vue-engineer",
      "https://workorajobs.com/jobs/node-architect"
    ],
    "submissionType": "URL_UPDATED"
  }
  ```
- **Response (202 Accepted)**:
  ```json
  {
    "success": true,
    "message": "Bulk batch submission processing completed.",
    "data": {
      "results": [
        { "url": "https://workorajobs.com/jobs/vue-engineer", "eligible": true, "queued": true },
        { "url": "https://workorajobs.com/jobs/node-architect", "eligible": true, "queued": true }
      ]
    }
  }
  ```

### Sitemap XML Submit
- **Route**: `POST /api/indexing/submit-sitemap`
- **Request Body**:
  ```json
  {
    "sitemapUrl": "https://workorajobs.com/sitemap-jobs.xml"
  }
  ```

### Get Submission Log History
- **Route**: `GET /api/indexing/history`
- **Parameters**: `page`, `limit`, `provider`, `status`, `search`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "sub_16892520_k2g6b_GOOGLE_INDEXING",
          "url": "https://workorajobs.com/jobs/react-engineer",
          "provider": "GOOGLE_INDEXING",
          "submissionType": "URL_UPDATED",
          "status": "SUCCESS",
          "responseCode": 200,
          "retryCount": 0,
          "processingDuration": 145,
          "createdAt": "2026-07-19T07:29:22.000Z"
        }
      ],
      "pagination": { "page": 1, "limit": 10, "total": 1, "pages": 1 }
    }
  }
  ```

### Crawl Metadata Statuses
- **Route**: `GET /api/indexing/crawl-status`
- **Parameters**: `page`, `limit`, `search`

### Reschedule / Manual Retry
- **Route**: `POST /api/indexing/retry/:id`

### Cancel Pending Submissions
- **Route**: `POST /api/indexing/cancel`

### Export Submissions Logs
- **Route**: `GET /api/indexing/export` -> Triggers dynamic file stream download of `indexing-submissions.json`.

---

## 6. Credentials Config & Management
Engine configuration settings are stored persistently in the database (`SystemSetting` table) and can be hot-reloaded:
- **Fetch Settings**: `GET /api/indexing/config` (Filters out private key materials and API keys for protection)
- **Modify Settings**: `PUT /api/indexing/config`
  ```json
  {
    "googleEnabled": true,
    "bingEnabled": true,
    "googleSitemapSubmitEnabled": true,
    "environment": "production",
    "googleServiceAccountEmail": "indexing-service@workora.iam.gserviceaccount.com",
    "googleServiceAccountPrivateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...",
    "bingApiKey": "32_character_hex_key"
  }
  ```
