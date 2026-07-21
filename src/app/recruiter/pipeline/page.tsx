import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Candidate Screening Pipeline & Stages",
  description:
    "Visual candidate pipeline board for tracking screening, submissions, and offers.",
  path: "/recruiter/pipeline",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
