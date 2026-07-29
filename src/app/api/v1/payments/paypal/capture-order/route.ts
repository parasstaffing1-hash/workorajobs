import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth/get-auth-user";
import { capturePayPalOrder } from "@/lib/payments/paypal";

export const runtime = "nodejs";

/**
 * POST /api/v1/payments/paypal/capture-order
 * Captures an approved PayPal order.
 * Requires authenticated user. Returns sanitized client errors.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const userId = await getAuthUserId(request, "ANY");
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Authentication required to capture payment." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { orderId } = body;

    if (!orderId || typeof orderId !== "string" || orderId.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required field 'orderId'." },
        { status: 400 }
      );
    }

    const result = await capturePayPalOrder({ orderId });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Payment capture was not successful." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "PayPal payment captured successfully.",
      data: {
        orderId: result.orderId,
        captureId: result.captureId,
        status: result.status,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[API PayPal Capture Order Internal Error]:", err.message);

    return NextResponse.json(
      { success: false, error: "Unable to process payment capture at this time. Please try again later." },
      { status: 500 }
    );
  }
}
