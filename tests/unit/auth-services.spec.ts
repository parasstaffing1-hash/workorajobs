/**
 * ============================================================================
 * UNIT TEST SUITE: AuthRateLimiter, RbacGuard, MfaService, PasskeyService
 * Tests rate limiting, RBAC, MFA, and passkey services
 * ============================================================================
 */

jest.mock("@/lib/prisma", () => ({
  prisma: {
    userTwoFactor: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    oAuthAccount: { create: jest.fn() },
    auditLog: { create: jest.fn() },
  },
}));

jest.mock("@/lib/redis", () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    incr: jest.fn().mockResolvedValue(1),
    expire: jest.fn().mockResolvedValue(1),
  },
}));

jest.mock("@/lib/jwt", () => ({
  signJwt: jest.fn(() => "mocked-jwt-token"),
  verifyJwt: jest.fn(),
}));

import { AuthRateLimiter } from "@/lib/auth/rate-limiter";
import { RbacGuard } from "@/lib/auth/rbac";
import { MfaService } from "@/lib/auth/mfa-service";
import { PasskeyService } from "@/lib/auth/passkey-service";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";

// ─── AuthRateLimiter ──────────────────────────────────────────────
describe("AuthRateLimiter", () => {
  beforeEach(() => jest.clearAllMocks());

  it("allows first request within rate limit window", async () => {
    (redis.incr as jest.Mock).mockResolvedValue(1);

    const result = await AuthRateLimiter.check("login", "127.0.0.1");

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
    expect(result.totalLimit).toBe(5);
  });

  it("blocks 6th attempt (exceeds 5 max attempts)", async () => {
    (redis.incr as jest.Mock).mockResolvedValue(6);

    const result = await AuthRateLimiter.check("login", "attacker@evil.com");

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("allows request at exact limit boundary (5th attempt)", async () => {
    (redis.incr as jest.Mock).mockResolvedValue(5);

    const result = await AuthRateLimiter.check("login", "test@example.com");

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("fails open (allows) when Redis is unavailable", async () => {
    (redis.incr as jest.Mock).mockRejectedValue(new Error("Redis down"));

    const result = await AuthRateLimiter.check("login", "user@example.com");

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(5);
  });

  it("sets TTL expire on first request", async () => {
    (redis.incr as jest.Mock).mockResolvedValue(1);

    await AuthRateLimiter.check("signup", "newuser@example.com", 10, 600);

    expect(redis.expire).toHaveBeenCalledWith(
      "ratelimit:signup:newuser@example.com",
      600
    );
  });

  it("resets rate limit counter for a key", async () => {
    (redis.del as jest.Mock).mockResolvedValue(1);

    await AuthRateLimiter.reset("login", "user@example.com");

    expect(redis.del).toHaveBeenCalledWith("ratelimit:login:user@example.com");
  });

  it("normalizes key to lowercase", async () => {
    (redis.incr as jest.Mock).mockResolvedValue(1);

    await AuthRateLimiter.check("login", "USER@EXAMPLE.COM");

    expect(redis.incr).toHaveBeenCalledWith("ratelimit:login:user@example.com");
  });
});

// ─── RbacGuard ────────────────────────────────────────────────────
describe("RbacGuard", () => {
  describe("isAdmin", () => {
    it("returns true for ADMIN role", () => {
      expect(RbacGuard.isAdmin("ADMIN")).toBe(true);
    });

    it("returns false for non-ADMIN roles", () => {
      expect(RbacGuard.isAdmin("JOB_SEEKER")).toBe(false);
      expect(RbacGuard.isAdmin("EMPLOYER")).toBe(false);
      expect(RbacGuard.isAdmin("USER")).toBe(false);
    });

    it("returns false for undefined role", () => {
      expect(RbacGuard.isAdmin(undefined)).toBe(false);
    });
  });

  describe("isEmployerOrAdmin", () => {
    it("returns true for EMPLOYER role", () => {
      expect(RbacGuard.isEmployerOrAdmin("EMPLOYER")).toBe(true);
    });

    it("returns true for ADMIN role", () => {
      expect(RbacGuard.isEmployerOrAdmin("ADMIN")).toBe(true);
    });

    it("returns true for RECRUITER role", () => {
      expect(RbacGuard.isEmployerOrAdmin("RECRUITER")).toBe(true);
    });

    it("returns false for JOB_SEEKER role", () => {
      expect(RbacGuard.isEmployerOrAdmin("JOB_SEEKER")).toBe(false);
    });
  });

  describe("isJobSeeker", () => {
    it("returns true for JOB_SEEKER role", () => {
      expect(RbacGuard.isJobSeeker("JOB_SEEKER")).toBe(true);
    });

    it("returns true for USER role (fallback)", () => {
      expect(RbacGuard.isJobSeeker("USER")).toBe(true);
    });

    it("returns true for ADMIN role (superuser access)", () => {
      expect(RbacGuard.isJobSeeker("ADMIN")).toBe(true);
    });

    it("returns false for EMPLOYER role", () => {
      expect(RbacGuard.isJobSeeker("EMPLOYER")).toBe(false);
    });
  });

  describe("canAccessResource", () => {
    it("allows admin to access any resource", () => {
      expect(RbacGuard.canAccessResource("admin-1", "ADMIN", "other-user")).toBe(true);
    });

    it("allows user to access own resource", () => {
      expect(RbacGuard.canAccessResource("user-1", "JOB_SEEKER", "user-1")).toBe(true);
    });

    it("denies user from accessing another user's resource", () => {
      expect(RbacGuard.canAccessResource("user-1", "JOB_SEEKER", "user-2")).toBe(false);
    });
  });
});

// ─── MfaService ───────────────────────────────────────────────────
describe("MfaService", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("setupMfa", () => {
    it("generates TOTP secret and 8 recovery codes", async () => {
      (prisma.userTwoFactor.upsert as jest.Mock).mockResolvedValue({});

      const result = await MfaService.setupMfa("user-1", "user@example.com");

      expect(result.secret).toBeDefined();
      expect(result.secret.length).toBe(40); // 20 bytes hex uppercase
      expect(result.recoveryCodes).toHaveLength(8);
      expect(result.qrCodeUri).toContain("otpauth://totp/WorkoraJobs:");
      expect(result.qrCodeUri).toContain("user%40example.com");
    });

    it("generates unique recovery codes", async () => {
      (prisma.userTwoFactor.upsert as jest.Mock).mockResolvedValue({});

      const result = await MfaService.setupMfa("user-1", "test@example.com");
      const uniqueCodes = new Set(result.recoveryCodes);
      expect(uniqueCodes.size).toBe(result.recoveryCodes.length);
    });
  });

  describe("verifyMfa", () => {
    it("rejects code shorter than 6 digits", async () => {
      await expect(MfaService.verifyMfa("user-1", "123")).rejects.toThrow();
    });

    it("rejects empty code", async () => {
      await expect(MfaService.verifyMfa("user-1", "")).rejects.toThrow();
    });

    it("accepts valid 6-digit code", async () => {
      const result = await MfaService.verifyMfa("user-1", "123456");
      expect(result.success).toBe(true);
    });
  });

  describe("verifyRecoveryCode", () => {
    it("validates and consumes a valid recovery code", async () => {
      (prisma.userTwoFactor.findUnique as jest.Mock).mockResolvedValue({
        userId: "user-1",
        backupCodes: ["AABBCCDD", "11223344", "EEFF0011"],
      });
      (prisma.userTwoFactor.update as jest.Mock).mockResolvedValue({});

      const result = await MfaService.verifyRecoveryCode("user-1", "AABBCCDD");
      expect(result.success).toBe(true);
    });
  });

  describe("emergencyDisableMfa", () => {
    it("disables MFA and creates audit log", async () => {
      (prisma.userTwoFactor.update as jest.Mock).mockResolvedValue({});
      (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await MfaService.emergencyDisableMfa("target-user", "admin-user");
      expect(result.success).toBe(true);
    });
  });
});

// ─── PasskeyService ───────────────────────────────────────────────
describe("PasskeyService", () => {
  describe("generateRegistrationOptions", () => {
    it("returns valid WebAuthn registration options", async () => {
      const options = await PasskeyService.generateRegistrationOptions("user-1", "user@example.com");

      expect(options.challenge).toBeDefined();
      expect(options.rp.name).toBe("WorkoraJobs Enterprise");
      expect(options.user.name).toBe("user@example.com");
      expect(options.pubKeyCredParams).toHaveLength(2);
      expect(options.pubKeyCredParams[0].alg).toBe(-7); // ES256
      expect(options.pubKeyCredParams[1].alg).toBe(-257); // RS256
      expect(options.authenticatorSelection?.userVerification).toBe("preferred");
    });
  });

  describe("registerPasskey", () => {
    it("stores passkey credential and returns ID", async () => {
      (prisma.oAuthAccount.create as jest.Mock).mockResolvedValue({ id: "pk-123" });

      const result = await PasskeyService.registerPasskey(
        "user-1",
        "Windows Hello",
        "cred-abc",
        "pubkey-xyz"
      );

      expect(result.success).toBe(true);
      expect(result.passkeyId).toBeDefined();
    });
  });

  describe("verifyPasskeyLogin", () => {
    it("returns session token and user on successful verification", async () => {
      const result = await PasskeyService.verifyPasskeyLogin("cred-abc");

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.sessionToken).toBeDefined();
      expect(result.user.role).toBe("EMPLOYER");
    });
  });
});
