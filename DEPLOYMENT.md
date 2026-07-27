# WorkoraJobs — Enterprise Multi-Platform Deployment Guide

This repository is optimized for zero-downtime, deterministic deployments across **Vercel**, **AWS EC2**, **Docker**, and **Local Workstations** using **pnpm 9.15.4** and **Node.js 20 LTS**.

---

## 🛠️ Pinned Toolchain & Environment Requirements

- **Node.js**: `20.18.0` (pinned via `.nvmrc`)
- **Package Manager**: `pnpm@9.15.4` (pinned via `packageManager` field in `package.json`)
- **Package Config**: `.npmrc` (`node-linker=hoisted`, `auto-install-peers=true`)
- **Framework**: Next.js 15 (`output: "standalone"`)
- **Database ORM**: Prisma Client v6 (`prisma@6.4.1`)

---

## 🚀 1. Deploying to Vercel (Recommended)

Vercel natively detects `packageManager: "pnpm@9.15.4"` in `package.json` and deploys automatically:

### GitHub Integration:
1. Connect your repository `parasstaffing1-hash/workorajobs` on [vercel.com/new](https://vercel.com/new).
2. Set Environment Variables (`DATABASE_URL`, `NEXT_PUBLIC_APP_URL`).
3. Click **Deploy**. Vercel will install dependencies via `pnpm` and deploy serverless edge functions.

---

## ⚡ 2. Deploying to AWS EC2

Deployments to AWS EC2 use pre-built standalone artifacts or native server builds with `pnpm`:

### Target Server Details:
- **Server IP**: `16.171.202.34`
- **Runtime Path**: `/opt/workora/runtime`
- **Service**: `workora-web.service`
- **Reverse Proxy**: Nginx (Port 80/443 -> `http://127.0.0.1:3000`)

---

## 🐳 3. Docker Deployment

Build and run the multi-stage production Docker container:

```bash
# Build production image
docker build -t workora-jobs:latest .

# Run container locally on Port 3000
docker run -d -p 3000:3000 --env-file .env workora-jobs:latest
```

---

## 🧪 4. Local Development & Verification

To verify the codebase locally before pushing:

```bash
# 1. Install exact dependencies
pnpm install

# 2. Generate Prisma Client
pnpm prisma generate

# 3. Type check & Lint
pnpm lint

# 4. Production Build
pnpm build
```
