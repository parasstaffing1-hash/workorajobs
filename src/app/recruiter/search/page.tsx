import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Sourcing Search Engine & Talent Discovery",
  description:
    "Search talent pool using boolean queries, skill filters, and location tags.",
  path: "/recruiter/search",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
