"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Sparkles, Building2, User } from "lucide-react";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"JOB_SEEKER" | "EMPLOYER">("JOB_SEEKER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe, role }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed.");
      }

      setAlert({ type: "success", message: "Sign in successful! Redirecting to dashboard..." });

      setTimeout(() => {
        if (role === "EMPLOYER" || data.user?.role === "EMPLOYER") {
          router.push("/employer/dashboard");
        } else {
          router.push("/candidate/dashboard");
        }
      }, 800);
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Failed to sign in." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 py-12 text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Sparkles className="h-3 w-3" /> Workora Jobs Authentication
          </span>
          <h1 className="text-2xl font-black">Welcome Back</h1>
          <p className="text-xs text-slate-500">Select account type &amp; enter credentials</p>
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
              <Link href="/auth/forgot-password" className="text-[11px] font-semibold text-blue-600 hover:underline">
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
            className={`w-full h-11 rounded-xl text-white font-bold text-xs shadow-md transition-all ${
              role === "EMPLOYER" ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
            }`}
          >
            {isLoading ? "Authenticating..." : `Sign In as ${role === "EMPLOYER" ? "Employer" : "Job Seeker"}`}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          Don't have an account yet?{" "}
          <Link href="/auth/signup" className="font-bold text-blue-600 hover:underline">
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
}
