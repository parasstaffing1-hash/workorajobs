import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "CRM Client Accounts & Corporate Contacts",
  description:
    "Manage corporate client accounts, key stakeholders, and hiring contracts.",
  path: "/crm/clients",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
