import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Employer Dashboard | Hire & Manage Talent",
  description:
    "Employer command center for managing open positions and talent sourcing.",
  path: "/employer",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
