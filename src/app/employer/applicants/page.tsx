import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Applicant Tracking & Candidate Evaluation",
  description:
    "Review candidate applications, score resumes, and schedule interviews.",
  path: "/employer/applicants",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
