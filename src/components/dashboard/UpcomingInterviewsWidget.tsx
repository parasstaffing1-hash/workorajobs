"use client";

import React from "react";
import { Calendar, Video, Clock, MapPin, ExternalLink } from "lucide-react";

interface UpcomingInterviewsWidgetProps {
  interviews: Array<{
    id: string;
    title: string;
    scheduledAt: string;
    durationMins: number;
    locationUrl?: string | null;
    notes?: string | null;
    jobTitle: string;
    companyName: string;
  }>;
  isDark?: boolean;
}

export function UpcomingInterviewsWidget({ interviews, isDark = false }: UpcomingInterviewsWidgetProps) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-4 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-amber-600" />
          <h2 className="text-base font-bold">Upcoming Scheduled Interviews ({interviews.length})</h2>
        </div>
      </div>

      {interviews.length === 0 ? (
        <p className={`text-xs italic py-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          No interviews scheduled at the moment. Keep applying to active job openings.
        </p>
      ) : (
        <div className="space-y-3">
          {interviews.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border space-y-2 ${
                isDark ? "bg-slate-900/60 border-slate-700" : "bg-amber-50/50 border-amber-200/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                  {item.title} ({item.companyName})
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  {item.durationMins} mins
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.jobTitle}</p>

              <div className="flex items-center justify-between gap-2 text-xs pt-1">
                <span className="flex items-center gap-1 font-mono font-medium text-amber-700 dark:text-amber-300">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(item.scheduledAt).toLocaleString()}
                </span>

                {item.locationUrl && (
                  <a
                    href={item.locationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700"
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Join Call</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
