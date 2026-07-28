# Workora AI Metadata Engine Documentation

## Architecture & Overview

The Workora AI Metadata Engine is an automated metadata generation system that computes, formats, validates, hashes, caches, versions, and bulk regenerates **9 core SEO assets** across the **Go Backend (`backend-go`)** and **Next.js Frontend (`src/`)**.

---

## 9 Generated Metadata Output Assets

| Asset Name | Character Limit | Constraint / Formatting Standard |
|---|---|---|
| 1. **SEO Title** | $\le 60$ chars | Keyword + location + `\| WorkoraJobs` suffix |
| 2. **Meta Description** | $120 - 160$ chars | Actionable CTA + salary insights + zero fluff |
| 3. **Open Graph Title** | $\le 60$ chars | Social engagement title |
| 4. **Twitter Title** | $\le 60$ chars | X (Twitter) Card title |
| 5. **Twitter Description** | $120 - 160$ chars | X Card snippet |
| 6. **Rich Snippets** | N/A | Schema.org JSON-LD structured data |
| 7. **FAQ** | 2 - 4 QA pairs | Contextual Question & Answer array |
| 8. **Page Introduction** | 200 - 400 words | 2-paragraph landing page intro section |
| 9. **Page Summary** | 3 - 5 bullets | Key takeaway bullet points |

---

## Key Capabilities & Guardrails

### 1. SHA256 Content Hashing & Duplicate Prevention
- Generates a SHA256 hash (`ComputeSHA256Hash(title, desc)`) to prevent identical titles or meta descriptions across dynamic pages.

### 2. Character Limit Enforcement
- Enforces strict limits with word-boundary awareness (`EnforceCharLimit(text, maxChars)`).

### 3. Metadata Versioning & Rollback
- Automatically increments version history (`v1`, `v2`, `v3`) per entity and allows instant rollback via `/api/v1/ai-metadata/rollback`.

### 4. Bulk Regeneration Queue
- Batch background processing endpoint `/api/v1/ai-metadata/bulk-generate`.

---

## API Reference (`/api/v1/ai-metadata/*`)

- `POST /api/v1/ai-metadata/generate`: Generates complete 9-asset AI metadata package.
- `POST /api/v1/ai-metadata/bulk-generate`: Triggers bulk background regeneration.
- `GET /api/v1/ai-metadata/versions`: Retrieves version history for an entity.
- `POST /api/v1/ai-metadata/rollback`: Rolls back entity metadata to target version.

---

## Verification & Test Results
- Go Backend Test Suite: `TestAiMetadataEngineGenerationAndLimits`, `TestAiMetadataVersioningAndRollback`, `TestBulkRegenerationQueue` (100% PASS).
