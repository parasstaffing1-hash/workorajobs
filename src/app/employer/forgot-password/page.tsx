"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { FormInput } from "@/components/auth/FormInput";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function EmployerForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    try {
      const res = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to process request.");

      setAlert({
        type: "success",
        message: "Password reset link sent to your business email.",
      });
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Error requesting password reset." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Reset Employer Password
        </h1>
        <p className="text-xs text-slate-600">
          Enter your registered business email address and we will send you password reset instructions.
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Sending Reset Link...</span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Reset Instructions</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link
              href="/employer/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Employer Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
