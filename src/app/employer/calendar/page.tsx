import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Interview Calendar & Schedule Coordinator",
  description:
    "Coordinate interview schedules with candidates and hiring managers.",
  path: "/employer/calendar",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
