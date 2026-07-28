# Go Backend Production Readiness Report

## Overview

This document tracks the current production-readiness status of the Workora Go backend (`backend-go`). Scores are evidence-based and should not be raised unless code and tests verify the claim.

Validation command set:

```bash
go test ./...
go build ./cmd/server ./cmd/worker
git diff --check
```

## Current audit scores

| Domain | Current score | Verified strengths | Remaining blockers |
|---|---:|---|---|
| Architecture & structure | 80 / 100 | Layered controllers/services/models, clearer storage and middleware boundaries. | Frontend API routing to Go is not verified. |
| Security & auth controls | 87 / 100 | JWT route guards, refresh-token persistence/rotation/logout, registration role restrictions, fail-closed S3 ownership checks, protected state-changing routes. | Google/LinkedIn OAuth parity and email verification/password reset flows are pending. |
| Storage & S3 integration | 82 / 100 | Presigned upload/download/delete, MIME/size validation, private/encrypted object writes, DB-backed company ownership tests. | Live AWS bucket/IAM/CORS validation is still manual. |
| Database & schema parity | 76 / 100 | Company, CompanyUser, Job, User, and auth flows have focused tests. | Full Postgres integration tests and complete Prisma/GORM parity are pending. |
| Rate limiting & resiliency | 76 / 100 | Memory limiter and Redis limiter exist; Redis URL parsing and ping are now part of router setup. | Redis backend needs production environment validation and operational monitoring. |
| Search & performance | 63 / 100 | Baseline Postgres search and finder modules compile and have targeted tests. | Search is still `ILIKE`/baseline, not full-text or external search backed. |
| Test coverage | 71 / 100 | Unit, route, storage, auth lifecycle, and lightweight integration tests exist. | Missing E2E tests for OAuth, payments, email, upload, admin, employer, and application flows. |
| Production readiness | 72 / 100 | Core safety checks improved and validation passes. | Not ready as a full backend replacement until remaining integration blockers are closed. |

## Verified hardening improvements

### Redis-backed rate limiting

- `RATE_LIMIT_BACKEND=memory` uses the in-process limiter.
- `RATE_LIMIT_BACKEND=redis` now parses `REDIS_URL`, creates a Redis client, and pings Redis during router setup.
- In production, Redis backend misconfiguration fails startup through the router setup path instead of silently pretending Redis rate limiting is active.
- In development and test modes, Redis misconfiguration falls back to memory with a warning.

### CompanyUser job-post authorization

`JobService.CreateJob` now allows job creation only when:

- the caller is global `ADMIN`, or
- the caller is `Company.ownerId`, or
- the caller has active `CompanyUser` membership with one of the Prisma-aligned roles:
  - `OWNER`
  - `ADMIN`
  - `HR_MANAGER`
  - `HIRING_MANAGER`
  - `RECRUITER`

The following roles/statuses must not post jobs:

- `INTERVIEWER`
- `VIEWER`
- `SUSPENDED`
- `INVITED`
- unrelated employers or candidates

### Route protection

Route tests verify unauthenticated state-changing endpoints return `401` for:

- `POST /api/v1/recommendations/jobs`
- `POST /api/v1/recommendations/resume-match`
- `POST /api/v1/internships/recommendations`
- `POST /api/v1/walkins/:id/remind`
- `POST /api/v1/jobs`

Public health/search route tests assert expected success status where a test DB is available.

### Auth lifecycle hardening

- Public registration now rejects privileged roles such as `ADMIN`, `RECRUITER`, `EDITOR`, and `SEO_MANAGER`.
- Public registration allows only safe self-service roles: `USER`, `JOB_SEEKER`, and `EMPLOYER`.
- Login now persists hashed refresh tokens.
- `POST /api/v1/auth/refresh` validates stored non-revoked refresh tokens and rotates credentials.
- `POST /api/v1/auth/logout` revokes the submitted refresh token.
- Integration tests verify duplicate registration rejection, login, refresh rotation, logout revocation, and privileged role rejection.

## Remaining production blockers

Do not deploy `backend-go` as a complete production replacement until these are verified:

1. Google OAuth flow parity.
2. LinkedIn OAuth flow parity.
3. Razorpay checkout and webhook verification.
4. Resend email verification and password reset flows.
5. Frontend routing/proxying from Next.js to Go API.
6. Production Postgres integration tests.
7. Live AWS S3 IAM, CORS, encryption, and lifecycle validation.
8. Admin, employer, candidate, job application, and upload E2E workflows.
9. Production observability: structured logs, metrics, traces, alerts, and runbooks.
10. Search scalability: Postgres full-text or dedicated search backend when dataset size requires it.
