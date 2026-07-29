# Workora Search Engine Indexing System Documentation

## Architecture & Overview

The Workora Search Engine Indexing System automates OpenSearch index updates, XML sitemap sync, page change detection (new, modified, deleted), exponential backoff retry queues, and real-time performance monitoring across the **Go Backend (`backend-go`)** and **Next.js Frontend (`src/`)**.

---

## Technical Indexing Pipeline

```
Change Detection Engine
   │
   ├─► New Pages      ──► Priority Queue (High: Priority 1)
   ├─► Modified Pages ──► Priority Queue (Normal: Priority 2)
   └─► Deleted Pages  ──► OpenSearch Purge + Sitemap Delete
          │
          ▼
   Batch Concurrency Worker (BatchSize = 100)
          │
          ├─► OpenSearch Sync (workora_jobs, companies, guides)
          └─► XML Sitemap Sync (12 Sitemaps)
          │
          └─► On Error ──► Exponential Backoff Retry Engine (MaxRetries = 5)
```

---

## Real-Time Monitoring Dashboard Metrics

- **Total Queued & Total Indexed**: Historical count of processed documents.
- **Pending Queue Depth**: Real-time count of pending jobs in queue.
- **Throughput (docs/sec)**: Number of index operations completed per second.
- **Average Latency (ms)**: End-to-end processing latency per document batch.
- **Health Indicators**: OpenSearch connection status & XML Sitemap sync status.

---

## API Reference (`/api/v1/indexing/*`)

- `GET /api/v1/indexing/dashboard`: Returns real-time indexing monitoring stats.
- `POST /api/v1/indexing/trigger`: Manually queues an indexing job for any URL.
- `POST /api/v1/indexing/retry`: Retries all pending failed jobs using exponential backoff.
- `GET /api/v1/indexing/queue`: Lists all active pending jobs.

---

## Verification & Test Results
- Go Backend Test Suite: `TestSearchIndexingSystemPipeline` (100% PASS).
