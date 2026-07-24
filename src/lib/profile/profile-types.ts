export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string; // YYYY-MM
  endDate?: string;  // YYYY-MM or null if current
  isCurrent: boolean;
  description: string;
  skillsUsed?: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  grade?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface LanguageItem {
  language: string;
  proficiency: "Native" | "Fluent" | "Professional" | "Basic";
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  url?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
  technologies?: string[];
}

export interface PersonalInformation {
  name: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  gender?: string;
  location?: string;
}

export interface ProfessionalDetails {
  headline?: string;
  summary?: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  skills: string[];
  languages: LanguageItem[];
  projects: ProjectItem[];
  resumeUrl?: string;
}

export interface CareerPreferences {
  preferredJobTitles: string[];
  salaryExpectation?: number; // Annual in USD or local currency
  workMode: "Remote" | "Hybrid" | "On-site";
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship";
  noticePeriod: "Immediate" | "15 Days" | "30 Days" | "60 Days" | "90 Days";
  willRelocate: boolean;
  preferredLocations: string[];
}

export interface PrivacySettings {
  profileVisibility: "PUBLIC" | "PRIVATE" | "RECRUITERS_ONLY";
  resumeVisibility: "PUBLIC" | "PRIVATE" | "APPLIED_ONLY";
  contactVisibility: "PUBLIC" | "PRIVATE" | "RECRUITERS_ONLY";
}

export interface CompleteJobSeekerProfile {
  userId: string;
  personal: PersonalInformation;
  professional: ProfessionalDetails;
  preferences: CareerPreferences;
  privacy: PrivacySettings;
  completionPercentage: number;
  missingFields: string[];
  updatedAt: string;
}
