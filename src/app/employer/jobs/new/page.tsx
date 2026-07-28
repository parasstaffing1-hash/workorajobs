import { redirect } from "next/navigation";

import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Post a New Job Opening & Attract Talent",
  description:
    "Create and publish a new job posting to attract qualified candidates globally.",
  path: "/employer/jobs/new",
});

export default function Page() {
  redirect("/employer/jobs/create");
}
