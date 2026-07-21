import { ProfileClient } from "./profile-client";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Candidate Profile & Resume Preferences",
  description:
    "Manage your professional candidate profile, uploaded CVs, and preferences.",
  path: "/candidate/profile",
});;

export default function CandidateProfilePage() {
  return <ProfileClient />;
}
