"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, ShieldCheck, CheckCircle2, Send, ArrowRight } from "lucide-react";
import { FormInput } from "@/components/auth/FormInput";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function EmployerVerifyEmailPage() {
  const [otpCode, setOtpCode] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const handleSendOtp = async () => {
    setIsLoading(true);
    setAlert(null);
    try {
      const res = await fetch("/api/v1/employer/auth/phone-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to send OTP.");
      setDemoCode(data.demoOtpCode || "");
      setAlert({ type: "success", message: `SMS OTP code dispatched! (Demo Code: ${data.demoOtpCode})` });
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Error sending OTP." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    try {
      const res = await fetch("/api/v1/employer/auth/phone-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", otpCode }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "OTP verification failed.");

      setAlert({ type: "success", message: "Employer phone number & account verified successfully!" });
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Invalid OTP code." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
          <span>Employer Account Verification</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Verify Employer Credentials
        </h1>
        <p className="text-xs text-slate-600">
          To maintain hiring compliance, verify your business email and official phone number.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200/80 space-y-6">
          {alert && <AuthAlert type={alert.type} message={alert.message} />}

          {/* Section 1: Business Email Verification */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-xs text-blue-900">1. Business Email Check</h3>
            </div>
            <p className="text-xs text-slate-600">
              A verification link was sent to your registered work email. Click the link to complete verification.
            </p>
          </div>

          {/* Section 2: Phone SMS OTP Verification */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-purple-600" />
                <h3 className="font-bold text-xs text-slate-900">2. Phone 2FA SMS Verification</h3>
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isLoading}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer disabled:opacity-50"
              >
                Send SMS OTP
              </button>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <FormInput
                label="6-Digit SMS Code"
                placeholder="e.g. 123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                required
              />

              <button
                type="submit"
                disabled={isLoading || otpCode.length !== 6}
                className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Verify Phone OTP</span>
                <CheckCircle2 className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link
              href="/employer/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
            >
              <span>Continue to Employer Login</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
