"use client";

import React from "react";
import { Bell, CheckCircle2, Info, Eye } from "lucide-react";

interface NotificationsWidgetProps {
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    timestamp: string;
    read: boolean;
  }>;
  isDark?: boolean;
}

export function NotificationsWidget({ notifications, isDark = false }: NotificationsWidgetProps) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-4 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-bold">Notifications &amp; Alerts</h2>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              isDark ? "bg-slate-900/60 border-slate-700" : "bg-slate-50 border-slate-200/80"
            } ${!notif.read ? "border-l-4 border-l-blue-600" : ""}`}
          >
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 shrink-0 mt-0.5">
              <Info className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-xs">{notif.title}</h4>
                <span className={`text-[10px] font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {new Date(notif.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
