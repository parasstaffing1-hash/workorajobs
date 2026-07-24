"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { CheckCircle2, Mail, RefreshCw } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryToken = searchParams.get("token") || "";

  const [tokenInput, setTokenInput] = useState(queryToken);
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendMsg, setResendMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (queryToken) {
      handleVerify(queryToken);
    }
  }, [queryToken]);

  const handleVerify = async (tokenToVerify: string) => {
    if (!tokenToVerify) return;
    setStatus("verifying");
    setErrorMessage("");

    try {
      const res = await fetch("/api/v1/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenToVerify }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Email verification failed or token has expired.");
      }

      setStatus("success");
      setTimeout(() => {
        router.push("/login?verified=true");
      }, 2000);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Invalid or expired token.");
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;
    setIsResending(true);
    setResendMsg(null);

    try {
      const res = await fetch("/api/v1/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to resend verification link.");
      }

      setResendMsg({
        type: "success",
        text: data.message || "A new verification link has been generated and sent.",
      });

      if (data.verificationToken) {
        setTokenInput(data.verificationToken);
      }
    } catch (err: any) {
      setResendMsg({
        type: "error",
        text: err.message || "Error resending verification link.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthCard
      title="Verify Your Email"
      subtitle="Confirm your email address to unlock full job applications, recruiter messages, and saved job alerts."
    >
      {status === "verifying" && (
        <div className="py-8 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Verifying your email token...</p>
        </div>
      )}

      {status === "success" && (
        <div className="py-6 text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <AuthAlert type="success" message="Your email address has been verified successfully! Redirecting to login..." />
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-10 px-6 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            Continue to Login &rarr;
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4">
          <AuthAlert type="error" title="Verification Failed" message={errorMessage} />
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <p className="text-xs font-semibold text-slate-700">Need a new verification link?</p>
            <form onSubmit={handleResend} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your registered email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                required
              />
              <button
                type="submit"
                disabled={isResending}
                className="w-full h-9 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isResending ? "Resending..." : "Resend Verification Email"}
              </button>
            </form>
            {resendMsg && <AuthAlert type={resendMsg.type} message={resendMsg.text} />}
          </div>
        </div>
      )}

      {status === "idle" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
            <Mail className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              We sent a verification link to your email inbox when you signed up. Please enter your verification token below if it didn't auto-verify.
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify(tokenInput);
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Verification Token
              </label>
              <input
                type="text"
                placeholder="Paste token here..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Verify Email Token
            </button>
          </form>
        </div>
      )}
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 bg-white rounded-2xl border text-center text-slate-500">
            Loading verification page...
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
