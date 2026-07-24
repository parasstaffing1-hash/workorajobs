"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, ArrowLeft } from "lucide-react";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  // Password strength calculation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isStrong = hasMinLength && hasUppercase && hasNumber && hasSpecial;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setAlert({ type: "error", message: "Invalid or missing password reset token." });
      return;
    }
    if (password !== confirmPassword) {
      setAlert({ type: "error", message: "Passwords do not match." });
      return;
    }
    if (!isStrong) {
      setAlert({ type: "error", message: "Please meet all password strength requirements." });
      return;
    }

    setIsLoading(true);
    setAlert(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Password reset failed. Token may be expired.");
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Failed to reset password." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 py-12 text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <Link href="/auth/login" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
        </Link>

        {isSuccess ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-black">Password Reset Complete</h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your password has been successfully updated. Redirecting to sign in...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-black">Create New Password</h1>
              <p className="text-xs text-slate-500">Choose a strong password to secure your account</p>
            </div>

            {alert && <AuthAlert type={alert.type} message={alert.message} />}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password Strength Checklist */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2 border border-slate-100 dark:border-slate-800 text-[11px]">
                <span className="font-bold text-slate-600 dark:text-slate-400">Password Requirements:</span>
                <div className="grid grid-cols-2 gap-1.5 font-semibold">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> 8+ characters
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> 1 uppercase
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> 1 number
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasSpecial ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> 1 symbol
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
              >
                {isLoading ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
