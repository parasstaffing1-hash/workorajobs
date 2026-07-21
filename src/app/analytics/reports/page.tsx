import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Hiring Reports & Recruiter Metrics Insights",
  description:
    "Generate custom recruitment reports, candidate funnel dropoffs, and SLA tracking.",
  path: "/analytics/reports",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
