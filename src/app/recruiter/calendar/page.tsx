import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Recruiter Calendar & Screening Schedule",
  description:
    "Manage recruiter screening availability, call bookings, and interviews.",
  path: "/recruiter/calendar",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
