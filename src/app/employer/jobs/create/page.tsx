"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { JobPostForm } from "@/components/jobs/JobPostForm";
import { JobPostInput } from "@/lib/jobs/job-validation-schemas";

export default function EmployerCreateJobPage() {
  const router = useRouter();

  const handleSubmit = async (data: JobPostInput, status: string) => {
    const res = await fetch("/api/v1/employer/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, status }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || (json.details ? json.details.join(", ") : "Failed to create job posting."));
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

        <JobPostForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
