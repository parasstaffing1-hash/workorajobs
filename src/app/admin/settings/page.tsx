import { ToggleLeft } from "lucide-react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { adminNav, systemStats } from "@/data/platform";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "System Settings",
  path: "/admin/settings",
});

export default function AdminSettingsPage() {
  return (
    <PlatformShell
      badge="Admin"
      description="Control system settings, password policy, caching, maintenance mode and production operations."
      nav={adminNav}
      title="System Settings"
    >
      <WorkflowCard
        action={
          <Button size="sm" variant="secondary">
            <ToggleLeft aria-hidden="true" className="h-4 w-4" />
            Maintenance
          </Button>
        }
        title="Operational settings"
      >
        <RecordList
          items={systemStats.map((stat) => ({
            title: stat.label,
            meta: stat.delta,
            value: stat.value,
          }))}
        />
      </WorkflowCard>
    </PlatformShell>
  );
}
