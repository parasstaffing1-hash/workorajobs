import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { adminNav, rolePermissions } from "@/data/platform";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Roles and Permissions",
  path: "/admin/roles",
});

export default function AdminRolesPage() {
  return (
    <PlatformShell
      badge="Admin"
      description="Manage enterprise roles, permission grants and access governance."
      nav={adminNav}
      title="Role Management"
    >
      <WorkflowCard title="Permission sets">
        <RecordList
          items={rolePermissions.map((item) => ({
            title: item.role,
            meta: item.permissions,
          }))}
        />
      </WorkflowCard>
    </PlatformShell>
  );
}
