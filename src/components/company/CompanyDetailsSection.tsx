"use client";

import React from "react";
import { Building2, Save } from "lucide-react";
import { FormInput } from "@/components/auth/FormInput";

interface CompanyDetailsSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  isDark?: boolean;
}

export function CompanyDetailsSection({ formData, onChange, isDark = false }: CompanyDetailsSectionProps) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-6 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-blue-600" />
        <h2 className="text-base font-bold">Company Overview &amp; Basics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Company Official Name"
          value={formData.name || ""}
          onChange={(e) => onChange("name", e.target.value)}
          required
        />

        <FormInput
          label="Tagline / Slogan"
          placeholder="e.g. Building the Future of Cloud Enterprise Software"
          value={formData.tagline || ""}
          onChange={(e) => onChange("tagline", e.target.value)}
        />

        <FormInput
          label="Official Website URL"
          placeholder="https://company.com"
          value={formData.websiteUrl || ""}
          onChange={(e) => onChange("websiteUrl", e.target.value)}
        />

        <FormInput
          label="Careers Page Link"
          placeholder="https://company.com/careers"
          value={formData.careersUrl || ""}
          onChange={(e) => onChange("careersUrl", e.target.value)}
        />

        <FormInput
          label="Industry Sector"
          placeholder="e.g. Information Technology & Services"
          value={formData.industry || ""}
          onChange={(e) => onChange("industry", e.target.value)}
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Company Size
          </label>
          <select
            value={formData.companySize || "11-50 employees"}
            onChange={(e) => onChange("companySize", e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
          >
            <option value="1-10 employees">1-10 employees</option>
            <option value="11-50 employees">11-50 employees</option>
            <option value="51-200 employees">51-200 employees</option>
            <option value="201-500 employees">201-500 employees</option>
            <option value="501-1000 employees">501-1000 employees</option>
            <option value="1000+ employees">1000+ Enterprise</option>
          </select>
        </div>

        <FormInput
          label="Founded Year"
          type="number"
          placeholder="e.g. 2018"
          value={formData.foundedYear || ""}
          onChange={(e) => onChange("foundedYear", e.target.value)}
        />

        <FormInput
          label="Headquarters City"
          placeholder="e.g. San Francisco / Bengaluru"
          value={formData.headquartersCity || ""}
          onChange={(e) => onChange("headquartersCity", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          About Company Overview
        </label>
        <textarea
          rows={4}
          placeholder="Describe your company mission, tech stack, hiring culture, and products..."
          value={formData.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-blue-600"
        />
      </div>
    </div>
  );
}
