"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { FormInput } from "@/components/auth/FormInput";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { LoginSchema } from "@/lib/auth/validation-schemas";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/candidate/profile";
  const verifiedNotice = searchParams.get("verified");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<{ type: "error" | "success" | "warning"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (verifiedNotice === "true") {
      setAlert({
        type: "success",
        message: "Your email address has been verified successfully! You can now log in.",
      });
    }
  }, [verifiedNotice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setErrors({});

    const validation = LoginSchema.safeParse(formData);
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
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login failed. Please check your credentials.");
      }

      setAlert({
        type: "success",
        message: "Authentication successful. Redirecting...",
      });

      // Redirect to candidate portal or requested URL
      setTimeout(() => {
        router.push(returnUrl);
        router.refresh();
      }, 500);
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.message || "An error occurred during login.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to your WorkoraJobs candidate profile, tracked applications, and job alerts."
      footerText="Don't have an account yet?"
      footerLinkText="Sign up for free"
      footerLinkHref="/signup"
    >
      {alert && <AuthAlert type={alert.type} message={alert.message} />}

      {/* Social Logins */}
      <SocialAuthButtons isLoading={isLoading} />

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isLoading}
          required
        />

        <div>
          <FormInput
            label="Password"
            name="password"
            isPassword
            placeholder="••••••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
            required
          />
          <div className="flex items-center justify-end mt-1">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={isLoading}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs font-medium text-slate-700">
              Remember this device for 30 days
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-500/20 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Authenticating...</span>
            </div>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 bg-white rounded-2xl border text-center text-slate-500">
            Loading authentication portal...
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  );
}
