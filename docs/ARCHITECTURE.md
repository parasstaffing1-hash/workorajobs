# Architecture Guide

## Frontend

The frontend uses Next.js 15 App Router, TypeScript, Tailwind CSS and reusable component layers:

- Marketing pages
- Platform shells for employer, candidate, recruiter, admin, CRM, analytics and billing areas
- Shared buttons, cards, forms, notifications, loading states and SEO helpers

## Backend

The backend is a modular NestJS REST API:

- `auth`: JWT, refresh tokens, OAuth, sessions
- `users`, `profiles`
- `companies`, `jobs`, `candidate`, `applications`
- `recruiter`, `ats`, `ai`, `automation`
- `admin`, `crm`, `analytics`, `billing`, `communication`
- `storage`, `notifications`, `audit`, `security`, `health`

## Data

PostgreSQL is accessed through Prisma. Redis is prepared for cache/session-adjacent production use. Storage is S3-ready with local fallback references when credentials are unavailable.

## Integrations

OpenAI, Stripe, n8n, SMS, WhatsApp, push and AWS S3 are implemented as credential-driven structures. Without credentials, the app stays buildable and returns explicit setup-required responses.
