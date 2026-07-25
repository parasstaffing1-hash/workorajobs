/**
 * Unit Tests for Razorpay Service Engine & Signature Verification
 */

import { verifyRazorpayPaymentSignature } from "../../src/lib/payments/razorpay";
import crypto from "crypto";

describe("Razorpay Signature Verification Engine", () => {
  const secretKey = "oBlnQiQ9waMOJIvdPqlS8XKN";

  beforeAll(() => {
    process.env.RAZORPAY_KEY_SECRET = secretKey;
    process.env.RAZORPAY_KEY_ID = "rzp_test_THkYG15Dw7EcN5";
  });

  it("should successfully verify a valid Razorpay HMAC-SHA256 signature", () => {
    const orderId = "order_9A33XWu170gUtm";
    const paymentId = "pay_29A12345678901";
    const body = `${orderId}|${paymentId}`;
    const validSignature = crypto
      .createHmac("sha256", secretKey)
      .update(body)
      .digest("hex");

    const result = verifyRazorpayPaymentSignature({
      orderId,
      paymentId,
      signature: validSignature,
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("verified successfully");
  });

  it("should reject an invalid or tampered signature", () => {
    const result = verifyRazorpayPaymentSignature({
      orderId: "order_9A33XWu170gUtm",
      paymentId: "pay_29A12345678901",
      signature: "invalid_tampered_signature_string",
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain("Invalid payment signature");
  });

  it("should reject verification when mandatory fields are missing", () => {
    const result = verifyRazorpayPaymentSignature({
      orderId: "",
      paymentId: "pay_123",
      signature: "sig_123",
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain("Missing required payment verification fields");
  });
});
