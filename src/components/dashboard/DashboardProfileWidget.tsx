"use client";

import React from "react";
import Link from "next/link";
import { UserCheck, Sparkles, ChevronRight, AlertCircle } from "lucide-react";
import { ProfileCompletionReport } from "@/lib/profile/profile-completion";

interface DashboardProfileWidgetProps {
  report: ProfileCompletionReport;
  isDark?: boolean;
}

export function DashboardProfileWidget({ report, isDark = false }: DashboardProfileWidgetProps) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-4 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-bold">Profile Completion</h2>
        </div>
        <span className="text-sm font-extrabold text-blue-600">{report.score}%</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${report.score}%` }}
        />
      </div>

      <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
        Status: <span className="font-bold text-blue-600">{report.level}</span> candidate profile
      </p>

      {report.missingItems.length > 0 && (
        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quick Improvements:</p>
          <div className="space-y-1">
            {report.missingItems.slice(0, 2).map((item) => (
              <div key={item.field} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300">Add {item.label}</span>
                <span className="font-bold text-blue-600">+{item.points}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Link
        href="/candidate/profile"
        className="inline-flex items-center justify-center gap-1 w-full h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-100 transition-colors"
      >
        <span>Complete Profile</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
