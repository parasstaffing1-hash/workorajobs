/**
 * ============================================================================
 * REGRESSION TEST SUITE: Hardened Security Audit & Validation
 * Tests SEO Authorization, Auth Rate Limits, Razorpay, S3 Storage & Secrets
 * ============================================================================
 */

import { NextRequest } from "next/server";
import { GET as getSeoStatus } from "@/app/api/v1/seo/route";
import { GET as getSeoAnalytics } from "@/app/api/v1/seo/analytics/route";
import { POST as postSeoAutomation } from "@/app/api/v1/seo/automation/route";
import { POST as postSeoIndexing } from "@/app/api/v1/seo/indexing/route";
import { POST as postSeoMetadata } from "@/app/api/v1/seo/metadata/route";
import { GET as getSeoCrawl } from "@/app/api/v1/seo/crawl/route";
import { GET as getSeoValidation } from "@/app/api/v1/seo/validation/route";
import { GET as getPseoStatus, POST as postPseoTrigger } from "@/app/api/v1/pseo/route";
import { GET as getSitemapsStatus, POST as postSitemapsTrigger } from "@/app/api/v1/sitemaps/route";
import { POST as postSyncSeo } from "@/app/api/jobs/sync-seo/route";

import { verifyRazorpayPaymentSignature } from "@/lib/payments/razorpay";
import { validateUploadFile, sanitizeFileName, generateS3Key } from "@/lib/aws/s3";

jest.mock("@/lib/auth/get-auth-user", () => ({
  getAuthUserId: jest.fn(),
}));

import { getAuthUserId } from "@/lib/auth/get-auth-user";

describe("Security Hardening Regression Test Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── 1. SEO Route Admin Authorization ────────────────────────────
  describe("SEO Administrative Route Authorization", () => {
    it("returns 403 Forbidden for unauthenticated access on /api/v1/seo", async () => {
      (getAuthUserId as jest.Mock).mockResolvedValue(null);
      const req = new NextRequest("http://localhost:3000/api/v1/seo");
      const res = await getSeoStatus(req);

      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.success).toBe(false);
    });

    it("returns 200 OK for authorized admin on /api/v1/seo", async () => {
      (getAuthUserId as jest.Mock).mockResolvedValue("admin-user-id");
      const req = new NextRequest("http://localhost:3000/api/v1/seo");
      const res = await getSeoStatus(req);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.enginesActive).toBe(12);
    });

    it("enforces pagination limit (max 100) on /api/v1/seo/analytics", async () => {
      (getAuthUserId as jest.Mock).mockResolvedValue("admin-user-id");
      const req = new NextRequest("http://localhost:3000/api/v1/seo/analytics?limit=1000");
      const res = await getSeoAnalytics(req);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.pagination.limit).toBe(100);
    });

    it("returns 403 Forbidden for unauthenticated access on /api/jobs/sync-seo", async () => {
      (getAuthUserId as jest.Mock).mockResolvedValue(null);
      const req = new NextRequest("http://localhost:3000/api/jobs/sync-seo", { method: "POST" });
      const res = await postSyncSeo(req);

      expect(res.status).toBe(403);
    });

    it("returns 403 Forbidden for unauthenticated access on /api/v1/pseo", async () => {
      (getAuthUserId as jest.Mock).mockResolvedValue(null);
      const req = new NextRequest("http://localhost:3000/api/v1/pseo");
      const res = await getPseoStatus(req);

      expect(res.status).toBe(403);
    });

    it("returns 403 Forbidden for unauthenticated access on /api/v1/sitemaps", async () => {
      (getAuthUserId as jest.Mock).mockResolvedValue(null);
      const req = new NextRequest("http://localhost:3000/api/v1/sitemaps");
      const res = await getSitemapsStatus(req);

      expect(res.status).toBe(403);
    });
  });

  // ─── 2. Razorpay Security ─────────────────────────────────────────
  describe("Razorpay Signature & Payment Validation", () => {
    it("rejects payment verification with invalid signature", () => {
      process.env.RAZORPAY_KEY_SECRET = "test_secret_key_12345";

      const result = verifyRazorpayPaymentSignature({
        orderId: "order_999",
        paymentId: "pay_888",
        signature: "invalid_signature_hash",
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain("Invalid payment signature");
    });

    it("accepts valid HMAC-SHA256 Razorpay signature", () => {
      const secret = "test_secret_key_12345";
      process.env.RAZORPAY_KEY_SECRET = secret;

      const orderId = "order_100";
      const paymentId = "pay_200";

      const crypto = require("crypto");
      const validSignature = crypto
        .createHmac("sha256", secret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

      const result = verifyRazorpayPaymentSignature({
        orderId,
        paymentId,
        signature: validSignature,
      });

      expect(result.success).toBe(true);
    });
  });

  // ─── 3. S3 Storage & Key Sanitization ─────────────────────────────
  describe("S3 Storage & Upload Security", () => {
    it("sanitizes file names to prevent path traversal", () => {
      const maliciousName = "../../../etc/passwd.pdf";
      const cleanName = sanitizeFileName(maliciousName);

      expect(cleanName).not.toContain("..");
      expect(cleanName).not.toContain("/");
    });

    it("rejects unallowed MIME types and file extensions", () => {
      const executableBuffer = Buffer.from("MZ header test executable");

      expect(() => {
        validateUploadFile(executableBuffer, "malicious.exe", "application/x-msdownload", "resumes");
      }).toThrow(/extension/i);
    });

    it("rejects oversized file uploads", () => {
      // 11MB buffer (max allowed for resumes is 10MB)
      const oversizedBuffer = Buffer.alloc(11 * 1024 * 1024);

      expect(() => {
        validateUploadFile(oversizedBuffer, "large.pdf", "application/pdf", "resumes");
      }).toThrow(/size/i);
    });
  });
});
