"use client";

import React from "react";
import { ShieldCheck, FileCheck, CheckCircle2 } from "lucide-react";
import { FormInput } from "@/components/auth/FormInput";

interface CompanyVerificationSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  isDark?: boolean;
}

export function CompanyVerificationSection({ formData, onChange, isDark = false }: CompanyVerificationSectionProps) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-6 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-emerald-600" />
        <h2 className="text-base font-bold">GST &amp; CIN Business Verification Compliance</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <FormInput
            label="GST Registration Number"
            placeholder="e.g. 22AAAAA0000A1Z5"
            value={formData.gstNumber || ""}
            onChange={(e) => onChange("gstNumber", e.target.value)}
          />
          {formData.isGstVerified ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> GST Verified
            </span>
          ) : (
            <p className="text-[11px] text-slate-400">Enter GST number for employer verification badge.</p>
          )}
        </div>

        <div className="space-y-2">
          <FormInput
            label="Corporate CIN Number"
            placeholder="e.g. U72200MH2018PTC123456"
            value={formData.cinNumber || ""}
            onChange={(e) => onChange("cinNumber", e.target.value)}
          />
          {formData.isCinVerified ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> CIN Verified
            </span>
          ) : (
            <p className="text-[11px] text-slate-400">Corporate Identification Number for legal verification.</p>
          )}
        </div>
      </div>
    </div>
  );
}
