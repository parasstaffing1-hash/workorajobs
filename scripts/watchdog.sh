#!/bin/bash
# ==============================================================================
# WorkoraJobs — Production Automatic Recovery Watchdog Script
# ==============================================================================
set -u

LOG_FILE="/var/log/workora-recovery.log"
mkdir -p "$(dirname "$LOG_FILE")"

log_action() {
    echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] $1" | tee -a "$LOG_FILE"
}

# 1. Check Docker Daemon
if ! systemctl is-active --quiet docker; then
    log_action "⚠️ Docker daemon down. Restarting docker.service..."
    systemctl restart docker
    sleep 5
fi

# 2. Check Nginx Container or Host Service
if command -v docker &>/dev/null && docker ps --format '{{.Names}}' | grep -q 'workora_nginx'; then
    NGINX_STATUS=$(docker inspect -f '{{.State.Status}}' workora_nginx 2>/dev/null || echo "down")
    if [ "$NGINX_STATUS" != "running" ]; then
        log_action "⚠️ workora_nginx container is $NGINX_STATUS. Restarting container..."
        docker restart workora_nginx
    fi
elif systemctl is-active --quiet nginx; then
    : # Host Nginx running fine
else
    log_action "⚠️ Nginx service down. Restarting nginx..."
    systemctl restart nginx || true
fi

# 3. Check Database Container
if command -v docker &>/dev/null && docker ps --format '{{.Names}}' | grep -q 'workora_prod_postgres'; then
    DB_STATUS=$(docker inspect -f '{{.State.Health.Status}}' workora_prod_postgres 2>/dev/null || echo "unhealthy")
    if [ "$DB_STATUS" != "healthy" ]; then
        log_action "⚠️ workora_prod_postgres is $DB_STATUS. Restarting database container..."
        docker restart workora_prod_postgres
    fi
fi

# 4. Check Web Application Container / Health Endpoint
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://127.0.0.1:3000/api/v1/health || echo "000")
if [ "$HTTP_CODE" != "200" ]; then
    log_action "⚠️ Web application health check returned HTTP $HTTP_CODE. Restarting workora_app container..."
    if command -v docker &>/dev/null && docker ps --format '{{.Names}}' | grep -q 'workora_app'; then
        docker restart workora_app
    elif systemctl is-active --quiet workora-web; then
        systemctl restart workora-web
    fi
fi
