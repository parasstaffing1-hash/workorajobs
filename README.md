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

## Verification

```bash
pnpm format
pnpm lint
pnpm type-check
pnpm build
```

See `docs/` for installation, architecture, API, deployment and environment details.
