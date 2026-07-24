"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, ShieldCheck } from "lucide-react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
}

export function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 group transition-transform duration-300 hover:scale-105 mb-4"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-md shadow-blue-500/20">
            W
          </span>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Workora Jobs
          </span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{subtitle}</p>
      </div>

      {/* Main Card Shell */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
        {children}
      </div>

      {/* Footer link */}
      {footerText && footerLinkText && footerLinkHref && (
        <div className="mt-6 text-center text-sm text-slate-600">
          {footerText}{" "}
          <Link
            href={footerLinkHref}
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            {footerLinkText}
          </Link>
        </div>
      )}

      {/* Trust Badge */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>Enterprise SSL 256-Bit Encrypted Auth System</span>
      </div>
    </div>
  );
}
