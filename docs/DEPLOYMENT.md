# WorkoraJobs Infrastructure, DevOps & Operations Guide

This guide covers production containerization, CI/CD pipelines, Nginx reverse proxy configuration, automated PostgreSQL backups, disaster recovery, and system monitoring for WorkoraJobs.

---

## 1. Quick Start Local Development (Docker)

To launch the complete application stack locally with PostgreSQL and Redis:

```bash
docker-compose up --build -d
```

Services exposed:
- **Next.js Application**: `http://localhost:3000`
- **PostgreSQL**: `localhost:5432` (`user: workora`, `pass: workora_pass`, `db: workorajobs`)
- **Redis**: `localhost:6379`

---

## 2. Production Deployment Architecture

Production uses `docker-compose.prod.yml` with Nginx reverse proxy, Certbot SSL, PostgreSQL 16, and Redis 7.

### Step 1: Configure Environment Variables
Copy `.env.example` to `.env` and set secrets:

```bash
DATABASE_URL="postgresql://workora:SECURE_PASSWORD@postgres:5432/workorajobs?schema=public"
POSTGRES_USER="workora"
POSTGRES_PASSWORD="SECURE_PASSWORD"
POSTGRES_DB="workorajobs"
JWT_SECRET="CRYPTOGRAPHICALLY_SECURE_JWT_SECRET_KEY"
```

### Step 2: Launch Production Stack
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 3. Reverse Proxy & SSL Configuration (Nginx)

Nginx handles HTTP to HTTPS redirection, TLS 1.2/1.3 encryption, static asset caching (`_next/static`), security headers (HSTS, X-Frame-Options, CSP), and Brotli/Gzip compression.

Location: `nginx/nginx.conf`

To renew Let's Encrypt SSL certificates automatically:
```bash
docker run --rm -v "./nginx/certbot/conf:/etc/letsencrypt" -v "./nginx/certbot/www:/var/www/certbot" certbot/certbot renew
```

---

## 4. Automated Database Backups & Disaster Recovery

### Automated Backup Script
Run `scripts/backup-db.sh` via cron every day at midnight:

```bash
0 0 * * * /bin/bash /opt/workora/scripts/backup-db.sh >> /var/log/workora-backup.log 2>&1
```

- **Compression**: Gzip (`.sql.gz`)
- **Retention Policy**: Backups older than 30 days are automatically purged.

### Database Restore Procedure
To restore the database from a backup file:

```bash
./scripts/restore-db.sh /opt/workora/backups/workorajobs_db_20260723_000000.sql.gz
```

---

## 5. System Health Monitoring

Execute `./scripts/health-check.sh` to inspect CPU, RAM, Disk usage, PostgreSQL readiness, and HTTP health endpoints:

```bash
./scripts/health-check.sh
```

---

## 6. GitHub Actions CI/CD Workflow

File: `.github/workflows/ci-cd.yml`

On every push to `main`:
1. Installs Node.js 20 dependencies.
2. Generates Prisma Client types.
3. Runs TypeScript type checking (`npx tsc --noEmit`).
4. Compiles production Next.js build (`npm run build`).
5. Builds production Docker container image (`workorajobs:latest`).
