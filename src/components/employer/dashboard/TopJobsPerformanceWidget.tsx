"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, Users, ChevronRight, ArrowUpRight } from "lucide-react";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";

interface TopJobsPerformanceWidgetProps {
  jobs: Array<{
    id: string;
    title: string;
    location: string;
    status: string;
    applicantCount: number;
  }>;
  isDark?: boolean;
}

export function TopJobsPerformanceWidget({ jobs, isDark = false }: TopJobsPerformanceWidgetProps) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-6 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-purple-600" />
          <h2 className="text-base font-bold">Top Performing Job Postings</h2>
        </div>
        <Link href="/employer/jobs" className="text-xs font-bold text-blue-600 hover:underline">
          View All Postings
        </Link>
      </div>

      <div className="space-y-3">
        {jobs.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No active job performance metrics yet.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-colors ${
                isDark ? "bg-slate-900/60 border-slate-700 hover:bg-slate-700/50" : "bg-slate-50 border-slate-200 hover:bg-slate-100/80"
              }`}
            >
              <div className="space-y-0.5">
                <Link href={`/employer/jobs/${job.id}/edit`} className="font-bold text-xs hover:text-blue-600">
                  {job.title}
                </Link>
                <p className="text-[11px] text-slate-500">{job.location}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                    {job.applicantCount} Apps
                  </span>
                  <JobStatusBadge status={job.status} />
                </div>
                <Link href={`/employer/ats?jobId=${job.id}`} className="text-slate-400 hover:text-blue-600">
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
