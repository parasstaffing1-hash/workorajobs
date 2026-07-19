# Installation Guide

## Requirements

- Node.js 20.18+
- pnpm 9+
- Docker and Docker Compose
- PostgreSQL 16
- Redis 7

## Local Setup

1. Copy `.env.example` to `.env`.
2. Fill required secrets: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_SECRET`.
3. Start infrastructure:

```bash
docker compose up postgres redis
```

4. Apply migrations and seed demo data:

```bash
pnpm --filter @workora/api prisma:deploy
pnpm --filter @workora/api prisma:seed
```

5. Start development servers:

```bash
pnpm dev
pnpm dev:api
```

Seeded demo password: `WorkoraDemo!2026`.
