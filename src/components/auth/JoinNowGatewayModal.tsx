"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

interface JoinNowGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: "JOB_SEEKER" | "EMPLOYER";
  onOpenSignIn?: () => void;
}

export function JoinNowGatewayModal({
  isOpen,
  onClose,
  initialRole,
  onOpenSignIn,
}: JoinNowGatewayModalProps) {
  const router = useRouter();
  const [role, setRole] = useState<"JOB_SEEKER" | "EMPLOYER" | null>(initialRole || null);

  const [seekerName, setSeekerName] = useState("");
  const [seekerEmail, setSeekerEmail] = useState("");
  const [seekerPassword, setSeekerPassword] = useState("");
  const [seekerLocation, setSeekerLocation] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [employerEmail, setEmployerEmail] = useState("");
  const [employerPassword, setEmployerPassword] = useState("");
  const [companySize, setCompanySize] = useState("11-50 employees");
  const [country, setCountry] = useState("United States");

  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError("You must agree to the Terms of Service.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (role === "EMPLOYER") {
        const res = await fetch("/api/v1/employer/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: employerEmail,
            password: employerPassword,
            companyName,
            companySize,
            country,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Employer registration failed.");
        }

        onClose();
        router.push("/employer/dashboard");
      } else {
        const res = await fetch("/api/v1/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: seekerName,
            email: seekerEmail,
            password: seekerPassword,
            location: seekerLocation,
            role: "JOB_SEEKER",
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Job seeker registration failed.");
        }

        onClose();
        router.push("/candidate/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed.");
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
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {!role ? (
            <div className="space-y-6">
              <div className="text-center space-y-1.5 pt-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Join Workora Jobs
                </h2>
                <p className="text-xs text-slate-500">Who are you?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setRole("JOB_SEEKER")}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-500 transition-all text-left space-y-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <User className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600">
                    Job Seeker
                  </h3>
                  <p className="text-xs text-slate-500">Find job opportunities, apply with 1-click, and track applications.</p>
                </button>

                <button
                  onClick={() => setRole("EMPLOYER")}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-500 transition-all text-left space-y-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600">
                    Employer
                  </h3>
                  <p className="text-xs text-slate-500">Post job listings, manage talent pipelines, and access verified candidates.</p>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setRole(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                  ← Back to choice
                </button>
                <span className="text-xs font-bold text-slate-400">
                  {role === "EMPLOYER" ? "Employer Account" : "Job Seeker Account"}
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {role === "EMPLOYER" ? "Create Employer Account" : "Create Job Seeker Account"}
                </h2>
                <p className="text-xs text-slate-500">Fill in details to get started instantly</p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 font-semibold text-xs border border-red-200">
                  {error}
                </div>
              )}

              {role === "JOB_SEEKER" ? (
                <>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={seekerName}
                      onChange={(e) => setSeekerName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={seekerEmail}
                      onChange={(e) => setSeekerEmail(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="At least 8 characters"
                      value={seekerPassword}
                      onChange={(e) => setSeekerPassword(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="San Francisco, CA / Remote"
                      value={seekerLocation}
                      onChange={(e) => setSeekerLocation(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Acme Enterprise Corp"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Email <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">(Work Email Recommended)</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com or hr@acme.com"
                      value={employerEmail}
                      onChange={(e) => setEmployerEmail(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="At least 8 characters"
                      value={employerPassword}
                      onChange={(e) => setEmployerPassword(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        Company Size
                      </label>
                      <select
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className="w-full h-10 px-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                      >
                        <option value="1-10 employees">1-10 employees</option>
                        <option value="11-50 employees">11-50 employees</option>
                        <option value="51-200 employees">51-200 employees</option>
                        <option value="201-500 employees">201-500 employees</option>
                        <option value="500+ employees">500+ employees</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>
                    I agree to the <a href="/terms" className="underline font-bold">Terms of Service</a> &amp; <a href="/privacy" className="underline font-bold">Privacy Policy</a>
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

              {/* Social Signup Divider */}
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400 bg-white dark:bg-slate-900 px-2">
                  Or instant sign up with
                </div>
              </div>

              <GoogleSignInButton
                role={role === "EMPLOYER" ? "EMPLOYER" : "JOB_SEEKER"}
                onSuccess={() => {
                  onClose();
                  router.push(role === "EMPLOYER" ? "/employer/dashboard" : "/candidate/dashboard");
                }}
                buttonText={role === "EMPLOYER" ? "Sign up with Google (Work Email)" : "Sign up with Google / Gmail"}
              />

              <div className="text-center text-xs text-slate-500 pt-1">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSignIn?.();
                  }}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
