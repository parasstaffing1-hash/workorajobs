"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, MapPin, Building2, ChevronRight } from "lucide-react";
import { OneClickApplyButton } from "@/components/applications/OneClickApplyButton";

interface JobItem {
  id: string;
  title: string;
  location: string;
  type: string;
  workMode: string;
  salary?: string;
  postedAt: string;
  company: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  matchScore: number;
}

interface RecommendedJobsWidgetProps {
  jobs: JobItem[];
  isDark?: boolean;
  onApplied?: () => void;
}

export function RecommendedJobsWidget({ jobs, isDark = false, onApplied }: RecommendedJobsWidgetProps) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-4 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-bold">Recommended Jobs for You</h2>
        </div>
        <Link
          href="/jobs"
          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
        >
          <span>View All</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`p-4 rounded-xl border transition-all hover:shadow-sm space-y-3 flex flex-col justify-between ${
              isDark ? "bg-slate-900/60 border-slate-700" : "bg-slate-50 border-slate-200/80"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0 overflow-hidden">
                    {job.company.logoUrl ? (
                      <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
                    ) : (
                      job.company.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm hover:text-blue-600 truncate max-w-[180px]">
                      <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                    </h3>
                    <p className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {job.company.name}
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200 shrink-0">
                  {job.matchScore}% Match
                </span>
              </div>

              <div className={`flex items-center gap-3 text-xs flex-wrap ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location} ({job.workMode})
                </span>
                {job.salary && <span>• {job.salary}</span>}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2">
              <Link
                href={`/jobs/${job.id}`}
                className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:underline"
              >
                View Details
              </Link>

              <OneClickApplyButton jobId={job.id} onSuccess={onApplied} className="h-8 px-3 text-[11px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
