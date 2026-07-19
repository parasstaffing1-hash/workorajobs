# WorkoraJobs: Enterprise System Architecture & Strategic Blueprint
**Author:** Chief Software Architect & CTO  
**Version:** 1.0.0  
**Target Scale:** 10M+ programmatic SEO pages, 5M+ monthly active users, thousands of concurrent automated workflows.

---

## Executive Summary & Alignment Analysis

WorkoraJobs is designed as an autonomous, self-optimizing SEO operating system and AI-powered job board. The primary driver of business value is **programmatic SEO (pSEO)** at scale. To achieve this, the system must decouple content generation, ingestion, rendering, and monitoring from the main transaction path.

### Current Codebase & Stack Alignment
The repository is currently initialized with a **React + Vite + TypeScript (Single-Page Application)** frontend skeleton, paired with node dependencies like **Express**.
* **Next.js vs. React + Express (The Vite/Full-stack pattern):** The vision specifies Next.js 15. However, inside containerized environments (like Cloud Run), a decoupled architecture using a lightweight, high-performance **React frontend** served via CDN/static-hosting and a **Node.js/Express server** (optimized with cluster/worker mode) is incredibly powerful. Express is highly suitable for running persistent, long-lived background queues (like **BullMQ**), whereas Next.js serverless runtimes are strictly limited by execution timeouts and lack native background worker capabilities.
* **Database & Queue ready:** The inclusion of database requirements means we will provision PostgreSQL (supported in this platform via Google Cloud SQL) and Redis for caching and caching-backed queues (BullMQ).

Below is the complete, production-grade architectural design for **WorkoraJobs**.

---

## Part 1: High-Level Overall Architecture

To scale to millions of pages seamlessly, we adopt a **Modular Monolith** transitioning to **Event-Driven Services** using **Clean Architecture** principles.

```
                  ┌────────────────────────────────────────┐
                  │            Cloudflare CDN              │
                  └───────────────────┬────────────────────┘
                                      │ (Edge Caching / SSR Page Delivery)
                  ┌───────────────────▼────────────────────┐
                  │         React SPA / Next.js UI         │
                  └───────────────────┬────────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │ API Gateway & Express Core (Cluster Mode)                  │
        │                                                           │
        │  ┌───────────────────┐  ┌───────────────────┐  ┌───────┐  │
        │  │   Controllers     │  │     Services      │  │ Repos │  │
        │  └────────┬──────────┘  └────────┬──────────┘  └───┬───┘  │
        │           │                      │                 │      │
        │           └──────────────────────┼─────────────────┘      │
        └──────────────────────────────────┼────────────────────────┘
                                           │
         ┌─────────────────────────────────┼────────────────────────┐
         │ Data & Orchestration Layer      │                        │
         │                                 ▼                        │
         │  ┌──────────────┐        ┌──────────────┐   ┌─────────┐  │
         │  │  PostgreSQL  │◄───────┤   Redis      │◄──┤ BullMQ  │  │
         │  │ (Prisma DB)  │        │ (Cache/Queue)│   │ Workers │  │
         │  └──────────────┘        └──────┬───────┘   └────▲────┘  │
         │                                 │                │       │
         └─────────────────────────────────┼────────────────┼───────┘
                                           │                │
                  ┌────────────────────────▼────────────────┴───────┐
                  │                 n8n Automation                  │
                  │   (Orchestration, Cron Jobs, Keyword Scrapers)  │
                  └─────────────────────────────────────────────────┘
```

### Purpose of Each Layer:
1. **Cloudflare CDN / Edge:** Caches static job pages and generated programmatic SEO pages at the edge to reduce database load and ensure sub-100ms load times for Googlebot.
2. **Frontend Layer (React/Next.js):** Delivers clean semantic HTML for SEO spiders, fast hydration, and a rich, interactive client experience for job seekers and admins.
3. **API / Controller Layer:** Acts as the traffic director. Handles input validation (Zod), JWT verification, and maps incoming requests to core use cases.
4. **Service Layer (Core Business Logic):** Pure TypeScript business logic. Independent of frameworks, databases, and third-party APIs.
5. **Repository Layer (Prisma):** Abstract database actions. Ensures that changes to database structures do not leak into the business logic.
6. **PostgreSQL Database:** Storing relational structural data (Job listings, clustered keywords, user accounts, and audit logs).
7. **Redis Caching & Queue Layer:** Powers ultra-fast metadata lookups, acts as the storage backend for BullMQ, and handles API rate limiting.
8. **BullMQ Worker Pool:** Processes asynchronous CPU-intensive tasks such as AI content generation, sitemap compiling, and competitor SERP scraping.
9. **n8n Automation Engine:** Orchestrates visual multi-step cron workflows (e.g., daily scraping trigger -> trigger backend API -> notify Slack).

