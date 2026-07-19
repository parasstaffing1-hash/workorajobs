import { ProfileClient } from "./profile-client";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Candidate Profile",
  path: "/candidate/profile",
});

export default function CandidateProfilePage() {
  return <ProfileClient />;
}
