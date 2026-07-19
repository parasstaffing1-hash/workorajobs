# WorkoraJobs Keyword Discovery & Research Engine

This document details the architecture, configuration, integration, and operational guidelines for the **Enterprise Keyword Discovery & Research Engine** in **WorkoraJobs**.

---

## 1. System Architecture

The Keyword Discovery & Research Engine is built following Clean Architecture and SOLID principles. It decouples data fetching, text normalization, mathematical scoring, and database transactions into specialized services.

```
+------------------------------------------------------------+
|                       REST API / n8n                       |
|           (Controllers, Auth, RBAC, Rate Limiting)          |
+-----------------------------+------------------------------+
                              |
                              v
+------------------------------------------------------------+
|                       KeywordService                       |
|       (Validation, Orchestration, Import/Export Engine)    |
+--------------+--------------+---------------+--------------+
               |              |               |
               v              v               v
+--------------+--+  +--------+-----+  +------+--------------+
| KeywordProviders |  | Normalizer   |  | ScoringEngine       |
| (Multi-source)   |  | (Unicode/NFD)|  | (Weights, Versions) |
+-----------------+  +--------------+  +---------------------+
                              |
                              v
+------------------------------------------------------------+
|                     KeywordRepository                      |
|             (Prisma Client, BulkUpsert, Metrics)           |
+------------------------------------------------------------+
```

---

## 2. Core Modules & Codebases

1. **`normalizeKeyword` (`src/core/utils/keywordNormalize.ts`)**:
   - Performs `NFD` decomposition to strip diacritics/accents safely.
   - Cleans whitespaces, handles special characters (e.g. converting `&` to `and`).
   - Standardizes common spelling variants and career terms (e.g. `softwear` -> `software`, `engeneer` -> `engineer`).

2. **`KeywordScoringEngine` (`src/services/KeywordScoringEngine.ts`)**:
   - A mathematical scoring system that aggregates:
     - Log-scaled search volume
     - Inverse keyword difficulty (lower difficulty = higher opportunity)
     - Intent priorities (Transactional & Commercial given top weights)
     - Categorization status
     - Trend indicators (+15% score bonus for `UP` trajectories, -15% penalty for `DOWN`)
   - Returns a detailed mathematical breakdown and is versioned (currently `2.1.0`).

3. **`KeywordProviders` (`src/services/KeywordProviders.ts`)**:
   - High-quality simulation and real-source suggestions from multiple networks:
     - Google Autocomplete
     - Bing Suggestions
     - Reddit Discussions
     - LinkedIn Trends
     - Google Search Console
     - Google Trends
     - Internal Search Logs
     - **AI Expansion Provider (Gemini API)**: Leverages `gemini-3.5-flash` to expand career seed terms into high-intent long-tail structures.

4. **`KeywordRepository` (`src/repositories/KeywordRepository.ts`)**:
   - Implements high-throughput bulk upsert transactions.
   - Restores soft-deleted keywords automatically if they are re-discovered.
   - Computes rolling aggregations and database metric summary arrays.

5. **`KeywordProcessingWorker` (`src/workers/KeywordProcessingWorker.ts`)**:
   - High-performance background processor listening on BullMQ's `keyword-processing` queue.
   - Implements strict rate limits and concurrency controls to prevent database lockups during heavy automated discovery runs.

---

## 3. REST API Specification

All keyword discovery routes are prefixed with `/api/v1`.

### 3.1. Submit Seed Keyword (Start Discovery)
Triggers multi-provider lookup, scoring, and ingestion.

- **URL**: `POST /keywords/seed`
- **Authentication**: Required (`authenticate` + `api.manage` permission)
- **Request Body**:
```json
{
  "seed": "software engineer",
  "language": "en",
  "country": "US",
  "limit": 10,
  "async": true
}
```
- **Response (Async Mode)**:
```json
{
  "success": true,
  "message": "Keyword discovery job successfully queued for background execution.",
  "data": {
    "status": "QUEUED",
    "jobId": "18",
    "seed": "software engineer"
  }
}
```

---

### 3.2. List & Query Keywords
Powerful, paged explorer with multi-dimensional filtering.

- **URL**: `GET /keywords`
- **Authentication**: Required (`authenticate`)
- **Query Parameters**:
  - `page`: Page index (default: `1`)
  - `limit`: Page limit (default: `20`)
  - `search`: Match keyword raw string
  - `category`: Filter by category (e.g. `job_titles`, `salary_keywords`)
  - `intent`: Filter by intent (e.g. `TRANSACTIONAL`, `COMMERCIAL`)
  - `isArchived`: `true` or `false`
  - `sortBy`: Sorting field (default: `opportunityScore`)
  - `sortOrder`: `asc` or `desc` (default: `desc`)

---

### 3.3. Export Keywords (CSV or JSON)
Allows full data export of lists.

- **URL**: `POST /keywords/export`
- **Query Parameters**:
  - `format`: `csv` or `json` (default: `json`)
- **Response**: Generates a standard file-system download attach stream (`Content-Disposition: attachment; filename="..."`).

---

### 3.4. Overall Metrics & Dashboard Indicators
Retrieves aggregate stats for administrative overviews.

- **URL**: `GET /keywords/metrics`
- **Response**:
```json
{
  "success": true,
  "message": "Keyword opportunity metrics computed successfully.",
  "data": {
    "totalCount": 1240,
    "avgDifficulty": 45,
    "avgOpportunityScore": 68.2,
    "avgSearchVolume": 3400,
    "topCategories": [
      { "category": "job_titles", "count": 450, "avgScore": 72.1 },
      { "category": "salary_keywords", "count": 210, "avgScore": 65.4 }
    ],
    "topIntents": [
      { "intent": "TRANSACTIONAL", "count": 680 },
      { "intent": "INFORMATIONAL", "count": 560 }
    ]
  }
}
```

---

## 4. Operational & Developer Guidelines

### Running Tests
Verify normalizer standards and scoring logic:
```bash
npm run test
```

### Starting the Worker
The background queue processor boots automatically when the main server binds to its port, initializing via:
```typescript
startKeywordProcessingWorker();
```
To run worker nodes as independent processes in production containers, simply launch the container entry-point running the `dist/server.cjs` bundle.
