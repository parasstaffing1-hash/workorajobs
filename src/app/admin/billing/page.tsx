import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { adminNav, billingPlans, invoices } from "@/data/platform";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Admin Billing",
  path: "/admin/billing",
});

export default function AdminBillingPage() {
  return (
    <PlatformShell
      badge="Admin"
      description="Manage subscription plans, invoices, GST support, coupons and payment history."
      nav={adminNav}
      title="Billing"
    >
      <div className="space-y-6">
        <WorkflowCard title="Plans">
          <RecordList
            items={billingPlans.map((plan) => ({
              title: plan.name,
              meta: plan.features,
              value: plan.price,
            }))}
          />
        </WorkflowCard>
        <WorkflowCard title="Invoices">
          <RecordList
            items={invoices.map((invoice) => ({
              title: invoice.number,
              meta: invoice.company,
              value: invoice.status,
            }))}
          />
        </WorkflowCard>
      </div>
    </PlatformShell>
  );
}
