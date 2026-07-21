import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { adminNav, contentItems } from "@/data/platform";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Admin Content & Marketing CMS Management",
  description:
    "Manage blog posts, landing page marketing copy, and SEO content.",
  path: "/admin/content",
});;

export default function AdminContentPage() {
  return (
    <PlatformShell
      badge="Admin"
      description="Manage content pages, resources, publishing states and ownership."
      nav={adminNav}
      title="Content Management"
    >
      <WorkflowCard title="Content library">
        <RecordList
          items={contentItems.map((item) => ({
            title: item.title,
            meta: item.owner,
            value: item.status,
          }))}
        />
      </WorkflowCard>
    </PlatformShell>
  );
}
