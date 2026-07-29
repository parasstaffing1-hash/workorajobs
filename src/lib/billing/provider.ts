/**
 * ============================================================================
 * UNIFIED PAYMENT PROVIDER ABSTRACTION FACTORY (Razorpay & PayPal)
 * Provides environment-driven payment intent creation without hardcoded secrets.
 * ============================================================================
 */

import { createRazorpayOrder } from "@/lib/payments/razorpay";
import { createPayPalOrder } from "@/lib/payments/paypal";

export type PaymentProviderType = "RAZORPAY" | "PAYPAL" | "MANUAL";

export interface PaymentIntentResult {
  provider: PaymentProviderType;
  paymentId: string;
  approvalUrl?: string;
  clientSecret?: string;
  amountCents: number;
  currency: string;
  status: "SUCCESS" | "PENDING" | "FAILED";
}

export class PaymentProviderFactory {
  /**
   * Resolves configured active payment provider (defaults to RAZORPAY, or PAYPAL if configured)
   */
  static getActiveProvider(): PaymentProviderType {
    const configured = (process.env.PAYMENT_PROVIDER || "").toUpperCase();
    if (configured === "PAYPAL") return "PAYPAL";
    if (configured === "RAZORPAY") return "RAZORPAY";

    // Auto-detect based on available credentials
    const hasRazorpay = !!(process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
    const hasPayPal = !!(process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);

    if (hasRazorpay) return "RAZORPAY";
    if (hasPayPal) return "PAYPAL";
    return "RAZORPAY";
  }

  /**
   * Creates a payment order/intent across the active provider
   */
  static async createPaymentIntent(
    amountCents: number,
    currency = "INR",
    metadata: Record<string, any> = {}
  ): Promise<PaymentIntentResult> {
    const provider = this.getActiveProvider();

    if (provider === "RAZORPAY") {
      // Amount in paise for INR
      const order = await createRazorpayOrder({
        amount: amountCents,
        currency,
        receipt: metadata.receipt,
        notes: metadata.notes,
      });

      return {
        provider: "RAZORPAY",
        paymentId: order.order_id,
        amountCents: Number(order.amount),
        currency: order.currency,
        status: "PENDING",
      };
    }

    if (provider === "PAYPAL") {
      // Amount in main currency units (e.g. USD)
      const amountUnits = amountCents / 100;
      const order = await createPayPalOrder({
        amount: amountUnits,
        currency: currency === "INR" ? "USD" : currency, // PayPal default
        description: metadata.description || "WorkoraJobs Subscription Plan",
      });

      return {
        provider: "PAYPAL",
        paymentId: order.orderId,
        approvalUrl: order.approvalUrl,
        amountCents: Math.round(order.amount * 100),
        currency: order.currency,
        status: "PENDING",
      };
    }

    throw new Error("[Payment Config Error] No supported payment provider configured.");
  }
}
