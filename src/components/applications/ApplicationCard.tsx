"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Clock,
  Zap,
  History,
  FileText,
  AlertOctagon,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";

export interface ApplicationCardData {
  id: string;
  status: string;
  appliedAt: string;
  updatedAt: string;
  isOneClick: boolean;
  coverLetter?: string;
  withdrawalReason?: string;
  job: {
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
      industry?: string;
      headquartersCity?: string;
    };
  };
  resume?: {
    id?: string;
    title?: string;
    fileName: string;
    fileUrl: string;
  } | null;
  timeline: Array<{
    id: string;
    fromStatus: string;
    toStatus: string;
    note?: string;
    createdAt: string;
  }>;
  employerNotesCount: number;
}

interface ApplicationCardProps {
  application: ApplicationCardData;
  onViewTimeline: (app: ApplicationCardData) => void;
  onWithdraw: (app: ApplicationCardData) => void;
}

export function ApplicationCard({
  application,
  onViewTimeline,
  onWithdraw,
}: ApplicationCardProps) {
  const { job } = application;
  const isWithdrawn = application.status === "WITHDRAWN";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 shrink-0 overflow-hidden flex items-center justify-center font-bold text-slate-700 text-lg">
            {job.company?.logoUrl ? (
              <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
            ) : (
              job.company?.name ? job.company.name.charAt(0).toUpperCase() : "C"
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900 text-base hover:text-blue-600 transition-colors">
                <Link href={`/jobs/${job.id}`}>{job.title}</Link>
              </h3>
              {application.isOneClick && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <Zap className="h-3 w-3 fill-amber-600 text-amber-600" />
                  1-Click Applied
                </span>
              )}
            </div>

            <p className="text-xs font-semibold text-slate-700">{job.company?.name}</p>

            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap pt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {job.location} ({job.workMode})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Applied {new Date(application.appliedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="shrink-0">
          <ApplicationStatusBadge status={application.status} />
        </div>
      </div>

      {/* Applied Resume & Info Bar */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-600 shrink-0" />
          <span className="text-slate-600">Attached Resume:</span>
          {application.resume ? (
            <a
              href={application.resume.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-slate-900 hover:text-blue-600 hover:underline truncate max-w-xs"
            >
              {application.resume.title || application.resume.fileName}
            </a>
          ) : (
            <span className="font-semibold text-slate-500 italic">Default Candidate Resume</span>
          )}
        </div>

        {application.withdrawalReason && (
          <span className="text-slate-500 italic">
            Reason: {application.withdrawalReason}
          </span>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap text-xs">
        {/* Timeline Modal Trigger */}
        <button
          onClick={() => onViewTimeline(application)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
        >
          <History className="h-4 w-4 text-purple-600" />
          <span>Application Timeline ({application.timeline.length} Steps)</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Withdraw Action if active */}
          {!isWithdrawn && application.status !== "HIRED" && application.status !== "REJECTED" && (
            <button
              onClick={() => onWithdraw(application)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-red-300 text-slate-600 hover:text-red-700 bg-white hover:bg-red-50 font-semibold transition-colors cursor-pointer"
            >
              <AlertOctagon className="h-3.5 w-3.5" />
              <span>Withdraw</span>
            </button>
          )}

          <Link
            href={`/jobs/${job.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer"
          >
            <span>View Posting</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
