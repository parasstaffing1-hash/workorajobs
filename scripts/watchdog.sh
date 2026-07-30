#!/usr/bin/env bash
set -u

readonly LOG_FILE="/var/log/workora-recovery.log"

log_action() {
  printf '[%s] %s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$1" >>"${LOG_FILE}"
}

# Production is a native systemd service. Starting the unused Docker stack
# creates duplicate Node processes and can exhaust the t3.small's memory.
if ! systemctl is-active --quiet nginx; then
  log_action "Nginx is down; restarting it."
  systemctl restart nginx || true
fi

HTTP_CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 http://127.0.0.1:3000/api/v1/health || true)"
if [[ "${HTTP_CODE}" != "200" ]]; then
  log_action "Web health returned HTTP ${HTTP_CODE:-000}; restarting workora-web."
  systemctl restart workora-web
fi

# Escalate only after the service has had time to recover.
sleep 5
if ! curl -fsS --max-time 5 http://127.0.0.1:3000/api/v1/health >/dev/null; then
  log_action "Web health still failing after restart; leaving evidence for alerting."
  exit 1
fi
