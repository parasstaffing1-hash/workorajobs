export const employerNav = [
  { href: "/employer", label: "Dashboard" },
  { href: "/employer/company", label: "Company" },
  { href: "/employer/jobs", label: "Jobs" },
  { href: "/employer/applicants", label: "Applicants" },
  { href: "/employer/calendar", label: "Calendar" },
  { href: "/employer/settings", label: "Settings" },
];

export const candidateNav = [
  { href: "/candidate", label: "Dashboard" },
  { href: "/candidate/profile", label: "Profile" },
  { href: "/candidate/jobs", label: "Find jobs" },
  { href: "/candidate/applications", label: "Applications" },
  { href: "/candidate/saved-jobs", label: "Saved jobs" },
  { href: "/candidate/notifications", label: "Notifications" },
];

export const recruiterNav = [
  { href: "/recruiter", label: "Dashboard" },
  { href: "/recruiter/candidates", label: "Candidates" },
  { href: "/recruiter/pipeline", label: "Pipeline" },
  { href: "/recruiter/search", label: "Search" },
  { href: "/recruiter/payroll", label: "Payroll & Math" },
  { href: "/recruiter/calendar", label: "Calendar" },
  { href: "/recruiter/tasks", label: "Tasks" },
  { href: "/recruiter/ai", label: "AI tools" },
  { href: "/recruiter/automation", label: "Automation" },
];

export const employerMetrics = [
  { label: "Open jobs", value: "0", delta: "No active jobs" },
  { label: "Applicants", value: "0", delta: "0 this week" },
  { label: "Shortlisted", value: "0", delta: "0% of applicants" },
  { label: "Interviews", value: "0", delta: "0 upcoming" },
];

export const employerJobs: any[] = [];

export const applicants: any[] = [];

export const interviews: any[] = [];


export const candidateMetrics = [
  {
    label: "Profile completion",
    value: "86%",
    delta: "Resume and skills complete",
  },
  { label: "Saved jobs", value: "9", delta: "3 new matches" },
  { label: "Applications", value: "6", delta: "2 in interview" },
  { label: "Notifications", value: "4", delta: "Unread updates" },
];

export const candidateProfileSections = [
  "Resume",
  "Education",
  "Experience",
  "Skills",
  "Certifications",
  "Languages",
  "Portfolio",
  "LinkedIn",
];

export const applicationTimeline = [
  { label: "Application submitted", date: "Jul 10, 2026", tone: "Complete" },
  { label: "Recruiter review", date: "Jul 11, 2026", tone: "Complete" },
  { label: "Shortlisted", date: "Jul 12, 2026", tone: "Complete" },
  { label: "Interview scheduled", date: "Jul 16, 2026", tone: "Upcoming" },
];

export const platformNotifications = [
  "Application submitted for Senior Product Designer",
  "Interview scheduled with Northstar Cloud",
  "Profile updated successfully",
  "Global Payroll Operations Lead has closed",
];

export const recruiterMetrics = [
  { label: "Assigned jobs", value: "18", delta: "6 active pipelines" },
  { label: "Candidates", value: "1,284", delta: "92 newly indexed" },
  { label: "Interviews", value: "34", delta: "11 this week" },
  { label: "Open tasks", value: "27", delta: "8 high priority" },
];

export const recruiterCandidates = [
  {
    name: "Daniel Okoro",
    headline: "Senior Product Manager",
    location: "Toronto, Canada",
    match: "78%",
    stage: "Recruiter screen",
    tags: ["High intent", "Product systems"],
  },
  {
    name: "Priya Raman",
    headline: "Staff Backend Engineer",
    location: "Bengaluru, India",
    match: "91%",
    stage: "Interview",
    tags: ["Cloud", "Distributed systems"],
  },
  {
    name: "Marcus Lee",
    headline: "Global Payroll Lead",
    location: "Singapore",
    match: "84%",
    stage: "Offer",
    tags: ["Payroll", "APAC"],
  },
];

export const recruiterPipeline = [
  { stage: "Applied", count: 142, tone: "New" },
  { stage: "Recruiter screen", count: 48, tone: "Reviewing" },
  { stage: "Interview", count: 26, tone: "Scheduled" },
  { stage: "Offer", count: 7, tone: "Decision" },
  { stage: "Rejected", count: 69, tone: "Closed" },
];

export const recruiterTasks = [
  {
    title: "Prepare shortlist packet",
    due: "Today, 17:00 UTC",
    priority: "High",
    status: "In progress",
  },
  {
    title: "Send interview reminder",
    due: "Tomorrow, 09:00 UTC",
    priority: "Medium",
    status: "Queued",
  },
  {
    title: "Review duplicate candidate alert",
    due: "Friday, 12:00 UTC",
    priority: "High",
    status: "Queued",
  },
];

