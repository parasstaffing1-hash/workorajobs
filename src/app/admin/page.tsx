import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Admin Portal | Enterprise Management Console",
  description:
    "System administration portal for WorkoraJobs platform operations.",
  path: "/admin",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
