"use client";

import React from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  Copy,
  Edit3,
  PauseCircle,
  PlayCircle,
  Trash2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { JobStatusBadge } from "./JobStatusBadge";

export interface EmployerJobItemData {
  id: string;
  title: string;
  slug?: string;
  department?: string;
  location: string;
  type: string;
  workMode: string;
  salary?: number;
  salaryMin?: number;
  salaryMax?: number;
  status: string;
  version: number;
  applicantCount: number;
  postedAt: string;
  updatedAt: string;
  company: {
    name: string;
    logoUrl?: string;
  };
}

interface JobCardEmployerProps {
  job: EmployerJobItemData;
  onDuplicate: (jobId: string) => void;
  onChangeStatus: (jobId: string, newStatus: string) => void;
  onDelete: (jobId: string) => void;
}

export function JobCardEmployer({
  job,
  onDuplicate,
  onChangeStatus,
  onDelete,
}: JobCardEmployerProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 shrink-0 flex items-center justify-center font-bold text-slate-700 text-lg">
            {job.company.logoUrl ? (
              <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              job.company.name.charAt(0)
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900 text-base hover:text-blue-600">
                <Link href={`/employer/jobs/${job.id}/edit`}>{job.title}</Link>
              </h3>
              <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                v{job.version}.0
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-700">{job.company.name}</p>

            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap pt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {job.location} ({job.workMode})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Updated {new Date(job.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="shrink-0">
          <JobStatusBadge status={job.status} />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-600 shrink-0" />
          <span className="text-slate-600">Total Applicants:</span>
          <span className="font-extrabold text-slate-900">{job.applicantCount} Candidates</span>
        </div>

        <Link
          href={`/employer/applications?jobId=${job.id}`}
          className="font-bold text-blue-600 hover:underline flex items-center gap-0.5"
        >
          <span>View Applicants</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Card Actions Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap text-xs">
        <div className="flex items-center gap-2">
          <Link
            href={`/employer/jobs/${job.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5 text-blue-600" />
            <span>Edit</span>
          </Link>

          <button
            onClick={() => onDuplicate(job.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
          >
            <Copy className="h-3.5 w-3.5 text-purple-600" />
            <span>Duplicate</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {job.status === "PUBLISHED" ? (
            <button
              onClick={() => onChangeStatus(job.id, "PAUSED")}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-amber-300 text-amber-900 bg-amber-50 font-semibold cursor-pointer"
            >
              <PauseCircle className="h-3.5 w-3.5" />
              <span>Pause Job</span>
            </button>
          ) : job.status === "PAUSED" || job.status === "DRAFT" ? (
            <button
              onClick={() => onChangeStatus(job.id, "PUBLISHED")}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold cursor-pointer"
            >
              <PlayCircle className="h-3.5 w-3.5" />
              <span>Publish Live</span>
            </button>
          ) : null}

          <button
            onClick={() => onDelete(job.id)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 cursor-pointer"
            title="Delete Job"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
