import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Admin Job Listings Management & Moderation",
  description:
    "Moderate posted job listings, verify employer posts, and approve roles.",
  path: "/admin/jobs",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