---

## Part 2: End-to-End Data Flows

### A. Autonomous AI Content & Publishing Pipeline
```
 n8n Scheduler (Trigger)
       │
       ▼
 1. GET /api/v1/keywords/discover  ───► Service checks opportunity index
       │
       ▼
 2. POST /api/v1/queue/ai-content  ───► BullMQ queues "GeneratePage" job
       │
       ▼
 3. Worker calls Gemini API  ─────────► Rich, structured job content returned
       │
       ▼
 4. Save to Postgres DB (Prisma)  ───► Record created with SEO optimizations
       │
       ▼
 5. Invalidate Redis CDN cache  ──────► Next spider hit gets fresh compiled page
```

### B. Analytics and GSC Monitoring Pipeline
```
 Google Search Console Hook  ─────────► Webhook handled by API controller
       │
       ▼
 Process GSC performance metrics  ────► Repositories update keywords ranking table
       │
       ▼
 Expose metric dashboards  ───────────► Real-time tracking via Recharts in SPA
```

---

## Part 3: Folder Structure Design

To maintain extreme modularity and scalability, we propose the following structure:

```
/
├── .env.example
├── tsconfig.json
├── vite.config.ts
├── package.json
├── docs/                      # Architectural and API documentation
│   └── enterprise_architecture.md
├── src/
│   ├── main.tsx               # Client entrypoint
│   ├── App.tsx                # Main SPA Shell
│   ├── server.ts              # Express Backend entrypoint (API Gateway + Vite Middleware)
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Base primitives (Button, Input, Card)
│   │   └── shared/            # Complex layouts (NavBar, Sidebar, Toast)
│   ├── core/                  # Clean Architecture Engine
│   │   ├── config/            # System configurations (DB, Redis, BullMQ)
│   │   ├── middleware/        # Global request handlers (Auth, Error, Rate-limiting)
│   │   ├── types/             # Domain model definitions and interfaces
│   │   └── utils/             # Helper libraries
│   └── modules/               # Feature-based domain modules
│       ├── auth/              # Auth, RBAC, session management
│       ├── keyword-engine/    # Keyword discover, clusters, intent analysis
│       ├── content-generator/ # AI-prompt schemas, Gemini integration
│       ├── publishing/        # Canonical management, site map generation, URL router
│       ├── analytics-gsc/     # Google Search Console sync, rank trackers
│       └── technical-seo/     # Broken link check, automated audit reports
```

### Purpose of Key Folders:
* `src/server.ts`: Powers the hybrid dev/production container where Express proxies API queries and serves the bundled React build.
* `src/modules/`: Houses self-contained domain boundaries. Moving to a microservice architecture in the future is as simple as copying a module folder out into its own repository.

---

## Part 4: Domain Module Boundaries

We establish strict boundaries around our modules. Communication between modules is limited to **Dependency Injected Services** or **Asynchronous Event Handlers**.

| Module | Core Responsibility | Key Dependencies | Public Interface |
| :--- | :--- | :--- | :--- |
| **Auth & RBAC** | Session security, permission mappings, audit logs. | PostgreSQL | `AuthService.verifyUser(token)` |
| **Keyword Engine** | Finding SEO terms, clustering by lexical semantic similarity. | Redis, PostgreSQL | `KeywordService.cluster(seedKeywords)` |
| **Content Generator** | Building high-quality templates using Gemini LLM. | Keyword Engine, Gemini | `ContentService.draftBrief(clusterId)` |
| **Publishing Pipeline** | Constructing public-facing jobs pages, sitemaps, robots.txt. | PostgreSQL, Redis | `PublishingService.publish(pageData)` |
| **Technical SEO** | Running on-page checks, structure analysis, broken-link tracking. | Publishing Pipeline | `AuditService.runAudit()` |

---

## Part 5: Relational Database Schema Design (PostgreSQL)

