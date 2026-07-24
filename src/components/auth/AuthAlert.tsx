"use client";

import React from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

interface AuthAlertProps {
  type?: "error" | "success" | "info" | "warning";
  title?: string;
  message: string;
}

export function AuthAlert({ type = "error", title, message }: AuthAlertProps) {
  if (!message) return null;

  const config = {
    error: {
      bg: "bg-red-50 border-red-200 text-red-800",
      icon: <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />,
    },
    success: {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
    },
    warning: {
      bg: "bg-amber-50 border-amber-200 text-amber-800",
      icon: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />,
    },
    info: {
      bg: "bg-blue-50 border-blue-200 text-blue-800",
      icon: <Info className="h-5 w-5 text-blue-600 shrink-0" />,
    },
  }[type];

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 text-sm font-medium ${config.bg} mb-4`}>
      {config.icon}
      <div className="space-y-0.5">
        {title && <p className="font-bold text-xs uppercase tracking-wider">{title}</p>}
        <p className="leading-relaxed text-xs sm:text-sm">{message}</p>
      </div>
    </div>
  );
}
