import { SourcingOrchestrator } from "@/modules/boolean-search";

export const metadata = {
  title: "Boolean Search String Generator | Workora Tools",
  description: "Advanced recruiter Boolean search string generator, Google X-Ray builder, role blueprints, and syntax validator.",
};

export default function BooleanSearchToolPage() {
  return (
    <div className="min-h-screen pt-20">
      <SourcingOrchestrator />
    </div>
  );
}
