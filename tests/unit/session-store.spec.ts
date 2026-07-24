/**
 * ============================================================================
 * UNIT TEST SUITE: SessionStore
 * Tests session creation, retrieval, revocation, and user-agent parsing
 * ============================================================================
 */

// Mock dependencies before imports
jest.mock("@/lib/prisma", () => ({
  prisma: {
    userSession: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      updateMany: jest.fn(),
    },
  },
}));

jest.mock("@/lib/redis", () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  },
}));

import { SessionStore, SessionData } from "@/lib/auth/session-store";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

describe("SessionStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── parseUserAgent ──────────────────────────────────────────────
  describe("parseUserAgent", () => {
    it("detects Chrome on Windows Desktop", () => {
      const ua = "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/120.0";
      const result = SessionStore.parseUserAgent(ua);
      expect(result.browser).toBe("Chrome");
      expect(result.os).toBe("Windows");
      expect(result.deviceType).toBe("Desktop");
    });

    it("detects Safari on macOS Desktop", () => {
      const ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/605 Safari/605";
      const result = SessionStore.parseUserAgent(ua);
      expect(result.browser).toBe("Safari");
      expect(result.os).toBe("macOS");
      expect(result.deviceType).toBe("Desktop");
    });

    it("detects Firefox on Linux Desktop", () => {
      const ua = "Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko Firefox/120.0";
      const result = SessionStore.parseUserAgent(ua);
      expect(result.browser).toBe("Firefox");
      expect(result.os).toBe("Linux");
      expect(result.deviceType).toBe("Desktop");
    });

    it("detects Mobile device type from user-agent", () => {
      const ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit Mobile Safari";
      const result = SessionStore.parseUserAgent(ua);
      expect(result.deviceType).toBe("Mobile");
      expect(result.os).toBe("iOS");
    });

    it("detects Tablet device type from user-agent", () => {
      const ua = "Mozilla/5.0 (iPad; Tablet CPU OS) AppleWebKit Mobile";
      const result = SessionStore.parseUserAgent(ua);
      expect(result.deviceType).toBe("Tablet");
    });

    it("returns Unknown for empty user-agent", () => {
      const result = SessionStore.parseUserAgent("");
      expect(result.browser).toBe("Unknown Browser");
      expect(result.os).toBe("Unknown OS");
      expect(result.deviceType).toBe("Desktop");
    });

    it("detects Android mobile device", () => {
      const ua = "Mozilla/5.0 (Linux; Android 14; Mobile) Chrome/120";
      const result = SessionStore.parseUserAgent(ua);
      expect(result.os).toBe("Android");
      expect(result.deviceType).toBe("Mobile");
    });
  });

  // ─── createSession ──────────────────────────────────────────────
  describe("createSession", () => {
    it("generates a 64-character hex session token", async () => {
      (prisma.userSession.create as jest.Mock).mockResolvedValue({ id: "sess-1" });
      (redis.set as jest.Mock).mockResolvedValue("OK");

      const result = await SessionStore.createSession({
        userId: "user-1",
        email: "test@example.com",
        role: "JOB_SEEKER",
      });

      expect(result.sessionToken).toBeDefined();
      expect(result.sessionToken.length).toBe(64); // 32 bytes = 64 hex chars
      expect(result.expiresAt).toBeInstanceOf(Date);
    });

    it("sets 30-day expiration when rememberMe is true", async () => {
      (prisma.userSession.create as jest.Mock).mockResolvedValue({ id: "sess-2" });
      (redis.set as jest.Mock).mockResolvedValue("OK");

      const result = await SessionStore.createSession({
        userId: "user-1",
        email: "test@example.com",
        role: "EMPLOYER",
        rememberMe: true,
      });

      const diffMs = result.expiresAt.getTime() - Date.now();
      const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));
      expect(diffDays).toBe(30);
    });

    it("sets 1-day expiration when rememberMe is false", async () => {
      (prisma.userSession.create as jest.Mock).mockResolvedValue({ id: "sess-3" });
      (redis.set as jest.Mock).mockResolvedValue("OK");

      const result = await SessionStore.createSession({
        userId: "user-1",
        email: "test@example.com",
        role: "JOB_SEEKER",
        rememberMe: false,
      });

      const diffMs = result.expiresAt.getTime() - Date.now();
      const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));
      expect(diffDays).toBe(1);
    });

    it("succeeds even when DB write fails (fault tolerance)", async () => {
      (prisma.userSession.create as jest.Mock).mockRejectedValue(new Error("DB offline"));
      (redis.set as jest.Mock).mockRejectedValue(new Error("Redis offline"));

      const result = await SessionStore.createSession({
        userId: "user-1",
        email: "fallback@example.com",
        role: "JOB_SEEKER",
      });

      expect(result.sessionToken).toBeDefined();
      expect(result.sessionToken.length).toBe(64);
    });
  });

  // ─── getSession ─────────────────────────────────────────────────
  describe("getSession", () => {
    it("returns null for empty session token", async () => {
      const result = await SessionStore.getSession("");
      expect(result).toBeNull();
    });

    it("retrieves session from Redis cache first", async () => {
      const mockSession: SessionData = {
        sessionId: "sess-1",
        userId: "user-1",
        email: "test@example.com",
        role: "JOB_SEEKER",
        deviceType: "Desktop",
        browser: "Chrome",
        os: "Windows",
        ipAddress: "127.0.0.1",
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        isRevoked: false,
      };

      (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(mockSession));

      const result = await SessionStore.getSession("valid-token");
      expect(result).not.toBeNull();
      expect(result!.userId).toBe("user-1");
      expect(result!.email).toBe("test@example.com");
      expect(prisma.userSession.findUnique).not.toHaveBeenCalled();
    });

    it("returns null for revoked session in Redis", async () => {
      const revokedSession: SessionData = {
        sessionId: "sess-revoked",
        userId: "user-1",
        email: "test@example.com",
        role: "JOB_SEEKER",
        deviceType: "Desktop",
        browser: "Chrome",
        os: "Windows",
        ipAddress: "127.0.0.1",
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        isRevoked: true,
      };

      (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(revokedSession));

      const result = await SessionStore.getSession("revoked-token");
      expect(result).toBeNull();
    });

    it("returns null for expired session in Redis", async () => {
      const expiredSession: SessionData = {
        sessionId: "sess-expired",
        userId: "user-1",
        email: "test@example.com",
        role: "JOB_SEEKER",
        deviceType: "Desktop",
        browser: "Chrome",
        os: "Windows",
        ipAddress: "127.0.0.1",
        expiresAt: new Date(Date.now() - 86400000).toISOString(), // expired yesterday
        isRevoked: false,
      };

      (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(expiredSession));

      const result = await SessionStore.getSession("expired-token");
      expect(result).toBeNull();
    });

    it("provides dev fallback session for long tokens when DB is offline", async () => {
      (redis.get as jest.Mock).mockRejectedValue(new Error("Redis down"));
      (prisma.userSession.findUnique as jest.Mock).mockRejectedValue(new Error("DB down"));

      const result = await SessionStore.getSession("dev-very-long-fallback-token-string");
      expect(result).not.toBeNull();
      expect(result!.userId).toBe("demo-user-id");
    });
  });

  // ─── revokeSession ──────────────────────────────────────────────
  describe("revokeSession", () => {
    it("does nothing for empty token", async () => {
      await SessionStore.revokeSession("");
      expect(redis.del).not.toHaveBeenCalled();
      expect(prisma.userSession.updateMany).not.toHaveBeenCalled();
    });

    it("deletes from Redis and marks revoked in DB", async () => {
      (redis.del as jest.Mock).mockResolvedValue(1);
      (prisma.userSession.updateMany as jest.Mock).mockResolvedValue({ count: 1 });

      await SessionStore.revokeSession("target-session-token");

      expect(redis.del).toHaveBeenCalledWith("session:target-session-token");
    });

    it("succeeds even when Redis and DB both fail", async () => {
      (redis.del as jest.Mock).mockRejectedValue(new Error("Redis offline"));
      (prisma.userSession.updateMany as jest.Mock).mockRejectedValue(new Error("DB offline"));

      await expect(SessionStore.revokeSession("some-token")).resolves.toBeUndefined();
    });
  });

  // ─── revokeAllOtherSessions ─────────────────────────────────────
  describe("revokeAllOtherSessions", () => {
    it("revokes all other sessions except current", async () => {
      (prisma.userSession.findMany as jest.Mock).mockResolvedValue([
        { sessionToken: "other-1" },
        { sessionToken: "other-2" },
      ]);
      (redis.del as jest.Mock).mockResolvedValue(1);
      (prisma.userSession.updateMany as jest.Mock).mockResolvedValue({ count: 2 });

      await SessionStore.revokeAllOtherSessions("user-1", "current-token");

      expect(redis.del).toHaveBeenCalledWith("session:other-1");
      expect(redis.del).toHaveBeenCalledWith("session:other-2");
    });
  });
});
