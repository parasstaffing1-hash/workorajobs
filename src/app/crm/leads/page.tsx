import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "CRM Business Leads & Prospecting Pipeline",
  description:
    "Track business development leads, client outreach, and contract proposals.",
  path: "/crm/leads",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
