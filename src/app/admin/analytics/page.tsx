import { MetricGrid } from "@/components/platform/metric-grid";
import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { adminNav, analyticsMetrics } from "@/data/platform";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Admin Analytics & System Performance Reports",
  description:
    "Platform metrics, system usage analytics, and growth performance reports.",
  path: "/admin/analytics",
});;

export default function AdminAnalyticsPage() {
  return (
    <PlatformShell
      badge="Admin"
      description="Review hiring analytics, employer analytics, candidate analytics and recruiter performance."
      nav={adminNav}
      title="Admin Analytics"
    >
      <WorkflowCard title="Platform analytics">
        <MetricGrid metrics={analyticsMetrics} />
      </WorkflowCard>
    </PlatformShell>
  );
}
