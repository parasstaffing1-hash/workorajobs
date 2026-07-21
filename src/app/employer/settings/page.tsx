import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Employer Account Settings & Team Access",
  description:
    "Manage team permissions, billing preferences, and organization settings.",
  path: "/employer/settings",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