export const recruiterSavedSearches = [
  {
    name: "Senior product leaders in Canada",
    query: '"Product Manager" AND SQL',
    filters: "Canada, SQL, 30-day availability",
  },
  {
    name: "Remote payroll operations",
    query: "Payroll AND APAC",
    filters: "Remote, leadership, compliance",
  },
  {
    name: "Cloud staff engineers",
    query: "(Kubernetes OR AWS) AND platform",
    filters: "Senior+, remote, backend",
  },
];

export const recruiterAutomation = [
  {
    name: "Resume processing",
    event: "RESUME_PROCESSING",
    status: "Ready",
  },
  {
    name: "Interview reminder",
    event: "INTERVIEW_REMINDER",
    status: "n8n target required",
  },
  {
    name: "Candidate matching",
    event: "CANDIDATE_MATCHING",
    status: "Ready",
  },
];

export const recruiterAiTools = [
  {
    name: "Resume analysis",
    endpoint: "POST /api/v1/ai/resume-analysis",
    description:
      "Summarize role fit, strengths, risks and recruiter follow-up questions from resume content.",
    input: "resumeText, jobDescription, candidateProfileId",
    output: "Structured analysis artifact",
    status: "Local ready",
  },
  {
    name: "Resume scoring",
    endpoint: "POST /api/v1/ai/resume-score",
    description:
      "Score candidate evidence against a target job description with explainable scoring factors.",
    input: "resumeText, jobDescription, applicationId",
    output: "Score, signals and recommendations",
    status: "Local ready",
  },
  {
    name: "Candidate matching",
    endpoint: "POST /api/v1/ai/candidate-match",
    description:
      "Compare a candidate profile with an open role and recommend the next recruiter action.",
    input: "resumeText, jobDescription, jobId",
    output: "Match summary and next action",
    status: "Local ready",
  },
  {
    name: "Boolean string search generator",
    endpoint: "POST /api/v1/ai/hiring-assistant",
    description:
      "Generate recruiter-ready Boolean search strings, synonym variants and exclusion terms for sourcing platforms.",
    input: "prompt, jobDescription, context",
    output: "Boolean search strings and sourcing variants",
    status: "Local ready",
  },
  {
    name: "Skill gap analysis",
    endpoint: "POST /api/v1/ai/skill-gap",
    description:
      "Identify missing, weak or under-evidenced skills before a candidate advances.",
    input: "resumeText, jobDescription",
    output: "Skill gaps and interview probes",
    status: "Local ready",
  },
  {
    name: "Job description generator",
    endpoint: "POST /api/v1/ai/job-description",
    description:
      "Draft inclusive, enterprise-ready job descriptions from role context and hiring goals.",
    input: "prompt, context",
    output: "Draft job description sections",
    status: "Local ready",
  },
  {
    name: "Interview question generator",
    endpoint: "POST /api/v1/ai/interview-questions",
    description:
      "Generate structured questions, evaluation signals and role-specific interview prompts.",
    input: "prompt, jobDescription, context",
    output: "Question set and rubric cues",
    status: "Local ready",
  },
  {
    name: "Candidate summary",
    endpoint: "POST /api/v1/ai/candidate-summary",
    description:
      "Create a concise recruiter and hiring-manager summary for shortlist review.",
    input: "resumeText, context, applicationId",
    output: "Review-ready candidate summary",
    status: "Local ready",
  },
  {
    name: "AI hiring assistant",
    endpoint: "POST /api/v1/ai/hiring-assistant",
    description:
      "Answer hiring workflow questions with policy-aware, human-reviewed guidance.",
    input: "prompt, context",
    output: "Assistant response artifact",
    status: "Local ready",
  },
];

