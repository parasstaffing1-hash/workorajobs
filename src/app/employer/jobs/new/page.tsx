import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Post a New Job Opening & Attract Talent",
  description:
    "Create and publish a new job posting to attract qualified candidates globally.",
  path: "/employer/jobs/new",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
