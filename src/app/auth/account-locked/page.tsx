"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function AccountLockedPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 mx-auto flex items-center justify-center">
          <ShieldAlert className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black">Account Temporarily Locked</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your account has been temporarily locked due to multiple consecutive failed login attempts. This brute-force protection mechanism secures your profile data.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Link
            href="/auth/forgot-password"
            className="block w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center"
          >
            Reset Password to Unlock
          </Link>
          <Link
            href="/contact"
            className="block w-full h-11 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center justify-center"
          >
            Contact Security Support
          </Link>
        </div>
      </div>
    </div>
  );
}
