/**
 * ============================================================================
 * UNIT TEST SUITE: PayPal Payment Gateway Service
 * Tests PayPal Access Token, Order Creation, Capture & Validation
 * ============================================================================
 */

import {
  createPayPalOrder,
  capturePayPalOrder,
  getPayPalAccessToken,
} from "@/lib/payments/paypal";

// Mock global fetch for PayPal REST API calls
const originalFetch = global.fetch;

describe("PayPal Payment Service Unit Tests", () => {
  beforeEach(() => {
    process.env.PAYPAL_MODE = "sandbox";
    process.env.PAYPAL_CLIENT_ID = "test_paypal_client_id_12345";
    process.env.PAYPAL_CLIENT_SECRET = "test_paypal_client_secret_67890";
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("throws error if PayPal client credentials are missing", async () => {
    delete process.env.PAYPAL_CLIENT_ID;
    delete process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    delete process.env.PAYPAL_CLIENT_SECRET;

    await expect(getPayPalAccessToken()).rejects.toThrow("[PayPal Config Error]");
  });

  it("successfully retrieves OAuth2 access token from PayPal REST API", async () => {
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
      // First call for OAuth token
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ access_token: "token_123" }),
      } as unknown as Response)
      // Second call for Order creation
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
      // First call for OAuth token
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ access_token: "token_123" }),
      } as unknown as Response)
      // Second call for Order capture
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
});
