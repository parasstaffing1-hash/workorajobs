# Go Backend Production Readiness Report

## Overview
This document summarizes the production readiness status of the Workora Go Backend (`backend-go`), detailing core modules, security controls, S3 integration, authorization rules, search baseline, rate limiting, and database schema parity status.

---

## Recent Hardening Fixes Applied

### 1. Fail-Closed S3 Company Logo Authorization & Testing
- **Fail-Closed DB Authorization**: `ValidateCompanyManagement` now fails closed (`return false`) when database access is unavailable, allowing only `ADMIN` roles without DB validation.
- **DB-Backed Testing**: Unit tests verify that `ADMIN` and authorized `EMPLOYER` owners of `Company.OwnerID` can presign company logos, while unauthorized users and missing target IDs are rejected.

### 2. Auth Context & Key Standardization
- **Middleware Constants**: Standardized context keys across controllers using `middleware.CtxUserID` (`"userID"`) and `middleware.CtxUserRole` (`"userRole"`).
- **Removed Anonymous Fallbacks**: Completely eliminated `userID = "anonymous_user"` fallback. Unauthenticated context access returns `401 Unauthorized`.

### 3. Log Privacy & Sanitization
- **Key Prefix Logging Only**: Replaced full object key logging with sanitized key prefixes (`resumes/user_123/*`, `company-logos/comp_100/*`).
- **Zero URL/Secret Leakage**: Ensured presigned URLs and credentials are never emitted into Zap logs.

### 4. Route Protection & Rate Limiting
- **Protected State-Changing Routes**: `POST /api/v1/recommendations/*`, `POST /api/v1/internships/recommendations`, `POST /api/v1/walkins/:id/remind`, and `/uploads/*` require valid JWT authentication.
- **Rate Limiting**: Integrated `RateLimitMiddleware` with `RATE_LIMIT_BACKEND` configuration (`memory` by default).

### 5. Pagination Safety
- **Clamped Page & Limit**: Integrated `response.SanitizePagination` across handlers, ensuring `page >= 1`, `limit` clamped between 1 and 100, and non-negative offsets.

---

## Rate Limiting Architecture & Multi-Instance Warning

> [!IMPORTANT]
> The default rate limiter (`RATE_LIMIT_BACKEND=memory`) uses in-memory tracking per process instance. This is suitable for single EC2/standalone deployments. For multi-instance horizontal scaling (e.g. AWS ECS / EKS with ALB), configure `RATE_LIMIT_BACKEND=redis` to share rate-limit counters across worker processes.

---

## Search Engine Baseline & Database Indexing Strategy

The search engine currently operates on a **PostgreSQL baseline search** with OpenSearch-compatible interfaces.

### Recommended Full-Text Search Migration (SQL)
For high-volume production datasets without external search clusters, create the following PostgreSQL indexes:

```sql
-- Composite B-Tree indexes for state & filtering
CREATE INDEX idx_job_status_posted ON "Job" (status, posted_at DESC);
CREATE INDEX idx_job_location_type ON "Job" (location, type, work_mode);

-- Full-Text Search GIN index for title and description
CREATE INDEX idx_job_fts ON "Job" USING gin(to_tsvector('english', title || ' ' || description));
```

---

## Prisma Schema vs. GORM Model Parity Audit

| Model | Alignment Status | Known Differences / Risks | Required Fix / Action |
|---|---|---|---|
| **User** | ✅ High | Prisma includes OAuth & permissions relations; GORM has core auth fields | Compatible for authentication |
| **Company** | ✅ High | Prisma links `companyUsers`; GORM links `OwnerID` directly | Compatible; ownership check uses `owner_id` |
| **Job** | ⚠️ Medium | GORM uses `CompanyID *string` & `PostedByID *string` | Required: ensure foreign key fields are populated on job creation |
| **Application** | ✅ High | Matching fields (`job_id`, `user_id`, `status`, `resume_url`) | Compatible |
| **SavedJob** | ✅ High | Compound foreign key matching (`user_id`, `job_id`) | Compatible |
| **OAuthAccount** | ⚠️ Partial | Implemented in Prisma schema; GORM model pending full OAuth integration | Blocked on OAuth implementation |

---

## AWS S3 Storage Integration Status

### Implemented Features (Go Backend)
- **AWS SDK for Go v2**: Integrated `github.com/aws/aws-sdk-go-v2` with `service/s3` presign client.
- **Presigned Upload URLs**: `POST /api/v1/uploads/presign` (supports `resume`, `profile_image`, `company_logo`).
- **Presigned Download URLs**: `GET /api/v1/uploads/presign-download?key=...` with strict object ownership validation.
- **Object Deletion**: `DELETE /api/v1/uploads` with pre-deletion ownership verification.
- **Object Key Formatting**:
  - `resumes/{userId}/{uuid}-{safeFileName}`
  - `profile-images/{userId}/{uuid}-{safeFileName}`
  - `company-logos/{companyId}/{uuid}-{safeFileName}`
- **Security Controls**: Private bucket only; server-side encryption enabled (`AES256`/`KMS`); path-traversal filename sanitization.

---

## Remaining Blockers & Deployment Warnings

> [!WARNING]
> **DO NOT DEPLOY** `backend-go` to production as a complete backend replacement until all remaining end-to-end integration items are verified:
> 1. **OAuth Verification**: Google & LinkedIn OAuth flows.
> 2. **Payments & Billing**: Razorpay checkout integration.
> 3. **Email Services**: Resend email verification & password reset flows.
> 4. **Frontend Routing**: Next.js API proxy routing to Go backend services.
