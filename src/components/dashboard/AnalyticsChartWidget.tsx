"use client";

import React from "react";
import { BarChart3, TrendingUp } from "lucide-react";

interface AnalyticsChartWidgetProps {
  trendData: Array<{
    month: string;
    applications: number;
    interviews: number;
  }>;
  isDark?: boolean;
}

export function AnalyticsChartWidget({ trendData, isDark = false }: AnalyticsChartWidgetProps) {
  const maxVal = Math.max(...trendData.map((d) => Math.max(d.applications, d.interviews, 5)));

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-6 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-bold">Application Velocity &amp; Interview Trend</h2>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
            Applications
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            Interviews
          </span>
        </div>
      </div>

      {/* SVG / Bar Chart Representation */}
      <div className="h-48 flex items-end justify-between gap-4 pt-4 px-2 border-b border-slate-200 dark:border-slate-700">
        {trendData.map((item, idx) => {
          const appHeightPct = Math.round((item.applications / maxVal) * 100);
          const intHeightPct = Math.round((item.interviews / maxVal) * 100);

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div className="w-full flex items-end justify-center gap-1.5 h-full">
                {/* Applications Bar */}
                <div
                  className="w-1/2 max-w-[24px] bg-blue-600 hover:bg-blue-700 rounded-t-lg transition-all duration-300 relative group/bar cursor-pointer"
                  style={{ height: `${Math.max(8, appHeightPct)}%` }}
                >
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                    {item.applications}
                  </span>
                </div>

                {/* Interviews Bar */}
                <div
                  className="w-1/2 max-w-[24px] bg-amber-500 hover:bg-amber-600 rounded-t-lg transition-all duration-300 relative group/bar cursor-pointer"
                  style={{ height: `${Math.max(8, intHeightPct)}%` }}
                >
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                    {item.interviews}
                  </span>
                </div>
              </div>

              <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
