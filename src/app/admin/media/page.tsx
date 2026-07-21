import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { adminNav, mediaLibrary } from "@/data/platform";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Admin Media Library & Asset Management",
  description:
    "Manage company brand assets, candidate uploaded files, and media storage.",
  path: "/admin/media",
});;

export default function AdminMediaPage() {
  return (
    <PlatformShell
      badge="Admin"
      description="Review resumes, logos, profile images, certificates, documents and content media."
      nav={adminNav}
      title="Media Library"
    >
      <WorkflowCard title="Stored assets">
        <RecordList
          items={mediaLibrary.map((asset) => ({
            title: asset.name,
            meta: asset.type,
            value: asset.size,
          }))}
        />
      </WorkflowCard>
    </PlatformShell>
  );
}
