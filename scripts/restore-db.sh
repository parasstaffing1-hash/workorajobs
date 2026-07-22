#!/usr/bin/env bash
# WorkoraJobs Database Restore & Disaster Recovery Script
set -e

if [ -z "$1" ]; then
  echo "Usage: ./restore-db.sh /path/to/backup.sql.gz"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "Error: Backup file ${BACKUP_FILE} does not exist."
  exit 1
fi

echo "[$(date)] Restoring PostgreSQL database from ${BACKUP_FILE}..."

gunzip -c "${BACKUP_FILE}" | PGPASSWORD="${POSTGRES_PASSWORD:-workora_pass}" psql \
  -h "${POSTGRES_HOST:-localhost}" \
  -U "${POSTGRES_USER:-workora}" \
  -d "${POSTGRES_DB:-workorajobs}"

echo "[$(date)] Database restore completed successfully!"
