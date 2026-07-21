import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Candidate Pool & Sourced Talent Roster",
  description:
    "Central candidate repository with AI resume scoring and talent tags.",
  path: "/recruiter/candidates",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
