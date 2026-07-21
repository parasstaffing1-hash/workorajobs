"use client";

import { CalendarPlus, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { applicants, employerNav } from "@/data/platform";



export default function ApplicantsPage() {
  return (
    <PlatformShell
      badge="Employer"
      description="View applicants, shortlist, reject and schedule interviews."
      nav={employerNav}
      title="Applicants"
    >
      <WorkflowCard title="Applicant review">
        <div className="grid gap-3">
          {applicants.map((applicant) => (
            <div
              className="grid gap-4 rounded-md border border-border p-4 lg:grid-cols-[1fr_auto]"
              key={applicant.name}
            >
              <div>
                <h2 className="font-semibold">{applicant.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {applicant.role} · {applicant.job} · {applicant.status}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => alert(`Shortlisted ${applicant.name}`)}>
                  <CheckCircle2 className="h-4 w-4" />
                  Shortlist
                </Button>
                <Button size="sm" variant="outline" onClick={() => alert(`Scheduled interview with ${applicant.name}`)}>
                  <CalendarPlus className="h-4 w-4" />
                  Interview
                </Button>
                <Button size="sm" variant="ghost" onClick={() => alert(`Rejected ${applicant.name}`)}>
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </WorkflowCard>
    </PlatformShell>
  );
}
