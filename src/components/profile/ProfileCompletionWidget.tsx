"use client";

import React from "react";
import { Award, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { ProfileCompletionReport } from "@/lib/profile/profile-completion";

interface ProfileCompletionWidgetProps {
  report: ProfileCompletionReport;
  onFixField?: (field: string) => void;
}

export function ProfileCompletionWidget({
  report,
  onFixField,
}: ProfileCompletionWidgetProps) {
  const getBadgeStyle = (level: string) => {
    switch (level) {
      case "All-Star":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Advanced":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Intermediate":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-amber-100 text-amber-800 border-amber-300";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Profile Strength</h2>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeStyle(
            report.level
          )}`}
        >
          {report.level}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-600">Completion Score</span>
          <span className="text-blue-600 text-sm font-extrabold">{report.score}%</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${report.score}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500 font-medium">
          {report.completedItems} of {report.totalItems} key profile sections completed
        </p>
      </div>

      {/* Actionable Missing Items */}
      {report.missingItems.length > 0 && (
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Recommendations to reach 100%:
          </p>
          <div className="space-y-1.5">
            {report.missingItems.slice(0, 4).map((item) => (
              <div
                key={item.field}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-blue-50/50 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>Add {item.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onFixField && onFixField(item.field)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  +{item.points}%
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
