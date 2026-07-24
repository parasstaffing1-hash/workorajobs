"use client";

import React from "react";
import Link from "next/link";
import { Plus, Users, Building2, Calendar, FileText, Download } from "lucide-react";

interface EmployerQuickActionsWidgetProps {
  isDark?: boolean;
}

export function EmployerQuickActionsWidget({ isDark = false }: EmployerQuickActionsWidgetProps) {
  const actions = [
    {
      title: "Post New Tech Job",
      desc: "Create and publish a role",
      icon: <Plus className="h-5 w-5 text-blue-600" />,
      href: "/employer/jobs/create",
      bg: "bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800",
    },
    {
      title: "Open ATS Pipeline",
      desc: "Review candidates & stages",
      icon: <Users className="h-5 w-5 text-indigo-600" />,
      href: "/employer/ats",
      bg: "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800",
    },
    {
      title: "Company Profile",
      desc: "Manage GST & verification",
      icon: <Building2 className="h-5 w-5 text-emerald-600" />,
      href: "/employer/company",
      bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800",
    },
    {
      title: "Export Applicants",
      desc: "Download CSV datasets",
      icon: <Download className="h-5 w-5 text-purple-600" />,
      href: "/api/v1/employer/ats/export",
      bg: "bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:border-purple-800",
    },
  ];

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-4 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <h2 className="text-base font-bold">Employer Quick Actions</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => (
          <Link
            key={act.title}
            href={act.href}
            className={`p-4 rounded-xl border flex items-start gap-3 transition-all hover:scale-[1.02] cursor-pointer ${act.bg}`}
          >
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm shrink-0">
              {act.icon}
            </div>
            <div className="space-y-0.5">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">{act.title}</h3>
              <p className="text-[11px] text-slate-500">{act.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
