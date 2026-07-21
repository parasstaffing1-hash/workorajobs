import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Job Alerts & Candidate Notifications",
  description:
    "View real-time alerts, interview invitations, and status updates.",
  path: "/candidate/notifications",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
