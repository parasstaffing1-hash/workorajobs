import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/payments/razorpay";

/**
 * POST /api/create-order
 * Backend endpoint to create a Razorpay Order
 *
 * Body: { amount: number (paise), currency?: string, receipt?: string }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amount, currency = "INR", receipt } = body;

    // STEP 1 Validation: Minimum amount 100 paise
    if (typeof amount !== "number" || amount < 100) {
      return NextResponse.json(
        {
          error: "Invalid amount. Minimum amount must be at least 100 paise (₹1.00).",
        },
        { status: 400 }
      );
    }

    const order = await createRazorpayOrder({
      amount,
      currency,
      receipt,
    });

    return NextResponse.json({
      order_id: order.order_id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[POST /api/create-order Error]:", err.message);
    const status = err.message.includes("Config") ? 401 : 500;
    return NextResponse.json(
      { error: err.message || "Failed to create Razorpay order." },
      { status }
    );
  }
}
