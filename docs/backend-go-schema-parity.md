# Go Backend & Prisma Schema Parity Report

## Overview

This document compares `prisma/schema.prisma` with GORM models in `backend-go/internal/domain/models/`. Mark a row verified only when implementation and tests support the claim.

## Parity matrix

| Model | Prisma model | GORM model | Status | Known mismatch / risk | Required action |
|---|---|---|---|---|---|
| User | `User` | `models.User` | High parity | Prisma has broader relations and permissions. | Keep OAuth/session parity tests pending. |
| Company | `Company` | `models.Company` | High parity | GORM maps the core fields used by Go services, not every metadata field from Prisma. | Add Postgres integration tests before production cutover. |
| CompanyUser | `CompanyUser` + `EmployerUserRole` | `models.CompanyUser` + `CompanyUserRole` | High parity for posting auth | Role enum now matches Prisma roles: `OWNER`, `ADMIN`, `HR_MANAGER`, `RECRUITER`, `HIRING_MANAGER`, `INTERVIEWER`, `VIEWER`. | Keep tests for active allowed roles and blocked viewer/interviewer/suspended/invited states. |
| Job | `Job` | `models.Job` | Medium-high parity | Prisma requires `companyId` and `postedById`; GORM fields are pointers but service validation now requires company and poster. | Add real Postgres create/list tests. |
| Application | `Application` | `models.Application` | Partial | Basic fields exist, but full application workflow is not E2E verified. | Add application service/API tests. |
| SavedJob | `SavedJob` | `models.SavedJob` | Partial | Basic model exists; uniqueness and user workflow need integration tests. | Add saved-job service/API tests. |
| OAuthAccount | `Account` / OAuth relations | `models.OAuthAccount` | Pending | Provider handlers and linking flows are not complete in Go. | Implement and test Google/LinkedIn OAuth before backend cutover. |
| UserSession / RefreshToken | Session-related Prisma models | `models.RefreshToken`, `models.UserSession` | Partial | JWT login tests exist, but full session revocation/refresh lifecycle needs coverage. | Add refresh/revoke/session tests. |

## Current safeguards

1. Job creation validates non-empty `userID`.
2. Job creation validates non-empty `companyId`.
3. Job creation verifies company existence.
4. Job creation authorizes global `ADMIN`, company owner, or active allowed `CompanyUser` role.
5. S3 company-logo authorization uses company ownership data and fails closed without DB for non-admin users.

## Remaining required verification

- Full Postgres integration tests.
- Prisma migration compatibility check.
- Application, SavedJob, OAuth, and session lifecycle tests.
- Frontend-to-Go API contract tests.
