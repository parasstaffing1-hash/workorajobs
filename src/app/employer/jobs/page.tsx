import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Employer Job Listings & Opening Management",
  description:
    "Manage active job postings, edit position requirements, and view stats.",
  path: "/employer/jobs",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
