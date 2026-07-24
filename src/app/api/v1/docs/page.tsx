"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Code2, Server, Terminal, FileCode, CheckCircle2, Copy } from "lucide-react";

export default function SwaggerDocsPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState("");

  const endpoints = [
    { method: "POST", path: "/api/v1/auth/signup", desc: "Register a new Job Seeker account with Zod validation & password hash." },
    { method: "POST", path: "/api/v1/auth/login", desc: "Authenticate job seeker, issue Redis session & HttpOnly JWT tokens." },
    { method: "POST", path: "/api/v1/auth/logout", desc: "Revoke candidate session & clear authentication cookies." },
    { method: "POST", path: "/api/v1/auth/forgot-password", desc: "Generate secure token hash & dispatch password reset email." },
    { method: "POST", path: "/api/v1/auth/reset-password", desc: "Verify reset token & update password with audit trail." },
    { method: "GET", path: "/api/v1/candidate/profile", desc: "Fetch candidate profile details, completion score %, & missing checklist." },
    { method: "PUT", path: "/api/v1/candidate/profile", desc: "Update personal, professional, preferences & privacy sections." },
    { method: "GET", path: "/api/v1/candidate/resumes", desc: "List candidate uploaded resume documents & default primary resume." },
    { method: "POST", path: "/api/v1/candidate/resumes", desc: "Upload PDF/DOCX resume file (up to 10MB) with version tracking." },
    { method: "DELETE", path: "/api/v1/candidate/resumes/[id]", desc: "Delete resume record & purge file from storage driver." },
    { method: "GET", path: "/api/v1/candidate/applications", desc: "Fetch candidate job application history & recruitment status timeline." },
    { method: "POST", path: "/api/v1/candidate/applications", desc: "Submit job application or trigger 1-Click Apply." },
    { method: "POST", path: "/api/v1/candidate/applications/[id]", desc: "Withdraw job application with reason tracking." },
    { method: "GET", path: "/api/v1/candidate/saved-jobs", desc: "List saved jobs with search, sort, work mode filters, and pagination." },
    { method: "POST", path: "/api/v1/candidate/saved-jobs", desc: "Bookmark job, organize into custom folder, or remove from saved." },
    { method: "GET", path: "/api/v1/candidate/saved-jobs/folders", desc: "List candidate custom collections & folder counts." },
    { method: "POST", path: "/api/v1/candidate/saved-jobs/folders", desc: "Create custom collection folder with color tag." },
    { method: "GET", path: "/api/v1/candidate/dashboard", desc: "Unified dashboard aggregation endpoint (9 candidate widgets in 1 query)." },
  ];

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(`http://localhost:3000${path}`);
    setCopiedEndpoint(path);
    setTimeout(() => setCopiedEndpoint(""), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                <Code2 className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                WorkoraJobs REST API Documentation
              </h1>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Enterprise OpenAPI 3.0 spec, authentication headers, rate limits, and JSON schemas for Job Seekers.
            </p>
          </div>

          <a
            href="/api/v1/docs/openapi.json"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shrink-0"
          >
            <FileCode className="h-4 w-4" />
            <span>OpenAPI Spec JSON</span>
          </a>
        </div>

        {/* Security & Config Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Bearer JWT / Cookie Auth</h3>
            <p className="text-xs text-slate-400">
              Headers: <code className="text-amber-300 font-mono">Authorization: Bearer &lt;token&gt;</code> or HttpOnly session cookie.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
            <Server className="h-5 w-5 text-blue-400" />
            <h3 className="font-bold text-sm text-white">Redis Rate Limiting</h3>
            <p className="text-xs text-slate-400">
              Sliding-window rate limit: 100 requests per 15 minutes per IP address.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
            <Terminal className="h-5 w-5 text-purple-400" />
            <h3 className="font-bold text-sm text-white">Standard Error Format</h3>
            <p className="text-xs text-slate-400">
              All error responses return <code className="text-amber-300 font-mono">{`{ success: false, error: "msg" }`}</code> with appropriate HTTP codes.
            </p>
          </div>
        </div>

        {/* Endpoints Table / Cards */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-200">
            Available Candidate Endpoints ({endpoints.length})
          </h2>

          <div className="space-y-3">
            {endpoints.map((ep, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold uppercase shrink-0 ${
                      ep.method === "GET"
                        ? "bg-blue-900/60 text-blue-300 border border-blue-700"
                        : ep.method === "POST"
                        ? "bg-emerald-900/60 text-emerald-300 border border-emerald-700"
                        : ep.method === "PUT"
                        ? "bg-amber-900/60 text-amber-300 border border-amber-700"
                        : "bg-red-900/60 text-red-300 border border-red-700"
                    }`}
                  >
                    {ep.method}
                  </span>

                  <div>
                    <code className="text-xs font-mono font-bold text-white">{ep.path}</code>
                    <p className="text-xs text-slate-400 mt-0.5">{ep.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(ep.path)}
                  className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedEndpoint === ep.path ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
