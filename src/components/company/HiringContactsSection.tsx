"use client";

import React from "react";
import { Users, Mail, Phone, UserCheck } from "lucide-react";
import { FormInput } from "@/components/auth/FormInput";

interface HiringContactsSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  isDark?: boolean;
}

export function HiringContactsSection({ formData, onChange, isDark = false }: HiringContactsSectionProps) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-6 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-indigo-600" />
        <h2 className="text-base font-bold">Hiring &amp; HR Contacts</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Official Hiring / Careers Email"
          type="email"
          placeholder="careers@company.com"
          value={formData.hiringEmail || ""}
          onChange={(e) => onChange("hiringEmail", e.target.value)}
        />

        <FormInput
          label="HR Head / Manager Contact Name"
          placeholder="e.g. Sarah Jenkins"
          value={formData.hrContactName || ""}
          onChange={(e) => onChange("hrContactName", e.target.value)}
        />

        <FormInput
          label="HR Contact Email"
          type="email"
          placeholder="hr@company.com"
          value={formData.hrContactEmail || ""}
          onChange={(e) => onChange("hrContactEmail", e.target.value)}
        />

        <FormInput
          label="Lead Technical Recruiter Contact"
          placeholder="e.g. Alex Rivera"
          value={formData.recruiterContactName || ""}
          onChange={(e) => onChange("recruiterContactName", e.target.value)}
        />
      </div>
    </div>
  );
}
