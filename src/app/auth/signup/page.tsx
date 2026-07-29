"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  Building2,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { AuthAlert } from "@/components/auth/AuthAlert";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { FormInput } from "@/components/auth/FormInput";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { SiteLogo } from "@/components/layout/site-logo";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams?.get("role");

  const [role, setRole] = useState<"JOB_SEEKER" | "EMPLOYER">(
    initialRoleParam === "EMPLOYER" ? "EMPLOYER" : "JOB_SEEKER"
  );

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string | null>(null);

  // Check if form is dirty (has user input)
  const isDirty = Boolean(
    name.trim() ||
      companyName.trim() ||
      email.trim() ||
      password ||
      confirmPassword ||
      location.trim()
  );

  useEffect(() => {
    if (initialRoleParam === "EMPLOYER") {
      setRole("EMPLOYER");
    }
  }, [initialRoleParam]);

  // Intercept browser refresh / close tab when form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved information. Leaving now will discard your progress.";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Handle Back Navigation with Unsaved Guard
  const triggerBack = (targetUrl?: string) => {
    if (isDirty) {
      setPendingRedirectUrl(targetUrl || "/jobs");
      setShowUnsavedModal(true);
    } else {
      performNavigation(targetUrl);
    }
  };

  const performNavigation = (targetUrl?: string) => {
    if (targetUrl) {
      router.push(targetUrl);
    } else if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/jobs");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setAlert({ type: "error", message: "Passwords do not match." });
      return;
    }
    if (!agreeTerms) {
      setAlert({ type: "error", message: "You must agree to the Terms of Service." });
      return;
    }

    setIsLoading(true);
    setAlert(null);

    try {
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          name: role === "JOB_SEEKER" ? name : undefined,
          companyName: role === "EMPLOYER" ? companyName : undefined,
          email,
          password,
          location: role === "JOB_SEEKER" ? location : undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Registration failed.");
      }

      setAlert({ type: "success", message: "Account created! Redirecting to dashboard..." });

      setTimeout(() => {
        if (role === "EMPLOYER" || data.user?.role === "EMPLOYER") {
          router.push("/employer/dashboard");
        } else {
          router.push("/candidate/dashboard");
        }
      }, 500);
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Registration failed." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100">
      {/* UNSAVED CHANGES MODAL */}
      <AnimatePresence>
        {showUnsavedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
                <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Leave this page?</h3>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                You have unsaved information. Leaving now will discard your registration progress.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUnsavedModal(false)}
                  className="h-11 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Stay
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUnsavedModal(false);
                    performNavigation(pendingRedirectUrl || undefined);
                  }}
                  className="h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer"
                >
                  Leave
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DEDICATED HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm">
        {/* Left: Back to Jobs Button */}
        <button
          type="button"
          onClick={() => triggerBack("/jobs")}
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

        {/* Right: Sign In Link */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="hidden md:inline text-slate-500 dark:text-slate-400 font-medium">
            Already have an account?
          </span>
          <button
            type="button"
            onClick={() => triggerBack("/auth/login")}
            className="min-h-[44px] px-3 inline-flex items-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/80 transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 lg:gap-12 items-center">
          {/* LEFT HERO SECTION (Desktop 45%) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-6 lg:pr-4"
          >
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Workora Career Network
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
                Build Your Tech Future with AI Precision
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Join 50,000+ engineers, product leaders, and tech professionals matching directly with verified global recruiters.
              </p>
            </div>

            {/* BENEFITS LIST */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">1-Click ATS Resume Match</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Instantly score and optimize your resume keywords for high-salary tech roles.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Verified Employer Profiles</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Direct application delivery to verified hiring managers without recruiter spam.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Real-Time Career Telemetry</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Track application status, interview requests, and candidate views live.</p>
                </div>
              </div>
            </div>

            {/* TRUST STATISTICS */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="text-center">
                <span className="block text-lg font-black text-slate-900 dark:text-white">50K+</span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Active Candidates</span>
              </div>
              <div className="text-center">
                <span className="block text-lg font-black text-slate-900 dark:text-white">1,200+</span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Verified Companies</span>
              </div>
              <div className="text-center">
                <span className="block text-lg font-black text-slate-900 dark:text-white">88%</span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Interview Match Rate</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT REGISTRATION FORM CARD (55% Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-[520px] mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Create Account</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select your account role to get started for free
              </p>
            </div>

            {/* Role Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setRole("JOB_SEEKER")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

            {/* Social Authentication Buttons */}
            <SocialAuthButtons role={role} isLoading={isLoading} />

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {role === "JOB_SEEKER" ? (
                <>
                  <FormInput
                    label="Full Name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <div>
                    <FormInput
                      label="Password"
                      name="password"
                      isPassword
                      autoComplete="new-password"
                      required
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="mt-1.5">
                      <PasswordStrengthMeter password={password} />
                    </div>
                  </div>

                  <FormInput
                    label="Confirm Password"
                    name="confirmPassword"
                    isPassword
                    autoComplete="new-password"
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <FormInput
                    label="Preferred Location"
                    name="location"
                    type="text"
                    placeholder="San Francisco, CA / Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <FormInput
                    label="Company Name"
                    name="companyName"
                    type="text"
                    autoComplete="organization"
                    required
                    placeholder="Acme Enterprise Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />

                  <FormInput
                    label="Work Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="hr@acme.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <div>
                    <FormInput
                      label="Password"
                      name="password"
                      isPassword
                      autoComplete="new-password"
                      required
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="mt-1.5">
                      <PasswordStrengthMeter password={password} />
                    </div>
                  </div>

                  <FormInput
                    label="Confirm Password"
                    name="confirmPassword"
                    isPassword
                    autoComplete="new-password"
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </>
              )}

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400 select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" className="font-bold underline text-blue-600 dark:text-blue-400">
                      Terms of Service
                    </Link>{" "}
                    &amp;{" "}
                    <Link href="/privacy" className="font-bold underline text-blue-600 dark:text-blue-400">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
              >
                {isLoading
                  ? "Creating Account..."
                  : `Create Free ${role === "EMPLOYER" ? "Employer" : "Job Seeker"} Account`}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500">
              Already registered?{" "}
              <button
                type="button"
                onClick={() => triggerBack("/auth/login")}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 text-slate-500">
          Loading signup portal...
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
