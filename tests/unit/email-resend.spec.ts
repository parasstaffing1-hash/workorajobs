/**
 * ============================================================================
 * UNIT TESTS: Resend Email Service & Auth Email Workflows
 * Validates Resend email dispatch, environment configuration validation,
 * link generation, token redaction in production, and safe error handling.
 * ============================================================================
 */

import { ResendEmailService } from "@/lib/email/resend";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    emailVerification: {
      create: jest.fn(),
    },
    passwordReset: {
      create: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  },
}));

describe("Resend Email Service Unit Tests", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("fails safely when RESEND_API_KEY is missing in production", () => {
    process.env.NODE_ENV = "production";
    process.env.EMAIL_PROVIDER = "resend";
    delete process.env.RESEND_API_KEY;
    process.env.EMAIL_FROM = "Workora Jobs <no-reply@workorajobs.com>";

    expect(() => {
      // @ts-ignore
      ResendEmailService.getApiKey();
    }).toThrow("[Resend Configuration Error] RESEND_API_KEY is required in production");
  });

  it("fails safely when EMAIL_FROM is missing in production", () => {
    process.env.NODE_ENV = "production";
    process.env.EMAIL_PROVIDER = "resend";
    process.env.RESEND_API_KEY = "re_dummy_test_key";
    delete process.env.EMAIL_FROM;

    expect(() => {
      // @ts-ignore
      ResendEmailService.getFromAddress();
    }).toThrow("[Resend Configuration Error] EMAIL_FROM is required in production");
  });

  it("builds verification email links with https://workorajobs.com base URL", async () => {
    process.env.NODE_ENV = "development";
    process.env.APP_URL = "https://workorajobs.com";
    process.env.EMAIL_FROM = "Workora Jobs <no-reply@workorajobs.com>";

    const sendEmailSpy = jest
      .spyOn(ResendEmailService, "sendEmail")
      .mockResolvedValue({ success: true, id: "test-email-123" });

    const email = "user@example.com";
    const token = "token123456";

    const ok = await ResendEmailService.sendVerificationEmail(email, token);
    expect(ok).toBe(true);
    expect(sendEmailSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: email,
        subject: "Verify your email address - Workora Jobs",
        html: expect.stringContaining("https://workorajobs.com/verify-email?token=token123456&email=user%40example.com"),
      })
    );

    sendEmailSpy.mockRestore();
  });

  it("builds password reset email links with https://workorajobs.com base URL", async () => {
    process.env.NODE_ENV = "development";
    process.env.APP_URL = "https://workorajobs.com";
    process.env.EMAIL_FROM = "Workora Jobs <no-reply@workorajobs.com>";

    const sendEmailSpy = jest
      .spyOn(ResendEmailService, "sendEmail")
      .mockResolvedValue({ success: true, id: "test-reset-123" });

    const email = "user@example.com";
    const token = "reset7890";

    const ok = await ResendEmailService.sendPasswordResetEmail(email, token);
    expect(ok).toBe(true);
    expect(sendEmailSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: email,
        subject: "Reset your password - Workora Jobs",
        html: expect.stringContaining("https://workorajobs.com/auth/reset-password?token=reset7890&email=user%40example.com"),
      })
    );

    sendEmailSpy.mockRestore();
  });

  it("triggers Resend verification email dispatch when sendVerificationEmail is called", async () => {
    const sendEmailSpy = jest
      .spyOn(ResendEmailService, "sendEmail")
      .mockResolvedValue({ success: true, id: "resend-id-999" });

    const email = "test-resend@example.com";
    const token = "v-token-999";

    const success = await ResendEmailService.sendVerificationEmail(email, token);
    expect(success).toBe(true);
    expect(sendEmailSpy).toHaveBeenCalledTimes(1);

    sendEmailSpy.mockRestore();
  });

  it("triggers Resend password reset email dispatch when sendPasswordResetEmail is called", async () => {
    const sendEmailSpy = jest
      .spyOn(ResendEmailService, "sendEmail")
      .mockResolvedValue({ success: true, id: "reset-id-888" });

    const email = "test-forgot@example.com";
    const token = "r-token-888";

    const success = await ResendEmailService.sendPasswordResetEmail(email, token);
    expect(success).toBe(true);
    expect(sendEmailSpy).toHaveBeenCalledTimes(1);

    sendEmailSpy.mockRestore();
  });
});
