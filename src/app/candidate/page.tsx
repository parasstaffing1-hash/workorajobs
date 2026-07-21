import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Candidate Dashboard | Jobs & Applications",
  description:
    "Candidate career management dashboard for application tracking and saved jobs.",
  path: "/candidate",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
