/**
 * ============================================================================
 * UNIT TEST SUITE: EnterpriseAuthController
 * Tests signup, login, password reset, email verification flows
 * ============================================================================
 */

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    passwordReset: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    loginHistory: {
      create: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  },
}));

jest.mock("@/lib/redis", () => ({
  redis: { get: jest.fn(), set: jest.fn(), del: jest.fn(), incr: jest.fn(), expire: jest.fn() },
}));

jest.mock("@/lib/jwt", () => ({
  signJwt: jest.fn(() => "mocked-jwt-token"),
  verifyJwt: jest.fn(() => ({ userId: "user-1", email: "test@example.com", role: "JOB_SEEKER" })),
}));

import { EnterpriseAuthController, SignupInput, LoginInput } from "@/lib/auth/enterprise-auth-controller";
import { prisma } from "@/lib/prisma";

describe("EnterpriseAuthController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Signup ─────────────────────────────────────────────────────
  describe("signup", () => {
    const validSignup: SignupInput = {
      email: "newuser@example.com",
      password: "SecureP@ss123!",
      role: "JOB_SEEKER",
      name: "New User",
    };

    it("creates a new JOB_SEEKER account and returns session token", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: "user-new",
        email: "newuser@example.com",
        name: "New User",
        role: "JOB_SEEKER",
        isEmailVerified: false,
      });
      (prisma.passwordReset.create as jest.Mock).mockResolvedValue({});
      (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await EnterpriseAuthController.signup(validSignup);

      expect(result.user.email).toBe("newuser@example.com");
      expect(result.user.role).toBe("JOB_SEEKER");
      expect(result.sessionToken).toBeDefined();
      expect(result.accessToken).toBe("mocked-jwt-token");
      expect(result.refreshToken).toBeDefined();
      expect(result.refreshToken.length).toBe(80); // 40 bytes = 80 hex chars
      expect(result.verificationToken).toBeDefined();
    });

    it("creates an EMPLOYER account with employer profile", async () => {
      const employerSignup: SignupInput = {
        email: "employer@acme.com",
        password: "SecureP@ss123!",
        role: "EMPLOYER",
        companyName: "Acme Corp",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: "user-emp",
        email: "employer@acme.com",
        name: "Acme Corp",
        role: "EMPLOYER",
        isEmailVerified: false,
      });
      (prisma.passwordReset.create as jest.Mock).mockResolvedValue({});
      (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await EnterpriseAuthController.signup(employerSignup);

      expect(result.user.role).toBe("EMPLOYER");
      expect(result.user.name).toBe("Acme Corp");
    });

    it("throws error for duplicate email registration", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "existing-user",
        email: "existing@example.com",
      });

      await expect(
        EnterpriseAuthController.signup({
          ...validSignup,
          email: "existing@example.com",
        })
      ).rejects.toThrow("An account with this email address already exists.");
    });

    it("normalizes email to lowercase", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: "user-norm",
        email: "uppercase@example.com",
        name: "Test",
        role: "JOB_SEEKER",
        isEmailVerified: false,
      });
      (prisma.passwordReset.create as jest.Mock).mockResolvedValue({});
      (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await EnterpriseAuthController.signup({
        ...validSignup,
        email: "UPPERCASE@EXAMPLE.COM",
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: "uppercase@example.com" },
        })
      );
    });

    it("generates a 64-character verification token", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: "user-vt",
        email: "verify@example.com",
        name: "Verify User",
        role: "JOB_SEEKER",
        isEmailVerified: false,
      });
      (prisma.passwordReset.create as jest.Mock).mockResolvedValue({});
      (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await EnterpriseAuthController.signup(validSignup);
      expect(result.verificationToken.length).toBe(64);
    });
  });

  // ─── Login ──────────────────────────────────────────────────────
  describe("login", () => {
    it("authenticates valid credentials and returns session", async () => {
      const bcrypt = require("bcryptjs");
      const hash = await bcrypt.hash("SecureP@ss123!", 12);

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        role: "JOB_SEEKER",
        isEmailVerified: true,
        passwordHash: hash,
      });
      (prisma.loginHistory.create as jest.Mock).mockResolvedValue({});
      (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await EnterpriseAuthController.login({
        email: "test@example.com",
        password: "SecureP@ss123!",
      });

      expect(result.user.email).toBe("test@example.com");
      expect(result.sessionToken).toBeDefined();
      expect(result.accessToken).toBe("mocked-jwt-token");
    });

    it("throws error for invalid password", async () => {
      const bcrypt = require("bcryptjs");
      const hash = await bcrypt.hash("correct-password", 12);

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        passwordHash: hash,
      });
      (prisma.loginHistory.create as jest.Mock).mockResolvedValue({});

      await expect(
        EnterpriseAuthController.login({
          email: "test@example.com",
          password: "wrong-password",
        })
      ).rejects.toThrow("Invalid email address or password.");
    });

    it("records failed login attempt in LoginHistory", async () => {
      const bcrypt = require("bcryptjs");
      const hash = await bcrypt.hash("correct-password", 12);

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        passwordHash: hash,
      });
      (prisma.loginHistory.create as jest.Mock).mockResolvedValue({});

      try {
        await EnterpriseAuthController.login({
          email: "test@example.com",
          password: "wrong-password",
        });
      } catch (_) {}

      expect(prisma.loginHistory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: "FAILED_INVALID_PASSWORD",
          }),
        })
      );
    });
  });

  // ─── Password Reset ─────────────────────────────────────────────
  describe("requestPasswordReset", () => {
    it("generates a 64-character reset token", async () => {
      (prisma.passwordReset.create as jest.Mock).mockResolvedValue({});

      const result = await EnterpriseAuthController.requestPasswordReset("user@example.com");

      expect(result.success).toBe(true);
      expect(result.resetToken).toBeDefined();
      expect(result.resetToken.length).toBe(64);
    });

    it("normalizes email to lowercase", async () => {
      (prisma.passwordReset.create as jest.Mock).mockResolvedValue({});

      await EnterpriseAuthController.requestPasswordReset("USER@EXAMPLE.COM");

      expect(prisma.passwordReset.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: "user@example.com",
          }),
        })
      );
    });

    it("sets 1-hour expiration on reset token", async () => {
      (prisma.passwordReset.create as jest.Mock).mockResolvedValue({});

      await EnterpriseAuthController.requestPasswordReset("user@example.com");

      const callArgs = (prisma.passwordReset.create as jest.Mock).mock.calls[0][0].data;
      const expiresAt = new Date(callArgs.expiresAt);
      const diffMinutes = Math.round((expiresAt.getTime() - Date.now()) / (60 * 1000));
      expect(diffMinutes).toBeGreaterThanOrEqual(58);
      expect(diffMinutes).toBeLessThanOrEqual(61);
    });
  });

  // ─── Email Verification ─────────────────────────────────────────
  describe("verifyEmail", () => {
    it("marks user email as verified when valid token is provided", async () => {
      const crypto = require("crypto");
      const rawToken = "verification-token-123";
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

      (prisma.passwordReset.findFirst as jest.Mock).mockResolvedValue({
        id: "record-1",
        email: "user@example.com",
        tokenHash,
        isUsed: false,
        expiresAt: new Date(Date.now() + 86400000),
      });
      (prisma.user.update as jest.Mock).mockResolvedValue({});
      (prisma.passwordReset.update as jest.Mock).mockResolvedValue({});

      const result = await EnterpriseAuthController.verifyEmail(rawToken);

      expect(result.success).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            isEmailVerified: true,
          }),
        })
      );
    });
  });
});
