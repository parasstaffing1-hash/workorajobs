import { createMetadata } from "@/lib/site";
import PageClient from "./page-client";

export const metadata = createMetadata({
  title: "Admin User Accounts & Member Moderation",
  description:
    "User account management, access suspension, and profile moderation.",
  path: "/admin/users",
});

export default function Page(props: any) {
  return <PageClient {...props} />;
}
