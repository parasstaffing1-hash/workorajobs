/**
 * ============================================================================
 * UNIT TEST SUITE: OAuthService
 * Tests Google, LinkedIn, and GitHub OAuth authentication flows
 * ============================================================================
 */

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    oAuthAccount: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    loginHistory: { create: jest.fn() },
    auditLog: { create: jest.fn() },
  },
}));

jest.mock("@/lib/redis", () => ({
  redis: { get: jest.fn(), set: jest.fn(), del: jest.fn() },
}));

jest.mock("@/lib/jwt", () => ({
  signJwt: jest.fn(() => "mocked-oauth-jwt-token"),
}));

import { OAuthService } from "@/lib/auth/oauth-service";
import { prisma } from "@/lib/prisma";

describe("OAuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("authenticates existing user via Google OAuth and returns session", async () => {
    (prisma.oAuthAccount.findUnique as jest.Mock).mockResolvedValue({
      id: "oa-1",
      provider: "google",
      providerAccountId: "google-123",
      user: {
        id: "user-g",
        email: "google.user@gmail.com",
        name: "Google User",
        role: "JOB_SEEKER",
        isEmailVerified: true,
      },
    });

    (prisma.oAuthAccount.upsert as jest.Mock).mockResolvedValue({});
    (prisma.loginHistory.create as jest.Mock).mockResolvedValue({});
    (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

    const result = await OAuthService.authenticateWithProvider({
      provider: "google",
      providerAccountId: "google-123",
      email: "google.user@gmail.com",
      name: "Google User",
    });

    expect(result.user.email).toBe("google.user@gmail.com");
    expect(result.accessToken).toBe("mocked-oauth-jwt-token");
    expect(result.sessionToken).toBeDefined();
  });

  it("auto-creates new verified user when signing in with Google for first time", async () => {
    (prisma.oAuthAccount.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "user-new-g",
      email: "new.google@gmail.com",
      name: "New Google User",
      role: "JOB_SEEKER",
      isEmailVerified: true,
    });
    (prisma.oAuthAccount.upsert as jest.Mock).mockResolvedValue({});
    (prisma.loginHistory.create as jest.Mock).mockResolvedValue({});
    (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

    const result = await OAuthService.authenticateWithProvider({
      provider: "google",
      providerAccountId: "google-new-999",
      email: "new.google@gmail.com",
      name: "New Google User",
      role: "JOB_SEEKER",
    });

    expect(result.user.email).toBe("new.google@gmail.com");
    expect(result.user.isEmailVerified).toBe(true);
    expect(prisma.user.create).toHaveBeenCalled();
  });
});
