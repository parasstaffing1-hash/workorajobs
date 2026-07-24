"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Filter,
  ArrowLeft,
  Moon,
  Sun,
  Settings,
} from "lucide-react";
import { NotificationItemCard, NotificationData } from "@/components/notifications/NotificationItemCard";
import { NotificationPreferencesForm } from "@/components/notifications/NotificationPreferencesForm";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function EmployerNotificationsPage() {
  const [activeTab, setActiveTab] = useState<"ALL" | "UNREAD" | "PREFERENCES">("ALL");
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState<any>({});

  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/notifications?unread=${activeTab === "UNREAD"}`);
      const json = await res.json();
      if (json.success) {
        setNotifications(json.notifications || []);
        setUnreadCount(json.unreadCount || 0);
      }
    } catch (_) {
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const res = await fetch("/api/v1/notifications/preferences");
      const json = await res.json();
      if (json.success) setPreferences(json.preferences);
    } catch (_) {}
  };

  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
  }, [activeTab]);

  const handleMarkRead = async (notificationId: string) => {
    try {
      const res = await fetch("/api/v1/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_read", notificationId }),
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (_) {}
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/v1/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read" }),
      });
      if (res.ok) {
        setAlert({ type: "success", message: "All notifications marked as read!" });
        fetchNotifications();
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (_) {}
  };

  const handleDelete = async (notificationId: string) => {
    try {
      const res = await fetch("/api/v1/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", notificationId }),
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (_) {}
  };

  const handleSavePreferences = async (data: any) => {
    const res = await fetch("/api/v1/notifications/preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to update preferences.");
    }
    setPreferences(json.preferences);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8 ${
        isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/employer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Employer Dashboard</span>
          </Link>

          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isDark ? "bg-slate-800 border-slate-700 text-amber-400" : "bg-white border-slate-200 text-slate-700"
            }`}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        {/* Page Header */}
        <div
          className={`p-6 sm:p-8 rounded-2xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <Bell className="h-7 w-7 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold">
                Enterprise Notification Command Center
              </h1>
            </div>
            <p className={`mt-1 text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Real-time candidate applications, interview reminders, system alerts, and delivery channels.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer shrink-0"
            >
              <CheckCheck className="h-4 w-4" />
              <span>Mark All ({unreadCount}) Read</span>
            </button>
          )}
        </div>

        {alert && <AuthAlert type={alert.type} message={alert.message} />}

        {/* Tabs Bar */}
        <div
          className={`p-2 rounded-2xl border shadow-sm flex items-center justify-between ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center gap-1">
            {[
              { id: "ALL", label: "All Notifications" },
              { id: "UNREAD", label: `Unread (${unreadCount})` },
              { id: "PREFERENCES", label: "Delivery Preferences" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Contents */}
        {activeTab === "PREFERENCES" ? (
          <NotificationPreferencesForm initialPrefs={preferences} onSave={handleSavePreferences} isDark={isDark} />
        ) : isLoading ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm space-y-2">
            <Bell className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-900 dark:text-white">No Notifications</h3>
            <p className="text-xs">You are all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <NotificationItemCard
                key={n.id}
                notification={n}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
                isDark={isDark}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
