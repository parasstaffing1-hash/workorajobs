import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Subscription Billing & Invoice Management",
  description:
    "Manage plan subscriptions, payment methods, and download billing invoices.",
  path: "/billing",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
