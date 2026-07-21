import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Recruitment Automation & Workflow Rules",
  description:
    "Configure automated email sequences, candidate triggers, and status updates.",
  path: "/recruiter/automation",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
