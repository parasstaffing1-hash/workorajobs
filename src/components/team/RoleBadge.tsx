"use client";

import React from "react";
import { ShieldAlert, ShieldCheck, UserCheck, Briefcase, Calendar, Eye } from "lucide-react";
import { EmployerRole, ROLE_CONFIGS } from "@/lib/team/team-rbac-config";

interface RoleBadgeProps {
  role: EmployerRole;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const config = ROLE_CONFIGS[role] || {
    label: role,
    color: "blue",
  };

  const icons = {
    OWNER: <ShieldAlert className="h-3.5 w-3.5 text-purple-600" />,
    ADMIN: <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />,
    HR_MANAGER: <UserCheck className="h-3.5 w-3.5 text-indigo-600" />,
    RECRUITER: <Briefcase className="h-3.5 w-3.5 text-emerald-600" />,
    HIRING_MANAGER: <Calendar className="h-3.5 w-3.5 text-amber-600" />,
    INTERVIEWER: <Eye className="h-3.5 w-3.5 text-teal-600" />,
    VIEWER: <Eye className="h-3.5 w-3.5 text-slate-500" />,
  };

  const bgStyles = {
    purple: "bg-purple-50 text-purple-800 border-purple-200",
    blue: "bg-blue-50 text-blue-800 border-blue-200",
    indigo: "bg-indigo-50 text-indigo-800 border-indigo-200",
    emerald: "bg-emerald-50 text-emerald-800 border-emerald-200",
    amber: "bg-amber-50 text-amber-900 border-amber-300",
    teal: "bg-teal-50 text-teal-800 border-teal-200",
  }[config.color] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${bgStyles}`}>
      {icons[role]}
      <span>{config.label}</span>
    </span>
  );
}
