import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "My Job Applications & Status Tracker",
  description:
    "Track submitted job applications, interview schedules, and employer feedback.",
  path: "/candidate/applications",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
