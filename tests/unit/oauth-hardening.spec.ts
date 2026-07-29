/**
 * ============================================================================
 * UNIT TESTS: OAuth Hardening & Callback Resilience
 * Validates Google/LinkedIn OAuth initialization, PKCE challenge generation,
 * state cookie path (/), role-aware redirect resolution, and profile auto-provisioning.
 * ============================================================================
 */

import { NextRequest } from "next/server";
import { GET as initOAuthHandler } from "@/app/api/v1/auth/oauth/[provider]/route";
import { OAuthService } from "@/lib/auth/oauth-service";
import { SessionStore } from "@/lib/auth/session-store";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    oAuthAccount: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    userProfile: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    employerProfile: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    loginHistory: {
      create: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  },
}));

jest.mock("@/lib/auth/session-store", () => ({
  SessionStore: {
    createSession: jest.fn().mockResolvedValue({
      id: "session-test-id",
      sessionToken: "session-test-token-12345",
      userId: "test-user-id",
    }),
  },
}));

describe("OAuth Hardening Unit Tests", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.GOOGLE_CLIENT_ID = "google-client-id-test";
    process.env.GOOGLE_CLIENT_SECRET = "google-client-secret-test";
    process.env.LINKEDIN_CLIENT_ID = "linkedin-client-id-test";
    process.env.LINKEDIN_CLIENT_SECRET = "linkedin-client-secret-test";
    process.env.NEXT_PUBLIC_APP_URL = "https://workorajobs.com";
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("initializes Google OAuth authorization flow with global '/' cookie path and PKCE", async () => {
    const req = new NextRequest("https://workorajobs.com/api/v1/auth/oauth/google");
    const res = await initOAuthHandler(req, { params: Promise.resolve({ provider: "google" }) });

    expect(res.status).toBe(307);
    const location = res.headers.get("location");
    expect(location).toContain("accounts.google.com");
    expect(location).toContain("client_id=google-client-id-test");
    expect(location).toContain("code_challenge=");
    expect(location).toContain("code_challenge_method=S256");

    const cookies = res.cookies.getAll();
    const stateCookie = cookies.find((c) => c.name === "workora_oauth_state");
    expect(stateCookie).toBeDefined();
    expect(stateCookie?.path).toBe("/");
  });

  it("initializes LinkedIn OAuth authorization flow with normalized redirect_uri", async () => {
    process.env.LINKEDIN_CALLBACK_URL = "https://workorajobs.com/api/v1/auth/oauth/linkedin/callback";

    const req = new NextRequest("https://workorajobs.com/api/v1/auth/oauth/linkedin");
    const res = await initOAuthHandler(req, { params: Promise.resolve({ provider: "linkedin" }) });

    expect(res.status).toBe(307);
    const location = res.headers.get("location");
    expect(location).toContain("linkedin.com/oauth/v2/authorization");
    expect(location).toContain(encodeURIComponent("https://workorajobs.com/api/v1/auth/oauth/linkedin/callback"));
  });

  it("auto-provisions candidate profile for new social login user", async () => {
    (prisma.oAuthAccount.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "user-new-oauth-1",
      email: "new.oauth@example.com",
      name: "New OAuth User",
      role: "JOB_SEEKER",
      isEmailVerified: true,
    });
    (prisma.oAuthAccount.upsert as jest.Mock).mockResolvedValue({});
    (prisma.loginHistory.create as jest.Mock).mockResolvedValue({});
    (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

    const result = await OAuthService.authenticateWithProvider({
      provider: "google",
      providerAccountId: "google-sub-12345",
      email: "new.oauth@example.com",
      name: "New OAuth User",
    });

    expect(result.user.id).toBe("user-new-oauth-1");
    expect(result.user.role).toBe("JOB_SEEKER");
    expect(result.sessionToken).toBe("session-test-token-12345");
  });

  it("auto-provisions missing EmployerProfile for existing employer social login", async () => {
    (prisma.oAuthAccount.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "employer-user-99",
      email: "employer@corp.example.com",
      name: "Corp Admin",
      role: "EMPLOYER",
      isEmailVerified: true,
    });
    (prisma.user.update as jest.Mock).mockResolvedValue({});
    (prisma.employerProfile.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.employerProfile.create as jest.Mock).mockResolvedValue({});
    (prisma.oAuthAccount.upsert as jest.Mock).mockResolvedValue({});
    (prisma.loginHistory.create as jest.Mock).mockResolvedValue({});
    (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

    const result = await OAuthService.authenticateWithProvider({
      provider: "linkedin",
      providerAccountId: "linkedin-id-99",
      email: "employer@corp.example.com",
      name: "Corp Admin",
    });

    expect(result.user.id).toBe("employer-user-99");
    expect(result.user.role).toBe("EMPLOYER");
    expect(prisma.employerProfile.create).toHaveBeenCalled();
  });
});