To achieve maximum read performance under heavy programmatic loads, tables are highly indexed, utilizing PostgreSQL JSONB for semi-structured job attributes and Composite Indexes for filtering.

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│     Keywords     ├──────►│ KeywordClusters  │◄──────┤   JobPostings    │
│ (ID, word, vol)  │       │ (ID, ClusterName)│       │ (ID, slug, html) │
└──────────────────┘       └──────────────────┘       └──────────────────┘
         │                                                      ▲
         │                                                      │
         ▼                                                      │
┌──────────────────┐                                            │
│   Competitors    │────────────────────────────────────────────┘
│ (ID, Domain, URL)│
└──────────────────┘
```

### Essential Database Tables:
1. **`Users` / `Roles`:** RBAC storage.
2. **`Keywords`:** Standard metadata (search volume, keyword difficulty, intent type, parent cluster ID).
3. **`KeywordClusters`:** Grouped keyword lists identifying semantic nodes.
4. **`JobPostings`:** Programmatic SEO landing page documents (title, schema, markdown body, slug, is_published, meta_description).
5. **`CompetitorAnalysis`:** Monitored search engine result page (SERP) domains tracking content quality benchmarks.
6. **`AuditLogs` / `SeoPerformance`:** System audits and daily organic traffic metrics.

---

## Part 6: API Framework Plan

All APIs follow the `/api/v1/` prefix and utilize JSON formatting with standard HTTP codes.

* **Authentication:** Stateless authorization via Bearer JWT stored in HTTPS-only cookies.
* **Rate Limiting:** IP-based sliding window rate limiter backed by Redis.
* **Format Structure:**
```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-07-18T20:53:00Z"
}
```

---

## Part 7: Queue & BullMQ Architecture

Background queueing prevents long-lived API transactions from freezing the web server.

### Identified Queue Pool:
1. **`keyword-discover-queue` (Priority: Low):** Processes scraping lists.
2. **`ai-generation-queue` (Priority: Medium):** Connects to Gemini to draft 1,000+ words job guides.
3. **`sitemap-compile-queue` (Priority: High):** Generates and caches structural sitemap XMLs.
4. **`rank-sync-queue` (Priority: Low):** Syncs ranks with GSC daily.

---

## Part 8: n8n Automation Ecosystem

While Express and Node retain the strict business logic (e.g. how a job brief is parsed or formatted), n8n orchestrates external events.

* **Workflow Category: Scheduled Scraping**
  * *Trigger:* Cron node (Daily at 02:00 AM).
  * *Step 1:* Hit backend `/api/v1/keywords/discover-jobs`.
  * *Step 2:* If jobs are found, push array metadata to `/api/v1/queue/ai-content`.
  * *Step 3:* Post execution metrics to a Slack/Discord operations channel.

---

## Part 9: Caching Architecture & Redis Layer

* **CDN Edge Caching:** 1-day TTL for job detail pages, purged immediately upon editing.
* **API Route Caching:** Active job listings caching in Redis (`key: jobs:active`).
* **Session Caching:** Standard key-value pairs (`sess:<userId>`) with a 14-day absolute TTL.

---

## Part 10: Infrastructure, Security & Scalability

### Security Protocols:
* **Input Protection:** Rigorous Zod validation schema matching on both client and server inputs.
* **Database Guard:** Prisma ORM inherently parameterizes SQL statements, blocking SQL injection vectors.
* **Content Security Policy (CSP):** Block cross-site scripting (XSS) vectors by explicitly white-listing Gemini API endpoints and asset domains.

### Scaling Milestones:
* **10,000 pages:** Standard Postgres instances with basic indexes.
* **1,000,000 pages:** Introduce Redis caching for index routes, setup Read-Replicas for PostgreSQL, and implement Cloudflare cache-everything policies.
* **10,000,000 pages:** Relational database partitioning on job records, database sharding, and distributing BullMQ workers across autoscaling Node clusters.

---

## Part 11: Development Roadmap

### Milestone 1: Core Foundation & API Routing (Current)
* **Goal:** Setup Express, Prisma, Database connections, and Redis/BullMQ client initializers.
* **Deliverable:** Fully compiled core runtime with active linter checks.

### Milestone 2: Keyword Discovery & Job Board Pipeline
* **Goal:** Create Keyword schema models, clustering services, and basic static templates.

### Milestone 3: AI Content Engine & GSC Sync
* **Goal:** Implement the @google/genai SDK integration, write dynamic prompting blocks, and configure rank analytics tracking.

### Milestone 4: Operational Portal & n8n Orchestration
* **Goal:** Build the Admin Dashboard, RBAC dashboards, and connect visual workflows.
