"use client";

import React from "react";
import { Send, Search, Calendar, Gift, TrendingUp, Award } from "lucide-react";

interface AnalyticsOverviewWidgetProps {
  stats: {
    totalApplied: number;
    underReview: number;
    interviews: number;
    offers: number;
    responseRate: number;
  };
  isDark?: boolean;
}

export function AnalyticsOverviewWidget({ stats, isDark = false }: AnalyticsOverviewWidgetProps) {
  const cards = [
    {
      label: "Total Applications",
      value: stats.totalApplied,
      sub: "Submitted to date",
      icon: <Send className="h-5 w-5 text-blue-600" />,
      bg: isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200",
    },
    {
      label: "Under Review",
      value: stats.underReview,
      sub: "Recruiter reviewing",
      icon: <Search className="h-5 w-5 text-indigo-600" />,
      bg: isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200",
    },
    {
      label: "Interviews",
      value: stats.interviews,
      sub: "Scheduled / Completed",
      icon: <Calendar className="h-5 w-5 text-amber-600" />,
      bg: isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200",
    },
    {
      label: "Offers & Hired",
      value: stats.offers,
      sub: "Job offers received",
      icon: <Gift className="h-5 w-5 text-emerald-600" />,
      bg: isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200",
    },
    {
      label: "Response Rate",
      value: `${stats.responseRate}%`,
      sub: "Recruiter engagement",
      icon: <TrendingUp className="h-5 w-5 text-purple-600" />,
      bg: isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((c, idx) => (
        <div
          key={idx}
          className={`p-5 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between space-y-3 ${c.bg}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {c.label}
            </span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 shrink-0">
              {c.icon}
            </div>
          </div>

          <div>
            <span className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {c.value}
            </span>
            <p className={`text-[11px] font-medium mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {c.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
