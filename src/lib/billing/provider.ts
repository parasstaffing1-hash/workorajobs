export type PaymentProviderType = "STRIPE" | "RAZORPAY" | "PAYPAL" | "MANUAL";

export interface PaymentIntentResult {
  provider: PaymentProviderType;
  paymentId: string;
  clientSecret?: string;
  amountCents: number;
  currency: string;
  status: "SUCCESS" | "PENDING" | "FAILED";
}

export class PaymentProviderFactory {
  /**
   * Resolves configured payment provider (default STRIPE)
   */
  static getActiveProvider(): PaymentProviderType {
    const provider = (process.env.PAYMENT_PROVIDER || "STRIPE").toUpperCase();
    if (provider === "RAZORPAY") return "RAZORPAY";
    if (provider === "PAYPAL") return "PAYPAL";
    return "STRIPE";
  }

  /**
   * Creates a payment intent across active provider
   */
  static async createPaymentIntent(amountCents: number, currency = "USD", metadata: Record<string, any> = {}): Promise<PaymentIntentResult> {
    const provider = this.getActiveProvider();
    const paymentId = `pay-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    if (provider === "RAZORPAY") {
      return {
        provider: "RAZORPAY",
        paymentId: `order_${paymentId}`,
        clientSecret: `rzp_live_${paymentId}`,
        amountCents,
        currency,
        status: "PENDING",
      };
    }

    if (provider === "PAYPAL") {
      return {
        provider: "PAYPAL",
        paymentId: `PAYPAL-${paymentId}`,
        clientSecret: `pp_sec_${paymentId}`,
        amountCents,
        currency,
        status: "PENDING",
      };
    }

    // Default Stripe
    return {
      provider: "STRIPE",
      paymentId: `pi_${paymentId}`,
      clientSecret: `pi_${paymentId}_secret_${Date.now()}`,
      amountCents,
      currency,
      status: "PENDING",
    };
  }
}
