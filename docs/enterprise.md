# WorkoraJobs Enterprise Platform Architecture

This document provides technical documentation for the enterprise systems, moderation workflows, verification standards, feature flags, and background queues built into WorkoraJobs.

---

## 1. Employer Verification System

Location: `src/lib/enterprise/verification.ts`

- **Workflow**:
  1. Employer submits business email and domain proof (`POST /api/v1/enterprise/verification/request`).
  2. Status transitions to `PENDING`.
  3. Admin manually reviews documents or business registration and approves/rejects (`POST /api/v1/enterprise/verification/approve`).
  4. Verified employers receive the official verified badge (`rating: 5.0`) and audit event.

---

## 2. Job Quality Engine

Location: `src/lib/enterprise/quality-engine.ts`

- **Scoring (0 - 100)**:
  - Deducts points for short descriptions (<50 chars), missing salary info, or scam keywords.
  - Automatically flags or rejects listings scoring under 60.
- **Scam Detection**: Checks titles & descriptions for scam phrases (`wire money`, `crypto payment`, `no experience $1000/day`, `whatsapp only`).

---

## 3. Feature Flag Platform

Location: `src/lib/enterprise/feature-flags.ts`

- **Capabilities**:
  - Global ON/OFF toggle.
  - Percentage rollout targeting (e.g. 20% of users).
  - Target User IDs & Target Roles list overrides.
  - Managed via `POST /api/v1/enterprise/feature-flags`.

---

## 4. Background Task Queue & Dead-Letter Escalation

Location: `src/lib/enterprise/background-jobs.ts`

- **Task Types**: `CRAWL`, `EMAIL`, `RESUME_PARSE`, `SEO_GEN`.
- **Status Lifecycle**: `PENDING` ➔ `PROCESSING` ➔ `COMPLETED` (or `FAILED` ➔ retry max 3 attempts ➔ `DEAD_LETTER`).
- Processed via `POST /api/v1/enterprise/queue/process`.

---

## 5. Candidate Recommendation Engine

Location: `src/lib/enterprise/recommendation-engine.ts`

- Matches candidate skills, preferred locations, and workMode preferences against active non-deleted jobs in PostgreSQL.
- Accessible via `GET /api/v1/enterprise/recommendations`.

---

## 6. Admin Moderation Platform

Location: `src/lib/enterprise/moderation.ts`

- Submit abuse reports (`POST /api/v1/enterprise/moderation/report`).
- Admin user suspension and account soft-deletion with audit logging.
