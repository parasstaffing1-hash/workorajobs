# Backend Go production-readiness notes

Do not deploy the `backend-go/` service until the remaining integration and feature-parity items below are verified.

## Context

A new Go backend was manually added under `backend-go/`. It was committed to `main`, but the initial version had several production-readiness problems.

Hardening was applied in:

```text
31d18df fix(backend-go): harden production configuration [skip deploy]
```

## Problems found in the manually added Go backend

1. Docker/Go version risk
   - `backend-go/go.mod` used `go 1.26.5`.
   - `backend-go/deploy/Dockerfile` used `golang:1.26-alpine`.
   - This may fail on normal CI/Docker environments if that image/toolchain is unavailable.

2. Hardcoded production secrets
   - `backend-go/deploy/docker-compose.yml` had hardcoded JWT secrets:
     - `JWT_ACCESS_SECRET=super-secret-jwt-access-key-workora-2026`
     - `JWT_REFRESH_SECRET=super-secret-jwt-refresh-key-workora-2026`
   - It also hardcoded `POSTGRES_PASSWORD=workora_password`.

3. Unsafe production DB defaults
   - `backend-go/internal/config/config.go` had default `POSTGRES_PASSWORD=workora_password`.
   - It generated a fallback `DATABASE_URL` with `sslmode=disable`.
   - Production should not silently use insecure database defaults.

4. Docker image secret leakage risk
   - `backend-go/deploy/Dockerfile` copied `.env` into the runtime image.
   - Secrets must not be baked into images.

5. Public metrics endpoint
   - `/metrics` was exposed without authentication.
   - Metrics should be private or bearer-token protected.

6. AutoMigrate risk
   - `db.AutoMigrate(...)` ran automatically on app startup.
   - Production migrations should be explicit and controlled.

7. Backend integration not confirmed
   - The Go backend exists in the repo, but it is not proven to be wired into the current Next.js/AWS production deployment.
   - Do not assume it replaces the existing backend.

8. Feature parity not confirmed
   - The Go backend currently appears incomplete compared with the existing app needs:
     - normal login/signup
     - Google OAuth
     - LinkedIn OAuth
     - email verification
     - password reset
     - S3 uploads/downloads
     - Razorpay
     - employer/admin flows
     - job applications
     - OpenRouter
     - Resend

## Fixes already applied

Commit:

```text
31d18df fix(backend-go): harden production configuration [skip deploy]
```

What was fixed:

1. Removed hardcoded JWT secrets from Docker Compose.
2. Removed hardcoded DB password from Docker Compose.
3. Removed `.env` copy from Docker image.
4. Production now fails closed if `DATABASE_URL` is missing.
5. Production now fails closed if `JWT_ACCESS_SECRET` or `JWT_REFRESH_SECRET` are missing.
6. Production rejects `DATABASE_URL` values containing `sslmode=disable`.
7. JWT secrets must be at least 32 characters in production.
8. `/metrics` is protected by `METRICS_BEARER_TOKEN` when enabled in production.
9. Added `MetricsAuthMiddleware`.
10. `AutoMigrate` is skipped in production unless `ENABLE_AUTO_MIGRATE=true`.
11. Kubernetes deployment now references secrets for `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and optional `METRICS_BEARER_TOKEN`.
12. Go validation passed:

```bash
go test ./...
go build ./cmd/server ./cmd/worker
git diff --check
```

## Do not do in the future

1. Do not commit hardcoded secrets, fake production passwords, or placeholder JWT secrets.
2. Do not copy `.env` into Docker images.
3. Do not expose `/metrics` publicly.
4. Do not run `AutoMigrate` automatically in production.
5. Do not use `sslmode=disable` for production Postgres.
6. Do not assume a newly added backend is wired into production unless routing, frontend API calls, deployment scripts, and environment variables prove it.
7. Do not deploy this Go backend until feature parity and deployment integration are verified.
8. Do not trigger deployment from review/fix commits; use `[skip deploy]` unless deployment is explicitly requested.
9. Do not replace the existing backend without a migration plan, rollback plan, and API compatibility check.

## Next review task

Review the latest `main` branch after commit `31d18df`. Confirm what still blocks production use of `backend-go`, especially:

- deployment wiring
- schema compatibility
- API compatibility
- OAuth
- uploads
- payments
- email flows
- admin/employer/job application flows
- frontend integration

Do not deploy during this review.
