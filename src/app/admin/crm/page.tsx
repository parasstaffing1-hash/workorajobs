import { MetricGrid } from "@/components/platform/metric-grid";
import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { adminNav, crmLeads, crmMetrics } from "@/data/platform";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Admin CRM & Client Relationship Manager",
  description:
    "Manage enterprise client profiles, lead funnels, and account managers.",
  path: "/admin/crm",
});;

export default function AdminCrmPage() {
  return (
    <PlatformShell
      badge="Admin"
      description="Review leads, clients, contacts, sales pipeline and CRM activity."
      nav={adminNav}
      title="CRM"
    >
      <div className="space-y-6">
        <MetricGrid metrics={crmMetrics} />
        <WorkflowCard title="Lead management">
          <RecordList
            items={crmLeads.map((lead) => ({
              title: lead.company,
              meta: lead.contact,
              value: lead.status,
            }))}
          />
        </WorkflowCard>
      </div>
    </PlatformShell>
  );
}
