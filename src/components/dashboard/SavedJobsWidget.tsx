"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, MapPin, ChevronRight } from "lucide-react";
import { OneClickApplyButton } from "@/components/applications/OneClickApplyButton";

interface SavedJobItem {
  id: string;
  title: string;
  location: string;
  type: string;
  workMode: string;
  salary?: string;
  company: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  savedAt: string;
}

interface SavedJobsWidgetProps {
  jobs: SavedJobItem[];
  isDark?: boolean;
}

export function SavedJobsWidget({ jobs, isDark = false }: SavedJobsWidgetProps) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-4 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-bold">Saved Jobs ({jobs.length})</h2>
        </div>
        <Link href="/jobs" className="text-xs font-bold text-blue-600 hover:underline">
          Browse More
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className={`text-xs italic py-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          No bookmarked jobs yet. Save interesting jobs while browsing to review them later.
        </p>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                isDark ? "bg-slate-900/60 border-slate-700" : "bg-slate-50 border-slate-200/80"
              }`}
            >
              <div className="space-y-0.5 min-w-0">
                <h3 className="font-bold text-xs truncate hover:text-blue-600">
                  <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                </h3>
                <p className={`text-[11px] font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {job.company.name} • {job.location} ({job.workMode})
                </p>
              </div>

              <OneClickApplyButton jobId={job.id} className="h-8 px-3 text-[11px] shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
