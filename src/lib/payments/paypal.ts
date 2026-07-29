/**
 * PayPal Payment Gateway Service Engine for WorkoraJobs
 *
 * Implements PayPal REST API v2 Order Creation, Order Capture, and Access Token Management
 * Without hardcoded credentials (reads from process.env strictly).
 */

export interface CreatePayPalOrderParams {
  amount: number; // e.g. 50.00
  currency?: string; // e.g. "USD", "EUR", "INR"
  description?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PayPalOrderResponse {
  orderId: string;
  status: string;
  approvalUrl?: string;
  amount: number;
  currency: string;
}

export interface CapturePayPalOrderParams {
  orderId: string;
}

export interface PayPalCaptureResponse {
  success: boolean;
  orderId: string;
  captureId?: string;
  status: string;
  payerEmail?: string;
  message?: string;
}

function getPayPalApiBase(): string {
  const mode = process.env.PAYPAL_MODE || "sandbox";
  return mode === "live" || mode === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

function getPayPalCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("[PayPal Config Error] PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET is missing.");
  }

  return { clientId, clientSecret };
}

/**
 * Obtains an OAuth2 Bearer Access Token from PayPal REST API.
 */
export async function getPayPalAccessToken(): Promise<string> {
  const { clientId, clientSecret } = getPayPalCredentials();
  const apiBase = getPayPalApiBase();

  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${apiBase}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${authHeader}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`[PayPal OAuth Error] Failed to obtain access token: ${response.status} ${errText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * STEP 1: Backend - Create PayPal Order
 */
export async function createPayPalOrder(params: CreatePayPalOrderParams): Promise<PayPalOrderResponse> {
  const { amount, currency = "USD", description = "WorkoraJobs Premium Service", returnUrl, cancelUrl } = params;

  if (typeof amount !== "number" || amount <= 0 || !Number.isFinite(amount)) {
    throw new Error("[PayPal Validation Error] Invalid order amount. Must be a positive number.");
  }

  const allowedCurrencies = ["USD", "EUR", "GBP", "CAD", "AUD", "INR"];
  const upperCurrency = currency.toUpperCase();
  if (!allowedCurrencies.includes(upperCurrency)) {
    throw new Error(`[PayPal Validation Error] Currency '${currency}' is not supported. Allowed: ${allowedCurrencies.join(", ")}`);
  }

  const accessToken = await getPayPalAccessToken();
  const apiBase = getPayPalApiBase();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: upperCurrency,
          value: amount.toFixed(2),
        },
        description: description.substring(0, 127),
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
          brand_name: "WorkoraJobs Global",
          locale: "en-US",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          return_url: returnUrl || `${appUrl}/checkout/paypal?status=success`,
          cancel_url: cancelUrl || `${appUrl}/checkout/paypal?status=cancel`,
        },
      },
    },
  };

  const response = await fetch(`${apiBase}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    const errorMsg = errBody?.message || errBody?.name || "Order creation failed";
    throw new Error(`[PayPal Order Creation Error] ${errorMsg}`);
  }

  const orderData = await response.json();
  const approveLink = orderData.links?.find((l: { rel: string; href: string }) => l.rel === "payer-action" || l.rel === "approve")?.href;

  return {
    orderId: orderData.id,
    status: orderData.status,
    approvalUrl: approveLink,
    amount,
    currency: upperCurrency,
  };
}

/**
 * STEP 2: Backend - Capture PayPal Order
 */
export async function capturePayPalOrder(params: CapturePayPalOrderParams): Promise<PayPalCaptureResponse> {
  const { orderId } = params;

  if (!orderId || typeof orderId !== "string" || orderId.trim().length === 0) {
    throw new Error("[PayPal Validation Error] Order ID is required for capture.");
  }

  const accessToken = await getPayPalAccessToken();
  const apiBase = getPayPalApiBase();

  const response = await fetch(`${apiBase}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    const errorMsg = errBody?.message || errBody?.name || "Order capture failed";
    return {
      success: false,
      orderId,
      status: "FAILED",
      message: errorMsg,
    };
  }

  const captureData = await response.json();
  const captureUnit = captureData.purchase_units?.[0]?.payments?.captures?.[0];
  const payerEmail = captureData.payer?.email_address;

  return {
    success: captureData.status === "COMPLETED",
    orderId: captureData.id,
    captureId: captureUnit?.id,
    status: captureData.status,
    payerEmail,
    message: captureData.status === "COMPLETED" ? "Payment completed successfully." : "Payment pending completion.",
  };
}
