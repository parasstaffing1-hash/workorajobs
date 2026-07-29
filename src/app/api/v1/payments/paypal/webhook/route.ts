import { NextRequest, NextResponse } from "next/server";
import { getPayPalAccessToken } from "@/lib/payments/paypal";

export const runtime = "nodejs";

function getPayPalApiBase(): string {
  const mode = process.env.PAYPAL_ENV || process.env.PAYPAL_MODE || "sandbox";
  return mode === "live" || mode === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

/**
 * POST /api/v1/payments/paypal/webhook
 * PayPal Webhook verification and event handler.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (!webhookId) {
      console.warn("[PayPal Webhook Warning] PAYPAL_WEBHOOK_ID not configured.");
      return NextResponse.json(
        { success: false, error: "PayPal webhook verification not configured on server." },
        { status: 503 }
      );
    }

    const rawBody = await request.text();
    const event = JSON.parse(rawBody);

    const transmissionId = request.headers.get("paypal-transmission-id");
    const transmissionTime = request.headers.get("paypal-transmission-time");
    const certUrl = request.headers.get("paypal-cert-url");
    const authAlgo = request.headers.get("paypal-auth-algo");
    const transmissionSig = request.headers.get("paypal-transmission-sig");

    if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
      return NextResponse.json(
        { success: false, error: "Missing required PayPal signature headers." },
        { status: 400 }
      );
    }

    // Verify webhook signature with PayPal REST API
    const accessToken = await getPayPalAccessToken();
    const apiBase = getPayPalApiBase();

    const verifyResponse = await fetch(`${apiBase}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: certUrl,
        auth_algo: authAlgo,
        transmission_sig: transmissionSig,
        webhook_id: webhookId,
        webhook_event: event,
      }),
    });

    if (!verifyResponse.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to communicate with PayPal verification service." },
        { status: 502 }
      );
    }

    const verifyResult = await verifyResponse.json();
    if (verifyResult.verification_status !== "SUCCESS") {
      console.warn("[PayPal Webhook Signature Mismatch] Signature status:", verifyResult.verification_status);
      return NextResponse.json(
        { success: false, error: "Invalid PayPal webhook signature." },
        { status: 400 }
      );
    }

    // Handle webhook event types
    const eventType = event.event_type;
    console.log(`[PayPal Webhook Event Verified]: ${eventType} (ID: ${event.id})`);

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = event.resource;
      const orderId = resource.custom_id || resource.id;
      const amount = resource.amount?.value;
      const currency = resource.amount?.currency_code;

      console.log(`[PayPal Payment Success]: Order ${orderId}, Amount: ${amount} ${currency}`);
    }

    return NextResponse.json({
      success: true,
      message: `PayPal event ${eventType} processed successfully.`,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[PayPal Webhook Error]:", err.message);
    return NextResponse.json(
      { success: false, error: "Webhook processing error." },
      { status: 500 }
    );
  }
}
