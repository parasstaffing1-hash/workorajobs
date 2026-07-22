#!/usr/bin/env bash
# WorkoraJobs Automated PostgreSQL Backup Script
set -e

BACKUP_DIR="${BACKUP_DIR:-/opt/workora/backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/workorajobs_db_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "[$(date)] Starting WorkoraJobs PostgreSQL backup..."

# Dump and Compress
PGPASSWORD="${POSTGRES_PASSWORD:-workora_pass}" pg_dump \
  -h "${POSTGRES_HOST:-localhost}" \
  -U "${POSTGRES_USER:-workora}" \
  -d "${POSTGRES_DB:-workorajobs}" | gzip > "${BACKUP_FILE}"

echo "[$(date)] Backup completed successfully: ${BACKUP_FILE}"

# Retention Cleanup: Delete backups older than 30 days
find "${BACKUP_DIR}" -type f -name "workorajobs_db_*.sql.gz" -mtime +30 -exec rm -f {} \;
echo "[$(date)] Cleaned up backups older than 30 days."
