"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  MessageSquare,
  AlertTriangle,
  CreditCard,
  ShieldCheck,
  Bell,
  CheckCircle,
  ExternalLink,
  Trash2,
} from "lucide-react";

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  actionUrl?: string;
  createdAt: string;
}

interface NotificationItemCardProps {
  notification: NotificationData;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  isDark?: boolean;
}

export function NotificationItemCard({
  notification,
  onMarkRead,
  onDelete,
  isDark = false,
}: NotificationItemCardProps) {
  const iconConfig = {
    NEW_APPLICANT: { icon: <Users className="h-4 w-4 text-blue-600" />, bg: "bg-blue-50 dark:bg-blue-950/60" },
    INTERVIEW_REMINDER: { icon: <Calendar className="h-4 w-4 text-amber-600" />, bg: "bg-amber-50 dark:bg-amber-950/60" },
    CANDIDATE_MESSAGE: { icon: <MessageSquare className="h-4 w-4 text-indigo-600" />, bg: "bg-indigo-50 dark:bg-indigo-950/60" },
    JOB_EXPIRING: { icon: <AlertTriangle className="h-4 w-4 text-red-600" />, bg: "bg-red-50 dark:bg-red-950/60" },
    SUBSCRIPTION_REMINDER: { icon: <CreditCard className="h-4 w-4 text-purple-600" />, bg: "bg-purple-50 dark:bg-purple-950/60" },
    VERIFICATION_STATUS: { icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />, bg: "bg-emerald-50 dark:bg-emerald-950/60" },
    SYSTEM_ALERT: { icon: <Bell className="h-4 w-4 text-slate-600" />, bg: "bg-slate-100 dark:bg-slate-700" },
  }[notification.type] || { icon: <Bell className="h-4 w-4 text-blue-600" />, bg: "bg-slate-100" };

  return (
    <div
      className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
        notification.isRead
          ? isDark
            ? "bg-slate-800/50 border-slate-700/60 opacity-80"
            : "bg-white border-slate-200"
          : isDark
          ? "bg-slate-800 border-blue-500/40 shadow-sm"
          : "bg-blue-50/40 border-blue-200 shadow-sm"
      }`}
    >
      {/* Type Icon */}
      <div className={`p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 shrink-0 ${iconConfig.bg}`}>
        {iconConfig.icon}
      </div>

      {/* Content */}
      <div className="space-y-1 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
            {notification.title}
          </h4>
          <span className="text-[11px] font-mono text-slate-400 shrink-0">
            {new Date(notification.createdAt).toLocaleDateString()}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between text-xs">
          {notification.actionUrl ? (
            <Link
              href={notification.actionUrl}
              onClick={() => onMarkRead(notification.id)}
              className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
            >
              <span>View Details</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            {!notification.isRead && (
              <button
                onClick={() => onMarkRead(notification.id)}
                className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Mark Read
              </button>
            )}

            <button
              onClick={() => onDelete(notification.id)}
              className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
              title="Delete Notification"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
