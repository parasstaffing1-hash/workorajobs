import { createMetadata } from "@/lib/site";
import { SourcingOrchestrator } from "@/modules/boolean-search";

export const metadata = createMetadata({
  title: "Boolean Search Tool for Recruiters & Sourcers",
  description:
    "Generate advanced boolean search strings instantly for Google X-Ray, LinkedIn, and Github.",
  path: "/tools/boolean-search",
});

export default function BooleanSearchToolPage() {
  return (
    <div className="min-h-screen pt-20">
      <SourcingOrchestrator />
    </div>
  );
}
