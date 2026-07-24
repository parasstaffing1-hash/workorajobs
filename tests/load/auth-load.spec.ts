/**
 * ============================================================================
 * LOAD TEST SUITE: Authentication System
 * Tests concurrency, throughput, and latency under load
 * ============================================================================
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const CONCURRENT_USERS = 20;

async function fetchApi(path: string, options: RequestInit = {}) {
  const start = Date.now();
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
    const body = await res.json().catch(() => ({}));
    return { status: res.status, body, latencyMs: Date.now() - start };
  } catch (err: any) {
    return { status: 0, body: {}, latencyMs: Date.now() - start };
  }
}

describe("Authentication Load Tests", () => {
  // ─── Login Endpoint Throughput ──────────────────────────────────
  describe("Login Endpoint Throughput", () => {
    it(`handles ${CONCURRENT_USERS} concurrent login requests`, async () => {
      const requests = Array.from({ length: CONCURRENT_USERS }, (_, i) =>
        fetchApi("/api/v1/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: `loadtest.user.${i}@example.com`,
            password: "SecureP@ss123!",
          }),
        })
      );

      const results = await Promise.all(requests);
      const successful = results.filter((r) => r.status === 200).length;
      const avgLatency = results.reduce((sum, r) => sum + r.latencyMs, 0) / results.length;

      expect(successful).toBeGreaterThan(0);
      expect(avgLatency).toBeLessThan(5000); // P50 under 5s
      console.log(`Login Load: ${successful}/${CONCURRENT_USERS} succeeded, avg latency: ${avgLatency.toFixed(0)}ms`);
    }, 30000);
  });

  // ─── Signup Endpoint Throughput ─────────────────────────────────
  describe("Signup Endpoint Throughput", () => {
    it(`handles ${CONCURRENT_USERS} concurrent signup requests`, async () => {
      const requests = Array.from({ length: CONCURRENT_USERS }, (_, i) =>
        fetchApi("/api/v1/auth/signup", {
          method: "POST",
          body: JSON.stringify({
            email: `load.signup.${Date.now()}.${i}@example.com`,
            password: "SecureP@ss123!",
            role: "JOB_SEEKER",
            name: `Load Test User ${i}`,
          }),
        })
      );

      const results = await Promise.all(requests);
      const successful = results.filter((r) => r.status === 200).length;
      const avgLatency = results.reduce((sum, r) => sum + r.latencyMs, 0) / results.length;

      expect(successful).toBeGreaterThan(0);
      console.log(`Signup Load: ${successful}/${CONCURRENT_USERS} succeeded, avg latency: ${avgLatency.toFixed(0)}ms`);
    }, 30000);
  });

  // ─── Session Retrieval Throughput ───────────────────────────────
  describe("Session Retrieval Throughput", () => {
    it(`handles ${CONCURRENT_USERS} concurrent /me requests`, async () => {
      const requests = Array.from({ length: CONCURRENT_USERS }, () =>
        fetchApi("/api/v1/auth/me")
      );

      const results = await Promise.all(requests);
      const successful = results.filter((r) => r.status === 200).length;
      const avgLatency = results.reduce((sum, r) => sum + r.latencyMs, 0) / results.length;
      const p99Latency = results.sort((a, b) => b.latencyMs - a.latencyMs)[0]?.latencyMs || 0;

      expect(successful).toBeGreaterThan(0);
      expect(avgLatency).toBeLessThan(3000);
      console.log(`Session Load: ${successful}/${CONCURRENT_USERS} succeeded, avg: ${avgLatency.toFixed(0)}ms, p99: ${p99Latency}ms`);
    }, 30000);
  });

  // ─── Password Reset Throughput ──────────────────────────────────
  describe("Password Reset Throughput", () => {
    it(`handles ${CONCURRENT_USERS} concurrent forgot-password requests`, async () => {
      const requests = Array.from({ length: CONCURRENT_USERS }, (_, i) =>
        fetchApi("/api/v1/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email: `load.reset.${i}@example.com` }),
        })
      );

      const results = await Promise.all(requests);
      const successful = results.filter((r) => r.status === 200).length;
      const avgLatency = results.reduce((sum, r) => sum + r.latencyMs, 0) / results.length;

      expect(successful).toBeGreaterThan(0);
      console.log(`Reset Load: ${successful}/${CONCURRENT_USERS} succeeded, avg latency: ${avgLatency.toFixed(0)}ms`);
    }, 30000);
  });

  // ─── Admin Console Throughput ───────────────────────────────────
  describe("Admin Console Throughput", () => {
    it(`handles ${CONCURRENT_USERS} concurrent admin dashboard requests`, async () => {
      const requests = Array.from({ length: CONCURRENT_USERS }, () =>
        fetchApi("/api/v1/admin/auth")
      );

      const results = await Promise.all(requests);
      const successful = results.filter((r) => r.status === 200).length;
      const avgLatency = results.reduce((sum, r) => sum + r.latencyMs, 0) / results.length;

      expect(successful).toBeGreaterThan(0);
      console.log(`Admin Load: ${successful}/${CONCURRENT_USERS} succeeded, avg latency: ${avgLatency.toFixed(0)}ms`);
    }, 30000);
  });

  // ─── Mixed Endpoint Stress Test ─────────────────────────────────
  describe("Mixed Endpoint Stress Test", () => {
    it("handles mixed authentication operations simultaneously", async () => {
      const mixed = [
        fetchApi("/api/v1/auth/me"),
        fetchApi("/api/v1/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: "stress@example.com", password: "Test123!" }),
        }),
        fetchApi("/api/v1/auth/sessions"),
        fetchApi("/api/v1/auth/mfa/setup", { method: "POST" }),
        fetchApi("/api/v1/admin/auth"),
        fetchApi("/api/v1/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email: "stress@example.com" }),
        }),
        fetchApi("/api/v1/auth/passkeys/register-options", { method: "POST" }),
      ];

      const results = await Promise.all(mixed);
      const allResponded = results.every((r) => r.status > 0);
      const maxLatency = Math.max(...results.map((r) => r.latencyMs));

      expect(allResponded).toBe(true);
      console.log(`Mixed Stress: All ${results.length} responded, max latency: ${maxLatency}ms`);
    }, 30000);
  });
});
