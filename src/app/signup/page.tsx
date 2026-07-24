"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { FormInput } from "@/components/auth/FormInput";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { SignupSchema } from "@/lib/auth/validation-schemas";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);

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
    setDevToken(null);

    // Validate with Zod
    const validation = SignupSchema.safeParse(formData);
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
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed. Please try again.");
      }

      setAlert({
        type: "success",
        message: data.message || "Account created successfully! Please verify your email to continue.",
      });

      if (data.verificationToken) {
        setDevToken(data.verificationToken);
      }

      // Scroll to top to see alert
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.message || "An unexpected error occurred during signup.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthCard
        title="Create Job Seeker Account"
        subtitle="Join WorkoraJobs to explore enterprise tech jobs, instant ATS match, and recruiter applications."
        footerText="Already have an account?"
        footerLinkText="Sign in"
        footerLinkHref="/login"
      >
        {alert && <AuthAlert type={alert.type} message={alert.message} />}

        {devToken && (
          <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
            <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Verification Link Simulated
            </p>
            <p className="text-xs text-blue-800">
              In production, an email is sent to your inbox. You can test email verification right now by clicking below:
            </p>
            <Link
              href={`/verify-email?token=${devToken}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors"
            >
              Verify Email Now &rarr;
            </Link>
          </div>
        )}

        {/* Social Authentication */}
        <SocialAuthButtons isLoading={isLoading} />

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Full Name"
            name="name"
            placeholder="e.g. Alex Morgan"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            disabled={isLoading}
            required
          />

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="alex@company.com or alex@gmail.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            disabled={isLoading}
            required
          />

          <div className="space-y-1">
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
            <PasswordStrengthMeter password={formData.password} />
          </div>

          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            isPassword
            placeholder="••••••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            disabled={isLoading}
            required
          />

          {/* Terms Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                disabled={isLoading}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
              />
              <span className="text-xs text-slate-600 leading-normal">
                I agree to the{" "}
                <Link href="/terms" className="text-blue-600 font-semibold hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 font-semibold hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.agreeToTerms}</p>
            )}
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
                <span>Creating Account...</span>
              </div>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>
      </AuthCard>
    </div>
  );
}
