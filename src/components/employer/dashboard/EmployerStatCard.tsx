"use client";

import React from "react";
import { TrendingUp, ArrowUpRight } from "lucide-react";

interface EmployerStatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string;
  isDark?: boolean;
}

export function EmployerStatCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
  isDark = false,
}: EmployerStatCardProps) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-3 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl text-white font-bold bg-${color}-600 shadow-sm`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <span className="text-3xl font-extrabold tracking-tight">{value}</span>
        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
          <TrendingUp className="h-3 w-3" />
          <span>Active</span>
        </span>
      </div>

      {subtitle && (
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{subtitle}</p>
      )}
    </div>
  );
}
