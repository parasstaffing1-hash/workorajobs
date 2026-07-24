export type EmployerRole = "OWNER" | "ADMIN" | "HR_MANAGER" | "RECRUITER" | "HIRING_MANAGER" | "INTERVIEWER";

export type Permission =
  | "MANAGE_TEAM"
  | "POST_JOBS"
  | "VIEW_APPLICANTS"
  | "MANAGE_ATS"
  | "CONDUCT_INTERVIEWS"
  | "COMPANY_SETTINGS";

export interface RoleConfig {
  label: string;
  description: string;
  color: string;
  defaultPermissions: Permission[];
}

export const ROLE_CONFIGS: Record<EmployerRole, RoleConfig> = {
  OWNER: {
    label: "Company Owner",
    description: "Full uninhibited root control over company, billing, and team.",
    color: "purple",
    defaultPermissions: ["MANAGE_TEAM", "POST_JOBS", "VIEW_APPLICANTS", "MANAGE_ATS", "CONDUCT_INTERVIEWS", "COMPANY_SETTINGS"],
  },
  ADMIN: {
    label: "Company Admin",
    description: "Full administrative access to manage postings, team members, and settings.",
    color: "blue",
    defaultPermissions: ["MANAGE_TEAM", "POST_JOBS", "VIEW_APPLICANTS", "MANAGE_ATS", "CONDUCT_INTERVIEWS", "COMPANY_SETTINGS"],
  },
  HR_MANAGER: {
    label: "HR Manager",
    description: "Manages overall recruitment operations, offer letters, and job postings.",
    color: "indigo",
    defaultPermissions: ["POST_JOBS", "VIEW_APPLICANTS", "MANAGE_ATS", "CONDUCT_INTERVIEWS"],
  },
  RECRUITER: {
    label: "Talent Recruiter",
    description: "Posts jobs, screens candidates, advances ATS pipeline stages.",
    color: "emerald",
    defaultPermissions: ["POST_JOBS", "VIEW_APPLICANTS", "MANAGE_ATS", "CONDUCT_INTERVIEWS"],
  },
  HIRING_MANAGER: {
    label: "Hiring Manager",
    description: "Reviews department applicants, schedules interviews, and approves hires.",
    color: "amber",
    defaultPermissions: ["VIEW_APPLICANTS", "MANAGE_ATS", "CONDUCT_INTERVIEWS"],
  },
  INTERVIEWER: {
    label: "Interviewer",
    description: "Reviews assigned candidate profiles and submits scorecard feedback.",
    color: "teal",
    defaultPermissions: ["VIEW_APPLICANTS", "CONDUCT_INTERVIEWS"],
  },
};

export const ALL_PERMISSIONS: Array<{ key: Permission; label: string; desc: string }> = [
  { key: "MANAGE_TEAM", label: "Manage Team & Roles", desc: "Invite members, change RBAC roles, suspend access" },
  { key: "POST_JOBS", label: "Post & Edit Jobs", desc: "Create, edit, publish, pause, or close job listings" },
  { key: "VIEW_APPLICANTS", label: "View Candidate Profiles", desc: "Access candidate resumes and application details" },
  { key: "MANAGE_ATS", label: "Manage ATS Pipeline", desc: "Move candidate stages, send offers, or reject" },
  { key: "CONDUCT_INTERVIEWS", label: "Conduct & Rate Interviews", desc: "Submit 1-5 star ratings and feedback scorecards" },
  { key: "COMPANY_SETTINGS", label: "Company Settings & Tax/GST", desc: "Update corporate details, GST/CIN numbers" },
];
