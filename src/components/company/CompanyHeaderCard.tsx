"use client";

import React from "react";
import { Building2, ShieldCheck, MapPin, Globe, Sparkles, ExternalLink } from "lucide-react";
import { CompanyCompletionReport } from "@/lib/company/company-completion";

interface CompanyHeaderCardProps {
  company: any;
  report: CompanyCompletionReport;
  isDark?: boolean;
}

export function CompanyHeaderCard({ company, report, isDark = false }: CompanyHeaderCardProps) {
  return (
    <div
      className={`rounded-2xl border shadow-sm overflow-hidden ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      {/* Cover Image Banner */}
      <div className="h-40 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        {company.coverImageUrl && (
          <img src={company.coverImageUrl} alt="Cover" className="w-full h-full object-cover opacity-80" />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Profile Header Content */}
      <div className="p-6 relative pt-0">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-xl flex items-center justify-center font-bold text-slate-800 text-2xl shrink-0 overflow-hidden">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                company.name ? company.name.charAt(0).toUpperCase() : "C"
              )}
            </div>

            <div className="space-y-1 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{company.name}</h1>
                {company.verificationStatus === "VERIFIED" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Verified Employer
                  </span>
                )}
              </div>

              {company.tagline && (
                <p className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  {company.tagline}
                </p>
              )}

              <div className={`flex items-center gap-3 text-xs flex-wrap ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {company.headquartersCity && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {company.headquartersCity}
                    {company.headquartersState ? `, ${company.headquartersState}` : ""}
                  </span>
                )}

                {company.websiteUrl && (
                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:underline text-blue-600 font-semibold"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    {company.websiteUrl.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Profile Completion Widget */}
          <div className={`p-4 rounded-xl border text-right space-y-1 shrink-0 ${
            isDark ? "bg-slate-900/60 border-slate-700" : "bg-blue-50/60 border-blue-200"
          }`}>
            <div className="flex items-center gap-2 justify-end">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                Company Profile Completion
              </span>
            </div>
            <div className="text-xl font-extrabold text-blue-600">{report.score}%</div>
            <p className="text-[11px] font-semibold text-slate-500">{report.level}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
