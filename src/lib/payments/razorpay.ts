/**
 * Razorpay Payment Gateway Service Engine for WorkoraJobs
 *
 * Implements Razorpay Standard Checkout Order Creation & HMAC-SHA256 Signature Verification
 */

import Razorpay from "razorpay";
import crypto from "crypto";

export interface CreateOrderParams {
  amount: number; // in paise (e.g. 50000 = ₹500.00)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface VerifyPaymentParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

/**
 * Lazy initialization of Razorpay Instance
 */
function getRazorpayInstance(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("[Razorpay Config Error] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing.");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * STEP 1: Backend - Create Razorpay Order
 */
export async function createRazorpayOrder(params: CreateOrderParams) {
  const { amount, currency = "INR", receipt, notes } = params;

  // STEP 1 Validation: Minimum amount 100 paise (₹1.00)
  if (!amount || typeof amount !== "number" || amount < 100) {
    throw new Error("Invalid order amount. Minimum amount is 100 paise (₹1.00).");
  }

  const instance = getRazorpayInstance();
  const options = {
    amount: Math.round(amount),
    currency,
    receipt: receipt || `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    notes: notes || {},
  };

  try {
    const order = await instance.orders.create(options);
    return {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[Razorpay Create Order Failed]:", err.message);
    throw new Error(`Razorpay Order Creation Failed: ${err.message}`);
  }
}

/**
 * STEP 3: Backend - Verify Payment Signature via HMAC-SHA256
 */
export function verifyRazorpayPaymentSignature(params: VerifyPaymentParams): {
  success: boolean;
  message?: string;
} {
  const { orderId, paymentId, signature } = params;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return {
      success: false,
      message: "Server configuration error: missing Razorpay secret key.",
    };
  }

  if (!orderId || !paymentId || !signature) {
    return {
      success: false,
      message: "Missing required payment verification fields (orderId, paymentId, signature).",
    };
  }

  // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");

  // Timing-safe comparison to prevent timing attacks
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return {
      success: true,
      message: "Payment signature verified successfully.",
    };
  }

  console.warn(`[Razorpay Signature Mismatch] Expected: ${expectedSignature}, Received: ${signature}`);
  return {
    success: false,
    message: "Invalid payment signature. Payment verification failed.",
  };
}
