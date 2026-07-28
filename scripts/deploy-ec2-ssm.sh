#!/usr/bin/env bash
set -euo pipefail

readonly RELEASE_SHA="${1:?A Git commit SHA is required}"
readonly APP_ROOT="/opt/workora"
readonly SERVICE_NAME="workora-web"
readonly DEPLOY_ID="${RELEASE_SHA:0:7}-$(date +%s)"
readonly BUILD_DIR="${APP_ROOT}/build-${DEPLOY_ID}"
readonly RELEASE_DIR="${APP_ROOT}/release-${DEPLOY_ID}"
readonly PREVIOUS_DIR="${APP_ROOT}/runtime.before-${DEPLOY_ID}"
readonly FAILED_DIR="${APP_ROOT}/runtime.failed-${DEPLOY_ID}"

export PATH="/opt/node/bin:${PATH}"

git init "${BUILD_DIR}"
git -C "${BUILD_DIR}" remote add origin https://github.com/parasstaffing1-hash/workorajobs.git
git -C "${BUILD_DIR}" fetch --depth 1 origin "${RELEASE_SHA}"
git -C "${BUILD_DIR}" checkout --detach FETCH_HEAD

cd "${BUILD_DIR}"
/opt/node/bin/corepack enable
/opt/node/bin/corepack prepare pnpm@10.11.1 --activate
pnpm install --frozen-lockfile
NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 pnpm build

# Load root-only production settings for schema migrations. The application
# also supports POSTGRES_* variables, so keep that fallback for older hosts.
if [[ -r /etc/workora/oauth.env ]]; then
  set -a
  # shellcheck disable=SC1091
  source /etc/workora/oauth.env
  set +a
fi

export DATABASE_URL="${DATABASE_URL:-postgresql://${POSTGRES_USER:-workora}:${POSTGRES_PASSWORD:-workora_password}@${POSTGRES_HOST:-localhost}:${POSTGRES_PORT:-5432}/${POSTGRES_DB:-workora_jobs}?schema=public}"

# Production predates Prisma's migration ledger. Baseline only when the legacy
# web User table exists and the ledger does not, so an empty database still
# receives the initial migration normally.
readonly PSQL_DATABASE_URL="${DATABASE_URL%%\?*}"
MIGRATION_STATE="$(psql "${PSQL_DATABASE_URL}" -Atc "SELECT (to_regclass('public.\"User\"') IS NOT NULL)::int || '|' || (to_regclass('public._prisma_migrations') IS NOT NULL)::int")"
if [[ "${MIGRATION_STATE}" == "1|0" ]]; then
  pnpm exec prisma migrate resolve --applied 20260717163622_init
fi

pnpm exec prisma migrate deploy

test -f .next/standalone/server.js
install -d -m 755 "${RELEASE_DIR}/.next"
cp -a .next/standalone/. "${RELEASE_DIR}/"
cp -a .next/static "${RELEASE_DIR}/.next/"
cp -a public "${RELEASE_DIR}/"
chown -R ec2-user:ec2-user "${RELEASE_DIR}"

systemctl stop "${SERVICE_NAME}"
mv "${APP_ROOT}/runtime" "${PREVIOUS_DIR}"
mv "${RELEASE_DIR}" "${APP_ROOT}/runtime"

if systemctl start "${SERVICE_NAME}" \
  && sleep 5 \
  && systemctl is-active --quiet "${SERVICE_NAME}" \
  && curl -fsS --max-time 15 http://127.0.0.1:3000/api/v1/health >/dev/null; then
  echo "DEPLOY_OK ${RELEASE_SHA}"
else
  systemctl stop "${SERVICE_NAME}" || true
  mv "${APP_ROOT}/runtime" "${FAILED_DIR}"
  mv "${PREVIOUS_DIR}" "${APP_ROOT}/runtime"
  systemctl start "${SERVICE_NAME}"
  echo "DEPLOY_ROLLED_BACK ${RELEASE_SHA}" >&2
  exit 1
fi
