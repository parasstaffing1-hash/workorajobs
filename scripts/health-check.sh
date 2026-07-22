#!/usr/bin/env bash
# WorkoraJobs System Monitoring & Health Check Script
set -e

APP_URL="${APP_URL:-http://localhost:3000}"

echo "=== WorkoraJobs Infrastructure Health Check ==="
echo "Date: $(date)"
echo ""

# 1. System Metrics
echo "--- CPU & Memory Usage ---"
free -h
echo ""

echo "--- Disk Space ---"
df -h /
echo ""

# 2. Database Health Check
echo "--- Checking PostgreSQL Connection ---"
if PGPASSWORD="${POSTGRES_PASSWORD:-workora_pass}" pg_isready -h "${POSTGRES_HOST:-localhost}" -U "${POSTGRES_USER:-workora}" -d "${POSTGRES_DB:-workorajobs}" > /dev/null 2>&1; then
  echo "✔ PostgreSQL: HEALTHY"
else
  echo "✖ PostgreSQL: UNHEALTHY"
fi

# 3. HTTP Health Endpoint Check
echo "--- Checking HTTP Application Health ---"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${APP_URL}/health/database" || echo "000")
if [ "${HTTP_STATUS}" -eq 200 ]; then
  echo "✔ HTTP App (${APP_URL}/health/database): 200 OK (HEALTHY)"
else
  echo "✖ HTTP App (${APP_URL}/health/database): Returned status ${HTTP_STATUS}"
fi

echo "=============================================="
