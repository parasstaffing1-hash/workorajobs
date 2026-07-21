import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "CRM Daily Tasks & Follow-up Reminders",
  description:
    "Track business tasks, client follow-up calls, and account milestones.",
  path: "/crm/tasks",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
