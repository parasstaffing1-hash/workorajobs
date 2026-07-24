"use client";

import React from "react";
import { BarChart2 } from "lucide-react";

interface ApplicationTrendChartProps {
  data?: Array<{ date: string; count: number }>;
  isDark?: boolean;
}

export function ApplicationTrendChart({ data = [], isDark = false }: ApplicationTrendChartProps) {
  const chartData = Array.isArray(data) && data.length > 0 ? data : [
    { date: "Day 1", count: 12 },
    { date: "Day 2", count: 18 },
    { date: "Day 3", count: 24 },
    { date: "Day 4", count: 31 },
    { date: "Day 5", count: 22 },
  ];

  const maxCount = Math.max(1, ...chartData.map((d) => d.count || 0));

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-6 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-bold">14-Day Application Trends</h2>
        </div>
        <span className="text-xs font-semibold text-slate-500">Daily Candidate Submissions</span>
      </div>

      {/* SVG Bar Chart Visualization */}
      <div className="h-44 w-full flex items-end justify-between gap-1.5 pt-6 pb-2">
        {chartData.map((item, index) => {
          const count = item.count || 0;
          const heightPercent = Math.max(8, (count / maxCount) * 100);

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-extrabold text-blue-600 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded border border-blue-200">
                {count}
              </div>

              <div
                className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg transition-all duration-300 hover:brightness-110"
                style={{ height: `${heightPercent}%` }}
              />

              <span className="text-[10px] font-semibold text-slate-400 truncate max-w-full">
                {item.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
