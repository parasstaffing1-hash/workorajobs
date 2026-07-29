"use client";

import { useState } from "react";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

interface RazorpayCheckoutButtonProps {
  amount?: number; // in INR (default ₹500)
  title?: string;
  description?: string;
  onSuccess?: (paymentId: string) => void;
}

export default function RazorpayCheckoutButton({
  amount = 500,
  title = "WorkoraJobs Premium Pass",
  description = "Access to top remote jobs & AI resume optimization",
  onSuccess,
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setStatusMessage({ type: "info", text: "Initializing Razorpay order..." });

    try {
      // 1. Load Razorpay checkout.js script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setStatusMessage({
          type: "error",
          text: "Failed to load Razorpay SDK. Check your internet connection.",
        });
        setLoading(false);
        return;
      }

      // 2. Call backend /api/create-order (amount in paise = INR * 100)
      const amountInPaise = Math.round(amount * 100);
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInPaise, currency: "INR" }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.order_id) {
        throw new Error(orderData.error || "Order creation failed.");
      }

      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
      if (!razorpayKeyId) {
        setStatusMessage({
          type: "error",
          text: "Razorpay Payment Gateway is not configured. Missing NEXT_PUBLIC_RAZORPAY_KEY_ID.",
        });
        setLoading(false);
        return;
      }

      // 3. Configure Razorpay Standard Modal options
      const options = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "WorkoraJobs",
        description,
        order_id: orderData.order_id,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          setStatusMessage({ type: "info", text: "Verifying payment signature..." });
          try {
            // STEP 3: Call backend to verify signature
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setStatusMessage({
                type: "success",
                text: `🎉 Payment Successful! Payment ID: ${response.razorpay_payment_id}`,
              });
              if (onSuccess) onSuccess(response.razorpay_payment_id);
            } else {
              setStatusMessage({
                type: "error",
                text: `❌ Signature Verification Failed: ${verifyData.error || "Invalid Payment"}`,
              });
            }
          } catch (err) {
            setStatusMessage({
              type: "error",
              text: `Verification network error: ${(err as Error).message}`,
            });
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setStatusMessage({
              type: "error",
              text: "Payment cancelled by user.",
            });
            setLoading(false);
          },
        },
        theme: {
          color: "#0888f8",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", (response: unknown) => {
        const failure = response as { error?: { description?: string } };
        setStatusMessage({
          type: "error",
          text: `Payment failed: ${failure.error?.description || "Transaction declined"}`,
        });
        setLoading(false);
      });

      paymentObject.open();
    } catch (err: unknown) {
      const error = err as Error;
      setStatusMessage({ type: "error", text: error.message || "Checkout failed." });
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-base shadow-xl hover:shadow-2xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>💳 Pay ₹{amount} with Razorpay</span>
          </>
        )}
      </button>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border text-center break-all transition-all ${
            statusMessage.type === "success"
              ? "bg-emerald-950/80 border-emerald-800 text-emerald-300"
              : statusMessage.type === "error"
              ? "bg-rose-950/80 border-rose-800 text-rose-300"
              : "bg-slate-900 border-slate-800 text-slate-300"
          }`}
        >
          {statusMessage.text}
        </div>
      )}
    </div>
  );
}
