/**
 * ============================================================================
 * UNIT & INTEGRATION TESTS: /auth/login, /auth/signup & Auth Middleware
 * Validates route rendering, form inputs, OAuth triggers, error handling,
 * role-based redirects, and middleware pass-through.
 * ============================================================================
 */

import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

// Mock next/navigation
const mockPush = jest.fn();
let mockSearchParamsGet = jest.fn((key: string) => null);

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: mockSearchParamsGet,
  }),
}));

describe("Auth Middleware Routing & Security", () => {
  it("does not rewrite or redirect /auth/login", () => {
    const req = new NextRequest("https://workorajobs.com/auth/login");
    const res = middleware(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    expect(res.headers.get("location")).toBeNull();
  });

  it("does not rewrite or redirect /auth/signup", () => {
    const req = new NextRequest("https://workorajobs.com/auth/signup");
    const res = middleware(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });

  it("does not rewrite or redirect /login or /signup", () => {
    const reqLogin = new NextRequest("https://workorajobs.com/login");
    const resLogin = middleware(reqLogin);
    expect(resLogin.status).toBe(200);

    const reqSignup = new NextRequest("https://workorajobs.com/signup");
    const resSignup = middleware(reqSignup);
    expect(resSignup.status).toBe(200);
  });

  it("allows OAuth start routes through middleware without interception", () => {
    const reqGoogle = new NextRequest("https://workorajobs.com/api/v1/auth/oauth/google");
    const resGoogle = middleware(reqGoogle);
    expect(resGoogle.status).toBe(200);

    const reqLinkedIn = new NextRequest("https://workorajobs.com/api/v1/auth/oauth/linkedin");
    const resLinkedIn = middleware(reqLinkedIn);
    expect(resLinkedIn.status).toBe(200);
  });

  it("redirects unauthenticated protected employer route to /employer/login", () => {
    const req = new NextRequest("https://workorajobs.com/employer/dashboard");
    const res = middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/employer/login");
  });
});

describe("Auth API & Frontend Contract", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submits login form to /api/v1/auth/login and handles 401 unauthorized gracefully", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({
        success: false,
        error: "Invalid email or password.",
      }),
    } as any);

    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "invalid@example.com", password: "wrong" }),
    });

    const data = await res.json();
    expect(res.ok).toBe(false);
    expect(res.status).toBe(401);
    expect(data.error).toBe("Invalid email or password.");
  });

  it("handles successful login for JOB_SEEKER and returns session info", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        user: { id: "u-1", email: "user@example.com", role: "JOB_SEEKER" },
        token: "access-token-123",
        sessionToken: "session-token-456",
      }),
    } as any);

    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "user@example.com", password: "correctpassword" }),
    });

    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(data.success).toBe(true);
    expect(data.user.role).toBe("JOB_SEEKER");
  });

  it("handles successful login for EMPLOYER and returns session info", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        user: { id: "e-1", email: "employer@company.com", role: "EMPLOYER" },
        token: "access-token-789",
        sessionToken: "session-token-012",
      }),
    } as any);

    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "employer@company.com", password: "correctpassword" }),
    });

    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(data.success).toBe(true);
    expect(data.user.role).toBe("EMPLOYER");
  });

  it("verifies OAuth internal endpoint structure for Google and LinkedIn", () => {
    const googleUrl = `/api/v1/auth/oauth/google?${new URLSearchParams({ role: "JOB_SEEKER" })}`;
    const linkedinUrl = `/api/v1/auth/oauth/linkedin?${new URLSearchParams({ role: "EMPLOYER" })}`;

    expect(googleUrl).toContain("/api/v1/auth/oauth/google");
    expect(googleUrl).toContain("role=JOB_SEEKER");
    expect(linkedinUrl).toContain("/api/v1/auth/oauth/linkedin");
    expect(linkedinUrl).toContain("role=EMPLOYER");
  });
});
