import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth/get-auth-user";
import { createPayPalOrder } from "@/lib/payments/paypal";

export const runtime = "nodejs";

/**
 * POST /api/v1/payments/paypal/create-order
 * Creates a PayPal Order for checkout.
 * Requires authenticated user.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const userId = await getAuthUserId(request, "ANY");
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Authentication required to create payment order." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { amount, currency = "USD", description, returnUrl, cancelUrl } = body;

    if (typeof amount !== "number" || amount <= 0 || !Number.isFinite(amount)) {
      return NextResponse.json(
        { success: false, error: "Invalid amount. Must be a positive number." },
        { status: 400 }
      );
    }

    const order = await createPayPalOrder({
      amount,
      currency,
      description,
      returnUrl,
      cancelUrl,
    });

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[API PayPal Create Order Error]:", err.message);
    const status = err.message.includes("Config") ? 503 : 400;
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create PayPal order." },
      { status }
    );
  }
}
