"use client";

import React from "react";
import { X, Download, ExternalLink, FileText } from "lucide-react";
import { ResumeCardData } from "./ResumeCard";
import { formatFileSize } from "@/lib/resumes/resume-validation";

interface ResumePreviewModalProps {
  resume: ResumeCardData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResumePreviewModal({
  resume,
  isOpen,
  onClose,
}: ResumePreviewModalProps) {
  if (!isOpen || !resume) return null;

  const isPdf = resume.fileName.toLowerCase().endsWith(".pdf");

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{resume.title}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-800">
                  v{resume.version}.0
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {resume.fileName} • {formatFileSize(resume.fileSize)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={resume.fileUrl}
              download={resume.fileName}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Preview Viewer Area */}
        <div className="flex-1 bg-slate-100 relative p-2 overflow-auto flex items-center justify-center">
          {isPdf ? (
            <iframe
              src={`${resume.fileUrl}#toolbar=0`}
              className="w-full h-full rounded-xl border border-slate-300 shadow-sm"
              title={resume.title}
            />
          ) : (
            <div className="max-w-md p-8 bg-white rounded-2xl border text-center space-y-4 shadow-sm">
              <FileText className="h-12 w-12 text-blue-600 mx-auto" />
              <h4 className="font-bold text-slate-900 text-base">Document Preview Ready</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Word documents (.docx, .doc) can be downloaded directly or opened in Microsoft Word / Google Docs.
              </p>
              <a
                href={resume.fileUrl}
                download={resume.fileName}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span>Download Word Document ({formatFileSize(resume.fileSize)})</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
