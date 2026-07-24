"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { FormInput } from "@/components/auth/FormInput";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { ResetPasswordSchema } from "@/lib/auth/validation-schemas";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryToken = searchParams.get("token") || "";

  const [formData, setFormData] = useState({
    token: queryToken,
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (queryToken) {
      setFormData((prev) => ({ ...prev, token: queryToken }));
    }
  }, [queryToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setErrors({});

    const validation = ResetPasswordSchema.safeParse(formData);
    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: formData.token,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Password reset failed. Token may be invalid or expired.");
      }

      setAlert({
        type: "success",
        message: "Your password has been reset successfully! Redirecting to login...",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.message || "Error resetting password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Enter a new strong password for your WorkoraJobs candidate account."
      footerText="Remember your current password?"
      footerLinkText="Back to Login"
      footerLinkHref="/login"
    >
      {alert && <AuthAlert type={alert.type} message={alert.message} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!queryToken && (
          <FormInput
            label="Reset Token"
            name="token"
            placeholder="Paste your reset token here..."
            value={formData.token}
            onChange={handleChange}
            error={errors.token}
            disabled={isLoading}
            required
          />
        )}

        <div className="space-y-1">
          <FormInput
            label="New Password"
            name="newPassword"
            isPassword
            placeholder="••••••••••••"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            disabled={isLoading}
            required
          />
          <PasswordStrengthMeter password={formData.newPassword} />
        </div>

        <FormInput
          label="Confirm New Password"
          name="confirmPassword"
          isPassword
          placeholder="••••••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={isLoading}
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-500/20 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Updating Password...</span>
            </div>
          ) : (
            <span>Update Password</span>
          )}
        </button>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 bg-white rounded-2xl border text-center text-slate-500">
            Loading reset page...
          </div>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
