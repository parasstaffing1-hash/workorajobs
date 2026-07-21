import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Enterprise Staffing & Global Hiring Services",
  description:
    "End-to-end recruitment services, executive search, and global payroll management.",
  path: "/services",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
