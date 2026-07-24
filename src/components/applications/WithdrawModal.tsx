"use client";

import React, { useState } from "react";
import { AlertOctagon, X, AlertCircle } from "lucide-react";
import { ApplicationCardData } from "./ApplicationCard";

interface WithdrawModalProps {
  application: ApplicationCardData | null;
  isOpen: boolean;
  onClose: () => void;
  onWithdrawSuccess: () => void;
}

export function WithdrawModal({
  application,
  isOpen,
  onClose,
  onWithdrawSuccess,
}: WithdrawModalProps) {
  const [reason, setReason] = useState("Accepted another offer");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !application) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const finalReason = reason === "Other" ? customReason : reason;

    try {
      const res = await fetch(`/api/v1/candidate/applications/${application.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "withdraw",
          reason: finalReason,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to withdraw application.");
      }

      onWithdrawSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error withdrawing application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-bold text-slate-900">Withdraw Application</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to withdraw your application for{" "}
            <span className="font-bold text-slate-900">{application.job.title}</span> at{" "}
            <span className="font-bold text-slate-900">{application.job.company?.name}</span>?
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Reason for Withdrawal
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:border-blue-600"
            >
              <option value="Accepted another offer">Accepted another job offer</option>
              <option value="Salary expectation mismatch">Salary expectation mismatch</option>
              <option value="Location / Commute preference">Location / Commute preference</option>
              <option value="Personal reasons">Personal reasons</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {reason === "Other" && (
            <div>
              <input
                type="text"
                placeholder="Specify reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
                required
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-9 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
            >
              Keep Application
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 h-9 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? "Withdrawing..." : "Confirm Withdrawal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
