import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Recruiter Daily Tasks & Follow-up Checklist",
  description:
    "Daily sourcing task list, candidate follow-up reminders, and priority actions.",
  path: "/recruiter/tasks",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
