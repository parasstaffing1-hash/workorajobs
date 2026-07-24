import { CompleteJobSeekerProfile } from "./profile-types";

export interface ProfileCompletionReport {
  score: number; // 0 - 100
  level: "Beginner" | "Intermediate" | "Advanced" | "All-Star";
  completedItems: number;
  totalItems: number;
  missingItems: { field: string; label: string; points: number }[];
}

/**
 * Dynamic Profile Completion Calculator with weighted scoring
 */
export function calculateProfileCompletion(profile: Partial<CompleteJobSeekerProfile>): ProfileCompletionReport {
  const items = [
    // 1. Personal Details (20 Points)
    { field: "personal.name", label: "Full Name", points: 5, value: !!profile.personal?.name },
    { field: "personal.phone", label: "Phone Number", points: 5, value: !!profile.personal?.phone },
    { field: "personal.location", label: "Current Location", points: 5, value: !!profile.personal?.location },
    { field: "personal.photoUrl", label: "Profile Photo", points: 5, value: !!profile.personal?.photoUrl },

    // 2. Professional Headline & Summary (20 Points)
    { field: "professional.headline", label: "Professional Headline", points: 10, value: !!profile.professional?.headline },
    { field: "professional.summary", label: "About / Bio Summary", points: 10, value: !!profile.professional?.summary },

    // 3. Work Experience & Education (25 Points)
    { field: "professional.experience", label: "Work Experience", points: 15, value: (profile.professional?.experience?.length || 0) > 0 },
    { field: "professional.education", label: "Education History", points: 10, value: (profile.professional?.education?.length || 0) > 0 },

    // 4. Skills & Resume (20 Points)
    { field: "professional.skills", label: "Skills (at least 3)", points: 10, value: (profile.professional?.skills?.length || 0) >= 3 },
    { field: "professional.resumeUrl", label: "Uploaded Resume PDF", points: 10, value: !!profile.professional?.resumeUrl },

    // 5. Preferences (15 Points)
    { field: "preferences.preferredJobTitles", label: "Preferred Job Titles", points: 5, value: (profile.preferences?.preferredJobTitles?.length || 0) > 0 },
    { field: "preferences.salaryExpectation", label: "Expected Salary Range", points: 5, value: !!profile.preferences?.salaryExpectation },
    { field: "preferences.noticePeriod", label: "Notice Period", points: 5, value: !!profile.preferences?.noticePeriod },
  ];

  let score = 0;
  let completedItems = 0;
  const missingItems: { field: string; label: string; points: number }[] = [];

  items.forEach((item) => {
    if (item.value) {
      score += item.points;
      completedItems += 1;
    } else {
      missingItems.push({
        field: item.field,
        label: item.label,
        points: item.points,
      });
    }
  });

  let level: "Beginner" | "Intermediate" | "Advanced" | "All-Star" = "Beginner";
  if (score >= 90) level = "All-Star";
  else if (score >= 70) level = "Advanced";
  else if (score >= 40) level = "Intermediate";

  return {
    score,
    level,
    completedItems,
    totalItems: items.length,
    missingItems,
  };
}
