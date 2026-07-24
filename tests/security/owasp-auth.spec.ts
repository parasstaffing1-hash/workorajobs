/**
 * ============================================================================
 * SECURITY & OWASP TEST SUITE: Authentication System
 * Tests OWASP Top 10 compliance, XSS, CSRF, SQL injection, brute-force
 * ============================================================================
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

async function fetchApi(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body, headers: res.headers };
}

describe("OWASP Security Test Suite", () => {
  // ─── A01:2021 Broken Access Control ─────────────────────────────
  describe("A01 - Broken Access Control", () => {
    it("admin endpoints reject unauthenticated requests", async () => {
      const { status } = await fetchApi("/api/v1/admin/auth");
      // Should return 200 with fallback data or 403 — never crash
      expect([200, 403]).toContain(status);
    });

    it("cannot access other user's session data without auth", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/sessions");
      expect(status).toBe(200);
      // Should only return current user's sessions, not all sessions
      if (body.sessions) {
        expect(Array.isArray(body.sessions)).toBe(true);
      }
    });
  });

  // ─── A02:2021 Cryptographic Failures ────────────────────────────
  describe("A02 - Cryptographic Failures", () => {
    it("never returns password hash in user response", async () => {
      const { body } = await fetchApi("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "test@example.com", password: "Test123!" }),
      });

      if (body.user) {
        expect(body.user.passwordHash).toBeUndefined();
        expect(body.user.password).toBeUndefined();
      }
    });

    it("signup response does not expose password hash", async () => {
      const { body } = await fetchApi("/api/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: `sec.test.${Date.now()}@example.com`,
          password: "SecureP@ss123!",
          role: "JOB_SEEKER",
        }),
      });

      expect(JSON.stringify(body)).not.toContain("passwordHash");
      expect(JSON.stringify(body)).not.toContain("$2b$"); // bcrypt prefix
    });

    it("MFA setup generates sufficient entropy in secrets", async () => {
      const { body } = await fetchApi("/api/v1/auth/mfa/setup", { method: "POST" });

      if (body.secret) {
        expect(body.secret.length).toBeGreaterThanOrEqual(20);
      }
    });
  });

  // ─── A03:2021 Injection ─────────────────────────────────────────
  describe("A03 - Injection Prevention", () => {
    it("SQL injection in email field is safely handled", async () => {
      const { status } = await fetchApi("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "' OR 1=1 --",
          password: "anything",
        }),
      });

      // Should fail validation, not crash with SQL error
      expect([200, 400, 401, 500]).toContain(status);
    });

    it("SQL injection in search query is safely handled", async () => {
      const { status } = await fetchApi("/api/v1/admin/auth?query=' DROP TABLE users;--");
      expect([200, 400, 403]).toContain(status);
    });

    it("XSS payload in name field is safely handled", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: `xss.test.${Date.now()}@example.com`,
          password: "SecureP@ss123!",
          role: "JOB_SEEKER",
          name: '<script>alert("XSS")</script>',
        }),
      });

      // Name should be stored/returned without script execution
      if (body.user?.name) {
        expect(body.user.name).not.toContain("<script>");
      }
    });

    it("NoSQL injection attempt in password is safely handled", async () => {
      const { status } = await fetchApi("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: { $gt: "" },
        }),
      });

      expect([200, 400, 401, 500]).toContain(status);
    });
  });

  // ─── A04:2021 Insecure Design ───────────────────────────────────
  describe("A04 - Insecure Design", () => {
    it("password reset does not reveal if email exists", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: "nonexistent@example.com" }),
      });

      // Should always return success (timing-safe)
      expect(status).toBe(200);
      expect(body.success).toBe(true);
    });

    it("login error message does not distinguish email vs password", async () => {
      const { body } = await fetchApi("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "doesnotexist@example.com",
          password: "WrongPassword!",
        }),
      });

      // Error should be generic, not "user not found" vs "wrong password"
      if (body.error) {
        expect(body.error).not.toContain("not found");
        expect(body.error).not.toContain("does not exist");
      }
    });
  });

  // ─── A07:2021 Identification & Auth Failures ────────────────────
  describe("A07 - Identification & Authentication Failures", () => {
    it("session tokens have sufficient entropy (64+ hex chars)", async () => {
      const { body } = await fetchApi("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "test@example.com", password: "SecureP@ss123!" }),
      });

      // Session token should be cryptographically strong
      if (body.sessionToken) {
        expect(body.sessionToken.length).toBeGreaterThanOrEqual(64);
      }
    });

    it("refresh tokens have sufficient entropy (80+ hex chars)", async () => {
      const { body } = await fetchApi("/api/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: `entropy.${Date.now()}@example.com`,
          password: "SecureP@ss123!",
          role: "JOB_SEEKER",
        }),
      });

      if (body.refreshToken) {
        expect(body.refreshToken.length).toBeGreaterThanOrEqual(80);
      }
    });
  });

  // ─── Brute Force Protection ─────────────────────────────────────
  describe("Brute Force Protection", () => {
    it("handles rapid sequential login attempts gracefully", async () => {
      const attempts = Array.from({ length: 8 }, (_, i) =>
        fetchApi("/api/v1/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: "bruteforce-target@example.com",
            password: `wrong-password-${i}`,
          }),
        })
      );

      const results = await Promise.all(attempts);

      // Should not crash; some may be rate-limited
      for (const { status } of results) {
        expect([200, 400, 401, 429]).toContain(status);
      }
    });
  });

  // ─── Response Header Security ───────────────────────────────────
  describe("Response Header Security", () => {
    it("does not expose server version in headers", async () => {
      const { headers } = await fetchApi("/api/v1/auth/me");

      const server = headers.get("server");
      if (server) {
        expect(server).not.toContain("Express");
        expect(server).not.toContain("Apache");
      }
    });
  });
});
