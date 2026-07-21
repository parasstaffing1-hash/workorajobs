import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "CRM Deal Stages & Sales Pipeline Board",
  description:
    "Visual Kanban pipeline tracking client engagements and revenue opportunities.",
  path: "/crm/pipeline",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
