"use client";

import React from "react";
import Link from "next/link";
import { FileText, Star, RefreshCw, ChevronRight } from "lucide-react";
import { formatFileSize } from "@/lib/resumes/resume-validation";

interface DashboardResumeWidgetProps {
  resume: {
    id: string;
    title: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    version: number;
    updatedAt: string;
  } | null;
  isDark?: boolean;
}

export function DashboardResumeWidget({ resume, isDark = false }: DashboardResumeWidgetProps) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-4 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-bold">Primary Default Resume</h2>
        </div>
        {resume && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
            <Star className="h-3 w-3 fill-emerald-600" />
            Default
          </span>
        )}
      </div>

      {resume ? (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs truncate">{resume.title}</h3>
              <span className="font-mono font-bold text-[10px] text-blue-600">v{resume.version}.0</span>
            </div>
            <p className="text-[11px] font-mono text-slate-500 truncate">{resume.fileName} • {formatFileSize(resume.fileSize)}</p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <a
              href={resume.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View Document &rarr;
            </a>

            <Link
              href="/candidate/resumes"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900"
            >
              <span>Manage Resumes</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 space-y-2">
          <p className={`text-xs italic ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            No primary default resume selected.
          </p>
          <Link
            href="/candidate/resumes"
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
          >
            Upload Primary Resume
          </Link>
        </div>
      )}
    </div>
  );
}
