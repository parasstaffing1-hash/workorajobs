# WorkoraJobs PostgreSQL Database Architecture & Operations Guide

This document covers PostgreSQL configuration, environment variable fallback resolution, Prisma ORM migrations, seeding, connection pooling, backup, and restore procedures for WorkoraJobs.

---

## 1. Environment Variable Configuration

WorkoraJobs supports both direct connection string configuration (`DATABASE_URL`) and individual `POSTGRES_*` environment variables.

### Primary Choice: Single Connection String
```env
DATABASE_URL=postgresql://workora:workora_password@localhost:5432/workora_jobs?schema=public&connection_limit=10
```

### Alternative: Individual Parameters (Auto-Constructed)
If `DATABASE_URL` is omitted, the application automatically builds the connection URL using:
```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=workora_jobs
POSTGRES_USER=workora
POSTGRES_PASSWORD=workora_password
POSTGRES_SCHEMA=public
POSTGRES_CONNECTION_LIMIT=10
```

---

## 2. Database Commands & Lifecycle

| Task | Package Script | Direct Command | Description |
|---|---|---|---|
| **Generate Types** | `npm run db:generate` | `npx prisma generate` | Regenerates Prisma Client types |
| **Apply Dev Schema** | `npm run db:push` | `npx prisma db push` | Pushes schema directly to database |
| **Create Migration** | `npm run db:migrate` | `npx prisma migrate dev` | Creates and applies a new migration |
| **Deploy Production** | `npm run db:deploy` | `npx prisma migrate deploy` | Applies pending migrations in production |
| **Reset Database** | `npm run db:reset` | `npx prisma migrate reset --force` | Drops and recreates the database |
| **Seed Dev Data** | `npm run db:seed` | `npx prisma db seed` | Populates sample development data |

---

## 3. Database Health Check API

To verify database status, call either health endpoint:

```bash
GET /api/health/database
# or
GET /health/database
```

### Response (Healthy 200 OK):
```json
{
  "status": "healthy",
  "database": "connected",
  "latencyMs": 14,
  "config": {
    "host": "localhost",
    "port": "5432",
    "database": "workora_jobs",
    "schema": "public"
  }
}
```

### Response (Disconnected 503 Service Unavailable):
```json
{
  "status": "unhealthy",
  "database": "disconnected",
  "error": "Connection timeout",
  "config": {
    "host": "localhost",
    "port": "5432",
    "database": "workora_jobs"
  }
}
```

---

## 4. Backup & Restore Procedures

### Database Backup
To create a compressed SQL backup of your PostgreSQL database:

```bash
pg_dump -h localhost -U workora -d workora_jobs -F c -b -v -f workora_jobs_backup_$(date +%Y%m%d_%H%M%S).dump
```

### Database Restore
To restore from a dump file:

```bash
# 1. Drop existing database if needed
dropdb -h localhost -U workora workora_jobs

# 2. Recreate empty database
createdb -h localhost -U workora workora_jobs

# 3. Restore backup dump
pg_restore -h localhost -U workora -d workora_jobs -v workora_jobs_backup_YYYYMMDD_HHMMSS.dump
```
