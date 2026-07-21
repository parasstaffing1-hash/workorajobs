import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Saved Job Listings & Bookmarked Positions",
  description:
    "Bookmarked job openings and saved career opportunities.",
  path: "/candidate/saved-jobs",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
