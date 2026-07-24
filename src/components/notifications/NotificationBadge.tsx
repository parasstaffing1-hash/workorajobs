"use client";

import React from "react";
import { Bell } from "lucide-react";

interface NotificationBadgeProps {
  unreadCount: number;
  onClick?: () => void;
}

export function NotificationBadge({ unreadCount, onClick }: NotificationBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
      title="Notifications"
    >
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white font-extrabold text-[10px] flex items-center justify-center animate-pulse">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}
