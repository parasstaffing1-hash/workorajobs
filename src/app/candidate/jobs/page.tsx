import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Recommended Jobs & Career Opportunities",
  description:
    "Personalized job recommendations matched with your skills and background.",
  path: "/candidate/jobs",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
