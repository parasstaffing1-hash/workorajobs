"use client";
import { Copy, PauseCircle, Pencil, Trash2 } from "lucide-react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button, ButtonLink } from "@/components/ui/button";
import { employerJobs, employerNav } from "@/data/platform";


export default function EmployerJobsPage() {
  return (
    <PlatformShell
      badge="Employer"
      description="Create, edit, delete, duplicate, publish and close jobs."
      nav={employerNav}
      title="Jobs"
    >
      <WorkflowCard
        action={<ButtonLink href="/employer/jobs/new">Create job</ButtonLink>}
        title="Job pipeline"
      >
        <div className="grid gap-3">
          {employerJobs.map((job) => (
            <div
              className="grid gap-4 rounded-md border border-border p-4 lg:grid-cols-[1fr_auto]"
              key={job.title}
            >
              <div>
                <h2 className="font-semibold">{job.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {job.status} · {job.applicants} applicants · {job.views} views
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="icon" variant="ghost" aria-label="Edit job" onClick={() => alert(`Edit ${job.title}`)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Duplicate job" onClick={() => alert(`Duplicate ${job.title}`)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Close job" onClick={() => alert(`Close ${job.title}`)}>
                  <PauseCircle className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Delete job" onClick={() => alert(`Delete ${job.title}`)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </WorkflowCard>
    </PlatformShell>
  );
}
