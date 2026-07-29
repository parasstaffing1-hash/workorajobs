/**
 * ============================================================================
 * UNIT TEST SUITE: PayPal Payment Gateway Service
 * Tests PayPal Access Token, Order Creation, Capture, Validation, Mode Checks & Webhook Verification
 * ============================================================================
 */

import {
  createPayPalOrder,
  capturePayPalOrder,
  getPayPalAccessToken,
  verifyPayPalWebhookSignature,
  getPayPalApiBase,
} from "@/lib/payments/paypal";

const originalFetch = global.fetch;

describe("PayPal Payment Service Unit Tests", () => {
  beforeEach(() => {
    process.env.PAYPAL_MODE = "sandbox";
    process.env.PAYPAL_CLIENT_ID = "test_paypal_client_id_12345";
    process.env.PAYPAL_CLIENT_SECRET = "test_paypal_client_secret_67890";
    process.env.PAYPAL_WEBHOOK_ID = "test_webhook_id_99999";
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    delete process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("throws error if PayPal client credentials are missing", async () => {
    delete process.env.PAYPAL_CLIENT_ID;
    delete process.env.PAYPAL_CLIENT_SECRET;

    await expect(getPayPalAccessToken()).rejects.toThrow("[PayPal Config Error]");
  });

  it("does NOT fall back to NEXT_PUBLIC_PAYPAL_CLIENT_ID for server authorization", async () => {
    delete process.env.PAYPAL_CLIENT_ID;
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = "public_client_id_attempt";

    await expect(getPayPalAccessToken()).rejects.toThrow("[PayPal Config Error]");
  });

  it("throws error if PAYPAL_MODE is invalid", () => {
    process.env.PAYPAL_MODE = "invalid_mode_string";
    expect(() => getPayPalApiBase()).toThrow("[PayPal Config Error]");
  });

  it("returns sandbox endpoint when PAYPAL_MODE=sandbox", () => {
    process.env.PAYPAL_MODE = "sandbox";
    expect(getPayPalApiBase()).toBe("https://api-m.sandbox.paypal.com");
  });

  it("returns live endpoint when PAYPAL_MODE=live", () => {
    process.env.PAYPAL_MODE = "live";
    expect(getPayPalApiBase()).toBe("https://api-m.paypal.com");
  });

  it("retrieves OAuth2 access token from PayPal REST API", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        access_token: "mock_paypal_bearer_access_token_abc123",
        token_type: "Bearer",
        expires_in: 32400,
      }),
    } as unknown as Response);

    const token = await getPayPalAccessToken();
    expect(token).toBe("mock_paypal_bearer_access_token_abc123");
  });

  it("creates a PayPal order with valid amount and currency", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ access_token: "token_123" }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: "PAYPAL_ORDER_999",
          status: "CREATED",
          links: [
            { rel: "payer-action", href: "https://www.sandbox.paypal.com/checkoutnow?token=PAYPAL_ORDER_999" },
          ],
        }),
      } as unknown as Response);

    const result = await createPayPalOrder({
      amount: 49.99,
      currency: "USD",
      description: "Workora Premium Candidate Plan",
    });

    expect(result.orderId).toBe("PAYPAL_ORDER_999");
    expect(result.status).toBe("CREATED");
    expect(result.approvalUrl).toContain("PAYPAL_ORDER_999");
    expect(result.amount).toBe(49.99);
    expect(result.currency).toBe("USD");
  });

  it("rejects order creation with negative or zero amount", async () => {
    await expect(createPayPalOrder({ amount: -10 })).rejects.toThrow("[PayPal Validation Error]");
    await expect(createPayPalOrder({ amount: 0 })).rejects.toThrow("[PayPal Validation Error]");
  });

  it("rejects unsupported currency", async () => {
    await expect(createPayPalOrder({ amount: 10, currency: "INVALID_CURRENCY" })).rejects.toThrow("[PayPal Validation Error]");
  });

  it("captures an approved PayPal order successfully", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ access_token: "token_123" }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: "PAYPAL_ORDER_999",
          status: "COMPLETED",
          payer: { email_address: "buyer@example.com" },
          purchase_units: [
            {
              payments: {
                captures: [{ id: "CAPTURE_555" }],
              },
            },
          ],
        }),
      } as unknown as Response);

    const result = await capturePayPalOrder({ orderId: "PAYPAL_ORDER_999" });

    expect(result.success).toBe(true);
    expect(result.orderId).toBe("PAYPAL_ORDER_999");
    expect(result.captureId).toBe("CAPTURE_555");
    expect(result.status).toBe("COMPLETED");
    expect(result.payerEmail).toBe("buyer@example.com");
  });

  it("verifies valid PayPal webhook signature", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ access_token: "token_123" }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ verification_status: "SUCCESS" }),
      } as unknown as Response);

    const isValid = await verifyPayPalWebhookSignature({
      authAlgo: "SHA256withRSA",
      certUrl: "https://api-m.sandbox.paypal.com/v1/notifications/certs/CERT-123",
      transmissionId: "trans_123",
      transmissionSig: "sig_abc_123",
      transmissionTime: "2026-07-29T12:00:00Z",
      webhookId: "test_webhook_id_99999",
      webhookEvent: { event_type: "PAYMENT.CAPTURE.COMPLETED" },
    });

    expect(isValid).toBe(true);
  });

  it("rejects invalid PayPal webhook signature", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ access_token: "token_123" }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ verification_status: "FAILURE" }),
      } as unknown as Response);

    const isValid = await verifyPayPalWebhookSignature({
      authAlgo: "SHA256withRSA",
      certUrl: "https://api-m.sandbox.paypal.com/v1/notifications/certs/CERT-123",
      transmissionId: "trans_invalid",
      transmissionSig: "sig_invalid",
      transmissionTime: "2026-07-29T12:00:00Z",
      webhookId: "test_webhook_id_99999",
      webhookEvent: { event_type: "PAYMENT.CAPTURE.COMPLETED" },
    });

    expect(isValid).toBe(false);
  });
});
