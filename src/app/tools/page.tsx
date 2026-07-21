import { createMetadata } from "@/lib/site";
import { SourcingOrchestrator } from "@/modules/boolean-search";

export const metadata = createMetadata({
  title: "Free AI Recruitment Tools for Recruiters",
  description:
    "Free recruiter tools including Boolean search generator, job description formatter, and salary estimators.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="min-h-screen pt-20">
      <SourcingOrchestrator />
    </div>
  );
}
