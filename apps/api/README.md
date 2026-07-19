# Workora Jobs API

NestJS backend for the Workora Jobs enterprise platform.

## Local setup

1. Copy `.env.example` to `.env` at the repository root.
2. Start infrastructure with `docker compose up postgres redis`.
3. Run migrations with `pnpm --filter @workora/api prisma:deploy`.
4. Seed demo users with `pnpm --filter @workora/api prisma:seed`.
5. Start the API with `pnpm dev:api`.

Swagger is available at `/docs` and API routes are prefixed with `/api/v1`.

Seeded demo accounts use the password `WorkoraDemo!2026`.

## Phase 4 integrations

AI endpoints use `OPENAI_API_KEY`, `OPENAI_MODEL` and `OPENAI_BASE_URL`. If no OpenAI key is configured, the API returns deterministic local fallback analysis so development and CI remain runnable.

Automation endpoints are n8n-ready. Set `N8N_BASE_URL` for default webhook dispatch, or create automation webhooks with explicit `targetUrl` values. Use `N8N_WEBHOOK_SECRET` or per-webhook secrets for signed external calls.

## Production integrations

Billing uses Stripe Checkout structure through `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_SUCCESS_URL` and `STRIPE_CANCEL_URL`. SMS, WhatsApp and push notifications are represented by provider configuration records and environment variables until real providers are connected.

See repository-level `docs/` for installation, architecture, API, deployment, environment and security guidance.
