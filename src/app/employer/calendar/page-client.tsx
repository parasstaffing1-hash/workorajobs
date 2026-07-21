"use client";

import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { employerNav, interviews } from "@/data/platform";



export default function EmployerCalendarPage() {
  return (
    <PlatformShell
      badge="Employer"
      description="Interview calendar for scheduled candidate conversations."
      nav={employerNav}
      title="Interview Calendar"
    >
      <WorkflowCard title="Upcoming interviews">
        <div className="grid gap-3">
          {interviews.map((interview) => (
            <div
              className="cursor-pointer rounded-md border border-border p-4 hover:bg-muted/50"
              key={interview.title}
              onClick={() => alert(`Opening details for: ${interview.title}`)}
            >
              <strong>{interview.title}</strong>
              <p className="mt-1 text-sm text-muted-foreground">
                {interview.type} · {interview.time}
              </p>
            </div>
          ))}
        </div>
      </WorkflowCard>
    </PlatformShell>
  );
}
