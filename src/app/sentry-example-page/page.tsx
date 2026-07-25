"use client";

import { useState } from "react";
import * as Sentry from "@sentry/nextjs";

export default function SentryExamplePage() {
  const [status, setStatus] = useState<string | null>(null);

  const triggerClientError = () => {
    setStatus("Triggering client-side error...");
    try {
      // Trigger an intentional client exception
      // @ts-expect-error Intentionally calling non-existent function for Sentry verification
      window.myUndefinedFunction();
    } catch (error) {
      Sentry.captureException(error);
      setStatus("✅ Client-side error captured and dispatched to Sentry!");
    }
  };

  const triggerApiError = async () => {
    setStatus("Calling Sentry test API route...");
    try {
      const res = await fetch("/api/v1/health/sentry-test");
      const data = await res.json();
      if (data.success) {
        setStatus(`✅ Sentry Test API Event Sent! Event ID: ${data.data.eventId}`);
      } else {
        setStatus(`❌ API Error: ${data.message || "Failed to trigger Sentry event"}`);
      }
    } catch (err) {
      const error = err as Error;
      Sentry.captureException(error);
      setStatus(`❌ Network Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full glass-panel bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xl">
            S
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sentry Verification Page</h1>
            <p className="text-xs text-slate-400 font-mono">Organization: workorajobs | Project: javascript-nextjs</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Use the interactive controls below to verify that error tracking and performance monitoring are actively capturing exceptions in Sentry.
        </p>

        <div className="space-y-4">
          <button
            onClick={triggerClientError}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>💥 Trigger Client-Side Exception</span>
            <span className="text-xs opacity-75 font-mono">(myUndefinedFunction)</span>
          </button>

          <button
            onClick={triggerApiError}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>📡 Send API Test Event</span>
            <span className="text-xs opacity-75 font-mono">(/api/v1/health/sentry-test)</span>
          </button>
        </div>

        {status && (
          <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-emerald-400 break-all animate-fade-in">
            {status}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>DSN: o4511795655409664.ingest.de.sentry.io</span>
          <span className="text-emerald-500 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> Active
          </span>
        </div>
      </div>
    </div>
  );
}
