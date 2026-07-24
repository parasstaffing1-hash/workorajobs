"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Mail, Phone, Lock, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { FormInput } from "@/components/auth/FormInput";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function EmployerSignupPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      setAlert({ type: "error", message: "You must accept the Employer Terms of Service." });
      return;
    }

    setIsLoading(true);
    setAlert(null);

    try {
      const res = await fetch("/api/v1/employer/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          businessEmail,
          phone,
          password,
          acceptTerms,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || (data.details ? data.details.join(", ") : "Signup failed."));
      }

      setAlert({
        type: "success",
        message: "Employer account created! Redirecting to email & phone verification...",
      });

      setTimeout(() => {
        router.push("/employer/verify-email");
      }, 1500);
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">
          <Building2 className="h-3.5 w-3.5 text-blue-600" />
          <span>WorkoraJobs Employer Portal</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create an Employer Hiring Account
        </h1>
        <p className="text-xs text-slate-600">
          Post tech jobs, access thousands of verified candidate profiles, and manage ATS recruitment pipelines.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200/80 space-y-6">
          {alert && <AuthAlert type={alert.type} message={alert.message} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Company Name"
              placeholder="e.g. Acme Corporation Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />

            <FormInput
              label="Work / Business Email"
              type="email"
              placeholder="name@company.com"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              required
            />

            <FormInput
              label="Official Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <div className="space-y-2">
              <FormInput
                label="Password"
                type="password"
                placeholder="At least 8 chars, 1 uppercase, 1 symbol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordStrengthMeter password={password} />
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
                required
              />
              <label htmlFor="terms" className="text-xs text-slate-600 leading-tight">
                I agree to the <span className="font-bold text-slate-900">Employer Terms of Service</span>, Privacy Policy, and candidate contact guidelines.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Creating Employer Account...</span>
              ) : (
                <>
                  <span>Create Hiring Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            Already have an Employer account?{" "}
            <Link href="/employer/login" className="font-bold text-blue-600 hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
