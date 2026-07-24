"use client";

import React, { useState } from "react";
import { Bell, Mail, Smartphone, Moon, Save } from "lucide-react";

interface NotificationPreferencesFormProps {
  initialPrefs?: any;
  onSave: (data: any) => Promise<void>;
  isDark?: boolean;
}

export function NotificationPreferencesForm({
  initialPrefs = {},
  onSave,
  isDark = false,
}: NotificationPreferencesFormProps) {
  const [formData, setFormData] = useState({
    emailEnabled: initialPrefs.emailEnabled ?? true,
    inAppEnabled: initialPrefs.inAppEnabled ?? true,
    telegramEnabled: initialPrefs.telegramEnabled ?? false,
    discordEnabled: initialPrefs.discordEnabled ?? false,
    telegramChatId: initialPrefs.telegramChatId || "",
    discordWebhookUrl: initialPrefs.discordWebhookUrl || "",
    quietHoursStart: initialPrefs.quietHoursStart || "22:00",
    quietHoursEnd: initialPrefs.quietHoursEnd || "08:00",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMsg("");
    try {
      await onSave(formData);
      setMsg("Notification preferences saved successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch (_) {
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border p-6 shadow-sm space-y-6 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-blue-600" />
        <h2 className="text-base font-bold">Notification Delivery Channels &amp; Preferences</h2>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-300">
          {msg}
        </div>
      )}

      {/* Checkbox Channels */}
      <div className="space-y-4">
        <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-xs">Email Alerts &amp; Digest</h3>
              <p className="text-[11px] text-slate-400">Receive application updates and candidate matches via email.</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={formData.emailEnabled}
            onChange={(e) => handleChange("emailEnabled", e.target.checked)}
            className="w-4 h-4 rounded text-blue-600"
          />
        </label>

        <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-xs">In-App Notifications</h3>
              <p className="text-[11px] text-slate-400">Display real-time bell alerts in WorkoraJobs navbar.</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={formData.inAppEnabled}
            onChange={(e) => handleChange("inAppEnabled", e.target.checked)}
            className="w-4 h-4 rounded text-blue-600"
          />
        </label>
      </div>

      {/* Quiet Hours */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-purple-600" />
          <h3 className="font-bold text-xs">Quiet Hours (Do Not Disturb)</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Start Time</label>
            <input
              type="time"
              value={formData.quietHoursStart}
              onChange={(e) => handleChange("quietHoursStart", e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">End Time</label>
            <input
              type="time"
              value={formData.quietHoursEnd}
              onChange={(e) => handleChange("quietHoursEnd", e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md shadow-blue-500/20"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? "Saving..." : "Save Preferences"}</span>
        </button>
      </div>
    </form>
  );
}
