"use client";

import React from "react";
import Link from "next/link";
import { Eye, MapPin, ChevronRight } from "lucide-react";

interface RecentlyViewedWidgetProps {
  jobs: Array<{
    id: string;
    title: string;
    location: string;
    company: { name: string; logoUrl?: string };
  }>;
  isDark?: boolean;
}

export function RecentlyViewedWidget({ jobs, isDark = false }: RecentlyViewedWidgetProps) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-4 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-bold">Recently Viewed Jobs</h2>
        </div>
      </div>

      <div className="space-y-2.5">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
              isDark
                ? "bg-slate-900/60 border-slate-700 hover:bg-slate-700/60"
                : "bg-slate-50 border-slate-200/80 hover:bg-slate-100"
            }`}
          >
            <div className="space-y-0.5 truncate">
              <h3 className="font-bold text-xs truncate hover:text-blue-600">{job.title}</h3>
              <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {job.company.name} • {job.location}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
