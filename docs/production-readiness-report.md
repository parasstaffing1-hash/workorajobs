# WorkoraJobs Production Readiness & Operations Runbook (RC1)

This guide documents environment variables, production deployment steps, rollback strategies, backup procedures, disaster recovery protocols, and operations guides for **WorkoraJobs** Release Candidate 1.

---

## 1. Environment Configurations

Make sure to populate these environment variables in your secure hosting platform (Vercel, Google Cloud Run, AWS ECS) before starting the app:

```env
# System Essentials
NODE_ENV=production
JWT_SECRET=super-high-entropy-signature-key-goes-here

# Database Configurations
DATABASE_URL=postgresql://<db_user>:<db_pass>@<db_host>:<db_port>/<db_name>?sslmode=require&connection_limit=10&pool_timeout=15

# Cache & Queues (Redis)
REDIS_URL=redis://:<redis_pass>@<redis_host>:<redis_port>

# Google Search Console & Search APIs
GOOGLE_API_CREDENTIALS={"type":"service_account","project_id":"...","private_key":"..."}
BING_API_KEY=your-bing-api-key

# n8n Orchestration Webhooks
N8N_SEO_AUDIT_WEBHOOK=https://your-n8n.com/webhook/seo-audit
```

---

## 2. Zero-Downtime Deployment Guide

We recommend a **Rolling Blue-Green Deployment** to guarantee zero-downtime launches:

1. **Build Step**:
   Execute `npm run build` inside your CI pipeline. This builds the static Vite bundle, compiles TypeScript files, and packages `src/server.ts` into a fast, unified CommonJS file (`dist/server.cjs`).
2. **Pre-deployment Migration**:
   Before updating active nodes, apply schema changes using:
   ```bash
   npx prisma db push --accept-data-loss=false
   ```
   *Note: Never run destructive schema drops during live traffic windows.*
3. **Container Rollout**:
   Start new container instances (Green). Once health checks pass, gradually route traffic from old container instances (Blue) to the new instances using your load balancer.

---

## 3. Disaster Recovery & Database Backups

- **Automated Backup Strategy**:
  We recommend configuring daily logical backups (using PostgreSQL `pg_dump` or cloud-hosted managed backups like AWS RDS/GCP Cloud SQL backups) with standard **7-day retention windows**.
- **Point-In-Time-Recovery (PITR)**:
  Configure transaction logs archiving to enable restoring the database to any state within the retention period.
- **Queue Interruption Recovery**:
  If workers crash during active processing:
  1. Redis automatically preserves active BullMQ job statuses.
  2. Workers upon restart fetch pending jobs from the queue and utilize idempotent upsert calls to prevent duplicate actions.

---

## 4. Runbook: Cache Flushing & Worker Invalidation

### Flush All Redis Cache keys
If site configurations or page hierarchies change dramatically, flush cached endpoints using:
```bash
redis-cli -u $REDIS_URL FLUSHDB
```

### Manual Queue Purge
If bad payloads saturate background workers, clear queue payloads using:
```bash
# Executable from inside express administrative endpoints or standard command line
redis-cli -u $REDIS_URL DEL bull:technical-seo-audits:wait bull:technical-seo-audits:active
```

---

## 5. System Health Check Endpoint
The system exposes a lightweight, public, sub-millisecond health status endpoint at:
- **`GET /api/health`** : Returns standard operational status (HTTP 200 OK) used by container orchestration systems (Kubernetes liveness, Cloud Run health, AWS target groups) to check node health.
