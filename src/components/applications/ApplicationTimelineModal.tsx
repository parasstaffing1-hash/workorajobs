"use client";

import React from "react";
import { History, X, CheckCircle2, Clock, Award, XCircle, Send, Search, Calendar, Gift } from "lucide-react";
import { ApplicationCardData } from "./ApplicationCard";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";

interface ApplicationTimelineModalProps {
  application: ApplicationCardData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationTimelineModal({
  application,
  isOpen,
  onClose,
}: ApplicationTimelineModalProps) {
  if (!isOpen || !application) return null;

  const funnelSteps = [
    { key: "APPLIED", label: "Applied" },
    { key: "UNDER_REVIEW", label: "Under Review" },
    { key: "INTERVIEW_SCHEDULED", label: "Interview" },
    { key: "OFFER_EXTENDED", label: "Offer" },
    { key: "HIRED", label: "Hired" },
  ];

  const currentStatusIndex = funnelSteps.findIndex(
    (s) => s.key === application.status
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
              <History className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Application Status Timeline</h2>
              <p className="text-xs text-slate-500">
                {application.job.title} at {application.job.company?.name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Recruitment Funnel Visual Progress */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Recruitment Funnel Progress
            </p>
            <div className="grid grid-cols-5 gap-1.5 text-center text-[11px] font-semibold">
              {funnelSteps.map((step, idx) => {
                const isPassed =
                  application.status === "HIRED" ||
                  (currentStatusIndex >= idx && application.status !== "REJECTED" && application.status !== "WITHDRAWN");
                const isCurrent = step.key === application.status;

                return (
                  <div key={step.key} className="space-y-1">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isPassed
                          ? "bg-blue-600"
                          : isCurrent
                          ? "bg-amber-500"
                          : "bg-slate-200"
                      }`}
                    />
                    <span className={isPassed ? "text-blue-900 font-bold" : "text-slate-400"}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Status Callout */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/60 border border-blue-200">
            <span className="text-xs font-semibold text-blue-900">Current Status:</span>
            <ApplicationStatusBadge status={application.status} />
          </div>

          {/* Detailed Timeline Audit Log */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Audit Event Log ({application.timeline.length})
            </h4>

            <div className="relative border-l-2 border-slate-200 ml-4 space-y-4">
              {application.timeline.map((event, idx) => (
                <div key={event.id || idx} className="relative pl-6">
                  <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 border-blue-600 bg-white flex items-center justify-center" />
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">
                        Status changed to {event.toStatus}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {new Date(event.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {event.note && (
                      <p className="text-xs text-slate-600 font-medium">{event.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-5 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
          >
            Close Timeline
          </button>
        </div>
      </div>
    </div>
  );
}
