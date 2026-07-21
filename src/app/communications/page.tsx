import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Candidate Messaging & Communication Hub",
  description:
    "In-app messaging center for communicating with candidates and hiring managers.",
  path: "/communications",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
