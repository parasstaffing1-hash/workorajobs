import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Contractor Payroll & Staffing Invoicing",
  description:
    "Manage contractor timesheets, staffing invoices, and payroll payouts.",
  path: "/recruiter/payroll",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
