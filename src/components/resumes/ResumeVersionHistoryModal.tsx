"use client";

import React from "react";
import { History, X, Download, FileText, Clock, CheckCircle2 } from "lucide-react";
import { ResumeCardData } from "./ResumeCard";
import { formatFileSize } from "@/lib/resumes/resume-validation";

interface ResumeVersionHistoryModalProps {
  resume: ResumeCardData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeVersionHistoryModal({
  resume,
  isOpen,
  onClose,
}: ResumeVersionHistoryModalProps) {
  if (!isOpen || !resume) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-bold text-slate-900">Version History</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <p className="text-xs text-slate-600">
            Audit history of all uploaded versions for <span className="font-bold text-slate-900">{resume.title}</span>.
          </p>

          <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
            {resume.versions.map((ver, idx) => (
              <div key={ver.id || idx} className="relative pl-6">
                <div
                  className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                    ver.version === resume.version
                      ? "border-blue-600 bg-blue-600"
                      : "border-slate-300"
                  }`}
                />

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        Version {ver.version}.0
                      </span>
                      {ver.version === resume.version && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          Active Current
                        </span>
                      )}
                    </div>
                    <a
                      href={ver.fileUrl}
                      download={ver.fileName}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </a>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    {ver.changeSummary || "Version update"}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
                    <span>{ver.fileName}</span>
                    <span>•</span>
                    <span>{formatFileSize(ver.fileSize)}</span>
                    <span>•</span>
                    <span>{new Date(ver.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-5 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
