"use client";

import React from "react";
import { Activity, Clock } from "lucide-react";

interface EmployerActivityWidgetProps {
  activity: Array<{
    id: string;
    action: string;
    timestamp: string;
  }>;
  isDark?: boolean;
}

export function EmployerActivityWidget({ activity, isDark = false }: EmployerActivityWidgetProps) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-6 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-emerald-600" />
        <h2 className="text-base font-bold">Recent Hiring Audit Stream</h2>
      </div>

      <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-4">
        {activity.length === 0 ? (
          <p className="text-xs text-slate-500 pl-4">No recent employer audit activity recorded.</p>
        ) : (
          activity.map((item) => (
            <div key={item.id} className="relative pl-5 text-xs space-y-0.5">
              <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white dark:border-slate-800" />
              <p className="font-semibold text-slate-800 dark:text-slate-200">{item.action.replace(/_/g, " ")}</p>
              <span className="text-[11px] font-mono text-slate-400 block">
                {new Date(item.timestamp).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
