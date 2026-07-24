"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Building2, Sparkles, CheckCircle2 } from "lucide-react";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"JOB_SEEKER" | "EMPLOYER">("JOB_SEEKER");

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          name: role === "JOB_SEEKER" ? name : undefined,
          companyName: role === "EMPLOYER" ? companyName : undefined,
          email,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed.");
      }

      setAlert({ type: "success", message: "Account created! Redirecting to dashboard..." });

      setTimeout(() => {
        if (role === "EMPLOYER") {
          router.push("/employer/dashboard");
        } else {
          router.push("/candidate/dashboard");
        }
      }, 800);
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Registration failed." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 py-12 text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Sparkles className="h-3 w-3" /> Create Account
          </span>
          <h1 className="text-2xl font-black">Join Workora Jobs</h1>
          <p className="text-xs text-slate-500">Choose your role to get started</p>
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
          {role === "JOB_SEEKER" ? (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none focus:border-blue-600"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                placeholder="Acme Enterprise Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none focus:border-blue-600"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              {role === "EMPLOYER" ? "Work Email Address" : "Email Address"}
            </label>
            <input
              type="email"
              required
              placeholder={role === "EMPLOYER" ? "hr@acme.com" : "you@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span>
                I agree to the <Link href="/terms" className="font-bold underline">Terms of Service</Link> &amp; <Link href="/privacy" className="font-bold underline">Privacy Policy</Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
          >
            {isLoading ? "Creating Account..." : "Create Free Account"}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-bold text-blue-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
