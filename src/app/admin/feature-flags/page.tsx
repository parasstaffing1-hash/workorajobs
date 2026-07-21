import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { adminNav, featureFlags } from "@/data/platform";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Admin Feature Flags & Deployment Toggles",
  description:
    "Toggle platform feature flags, beta modules, and experimental features.",
  path: "/admin/feature-flags",
});;

export default function AdminFeatureFlagsPage() {
  return (
    <PlatformShell
      badge="Admin"
      description="Manage feature flags, rollout percentages and environment-specific controls."
      nav={adminNav}
      title="Feature Flags"
    >
      <WorkflowCard title="Flag controls">
        <RecordList
          items={featureFlags.map((flag) => ({
            title: flag.key,
            meta: `${flag.rollout} rollout`,
            value: flag.status,
          }))}
        />
      </WorkflowCard>
    </PlatformShell>
  );
}