export const adminNav = [
  { href: "/admin", label: "Executive" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/roles", label: "Roles" },
  { href: "/admin/audit", label: "Audit" },
  { href: "/admin/search", label: "Search" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/feature-flags", label: "Flags" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/billing", label: "Billing" },
  { href: "/admin/crm", label: "CRM" },
  { href: "/admin/communications", label: "Comms" },
];

export const crmNav = [
  { href: "/crm", label: "Overview" },
  { href: "/crm/leads", label: "Leads" },
  { href: "/crm/clients", label: "Clients" },
  { href: "/crm/pipeline", label: "Pipeline" },
  { href: "/crm/tasks", label: "Tasks" },
];

export const analyticsNav = [
  { href: "/analytics", label: "Overview" },
  { href: "/analytics/reports", label: "Reports" },
];

export const adminMetrics = [
  { label: "Total users", value: "4,812", delta: "+18% QoQ" },
  { label: "Companies", value: "326", delta: "41 enterprise" },
  { label: "Applications", value: "28.4k", delta: "12% conversion lift" },
  { label: "MRR", value: "$248k", delta: "GST-ready billing" },
];

export const systemStats = [
  { label: "API health", value: "Operational", delta: "99.98% uptime" },
  { label: "Queue status", value: "Normal", delta: "0 failed automations" },
  { label: "Storage", value: "S3 ready", delta: "6 media classes" },
  { label: "Security", value: "Hardened", delta: "Audit logging active" },
];

export const adminUsers = [
  { name: "Amara Stone", role: "Admin", status: "Active" },
  { name: "Maya Chen", role: "Employer", status: "Active" },
  { name: "Daniel Okoro", role: "Candidate", status: "Active" },
  { name: "Elena Ruiz", role: "Recruiter", status: "Active" },
];

export const adminTimeline = [
  "auth.login recorded for recruiter@workorajobs.com",
  "billing.checkout_session requested for Northstar Cloud",
  "ats.application.stage.updated for Senior Product Designer",
  "crm.lead.created for Atlas Finance",
];

export const rolePermissions = [
  { role: "Enterprise Admin", permissions: "All platform resources" },
  { role: "Recruiter Lead", permissions: "CRM, ATS, analytics, candidates" },
  { role: "Billing Manager", permissions: "Plans, invoices, payments" },
];

export const featureFlags = [
  { key: "ai_hiring_assistant", status: "Enabled", rollout: "100%" },
  { key: "billing_self_service", status: "Enabled", rollout: "100%" },
  { key: "maintenance_banner", status: "Disabled", rollout: "0%" },
];

export const contentItems = [
  {
    title: "Enterprise Hiring Guide",
    status: "Published",
    owner: "Admin",
  },
  {
    title: "Candidate Interview Prep",
    status: "Draft",
    owner: "Content",
  },
  {
    title: "Employer Onboarding Checklist",
    status: "Published",
    owner: "Operations",
  },
];

export const mediaLibrary = [
  { name: "workora-platform-overview.pdf", type: "Document", size: "128 KB" },
  { name: "northstar-logo.svg", type: "Company logo", size: "42 KB" },
  { name: "daniel-okoro-resume.pdf", type: "Resume", size: "312 KB" },
];

export const crmMetrics = [
  { label: "Leads", value: "186", delta: "24 qualified" },
  { label: "Clients", value: "73", delta: "18 enterprise" },
  { label: "Pipeline", value: "$1.8M", delta: "Weighted forecast" },
  { label: "Follow-ups", value: "42", delta: "11 due today" },
];

export const crmLeads = [
  {
    company: "Atlas Finance",
    contact: "Nora Ellis",
    status: "Qualified",
    value: "$125k",
  },
  {
    company: "Helio Health",
    contact: "Ravi Shah",
    status: "Nurturing",
    value: "$84k",
  },
  {
    company: "Northstar Cloud",
    contact: "Maya Chen",
    status: "Won",
    value: "$240k",
  },
];

export const crmClients = [
  { name: "Northstar Cloud", owner: "Elena Ruiz", status: "Active" },
  { name: "Atlas Finance", owner: "Elena Ruiz", status: "Proposal" },
  { name: "Helio Health", owner: "Amara Stone", status: "Discovery" },
];

export const salesPipeline = [
  { stage: "Prospecting", count: 32, value: "$410k" },
  { stage: "Qualification", count: 18, value: "$520k" },
  { stage: "Proposal", count: 9, value: "$640k" },
  { stage: "Negotiation", count: 4, value: "$330k" },
  { stage: "Won", count: 7, value: "$910k" },
];

export const analyticsMetrics = [
  { label: "Apply rate", value: "14.8%", delta: "+2.1 pts" },
  { label: "Interview rate", value: "8.6%", delta: "+0.9 pts" },
  { label: "Offer rate", value: "2.4%", delta: "Stable" },
  { label: "Time to shortlist", value: "2.1d", delta: "-18%" },
];

export const reports = [
  { name: "Hiring performance overview", type: "Hiring", status: "Ready" },
  { name: "Recruiter productivity", type: "Recruiter", status: "Ready" },
  { name: "Employer conversion funnel", type: "Employer", status: "Queued" },
];

export const billingPlans = [
  { name: "Starter", price: "$149/mo", features: "10 jobs, core ATS" },
  { name: "Growth", price: "$299/mo", features: "25 jobs, AI, analytics" },
  { name: "Enterprise", price: "Custom", features: "SLA, SSO, custom terms" },
];

export const invoices = [
  { number: "INV-WORKORA-0001", company: "Northstar Cloud", status: "Paid" },
  { number: "INV-WORKORA-0002", company: "Atlas Finance", status: "Open" },
  { number: "INV-WORKORA-0003", company: "Helio Health", status: "Draft" },
];

export const communicationProviders = [
  { channel: "Email", provider: "SMTP", status: "Enabled" },
  { channel: "SMS", provider: "Provider structure", status: "Needs key" },
  { channel: "WhatsApp", provider: "Provider structure", status: "Needs key" },
  { channel: "Push", provider: "Provider structure", status: "Needs key" },
];
