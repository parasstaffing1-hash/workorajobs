"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Trash2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { AuthAlert } from "@/components/auth/AuthAlert";

interface DeviceSession {
  id: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
}

export default function CandidateSessionsPage() {
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/auth/sessions");
      const data = await res.json();
      if (data.success && data.sessions) {
        setSessions(data.sessions);
      }
    } catch (err: any) {
      setAlert({
        type: "error",
        message: "Failed to load active device sessions.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const res = await fetch("/api/v1/auth/sessions/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to revoke session.");
      }

      setAlert({
        type: "success",
        message: "Device session revoked successfully.",
      });
      fetchSessions();
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.message || "Error revoking session.",
      });
    }
  };

  const handleRevokeAllOther = async () => {
    if (!confirm("Are you sure you want to log out from all other devices?")) return;

    try {
      const res = await fetch("/api/v1/auth/sessions/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revokeAllOther: true }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to revoke sessions.");
      }

      setAlert({
        type: "success",
        message: "All other device sessions have been revoked.",
      });
      fetchSessions();
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.message || "Error revoking other sessions.",
      });
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    if (deviceType.toLowerCase() === "mobile") return <Smartphone className="h-5 w-5 text-blue-600" />;
    if (deviceType.toLowerCase() === "tablet") return <Tablet className="h-5 w-5 text-purple-600" />;
    return <Laptop className="h-5 w-5 text-slate-700" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation back */}
        <div>
          <Link
            href="/candidate/profile"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Candidate Profile</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Security &amp; Device Sessions
              </h1>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Manage your active login sessions across devices and secure your WorkoraJobs candidate account.
            </p>
          </div>

          <button
            onClick={handleRevokeAllOther}
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold text-xs hover:bg-red-100 transition-colors cursor-pointer shrink-0"
          >
            <KeyRound className="h-4 w-4" />
            <span>Sign Out All Other Devices</span>
          </button>
        </div>

        {alert && <AuthAlert type={alert.type} message={alert.message} />}

        {/* Device Sessions List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Active Sessions ({sessions.length})
            </h2>
            <span className="text-xs text-slate-500 font-mono">Real-time Redis &amp; DB Session Store</span>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Loading active sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No active sessions found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200/80 shrink-0">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">
                          {session.browser} on {session.os}
                        </span>
                        {session.isCurrent && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Current Device
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5 text-slate-400" />
                          IP: {session.ipAddress}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          Last Active: {new Date(session.lastActiveAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(session.id)}
                      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-slate-200 hover:border-red-300 bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 font-semibold text-xs transition-all cursor-pointer shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Revoke Session</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
