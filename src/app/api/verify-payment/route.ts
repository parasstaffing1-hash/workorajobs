import { NextResponse } from "next/server";
import { verifyRazorpayPaymentSignature } from "@/lib/payments/razorpay";

/**
 * POST /api/verify-payment
 * Backend endpoint to verify Razorpay Payment Signature
 *
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required verification fields: razorpay_order_id, razorpay_payment_id, razorpay_signature",
        },
        { status: 400 }
      );
    }

    const result = verifyRazorpayPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment signature verified successfully.",
      data: {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        verified_at: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[POST /api/verify-payment Error]:", err.message);
    return NextResponse.json(
      { success: false, error: err.message || "Payment verification failed." },
      { status: 500 }
    );
  }
}
