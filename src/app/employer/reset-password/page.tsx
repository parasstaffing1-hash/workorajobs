"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, CheckCircle2 } from "lucide-react";
import { FormInput } from "@/components/auth/FormInput";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function EmployerResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setAlert({ type: "error", message: "Passwords do not match." });
      return;
    }

    setIsLoading(true);
    setAlert(null);

    try {
      const res = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Password reset failed.");

      setAlert({
        type: "success",
        message: "Employer password reset successfully! Redirecting to login...",
      });
      setTimeout(() => router.push("/employer/login"), 1500);
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Invalid or expired reset token." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Set New Employer Password
        </h1>
        <p className="text-xs text-slate-600">
          Create a new secure password for your hiring account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200/80 space-y-6">
          {alert && <AuthAlert type={alert.type} message={alert.message} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <FormInput
                label="New Password"
                type="password"
                placeholder="At least 8 chars"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordStrengthMeter password={password} />
            </div>

            <FormInput
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
