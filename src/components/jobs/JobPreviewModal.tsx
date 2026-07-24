"use client";

import React from "react";
import { X, MapPin, Building2, Clock, Briefcase, Zap, CheckCircle2 } from "lucide-react";
import { JobPostInput } from "@/lib/jobs/job-validation-schemas";

interface JobPreviewModalProps {
  job: JobPostInput | null;
  companyName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function JobPreviewModal({
  job,
  companyName = "Acme Corp",
  isOpen,
  onClose,
}: JobPreviewModalProps) {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Live Preview Mode
            </span>
            <h2 className="text-sm font-bold text-slate-700">How Candidates Will See This Job</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                {job.type.replace("_", " ")}
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-700">{companyName}</p>

            <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-slate-400" />
                {job.location} ({job.workMode})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4 text-slate-400" />
                {job.experience}
              </span>
              {job.salaryMax && (
                <>
                  <span>•</span>
                  <span className="font-bold text-slate-900">${job.salaryMax.toLocaleString()} / year</span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Job Description</h3>
            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              {job.description}
            </div>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Key Responsibilities</h3>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                {job.responsibilities}
              </div>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Requirements &amp; Qualifications</h3>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                {job.requirements}
              </div>
            </div>
          )}

          {/* Skills Required Tags */}
          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Skills Required</h3>
              <div className="flex flex-wrap gap-1.5">
                {job.skillsRequired.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
