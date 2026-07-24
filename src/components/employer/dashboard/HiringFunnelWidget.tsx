"use client";

import React from "react";
import { Filter } from "lucide-react";

export type FunnelData =
  | {
      applied?: number;
      screening?: number;
      interview?: number;
      offer?: number;
      hired?: number;
    }
  | Array<{ stage: string; count: number; percentage?: number }>;

interface HiringFunnelWidgetProps {
  funnel?: FunnelData;
  isDark?: boolean;
}

export function HiringFunnelWidget({ funnel, isDark = false }: HiringFunnelWidgetProps) {
  let stages: Array<{ label: string; count: number; color: string }> = [];

  if (Array.isArray(funnel)) {
    const colorMap: Record<string, string> = {
      Applied: "bg-blue-600",
      Screening: "bg-indigo-600",
      Interview: "bg-amber-500",
      Offer: "bg-purple-600",
      Hired: "bg-emerald-600",
    };

    stages = funnel.map((item) => ({
      label: item.stage,
      count: item.count || 0,
      color: colorMap[item.stage] || "bg-blue-600",
    }));
  } else if (funnel && typeof funnel === "object") {
    stages = [
      { label: "Applied", count: funnel.applied || 0, color: "bg-blue-600" },
      { label: "Screening", count: funnel.screening || 0, color: "bg-indigo-600" },
      { label: "Interview", count: funnel.interview || 0, color: "bg-amber-500" },
      { label: "Offer", count: funnel.offer || 0, color: "bg-purple-600" },
      { label: "Hired", count: funnel.hired || 0, color: "bg-emerald-600" },
    ];
  } else {
    // Default fallback stages
    stages = [
      { label: "Applied", count: 248, color: "bg-blue-600" },
      { label: "Screening", count: 142, color: "bg-indigo-600" },
      { label: "Interview", count: 48, color: "bg-amber-500" },
      { label: "Offer", count: 14, color: "bg-purple-600" },
      { label: "Hired", count: 8, color: "bg-emerald-600" },
    ];
  }

  const total = Math.max(1, stages[0]?.count || 1);

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-6 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-bold">Candidate Hiring Funnel</h2>
        </div>
        <span className="text-xs font-semibold text-slate-500">Stage Conversion</span>
      </div>

      <div className="space-y-4">
        {stages.map((stage) => {
          const percentage = Math.round((stage.count / total) * 100);

          return (
            <div key={stage.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">{stage.label}</span>
                <span className="text-slate-900 dark:text-white">
                  {stage.count.toLocaleString()}{" "}
                  <span className="text-slate-400 font-normal">({percentage}%)</span>
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full ${stage.color} transition-all duration-500 rounded-full`}
                  style={{ width: `${Math.max(5, percentage)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
