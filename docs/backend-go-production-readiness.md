# Go Backend Production Readiness Report

## Overview
This document summarizes the production readiness status of the Workora Go Backend (`backend-go`), detailing core modules, security controls, S3 integration, authorization rules, search baseline, and deployment requirements.

---

## Recent Hardening Fixes Applied

### 1. S3 Company Logo Authorization
- **DB-Backed Ownership Check**: `company_logo` presigned upload URL requests now strictly verify that the requesting user is either an `ADMIN` or an `EMPLOYER`/`RECRUITER` managing `targetId`.
- **Target ID Enforcement**: Requests missing `targetId` for `company_logo` are rejected immediately with `ErrTargetIDRequired`.

### 2. Auth Context & Key Consistency
- **Middleware Constants**: Standardized context keys across controllers using `middleware.CtxUserID` and `middleware.CtxUserRole`.
- **Removed Anonymous Fallbacks**: Completely eliminated `userID = "anonymous_user"` fallback. Unauthenticated context access returns `401 Unauthorized`.

### 3. S3 Initialization & Operations
- **Explicit S3 Service Init**: `SetupRouter` inspects `EnableS3Uploads` and S3 config. In production with `ENABLE_S3_UPLOADS=true`, initialization failures trigger `log.Fatal`. In dev, a warning is logged and upload routes are gracefully omitted.

### 4. Recommendation Endpoint Protection
- **Protected POST Routes**: `POST /api/v1/recommendations/jobs`, `/salary-predict`, and `/resume-match` are now protected by `AuthMiddleware` and rate-limited via `RateLimitMiddleware` (30 req/min).

### 5. Clear Heuristic Labelling
- **Beta / Estimated Indicators**: Added `IsHeuristicEstimate: true` and `CalculationMethod: "rule_based_heuristic_v1_beta"` fields to response DTOs for salary predictions and comparisons.

### 6. Search Baseline & Indexes
- **Postgres Search Baseline**: The current search engine uses PostgreSQL `ILIKE` filtering with OpenSearch compatibility interfaces.
- **Added GORM Indexes**: Indexes applied for `status`, `posted_at`, `title`, `location`, `type`, `work_mode`.

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
- **Security & Validation Controls**:
  - **Private Bucket Only**: Enforces zero public-read ACLs.
  - **Server-Side Encryption**: Enforces `AES256` or AWS KMS (`x-amz-server-side-encryption`).
  - **MIME Type Whitelisting**:
    - Resumes: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
    - Images: `image/png`, `image/jpeg`, `image/webp`
  - **Size Limit Enforcement**: 10 MB for resumes, 5 MB for images.
  - **Filename Sanitization**: Sanitizes path traversal attempts (`../`) and illegal characters.

---

## Remaining Blockers & Deployment Warnings

> [!WARNING]
> **DO NOT DEPLOY** `backend-go` to production until all remaining end-to-end integration items are verified:
> 1. **OAuth Verification**: Google & LinkedIn OAuth flows.
> 2. **Payments & Billing**: Razorpay checkout integration.
> 3. **Database Schema Parity**: Complete alignment between Prisma schema and GORM models.
> 4. **Email Services**: Resend email verification & password reset flows.
> 5. **Frontend Routing**: Next.js API proxy routing to Go backend services.

---

## Manual Infrastructure Checklist (AWS S3)

Before deploying to AWS production, execute the following manual/IaC steps:

1. **Bucket Creation**:
   ```bash
   aws s3api create-bucket --bucket workorajobs-production-storage --region us-east-1
   ```

2. **Block Public Access**:
   ```bash
   aws s3api put-public-access-block \
     --bucket workorajobs-production-storage \
     --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
   ```

3. **CORS Configuration**:
   Apply `docs/s3-cors-config.json` allowing `PUT`, `GET`, `DELETE` from `https://workorajobs.com`.

4. **Bucket Policy / IAM Policy**:
   Attach `docs/s3-iam-policy.json` to the ECS/EC2 instance role with `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject` permissions.
