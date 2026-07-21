import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Company Profile Settings & Branding Hub",
  description:
    "Manage public employer branding, company culture notes, and tech stack details.",
  path: "/employer/company",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
