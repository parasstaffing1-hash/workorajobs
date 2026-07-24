"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Building2,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

interface SignInGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenJoinNow?: (role?: "JOB_SEEKER" | "EMPLOYER") => void;
}

export function SignInGatewayModal({
  isOpen,
  onClose,
  onOpenJoinNow,
}: SignInGatewayModalProps) {
  const router = useRouter();
  const [view, setView] = useState<"CHOICE" | "JOB_SEEKER" | "EMPLOYER">("CHOICE");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSelectRole = (role: "JOB_SEEKER" | "EMPLOYER") => {
    setError("");
    setView(role);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all credentials.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const endpoint = view === "EMPLOYER" ? "/api/v1/employer/auth/login" : "/api/v1/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed. Please verify credentials.");
      }

      onClose();

      if (view === "EMPLOYER" || data.user?.role === "EMPLOYER") {
        router.push("/employer/dashboard");
      } else {
        router.push("/candidate/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* CHOICE VIEW */}
          {view === "CHOICE" && (
            <div className="space-y-6">
              <div className="text-center space-y-1.5 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <Sparkles className="h-3 w-3" />
                  WorkoraJobs Auth Gateway
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Welcome to Workora Jobs
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Choose how you would like to continue to your account
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Card 1: Job Seeker */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectRole("JOB_SEEKER")}
                  className="group relative p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 hover:border-blue-500/50 transition-all cursor-pointer space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
                      <User className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      👤 Job Seeker
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Find jobs, manage applications, resume, saved jobs and alerts.
                    </p>
                  </div>

                  <button className="w-full h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20">
                    <span>Continue as Job Seeker</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>

                {/* Card 2: Employer */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectRole("EMPLOYER")}
                  className="group relative p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 hover:border-indigo-500/50 transition-all cursor-pointer space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      🏢 Employer
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Post jobs, manage applicants, company profile and ATS.
                    </p>
                  </div>

                  <button className="w-full h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20">
                    <span>Continue as Employer</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              </div>

              <div className="pt-2 text-center text-xs text-slate-500">
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    onClose();
                    onOpenJoinNow?.();
                  }}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Join Now
                </button>
              </div>
            </div>
          )}

          {/* LOGIN FORM VIEW */}
          {view !== "CHOICE" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setView("CHOICE")}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  ← Back to role selection
                </button>

                <span className="text-xs font-bold text-slate-400">
                  {view === "EMPLOYER" ? "Employer Login" : "Job Seeker Login"}
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {view === "EMPLOYER" ? "Sign In to Employer Portal" : "Sign In to Job Seeker Account"}
                </h2>
                <p className="text-xs text-slate-500">Enter your credentials to access your dashboard</p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 font-semibold text-xs border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Email {view === "EMPLOYER" && <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">(Work Email Recommended)</span>}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder={view === "EMPLOYER" ? "you@example.com or name@company.com" : "you@example.com"}
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
                      href={view === "EMPLOYER" ? "/employer/forgot-password" : "/candidate/forgot-password"}
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
                    view === "EMPLOYER"
                      ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
                      : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                  }`}
                >
                  {isLoading ? "Authenticating..." : "Continue to Account"}
                </button>
              </form>

              {/* OAuth Dividers */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase font-bold text-slate-400 bg-white dark:bg-slate-900 px-2">
                  Or continue with social account
                </div>
              </div>

              <div className="space-y-2.5">
                <GoogleSignInButton
                  role={view === "EMPLOYER" ? "EMPLOYER" : "JOB_SEEKER"}
                  onSuccess={() => {
                    onClose();
                    router.push(view === "EMPLOYER" ? "/employer/dashboard" : "/candidate/dashboard");
                  }}
                  buttonText={view === "EMPLOYER" ? "Sign in with Google (Work Email)" : "Sign in with Google / Gmail"}
                />

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/v1/auth/oauth/linkedin", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ role: view === "EMPLOYER" ? "EMPLOYER" : "JOB_SEEKER" }),
                        });
                        const data = await res.json();
                        if (data.success) {
                          onClose();
                          router.push(view === "EMPLOYER" ? "/employer/dashboard" : "/candidate/dashboard");
                        }
                      } catch (_) {}
                    }}
                    className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <span className="text-blue-600 font-extrabold text-xs">in</span>
                    <span>LinkedIn</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/v1/auth/oauth/github", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ role: view === "EMPLOYER" ? "EMPLOYER" : "JOB_SEEKER" }),
                        });
                        const data = await res.json();
                        if (data.success) {
                          onClose();
                          router.push(view === "EMPLOYER" ? "/employer/dashboard" : "/candidate/dashboard");
                        }
                      } catch (_) {}
                    }}
                    className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <span className="font-extrabold text-xs">🐙</span>
                    <span>GitHub</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 text-center text-xs text-slate-500">
                Need a new account?{" "}
                <button
                  onClick={() => {
                    onClose();
                    onOpenJoinNow?.(view);
                  }}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  {view === "EMPLOYER" ? "Create Employer Account" : "Create Job Seeker Account"}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
