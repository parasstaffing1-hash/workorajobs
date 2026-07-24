"use client";

import React from "react";
import {
  FileText,
  Star,
  Download,
  Eye,
  RefreshCw,
  History,
  Trash2,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { formatFileSize } from "@/lib/resumes/resume-validation";

export interface ResumeCardData {
  id: string;
  title: string;
  isDefault: boolean;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  versionCount: number;
  versions: Array<{
    id: string;
    version: number;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    changeSummary?: string;
    createdAt: string;
  }>;
}

interface ResumeCardProps {
  resume: ResumeCardData;
  onSetDefault: (id: string) => void;
  onPreview: (resume: ResumeCardData) => void;
  onReplace: (resume: ResumeCardData) => void;
  onVersionHistory: (resume: ResumeCardData) => void;
  onDelete: (id: string) => void;
}

export function ResumeCard({
  resume,
  onSetDefault,
  onPreview,
  onReplace,
  onVersionHistory,
  onDelete,
}: ResumeCardProps) {
  const isDocx =
    resume.fileName.endsWith(".docx") || resume.fileName.endsWith(".doc");

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 p-5 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 ${
        resume.isDefault
          ? "border-blue-500 ring-2 ring-blue-500/10"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Top Card Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Format Icon */}
          <div
            className={`p-3 rounded-xl shrink-0 ${
              isDocx
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <FileText className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                {resume.title}
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                v{resume.version}.0
              </span>
            </div>

            <p className="text-xs text-slate-500 truncate max-w-xs font-mono">
              {resume.fileName} • {formatFileSize(resume.fileSize)}
            </p>

            <p className="text-[11px] text-slate-400">
              Uploaded {new Date(resume.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Primary Default Status Star */}
        {resume.isDefault ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
            <Star className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
            Primary Default
          </span>
        ) : (
          <button
            onClick={() => onSetDefault(resume.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200 cursor-pointer shrink-0"
            title="Set as default application resume"
          >
            <Star className="h-3.5 w-3.5" />
            Make Default
          </button>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-2">
          {/* Preview */}
          <button
            onClick={() => onPreview(resume)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-blue-600" />
            <span>Preview</span>
          </button>

          {/* Download */}
          <a
            href={resume.fileUrl}
            download={resume.fileName}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-emerald-600" />
            <span>Download</span>
          </a>

          {/* Version History */}
          <button
            onClick={() => onVersionHistory(resume)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-medium transition-colors cursor-pointer"
          >
            <History className="h-3.5 w-3.5 text-purple-600" />
            <span>History ({resume.versionCount})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Replace */}
          <button
            onClick={() => onReplace(resume)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 text-blue-600 hover:bg-blue-50 font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Replace</span>
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(resume.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Delete Resume"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
