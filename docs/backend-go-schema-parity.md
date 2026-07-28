# Go Backend & Prisma Schema Parity Report

## Overview
This document presents an accurate, element-by-element schema audit comparing the Prisma schema (`prisma/schema.prisma`) with the GORM models in `backend-go/internal/domain/models/`.

---

## Detailed Model Parity Matrix

| Model Name | Prisma Model | GORM Model | Parity Status | Mismatch Description | Runtime Risk | Fix / Mitigation Status |
|---|---|---|---|---|---|---|
| **User** | `model User` | `models.User` | 🟢 Verified | Prisma includes direct OAuth relations and role enums (`ADMIN`, `EMPLOYER`, `RECRUITER`, `CANDIDATE`). GORM stores role as `models.Role`. | Low | Fully functional for JWT authentication and DB persistence. |
| **Company** | `model Company` | `models.Company` | 🟢 Verified | Both include `id`, `name`, `slug`, `logo`, `website`, `description`, `ownerId`. | Low | `owner_id` properly set as optional string pointer (`*string`). |
| **CompanyUser** | `model CompanyUser` | `models.CompanyUser` | 🟢 Verified | Defines join table between `Company` and `User` with `role` and `status`. | Low | `CompanyUser` struct defined in `models/company.go` and verified in authorization checks. |
| **Job** | `model Job` | `models.Job` | 🟢 Verified | Prisma requires non-null `companyId` and `postedById`. GORM has `CompanyID *string` and `PostedByID *string` as pointers. | Low | `CreateJob` service method validates non-empty `companyID` and verifies company existence and user ownership/membership. |
| **Application** | `model Application` | `models.Application` | 🟢 Verified | Matches `id`, `jobId`, `userId`, `resumeUrl`, `status`, `coverLetter`. | Low | Unique index constraint `(userId, jobId)` enforced in DB. |
| **SavedJob** | `model SavedJob` | `models.SavedJob` | 🟢 Verified | Matches `id`, `userId`, `jobId`, `createdAt`. | Low | Compound unique constraint `(userId, jobId)` enforced. |
| **OAuthAccount** | `model Account` | `models.OAuthAccount` | 🔴 Pending OAuth | Model defined in Prisma and GORM; OAuth provider handlers pending full backend integration. | High | Logged in readiness report as blocker for production switchover. |
| **UserSession** | `model Session` | `models.RefreshToken` | 🟢 Verified | Refresh tokens are hashed and persisted with expiration timestamps (`RefreshToken`). | Low | JWT refresh token flow verified. |

---

## Verified Database Constraints & Safeguards
1. **Foreign Key Integrity**: GORM `Job` model links `CompanyID` to `Company.ID` and `PostedByID` to `User.ID`.
2. **CompanyUser Authorization**: `CompanyUser` model allows multi-user company management (`EMPLOYER`/`RECRUITER` roles).
3. **Cascading Safety**: Deletion of jobs or users does not trigger silent data corruption; soft-deletes (`deleted_at`) are enabled on primary entities.
4. **Index Coverage**: Critical search and lookup columns (`status`, `posted_at`, `title`, `location`, `type`, `work_mode`) contain explicit GORM index tags.
