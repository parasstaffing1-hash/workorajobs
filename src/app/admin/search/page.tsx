import { Search } from "lucide-react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminNav, recruiterCandidates } from "@/data/platform";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Global Search",
  path: "/admin/search",
});

export default function AdminSearchPage() {
  return (
    <PlatformShell
      badge="Admin"
      description="Search users, jobs, companies, candidates and indexed content."
      nav={adminNav}
      title="Global Search"
    >
      <div className="space-y-6">
        <WorkflowCard title="Search index">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <Input aria-label="Global search" placeholder="Search Workora" />
            <Button>
              <Search aria-hidden="true" className="h-4 w-4" />
              Search
            </Button>
          </div>
        </WorkflowCard>
        <WorkflowCard title="Indexed examples">
          <RecordList
            items={recruiterCandidates.map((candidate) => ({
              title: candidate.name,
              meta: candidate.headline,
              value: candidate.match,
            }))}
          />
        </WorkflowCard>
      </div>
    </PlatformShell>
  );
}
