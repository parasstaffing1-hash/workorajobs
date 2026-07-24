"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { FormInput } from "@/components/auth/FormInput";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { ForgotPasswordSchema } from "@/lib/auth/validation-schemas";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setError("");
    setResetToken(null);

    const validation = ForgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process password reset request.");
      }

      setAlert({
        type: "success",
        message: data.message || "If an account exists with that email, a password reset link has been generated.",
      });

      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.message || "Error requesting password reset.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthCard
        title="Forgot Password"
        subtitle="Enter your registered email address and we'll send you instructions to reset your password."
        footerText="Remember your password?"
        footerLinkText="Back to Login"
        footerLinkHref="/login"
      >
        {alert && <AuthAlert type={alert.type} message={alert.message} />}

        {resetToken && (
          <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
            <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Password Reset Link Simulated
            </p>
            <p className="text-xs text-blue-800">
              You can complete password reset immediately by clicking below:
            </p>
            <Link
              href={`/reset-password?token=${resetToken}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors"
            >
              Reset Password Now &rarr;
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            error={error}
            disabled={isLoading}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-500/20 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Sending Reset Link...</span>
              </div>
            ) : (
              <span>Send Password Reset Link</span>
            )}
          </button>
        </form>
      </AuthCard>
    </div>
  );
}
