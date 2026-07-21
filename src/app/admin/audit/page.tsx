import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { adminNav, adminTimeline } from "@/data/platform";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Admin Audit Logs & Security Event History",
  description:
    "Security access history, user activity trails, and compliance audit logs.",
  path: "/admin/audit",
});;

export default function AdminAuditPage() {
  return (
    <PlatformShell
      badge="Admin"
      description="Inspect audit logs, security events and platform activity timelines."
      nav={adminNav}
      title="Audit Logs"
    >
      <WorkflowCard title="Audit stream">
        <RecordList
          items={adminTimeline.map((item) => ({
            title: item,
            meta: "Immutable audit event",
          }))}
        />
      </WorkflowCard>
    </PlatformShell>
  );
}
