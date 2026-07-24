"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight } from "lucide-react";
import { FormInput } from "@/components/auth/FormInput";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function EmployerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    try {
      const res = await fetch("/api/v1/employer/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login failed.");
      }

      setAlert({ type: "success", message: "Employer login successful! Redirecting to dashboard..." });
      setTimeout(() => {
        router.push("/employer/dashboard");
      }, 1200);
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Invalid credentials." });
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
          Employer Portal Sign In
        </h1>
        <p className="text-xs text-slate-600">
          Access your hiring company dashboard, manage job postings, and review applicants.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200/80 space-y-6">
          {alert && <AuthAlert type={alert.type} message={alert.message} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Business Email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-600 font-medium">Remember Me</span>
              </label>

              <Link
                href="/employer/forgot-password"
                className="font-bold text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In to Employer Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold">Or continue with</span>
            </div>
          </div>

          <SocialAuthButtons />

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            Need an Employer Account?{" "}
            <Link href="/employer/signup" className="font-bold text-blue-600 hover:underline">
              Create One Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
