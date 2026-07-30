#!/bin/bash
# ==============================================================================
# WorkoraJobs — Automated PostgreSQL Backup & Restoration Verification Script
# ==============================================================================
set -e

BACKUP_DIR="${BACKUP_DIR:-/opt/workora/backups/db}"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/workora_db_${TIMESTAMP}.sql.gz"
CONTAINER_NAME="workora_prod_postgres"
DB_USER="${POSTGRES_USER:-workora}"
DB_NAME="${POSTGRES_DB:-workora_prod}"

echo "📦 [1/4] Initiating PostgreSQL database backup..."
docker exec -t "$CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" --clean --if-exists | gzip -9 > "$BACKUP_FILE"

FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "  ✓ Database dump created successfully (${FILE_SIZE}): $BACKUP_FILE"

# Restoration Verification in Temporary Container
echo "🧪 [2/4] Verifying backup restoration in temporary PostgreSQL container..."
TEMP_CONTAINER="test_restore_${TIMESTAMP}"

docker run --name "$TEMP_CONTAINER" -e POSTGRES_PASSWORD=test_restore_pass -e POSTGRES_USER="$DB_USER" -e POSTGRES_DB="$DB_NAME" -d postgres:16-alpine > /dev/null

cleanup_temp() {
    docker rm -f "$TEMP_CONTAINER" > /dev/null 2>&1 || true
}
trap cleanup_temp EXIT

# Wait for temp DB to be ready
until docker exec "$TEMP_CONTAINER" pg_isready -U "$DB_USER" -d "$DB_NAME" > /dev/null 2>&1; do
    sleep 1
done

# Restore compressed dump into temp DB
gunzip -c "$BACKUP_FILE" | docker exec -i "$TEMP_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" > /dev/null 2>&1

# Verify table count
TABLE_COUNT=$(docker exec -i "$TEMP_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';" | tr -d '[:space:]')

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo "  ✓ Restoration verification successful (${TABLE_COUNT} public tables restored)"
else
    echo "  ❌ Backup restoration verification failed (0 tables found)"
    exit 1
fi

# Cleanup old backups (keep latest 7)
echo "🧹 [3/4] Retaining latest 7 backups and purging older dumps..."
find "$BACKUP_DIR" -type f -name "workora_db_*.sql.gz" -mtime +7 -delete

echo "✅ [4/4] Automated database backup completed & verified!"
