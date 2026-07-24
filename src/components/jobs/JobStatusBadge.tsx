"use client";

import React from "react";
import { CheckCircle2, FileEdit, Clock, PauseCircle, XCircle, Archive } from "lucide-react";

interface JobStatusBadgeProps {
  status: string;
}

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  const config = {
    PUBLISHED: {
      label: "Live & Active",
      bg: "bg-emerald-50 text-emerald-800 border-emerald-300",
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />,
    },
    DRAFT: {
      label: "Draft",
      bg: "bg-amber-50 text-amber-900 border-amber-300",
      icon: <FileEdit className="h-3.5 w-3.5 text-amber-600" />,
    },
    SCHEDULED: {
      label: "Scheduled",
      bg: "bg-blue-50 text-blue-800 border-blue-200",
      icon: <Clock className="h-3.5 w-3.5 text-blue-600" />,
    },
    PAUSED: {
      label: "Paused",
      bg: "bg-slate-100 text-slate-700 border-slate-300",
      icon: <PauseCircle className="h-3.5 w-3.5 text-slate-500" />,
    },
    CLOSED: {
      label: "Closed",
      bg: "bg-red-50 text-red-800 border-red-200",
      icon: <XCircle className="h-3.5 w-3.5 text-red-600" />,
    },
    ARCHIVED: {
      label: "Archived",
      bg: "bg-slate-100 text-slate-500 border-slate-200 line-through",
      icon: <Archive className="h-3.5 w-3.5 text-slate-400" />,
    },
  }[status] || {
    label: status,
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    icon: <Clock className="h-3.5 w-3.5" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.bg}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}
