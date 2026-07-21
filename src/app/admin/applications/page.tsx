import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { adminNav, applicants } from "@/data/platform";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Admin Applications & Candidate Approvals",
  description:
    "Review and manage candidate job applications across all employer listings.",
  path: "/admin/applications",
});;

export default function AdminApplicationsPage() {
  return (
    <PlatformShell
      badge="Admin"
      description="Monitor applications, hiring stages, timelines and recruiter actions."
      nav={adminNav}
      title="Application Management"
    >
      <WorkflowCard title="Applications">
        <RecordList
          items={applicants.map((applicant) => ({
            title: applicant.name,
            meta: `${applicant.job} · ${applicant.location}`,
            value: applicant.status,
          }))}
        />
      </WorkflowCard>
    </PlatformShell>
  );
}
