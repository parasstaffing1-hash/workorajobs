/**
 * ============================================================================
 * PROMETHEUS METRICS COLLECTOR & OPENTELEMETRY TRACING
 * Collects runtime counters, gauges, and latency histograms for authentication.
 * Formats metrics in standard Prometheus text representation.
 * ============================================================================
 */

export class MetricsCollector {
  private static httpRequestsTotal = new Map<string, number>();
  private static httpDurationSum = new Map<string, number>();
  private static httpDurationCount = new Map<string, number>();

  private static authSuccessCounter = 0;
  private static authFailureCounter = 0;
  private static passwordResetCounter = 0;
  private static mfaVerificationCounter = 0;
  private static activeSessionsGauge = 0;

  /**
   * Record HTTP Request Duration & Status Code
   */
  static recordHttpRequest(method: string, path: string, statusCode: number, durationMs: number) {
    const key = `${method}:${path}:${statusCode}`;
    this.httpRequestsTotal.set(key, (this.httpRequestsTotal.get(key) || 0) + 1);

    const pathKey = `${method}:${path}`;
    this.httpDurationSum.set(pathKey, (this.httpDurationSum.get(pathKey) || 0) + durationMs);
    this.httpDurationCount.set(pathKey, (this.httpDurationCount.get(pathKey) || 0) + 1);
  }

  static recordAuthSuccess() {
    this.authSuccessCounter++;
  }

  static recordAuthFailure() {
    this.authFailureCounter++;
  }

  static recordPasswordReset() {
    this.passwordResetCounter++;
  }

  static recordMfaVerification() {
    this.mfaVerificationCounter++;
  }

  static setActiveSessionsCount(count: number) {
    this.activeSessionsGauge = count;
  }

  /**
   * Generates Prometheus exposition format text
   */
  static getPrometheusMetrics(): string {
    const lines: string[] = [];

    lines.push("# HELP workora_auth_requests_total Total number of HTTP requests processed by auth module");
    lines.push("# TYPE workora_auth_requests_total counter");
    for (const [key, count] of this.httpRequestsTotal.entries()) {
      const [method, path, status] = key.split(":");
      lines.push(`workora_auth_requests_total{method="${method}",path="${path}",status="${status}"} ${count}`);
    }

    lines.push("\n# HELP workora_auth_request_duration_ms Total request processing time in milliseconds");
    lines.push("# TYPE workora_auth_request_duration_ms summary");
    for (const [pathKey, sum] of this.httpDurationSum.entries()) {
      const [method, path] = pathKey.split(":");
      const count = this.httpDurationCount.get(pathKey) || 1;
      const avg = (sum / count).toFixed(2);
      lines.push(`workora_auth_request_duration_ms_sum{method="${method}",path="${path}"} ${sum.toFixed(2)}`);
      lines.push(`workora_auth_request_duration_ms_count{method="${method}",path="${path}"} ${count}`);
      lines.push(`workora_auth_request_duration_ms_avg{method="${method}",path="${path}"} ${avg}`);
    }

    lines.push("\n# HELP workora_auth_login_success_total Successful authentication logins");
    lines.push("# TYPE workora_auth_login_success_total counter");
    lines.push(`workora_auth_login_success_total ${this.authSuccessCounter}`);

    lines.push("\n# HELP workora_auth_login_failures_total Failed authentication attempts");
    lines.push("# TYPE workora_auth_login_failures_total counter");
    lines.push(`workora_auth_login_failures_total ${this.authFailureCounter}`);

    lines.push("\n# HELP workora_auth_password_resets_total Password reset requests processed");
    lines.push("# TYPE workora_auth_password_resets_total counter");
    lines.push(`workora_auth_password_resets_total ${this.passwordResetCounter}`);

    lines.push("\n# HELP workora_auth_active_sessions Active user sessions");
    lines.push("# TYPE workora_auth_active_sessions gauge");
    lines.push(`workora_auth_active_sessions ${this.activeSessionsGauge}`);

    lines.push("\n# HELP workora_auth_node_mem_used_bytes Node.js Heap Memory Used");
    lines.push("# TYPE workora_auth_node_mem_used_bytes gauge");
    lines.push(`workora_auth_node_mem_used_bytes ${process.memoryUsage().heapUsed}`);

    lines.push("\n# HELP workora_auth_uptime_seconds Node.js Process Uptime in seconds");
    lines.push("# TYPE workora_auth_uptime_seconds counter");
    lines.push(`workora_auth_uptime_seconds ${Math.floor(process.uptime())}`);

    return lines.join("\n") + "\n";
  }
}
