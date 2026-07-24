"use client";

import React from "react";
import {
  Send,
  Clock,
  Search,
  CheckCircle2,
  Calendar,
  Gift,
  XCircle,
  AlertOctagon,
  Award,
} from "lucide-react";

interface ApplicationStatusBadgeProps {
  status: string;
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const config = {
    APPLIED: {
      label: "Applied",
      bg: "bg-blue-50 text-blue-800 border-blue-200",
      icon: <Send className="h-3.5 w-3.5 text-blue-600" />,
    },
    PENDING: {
      label: "Pending Review",
      bg: "bg-slate-100 text-slate-700 border-slate-200",
      icon: <Clock className="h-3.5 w-3.5 text-slate-500" />,
    },
    UNDER_REVIEW: {
      label: "Under Review",
      bg: "bg-indigo-50 text-indigo-800 border-indigo-200",
      icon: <Search className="h-3.5 w-3.5 text-indigo-600" />,
    },
    SHORTLISTED: {
      label: "Shortlisted",
      bg: "bg-purple-50 text-purple-800 border-purple-200",
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />,
    },
    INTERVIEW_SCHEDULED: {
      label: "Interview Scheduled",
      bg: "bg-amber-50 text-amber-900 border-amber-300",
      icon: <Calendar className="h-3.5 w-3.5 text-amber-600" />,
    },
    INTERVIEW_COMPLETED: {
      label: "Interview Completed",
      bg: "bg-amber-100 text-amber-900 border-amber-300",
      icon: <Calendar className="h-3.5 w-3.5 text-amber-700" />,
    },
    OFFER_EXTENDED: {
      label: "Offer Extended",
      bg: "bg-emerald-50 text-emerald-800 border-emerald-300",
      icon: <Gift className="h-3.5 w-3.5 text-emerald-600" />,
    },
    HIRED: {
      label: "Hired",
      bg: "bg-emerald-100 text-emerald-900 border-emerald-400 font-extrabold",
      icon: <Award className="h-3.5 w-3.5 text-emerald-700" />,
    },
    REJECTED: {
      label: "Not Selected",
      bg: "bg-red-50 text-red-800 border-red-200",
      icon: <XCircle className="h-3.5 w-3.5 text-red-600" />,
    },
    WITHDRAWN: {
      label: "Withdrawn",
      bg: "bg-slate-100 text-slate-500 border-slate-200 line-through",
      icon: <AlertOctagon className="h-3.5 w-3.5 text-slate-400" />,
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
