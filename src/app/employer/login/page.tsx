"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight, ArrowLeft } from "lucide-react";

import { FormInput } from "@/components/auth/FormInput";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { SiteLogo } from "@/components/layout/site-logo";

export default function EmployerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/jobs");
    }
  };

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

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login failed. Invalid employer credentials.");
      }

      setAlert({ type: "success", message: "Employer login successful! Redirecting to dashboard..." });
      setTimeout(() => {
        const requestedUrl = new URLSearchParams(window.location.search).get("returnUrl");
        const returnUrl =
          requestedUrl &&
          (requestedUrl === "/employer" || requestedUrl.startsWith("/employer/")) &&
          !requestedUrl.startsWith("//")
            ? requestedUrl
            : "/employer/dashboard";
        router.push(returnUrl);
        router.refresh();
      }, 500);
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Invalid credentials." });
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
          aria-label="Back to Jobs"
          className="min-h-[44px] min-w-[44px] inline-flex items-center gap-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Jobs</span>
        </button>

        {/* Center: Workora Logo */}
        <div className="flex items-center justify-center">
          <SiteLogo />
        </div>

        {/* Right: Sign Up Link */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="hidden md:inline text-slate-500 dark:text-slate-400 font-medium">
            Need an employer account?
          </span>
          <Link
            href="/employer/signup"
            className="min-h-[44px] px-3 inline-flex items-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-colors cursor-pointer"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 sm:p-6 flex items-center justify-center">
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Building2 className="h-3.5 w-3.5" />
              <span>Workora Employer Portal</span>
            </div>

            <h1 className="text-2xl font-black">Employer Sign In</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access your hiring company dashboard and manage job postings
            </p>
          </div>

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
              isPassword
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-medium">Remember Me</span>
              </label>

              <Link
                href="/employer/forgot-password"
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
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

          <SocialAuthButtons role="EMPLOYER" isLoading={isLoading} />

          <div className="pt-2 text-center text-xs text-slate-500">
            Need an Employer Account?{" "}
            <Link href="/employer/signup" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Create One Here
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
