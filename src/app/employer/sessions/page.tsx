"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Monitor, Smartphone, Globe, Trash2, ArrowLeft } from "lucide-react";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function EmployerSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/auth/sessions");
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions || []);
      }
    } catch (_) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/v1/auth/sessions/${sessionId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setAlert({ type: "success", message: "Session revoked successfully." });
        fetchSessions();
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/employer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Employer Dashboard</span>
          </Link>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Employer Device Session Security</h1>
          </div>
          <p className="text-xs text-slate-600">
            Manage logged-in devices and active security tokens for your hiring account.
          </p>
        </div>

        {alert && <AuthAlert type={alert.type} message={alert.message} />}

        {isLoading ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            Loading active sessions...
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Active Login Sessions ({sessions.length})</h2>

            <div className="space-y-3">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-4 rounded-xl border border-slate-200/80 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                      {sess.deviceType === "Mobile" ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs text-slate-900">{sess.browser} on {sess.os}</h4>
                      <p className="text-[11px] font-mono text-slate-500">
                        IP: {sess.ipAddress || "Unknown"} • Last Active: {new Date(sess.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRevokeSession(sess.id)}
                    className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
                    title="Revoke Session"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
