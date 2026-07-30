#!/bin/bash
# ==============================================================================
# WorkoraJobs — Hardened AWS Production Deployment & Rollback Pipeline
# ==============================================================================
set -e

COMMIT_REF="${1:-main}"
SERVER_URL="${SERVER_URL:-https://workorajobs.com}"

echo "================================================================="
echo "🚀 WORKORA JOBS — AWS PRODUCTION DEPLOYMENT HARDENING PIPELINE"
echo "================================================================="
echo "📍 Target Ref: $COMMIT_REF"
echo "-----------------------------------------------------------------"

# 1. Pull requested Git commit
if [ -d ".git" ]; then
    echo "🔄 [1/7] Fetching requested Git commit ($COMMIT_REF)..."
    git fetch origin
    git checkout "$COMMIT_REF"
    git pull origin "$COMMIT_REF" || true
fi

# 2. Tag previous image for zero-downtime rollback safety
echo "🛡️ [2/7] Backup current running image for rollback safety..."
if docker image inspect workora_app:latest &>/dev/null; then
    docker tag workora_app:latest workora_app:previous || true
fi

# 3. Build new production Docker image before stopping active release
echo "🏗️ [3/7] Building new production Docker image..."
if ! docker build -t workora_app:latest -f Dockerfile .; then
    echo "❌ Build failed! Aborting deployment. Current release remains active."
    exit 1
fi

# 4. Safe Database Migrations (NEVER migrate reset!)
echo "🗄️ [4/7] Applying Prisma database migrations..."
if [ -f "prisma/schema.prisma" ]; then
    npx prisma migrate deploy || echo "⚠️ Migration warning: verify schema status."
fi

# 5. Start hardened Docker Compose stack
echo "🚀 [5/7] Starting hardened production container stack..."
if command -v docker-compose &>/dev/null; then
    docker-compose -f docker-compose.prod.yml up -d
else
    docker compose -f docker-compose.prod.yml up -d
fi

# 6. Wait for container health checks
echo "⏳ [6/7] Waiting for container health checks..."
HEALTHY=false
for i in {1..12}; do
    APP_STATUS=$(docker inspect -f '{{.State.Health.Status}}' workora_app 2>/dev/null || echo "starting")
    NGINX_STATUS=$(docker inspect -f '{{.State.Health.Status}}' workora_nginx 2>/dev/null || echo "starting")
    echo "  - Attempt $i: App ($APP_STATUS), Nginx ($NGINX_STATUS)"
    if [ "$APP_STATUS" = "healthy" ] && [ "$NGINX_STATUS" = "healthy" ]; then
        HEALTHY=true
        break
    fi
    sleep 5
done

# 7. Automated Production Endpoint Verification & Rollback
echo "🧪 [7/7] Verifying live endpoints..."

rollback() {
    echo "❌ CRITICAL: Deployment verification failed! Executing automatic rollback to previous release..."
    if docker image inspect workora_app:previous &>/dev/null; then
        docker tag workora_app:previous workora_app:latest
        if command -v docker-compose &>/dev/null; then
            docker-compose -f docker-compose.prod.yml up -d
        else
            docker compose -f docker-compose.prod.yml up -d
        fi
        echo "🔄 Rollback to previous Docker release completed."
    fi
    exit 1
}

if [ "$HEALTHY" != "true" ]; then
    echo "❌ Containers failed to reach healthy state within 60s."
    rollback
fi

# Check Homepage
HTTP_HOME=$(curl -s -o /tmp/live_home.html -w "%{http_code}" --max-time 10 "${SERVER_URL}/" || echo "000")
echo "  - Homepage: HTTP $HTTP_HOME"
if [ "$HTTP_HOME" -ne 200 ]; then rollback; fi

# Check API Health Endpoint
HTTP_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "${SERVER_URL}/api/v1/health" || echo "000")
echo "  - API Health: HTTP $HTTP_HEALTH"
if [ "$HTTP_HEALTH" -ne 200 ]; then rollback; fi

# Check Auth Login Page
HTTP_LOGIN=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "${SERVER_URL}/auth/login" || echo "000")
echo "  - Auth Login: HTTP $HTTP_LOGIN"
if [ "$HTTP_LOGIN" -ne 200 ]; then rollback; fi

# Check Real Static CSS Asset
CSS_PATH=$(grep -oE '/_next/static/chunks/[a-zA-Z0-9_-]+\.css' /tmp/live_home.html | head -n 1 || echo "")
if [ -n "$CSS_PATH" ]; then
    CSS_URL="${SERVER_URL}${CSS_PATH}"
else
    CSS_URL="${SERVER_URL}/_next/static/chunks/0i202dfltqh6p.css"
fi

HTTP_CSS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$CSS_URL" || echo "000")
echo "  - Static CSS Asset ($CSS_URL): HTTP $HTTP_CSS"
if [ "$HTTP_CSS" -ne 200 ]; then rollback; fi

echo "================================================================="
echo "✅ DEPLOYMENT COMPLETED & VERIFIED SUCCESSFULLY!"
echo "🌐 Live URL: $SERVER_URL"
echo "================================================================="
