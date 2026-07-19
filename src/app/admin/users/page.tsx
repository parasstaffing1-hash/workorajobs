"use client";

import { useRouter } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { adminNav, adminUsers } from "@/data/platform";

export default function AdminUsersPage() {
  const router = useRouter();

  const handleAction = (action: string) => {
    alert(`Action triggered: ${action}`);
  };

  return (
    <PlatformShell
      badge="Admin"
      description="Manage admins, recruiters, employers, candidates and role assignments."
      nav={adminNav}
      title="User Management"
    >
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.push("/admin")}>
          Back to Admin
        </Button>
      </div>
      <WorkflowCard 
        title="Users"
        action={<Button onClick={() => handleAction("Add User")}>Add User</Button>}
      >
        <RecordList
          items={adminUsers.map((user) => ({
            title: user.name,
            meta: user.role,
            value: user.status,
            details: `Profile details for ${user.name} with role ${user.role}.`
          }))}
        />
      </WorkflowCard>
    </PlatformShell>
  );
}
