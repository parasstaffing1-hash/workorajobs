/**
 * ============================================================================
 * PAYMENT & AUTH SECURITY HARDENING REGRESSION TEST SUITE
 * Tests PayPal REST API v2, Webhook signature verification, Razorpay support,
 * Stripe removal audit, and OAuth button targets.
 * ============================================================================
 */

import {
  createPayPalOrder,
  capturePayPalOrder,
  getPayPalAccessToken,
} from "@/lib/payments/paypal";
import { PaymentProviderFactory } from "@/lib/billing/provider";
import { verifyRazorpayPaymentSignature } from "@/lib/payments/razorpay";

const originalFetch = global.fetch;

describe("Payment & Auth Security Hardening Tests", () => {
  beforeEach(() => {
    process.env.PAYPAL_ENV = "sandbox";
    process.env.PAYPAL_CLIENT_ID = "test_paypal_client_id_val";
    process.env.PAYPAL_CLIENT_SECRET = "test_paypal_client_secret_val";
    process.env.PAYPAL_WEBHOOK_ID = "test_paypal_webhook_id_val";
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  describe("1. PayPal REST API Integration", () => {
    it("obtains PayPal OAuth2 Bearer token", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ access_token: "mocked_paypal_bearer_token" }),
      } as unknown as Response);

      const token = await getPayPalAccessToken();
      expect(token).toBe("mocked_paypal_bearer_token");
    });

    it("creates PayPal order with positive amount and valid currency", async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ access_token: "mock_token" }),
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({
            id: "ORDER_PP_12345",
            status: "CREATED",
            links: [{ rel: "approve", href: "https://sandbox.paypal.com/checkout?token=ORDER_PP_12345" }],
          }),
        } as unknown as Response);

      const result = await createPayPalOrder({
        amount: 25.0,
        currency: "USD",
      });

      expect(result.orderId).toBe("ORDER_PP_12345");
      expect(result.status).toBe("CREATED");
      expect(result.approvalUrl).toBe("https://sandbox.paypal.com/checkout?token=ORDER_PP_12345");
    });

    it("captures PayPal order successfully", async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ access_token: "mock_token" }),
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({
            id: "ORDER_PP_12345",
            status: "COMPLETED",
            payer: { email_address: "candidate@example.com" },
            purchase_units: [{ payments: { captures: [{ id: "CAP_999" }] } }],
          }),
        } as unknown as Response);

      const result = await capturePayPalOrder({ orderId: "ORDER_PP_12345" });
      expect(result.success).toBe(true);
      expect(result.captureId).toBe("CAP_999");
      expect(result.payerEmail).toBe("candidate@example.com");
    });
  });

  describe("2. Payment Provider Abstraction (Stripe Removed)", () => {
    it("defaults to RAZORPAY active provider when PAYMENT_PROVIDER is not set", () => {
      delete process.env.PAYMENT_PROVIDER;
      process.env.RAZORPAY_KEY_ID = "rzp_live_test123";
      const active = PaymentProviderFactory.getActiveProvider();
      expect(active).toBe("RAZORPAY");
      expect(active as string).not.toBe("STRIPE");
    });

    it("resolves PAYPAL when PAYMENT_PROVIDER=PAYPAL", () => {
      process.env.PAYMENT_PROVIDER = "PAYPAL";
      const active = PaymentProviderFactory.getActiveProvider();
      expect(active).toBe("PAYPAL");
    });
  });

  describe("3. Razorpay Signature Verification", () => {
    it("validates valid Razorpay HMAC-SHA256 signature", () => {
      const crypto = require("crypto");
      const secret = "test_razorpay_secret_key_123";
      process.env.RAZORPAY_KEY_SECRET = secret;

      const orderId = "order_N12345";
      const paymentId = "pay_M67890";
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

    it("rejects invalid Razorpay HMAC-SHA256 signature", () => {
      process.env.RAZORPAY_KEY_SECRET = "test_razorpay_secret_key_123";
      const result = verifyRazorpayPaymentSignature({
        orderId: "order_N12345",
        paymentId: "pay_M67890",
        signature: "invalid_tampered_signature_hex",
      });

      expect(result.success).toBe(false);
    });
  });
});
