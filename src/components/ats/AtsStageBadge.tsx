"use client";

import React from "react";
import { Send, Search, Calendar, Code2, Users, Gift, CheckCircle2, XCircle } from "lucide-react";

interface AtsStageBadgeProps {
  stageKey: string;
}

export function AtsStageBadge({ stageKey }: AtsStageBadgeProps) {
  const config = {
    APPLIED: {
      label: "Applied",
      bg: "bg-blue-50 text-blue-800 border-blue-200",
      icon: <Send className="h-3.5 w-3.5 text-blue-600" />,
    },
    SCREENING: {
      label: "Screening",
      bg: "bg-indigo-50 text-indigo-800 border-indigo-200",
      icon: <Search className="h-3.5 w-3.5 text-indigo-600" />,
    },
    INTERVIEW: {
      label: "Interview",
      bg: "bg-amber-50 text-amber-900 border-amber-300",
      icon: <Calendar className="h-3.5 w-3.5 text-amber-600" />,
    },
    TECHNICAL_ROUND: {
      label: "Tech Round",
      bg: "bg-purple-50 text-purple-800 border-purple-200",
      icon: <Code2 className="h-3.5 w-3.5 text-purple-600" />,
    },
    HR_ROUND: {
      label: "HR Round",
      bg: "bg-teal-50 text-teal-800 border-teal-200",
      icon: <Users className="h-3.5 w-3.5 text-teal-600" />,
    },
    OFFER: {
      label: "Offer",
      bg: "bg-emerald-50 text-emerald-800 border-emerald-300",
      icon: <Gift className="h-3.5 w-3.5 text-emerald-600" />,
    },
    HIRED: {
      label: "Hired",
      bg: "bg-emerald-100 text-emerald-900 border-emerald-400 font-extrabold",
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />,
    },
    REJECTED: {
      label: "Not Selected",
      bg: "bg-red-50 text-red-800 border-red-200",
      icon: <XCircle className="h-3.5 w-3.5 text-red-600" />,
    },
  }[stageKey] || {
    label: stageKey,
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    icon: <Send className="h-3.5 w-3.5" />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.bg}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}
