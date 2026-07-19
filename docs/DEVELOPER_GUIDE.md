# Developer Guide

## Project Layout

- `src/app`: Next.js App Router routes
- `src/components`: reusable UI, layout, platform and marketing components
- `src/data`: static frontend demo data
- `apps/api/src`: NestJS modules
- `apps/api/prisma`: Prisma schema, migrations and seed data
- `nginx`: production reverse proxy configuration

## Common Commands

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm --filter @workora/api prisma:generate
pnpm --filter @workora/api prisma:deploy
pnpm --filter @workora/api prisma:seed
```

## Development Rules

- Keep frontend design consistent with the existing platform shell.
- Add backend features as Nest modules.
- Store database changes in Prisma migrations.
- Keep secrets in environment variables only.
- Run lint, type-check and build before release.
