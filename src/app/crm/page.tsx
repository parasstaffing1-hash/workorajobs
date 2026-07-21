import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Recruitment CRM & Client Pipeline Dashboard",
  description:
    "Corporate relationship management, candidate deals, and sales activity.",
  path: "/crm",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
