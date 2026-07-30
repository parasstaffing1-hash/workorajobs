"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldCheck } from "lucide-react";

import { AuthAlert } from "@/components/auth/AuthAlert";
import { FormInput } from "@/components/auth/FormInput";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { SiteLogo } from "@/components/layout/site-logo";

export default function SetPasswordPage() {
  const router = useRouter();
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [role, setRole] = useState("JOB_SEEKER");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success" | "info"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/v1/auth/change-password", { cache: "no-store" })
      .then(async (response) => ({ response, data: await response.json().catch(() => ({})) }))
      .then(({ response, data }) => {
        if (!response.ok) throw new Error(data.error || "Sign in to manage your password.");
        setHasPassword(Boolean(data.hasPassword));
        setRole(data.role || "JOB_SEEKER");
      })
      .catch((error) => {
        setAlert({ type: "error", message: error.message });
        setIsAuthorized(false);
      });
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setAlert(null);
    if (newPassword !== confirmPassword) {
      setAlert({ type: "error", message: "New passwords do not match." });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.error || "Password update failed.");
      setHasPassword(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setAlert({ type: "success", message: data.message });
    } catch (error: any) {
      setAlert({ type: "error", message: error.message || "Password update failed." });
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardUrl = role === "EMPLOYER" ? "/employer/dashboard" : "/candidate/dashboard";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <SiteLogo />
          <Link href={dashboardUrl} className="text-xs font-bold text-blue-600 hover:underline">
            Back to dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md items-center px-4 py-10">
        <div className="w-full space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black">{hasPassword ? "Change password" : "Create a password"}</h1>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {hasPassword
                ? "Confirm your current password, then choose a new one."
                : "You signed in securely with Google or LinkedIn. Create a password to also use normal email sign-in."}
            </p>
          </div>

          {alert && <AuthAlert type={alert.type} message={alert.message} />}

          {!isAuthorized && (
            <Link
              href="/auth/login"
              className="flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700"
            >
              Sign in securely
            </Link>
          )}

          {isAuthorized && hasPassword !== null && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {hasPassword && (
                <FormInput
                  label="Current password"
                  isPassword
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  required
                />
              )}
              <FormInput
                label="New password"
                isPassword
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
              <PasswordStrengthMeter password={newPassword} />
              <FormInput
                label="Confirm new password"
                isPassword
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                <ShieldCheck className="h-4 w-4" />
                {isLoading ? "Saving..." : hasPassword ? "Change password" : "Create password"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
