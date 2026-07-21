"use client";

import { useRouter } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { adminNav, employerJobs } from "@/data/platform";


export default function AdminJobsPage() {
  const router = useRouter();

  const handleAction = (action: string) => {
    alert(`Action triggered: ${action}`);
  };

  return (
    <PlatformShell
      badge="Admin"
      description="Review jobs, statuses, ownership, publishing state and hiring activity."
      nav={adminNav}
      title="Job Management"
    >
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.push("/admin")}>
          Back to Admin
        </Button>
      </div>
      <WorkflowCard 
        title="Jobs"
        action={<Button onClick={() => handleAction("Create Job")}>Create Job</Button>}
      >
        <RecordList
          items={employerJobs.map((job) => ({
            title: job.title,
            meta: `${job.location} · ${job.applicants} applicants`,
            value: job.status,
            details: `Additional details for job: ${job.title}, located in ${job.location} with ${job.applicants} applicants.`
          }))}
        />
      </WorkflowCard>
    </PlatformShell>
  );
}
