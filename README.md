# Workora Jobs

Workora Jobs is an enterprise staffing and recruitment platform built with Next.js 15, TypeScript, Tailwind CSS, NestJS, PostgreSQL, Prisma, Redis, Docker and Nginx.

## What Is Included

- Public marketing website
- Employer, candidate, recruiter and admin platform surfaces
- REST API with Swagger documentation
- PostgreSQL schema and Prisma migrations
- Authentication, RBAC, audit logging and session management
- Employer jobs, candidate profiles, applications and interviews
- Recruiter portal, ATS, resume indexing, AI integration structure and automation webhooks
- Admin dashboard, CRM, analytics, billing, communication provider structures and media library
- Docker Compose and Nginx production profile

## Quick Start

```bash
pnpm install
cp .env.example .env
docker compose up postgres redis
pnpm --filter @workora/api prisma:deploy
pnpm --filter @workora/api prisma:seed
pnpm dev
```

API docs are available at `/docs` when the API is running.

## AWS S3 File Storage Integration

WorkoraJobs uses **AWS SDK v3** (`@aws-sdk/client-s3`) for primary file storage (resumes, profile photos, company logos, certificates).

- **Service Engine**: `src/lib/aws/s3.ts`
- **API Handler**: `src/app/api/v1/uploads/route.ts`
- **Server Actions**: `src/lib/actions/upload-actions.ts`
- **Documentation Guide**: `docs/AWS_S3_SETUP_GUIDE.md`

### Environment Variables required for S3:
```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=eu-north-1
AWS_S3_BUCKET=workorajobs-production-assets
AWS_S3_PUBLIC_BASE_URL=https://workorajobs-production-assets.s3.eu-north-1.amazonaws.com
```

See `docs/AWS_S3_SETUP_GUIDE.md` for complete IAM policies, S3 Bucket policies, CORS config, and security documentation.

## Verification

```bash
pnpm format
pnpm lint
pnpm type-check
pnpm build
```

See `docs/` for installation, architecture, API, deployment and environment details.

