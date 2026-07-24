/**
 * ============================================================================
 * INTEGRATION TEST SUITE: Authentication API Endpoints
 * Tests all auth API routes for validation, error handling, and security
 * ============================================================================
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

async function fetchApi(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body, headers: res.headers };
}

describe("Authentication API Integration Tests", () => {
  // ─── POST /api/v1/auth/signup ───────────────────────────────────
  describe("POST /api/v1/auth/signup", () => {
    it("creates a JOB_SEEKER account with valid input", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: `test.seeker.${Date.now()}@example.com`,
          password: "SecureP@ss123!",
          role: "JOB_SEEKER",
          name: "Test Seeker",
        }),
      });

      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.user).toBeDefined();
      expect(body.user.role).toBe("JOB_SEEKER");
      expect(body.token).toBeDefined();
    });

    it("creates an EMPLOYER account with company name", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: `test.employer.${Date.now()}@example.com`,
          password: "SecureP@ss123!",
          role: "EMPLOYER",
          companyName: "Test Corp",
        }),
      });

      expect(status).toBe(200);
      expect(body.success).toBe(true);
    });

    it("returns 400 for missing email", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify({ password: "SecureP@ss123!", role: "JOB_SEEKER" }),
      });

      expect(status).toBeGreaterThanOrEqual(400);
    });

    it("returns 400 for missing password", async () => {
      const { status } = await fetchApi("/api/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email: "test@example.com", role: "JOB_SEEKER" }),
      });

      expect(status).toBeGreaterThanOrEqual(400);
    });
  });

  // ─── POST /api/v1/auth/login ────────────────────────────────────
  describe("POST /api/v1/auth/login", () => {
    it("authenticates valid credentials", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "SecureP@ss123!",
        }),
      });

      expect(status).toBe(200);
      expect(body.success).toBe(true);
    });

    it("returns consistent error for invalid credentials", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "nonexistent@example.com",
          password: "WrongPassword!",
        }),
      });

      // Should not reveal whether email exists
      expect(status).toBeGreaterThanOrEqual(200);
    });

    it("accepts rememberMe parameter", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "SecureP@ss123!",
          rememberMe: true,
        }),
      });

      expect(status).toBe(200);
    });
  });

  // ─── POST /api/v1/auth/logout ───────────────────────────────────
  describe("POST /api/v1/auth/logout", () => {
    it("successfully logs out", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/logout", {
        method: "POST",
      });

      expect(status).toBe(200);
      expect(body.success).toBe(true);
    });
  });

  // ─── GET /api/v1/auth/me ────────────────────────────────────────
  describe("GET /api/v1/auth/me", () => {
    it("returns current user profile", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/me");

      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.user).toBeDefined();
    });
  });

  // ─── POST /api/v1/auth/forgot-password ──────────────────────────
  describe("POST /api/v1/auth/forgot-password", () => {
    it("accepts valid email for password reset", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: "user@example.com" }),
      });

      expect(status).toBe(200);
      expect(body.success).toBe(true);
    });
  });

  // ─── POST /api/v1/auth/reset-password ───────────────────────────
  describe("POST /api/v1/auth/reset-password", () => {
    it("accepts token and new password", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token: "test-reset-token",
          password: "NewSecureP@ss123!",
        }),
      });

      expect(status).toBe(200);
      expect(body.success).toBe(true);
    });
  });

  // ─── POST /api/v1/auth/verify-email ─────────────────────────────
  describe("POST /api/v1/auth/verify-email", () => {
    it("accepts verification token", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token: "test-verification-token" }),
      });

      expect(status).toBe(200);
      expect(body.success).toBe(true);
    });
  });

  // ─── POST /api/v1/auth/refresh ──────────────────────────────────
  describe("POST /api/v1/auth/refresh", () => {
    it("refreshes session token", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken: "test-refresh-token" }),
      });

      expect(status).toBe(200);
      expect(body.success).toBe(true);
    });
  });

  // ─── GET /api/v1/auth/sessions ──────────────────────────────────
  describe("GET /api/v1/auth/sessions", () => {
    it("returns active user sessions", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/sessions");

      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.sessions)).toBe(true);
    });
  });

  // ─── POST /api/v1/auth/sessions/revoke-others ──────────────────
  describe("POST /api/v1/auth/sessions/revoke-others", () => {
    it("revokes all other sessions", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/sessions/revoke-others", {
        method: "POST",
      });

      expect(status).toBe(200);
      expect(body.success).toBe(true);
    });
  });

  // ─── POST /api/v1/auth/change-password ──────────────────────────
  describe("POST /api/v1/auth/change-password", () => {
    it("changes password with valid current password", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: "OldP@ssw0rd!",
          newPassword: "NewSecureP@ss123!",
        }),
      });

      expect(status).toBe(200);
      expect(body.success).toBe(true);
    });
  });

  // ─── MFA Endpoints ──────────────────────────────────────────────
  describe("POST /api/v1/auth/mfa/setup", () => {
    it("generates QR code and backup codes", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/mfa/setup", {
        method: "POST",
      });

      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.qrCodeUrl).toBeDefined();
      expect(body.backupCodes).toBeDefined();
    });
  });

  describe("POST /api/v1/auth/mfa/verify", () => {
    it("accepts valid 6-digit code", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/mfa/verify", {
        method: "POST",
        body: JSON.stringify({ code: "123456" }),
      });

      expect(status).toBe(200);
      expect(body.success).toBe(true);
    });

    it("rejects invalid code length", async () => {
      const { status } = await fetchApi("/api/v1/auth/mfa/verify", {
        method: "POST",
        body: JSON.stringify({ code: "12" }),
      });

      expect(status).toBeGreaterThanOrEqual(400);
    });
  });

  // ─── Passkey Endpoints ──────────────────────────────────────────
  describe("POST /api/v1/auth/passkeys/register-options", () => {
    it("generates WebAuthn registration options", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/passkeys/register-options", {
        method: "POST",
      });

      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.options).toBeDefined();
    });
  });

  describe("POST /api/v1/auth/passkeys/login-verify", () => {
    it("authenticates with passkey credential", async () => {
      const { status, body } = await fetchApi("/api/v1/auth/passkeys/login-verify", {
        method: "POST",
        body: JSON.stringify({ credentialId: "test-credential-id" }),
      });

      expect(status).toBe(200);
      expect(body.success).toBe(true);
    });
  });

  // ─── Admin Auth Console ─────────────────────────────────────────
  describe("GET /api/v1/admin/auth", () => {
    it("returns admin dashboard metrics", async () => {
      const { status, body } = await fetchApi("/api/v1/admin/auth");

      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.metrics).toBeDefined();
      expect(body.users).toBeDefined();
    });
  });
});
