"use client";

import React from "react";
import { Activity, Clock } from "lucide-react";

interface RecentActivityWidgetProps {
  activities: Array<{
    id: string;
    action: string;
    company: string;
    timestamp: string;
    status: string;
  }>;
  isDark?: boolean;
}

export function RecentActivityWidget({ activities, isDark = false }: RecentActivityWidgetProps) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-4 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-bold">Recent Candidate Activity</h2>
        </div>
      </div>

      <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-4">
        {activities.map((item, idx) => (
          <div key={item.id || idx} className="relative pl-5">
            <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white dark:border-slate-800" />
            <div className="space-y-0.5">
              <p className="font-bold text-xs">{item.action}</p>
              <div className={`flex items-center gap-2 text-[11px] font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                <span>{item.company}</span>
                <span>•</span>
                <span>{new Date(item.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
