import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Recruitment Analytics & Performance Overview",
  description:
    "Recruitment pipeline metrics, sourcing conversion rates, and time-to-hire reports.",
  path: "/analytics",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
