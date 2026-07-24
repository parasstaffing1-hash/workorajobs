"use client";

import React, { useState, useEffect } from "react";
import { Laptop, Smartphone, Tablet, ShieldAlert, LogOut, CheckCircle2 } from "lucide-react";

interface DeviceSession {
  id: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

export function SecuritySessionManager() {
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/auth/sessions");
      const json = await res.json();
      if (json.success && Array.isArray(json.sessions)) {
        setSessions(json.sessions);
      }
    } catch (_) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeOthers = async () => {
    try {
      const res = await fetch("/api/v1/auth/sessions/revoke-others", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setAlertMessage("Logged out all other active sessions.");
        fetchSessions();
      }
    } catch (_) {}
  };

  const getDeviceIcon = (deviceType: string) => {
    if (deviceType === "Mobile") return <Smartphone className="h-5 w-5 text-blue-600" />;
    if (deviceType === "Tablet") return <Tablet className="h-5 w-5 text-indigo-600" />;
    return <Laptop className="h-5 w-5 text-slate-700 dark:text-slate-300" />;
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Active Device Sessions</h2>
        </div>

        {sessions.length > 1 && (
          <button
            onClick={handleRevokeOthers}
            className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out All Other Devices</span>
          </button>
        )}
      </div>

      {alertMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
          {alertMessage}
        </div>
      )}

      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
          <div className="h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  {getDeviceIcon(sess.deviceType)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                      {sess.browser} on {sess.os}
                    </h3>
                    {sess.isCurrent && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        <CheckCircle2 className="h-3 w-3" /> Current Session
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    IP: {sess.ipAddress} • Last active {new Date(sess.lastActiveAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
