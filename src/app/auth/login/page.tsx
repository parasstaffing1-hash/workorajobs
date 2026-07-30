"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Sparkles, Building2, User, ArrowLeft } from "lucide-react";

import { AuthAlert } from "@/components/auth/AuthAlert";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { SiteLogo } from "@/components/layout/site-logo";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrlParam = searchParams?.get("returnUrl");
  const initialRoleParam = searchParams?.get("role");

  const [role, setRole] = useState<"JOB_SEEKER" | "EMPLOYER">(
    initialRoleParam === "EMPLOYER" ? "EMPLOYER" : "JOB_SEEKER"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  useEffect(() => {
    if (initialRoleParam === "EMPLOYER") {
      setRole("EMPLOYER");
    }
  }, [initialRoleParam]);

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
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe, role }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        const errorMsg =
          res.status === 401
            ? "Invalid email or password. If you joined with Google or LinkedIn, use the same provider above, then choose Password on your dashboard to enable email sign-in."
            : data.error || data.message || "Failed to sign in. Please verify your credentials.";
        throw new Error(errorMsg);
      }

      setAlert({ type: "success", message: "Sign in successful! Redirecting..." });

      setTimeout(() => {
        const userRole = data.user?.role;
        const safeReturnUrl =
          returnUrlParam &&
          returnUrlParam.startsWith("/") &&
          !returnUrlParam.startsWith("//") &&
          ((userRole === "EMPLOYER" && returnUrlParam.startsWith("/employer")) ||
            (userRole !== "EMPLOYER" && returnUrlParam.startsWith("/candidate")))
            ? returnUrlParam
            : null;

        if (safeReturnUrl) {
          router.push(safeReturnUrl);
        } else if (userRole === "EMPLOYER") {
          router.push("/employer/dashboard");
        } else {
          router.push("/candidate/dashboard");
        }
        router.refresh();
      }, 500);
    } catch (err: any) {
      setAlert({
        type: "error",
        message: typeof err.message === "string" ? err.message : "Invalid email or password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 maximalist-hero-mesh">
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
            New to Workora?
          </span>
          <Link
            href="/auth/signup"
            className="min-h-[44px] px-3 inline-flex items-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/80 transition-colors cursor-pointer"
          >
            Create Free Account
          </Link>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 sm:p-6 flex items-center justify-center">
        <div className="w-full glass-card-enterprise p-6 sm:p-8 shadow-2xl space-y-6 maximalist-card-glow">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30">
              <Sparkles className="h-3.5 w-3.5" /> Workora Jobs Authentication
            </span>
            <h1 className="text-3xl font-black tracking-tight text-gradient-maximalist">Welcome Back</h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Select account type &amp; enter credentials</p>
          </div>

          {/* Role Toggle Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole("JOB_SEEKER")}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === "JOB_SEEKER"
                  ? "bg-white dark:bg-slate-900 text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <User className="h-4 w-4" />
              <span>Job Seeker</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("EMPLOYER")}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === "EMPLOYER"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>Employer</span>
            </button>
          </div>

          {alert && <AuthAlert type={alert.type} message={alert.message} />}

          <SocialAuthButtons role={role} isLoading={isLoading} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Email {role === "EMPLOYER" && <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">(Work Email Recommended)</span>}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder={role === "EMPLOYER" ? "you@example.com or name@company.com" : "you@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Password
                </label>
                <Link
                  href={role === "EMPLOYER" ? "/employer/forgot-password" : "/auth/forgot-password"}
                  className="text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-11 rounded-xl text-white font-bold text-xs shadow-md transition-all cursor-pointer ${
                role === "EMPLOYER" ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
              }`}
            >
              {isLoading ? "Authenticating..." : `Sign In as ${role === "EMPLOYER" ? "Employer" : "Job Seeker"}`}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Don't have an account yet?{" "}
            <Link href="/auth/signup" className="font-bold text-blue-600 hover:underline">
              Create Free Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 text-slate-500">
          Loading authentication portal...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
