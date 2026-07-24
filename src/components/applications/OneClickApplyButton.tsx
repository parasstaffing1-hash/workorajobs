"use client";

import React, { useState } from "react";
import { Zap, CheckCircle2, AlertCircle } from "lucide-react";

interface OneClickApplyButtonProps {
  jobId: string;
  onSuccess?: () => void;
  className?: string;
}

export function OneClickApplyButton({
  jobId,
  onSuccess,
  className = "",
}: OneClickApplyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/candidate/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          isOneClick: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "1-Click Apply failed.");
      }

      setApplied(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Error applying.");
    } finally {
      setIsLoading(false);
    }
  };

  if (applied) {
    return (
      <span className="inline-flex items-center gap-1.5 px-4 h-11 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        <span>Applied via 1-Click</span>
      </span>
    );
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleApply}
        disabled={isLoading}
        className={`inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 ${className}`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            <span>Submitting...</span>
          </div>
        ) : (
          <>
            <Zap className="h-4 w-4 fill-white" />
            <span>1-Click Apply</span>
          </>
        )}
      </button>

      {error && <p className="text-[11px] font-semibold text-red-600 mt-1">{error}</p>}
    </div>
  );
}
