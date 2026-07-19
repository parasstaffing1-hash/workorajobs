# Deployment Guide

## Docker Compose

1. Create production `.env`.
2. Set all required secrets and provider keys.
3. Build and start:

```bash
docker compose up --build -d
```

4. Apply migrations:

```bash
docker compose exec api pnpm --filter @workora/api prisma:deploy
```

5. Check health:

```bash
curl http://localhost:8080/api/v1/health
```

## Nginx

The included Nginx profile proxies:

- `/` to the web service
- `/api/` to the API
- `/docs` to Swagger

Security headers, gzip and static asset caching are enabled.

## Release Checklist

- Run `pnpm lint`
- Run `pnpm type-check`
- Run `pnpm build`
- Apply migrations
- Seed only in non-production or controlled demo environments
- Verify health endpoints
- Verify auth, upload and billing flows with real providers
