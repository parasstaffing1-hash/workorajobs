"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

import { AuthAlert } from "@/components/auth/AuthAlert";
import { SiteLogo } from "@/components/layout/site-logo";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/auth/login");
    }
  };

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

      const data = await res.json().catch(() => ({}));
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100">
      {/* DEDICATED HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm">
        {/* Left: Back Button */}
        <button
          type="button"
          onClick={handleBack}
          aria-label="Back to Sign In"
          className="min-h-[44px] min-w-[44px] inline-flex items-center gap-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Sign In</span>
        </button>

        {/* Center: Workora Logo */}
        <div className="flex items-center justify-center">
          <SiteLogo />
        </div>

        {/* Right: Help Action */}
        <div className="flex items-center gap-1.5 text-xs">
          <Link
            href="/contact"
            className="min-h-[44px] px-3 inline-flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Need Help?
          </Link>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 sm:p-6 flex items-center justify-center">
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">Check Your Email</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                If an account is associated with <strong>{email}</strong>, we have sent a secure password reset link.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/auth/login")}
                  className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1 text-center">
                <h1 className="text-2xl font-black">Reset Password</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter your email address to receive a secure password reset token
                </p>
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
                  className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  {isLoading ? "Sending Link..." : "Send Reset Link"}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
