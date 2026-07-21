import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Hiring Resources & Professional Recruiter Guides",
  description:
    "Comprehensive guides, templates, and frameworks for technical hiring and staffing.",
  path: "/resources",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
