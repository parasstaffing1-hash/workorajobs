import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { adminNav, communicationProviders } from "@/data/platform";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Admin Communications",
  path: "/admin/communications",
});

export default function AdminCommunicationsPage() {
  return (
    <PlatformShell
      badge="Admin"
      description="Manage notification center, templates and SMS, WhatsApp, push and email provider structures."
      nav={adminNav}
      title="Communications"
    >
      <WorkflowCard title="Provider readiness">
        <RecordList
          items={communicationProviders.map((provider) => ({
            title: provider.channel,
            meta: provider.provider,
            value: provider.status,
          }))}
        />
      </WorkflowCard>
    </PlatformShell>
  );
}
