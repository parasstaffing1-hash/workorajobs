import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Recruiter Workbench & Talent Command Center",
  description:
    "High-density workbench for recruiters to source, screen, and submit talent.",
  path: "/recruiter",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
