"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send reset link.");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Request failed." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <Link href="/auth/login" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
        </Link>

        {isSubmitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold">Check Your Email</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              If an account is associated with <strong>{email}</strong>, we have sent a secure password reset link.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-black">Reset Password</h1>
              <p className="text-xs text-slate-500">Enter your email address to receive a password reset token</p>
            </div>

            {alert && <AuthAlert type={alert.type} message={alert.message} />}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
              >
                {isLoading ? "Sending Link..." : "Send Reset Link"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
