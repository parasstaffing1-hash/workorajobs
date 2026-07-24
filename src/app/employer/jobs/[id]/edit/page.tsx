"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, History } from "lucide-react";
import { JobPostForm } from "@/components/jobs/JobPostForm";
import { JobPostInput } from "@/lib/jobs/job-validation-schemas";

export default function EmployerEditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [job, setJob] = useState<any>(null);
  const [versionHistory, setVersionHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobDetails = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/employer/jobs/${resolvedParams.id}`);
      const json = await res.json();
      if (json.success && json.job) {
        setJob(json.job);
        setVersionHistory(json.job.versionHistory || []);
      } else {
        throw new Error(json.error || "Failed to load job posting.");
      }
    } catch (err: any) {
      setError(err.message || "Error loading job details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [resolvedParams.id]);

  const handleSubmit = async (data: JobPostInput, status: string) => {
    const res = await fetch(`/api/v1/employer/jobs/${resolvedParams.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, status }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to update job posting.");
    }

    router.push("/employer/jobs");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link
          href="/employer/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Employer Jobs</span>
        </Link>

        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            Loading job posting editor...
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-red-200 text-red-600 font-semibold text-xs">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            <JobPostForm initialValues={job} companyName={job.company?.name} isEditing onSubmit={handleSubmit} />

            {/* Version History Audit Log */}
            {versionHistory.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-900">Job Version History Audit Log ({versionHistory.length})</h3>
                </div>

                <div className="relative border-l-2 border-slate-200 ml-4 space-y-3">
                  {versionHistory.map((v) => (
                    <div key={v.id} className="relative pl-5 text-xs">
                      <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-purple-600 border-2 border-white" />
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">Version v{v.version}.0</span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {new Date(v.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-600">{v.changeSummary || "Job specification updated."}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
