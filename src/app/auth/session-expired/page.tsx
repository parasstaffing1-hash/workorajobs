"use client";

import React from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

export default function SessionExpiredPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 mx-auto flex items-center justify-center">
          <Clock className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black">Session Expired</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your active login session has expired due to inactivity or session revocation. Please sign in again to continue.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/auth/login"
            className="block w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center"
          >
            Sign In Again
          </Link>
        </div>
      </div>
    </div>
  );
}
