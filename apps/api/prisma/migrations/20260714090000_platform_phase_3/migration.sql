CREATE TYPE "CompanyStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SUSPENDED');
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED');
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP');
CREATE TYPE "ExperienceLevel" AS ENUM ('ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE');
CREATE TYPE "RemotePolicy" AS ENUM ('ONSITE', 'HYBRID', 'REMOTE');
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'REJECTED', 'WITHDRAWN', 'OFFERED', 'HIRED');
CREATE TYPE "InterviewStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');
CREATE TYPE "NotificationType" AS ENUM ('APPLICATION_SUBMITTED', 'APPLICATION_WITHDRAWN', 'INTERVIEW_SCHEDULED', 'JOB_CLOSED', 'PROFILE_UPDATED', 'APPLICATION_STATUS');

CREATE TABLE "companies" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "ownerId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "status" "CompanyStatus" NOT NULL DEFAULT 'DRAFT',
  "logoUrl" TEXT,
  "logoKey" TEXT,
  "website" TEXT,
  "industry" TEXT,
  "size" TEXT,
  "headquarters" TEXT,
  "description" TEXT,
  "settings" JSONB,
  "billingCustomerId" TEXT,
  "subscriptionPlan" TEXT,
  "subscriptionStatus" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "jobs" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "companyId" UUID NOT NULL,
  "createdById" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "responsibilities" TEXT,
  "requirements" TEXT,
  "benefits" TEXT,
  "category" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "country" TEXT,
  "salaryMin" INTEGER,
  "salaryMax" INTEGER,
  "salaryCurrency" TEXT NOT NULL DEFAULT 'USD',
  "employmentType" "EmploymentType" NOT NULL,
  "experienceLevel" "ExperienceLevel" NOT NULL,
  "remotePolicy" "RemotePolicy" NOT NULL,
  "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMP(3),
  "closedAt" TIMESTAMP(3),
  "applicationDeadline" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "job_analytics" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "jobId" UUID NOT NULL,
  "views" INTEGER NOT NULL DEFAULT 0,
  "saves" INTEGER NOT NULL DEFAULT 0,
  "applications" INTEGER NOT NULL DEFAULT 0,
  "shortlisted" INTEGER NOT NULL DEFAULT 0,
  "rejected" INTEGER NOT NULL DEFAULT 0,
  "interviews" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "job_analytics_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "candidate_profiles" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "resumeUrl" TEXT,
  "resumeKey" TEXT,
  "resumeOriginalName" TEXT,
  "linkedinUrl" TEXT,
  "portfolioUrl" TEXT,
  "preferredLocation" TEXT,
  "salaryExpectationMin" INTEGER,
  "salaryExpectationMax" INTEGER,
  "salaryCurrency" TEXT NOT NULL DEFAULT 'USD',
  "preferredJobType" "EmploymentType",
  "availability" TEXT,
  "completionScore" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "candidate_profiles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "candidate_education" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "candidateProfileId" UUID NOT NULL,
  "institution" TEXT NOT NULL,
  "degree" TEXT NOT NULL,
  "fieldOfStudy" TEXT,
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "candidate_education_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "candidate_experience" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "candidateProfileId" UUID NOT NULL,
  "company" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "location" TEXT,
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "current" BOOLEAN NOT NULL DEFAULT false,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "candidate_experience_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "candidate_skills" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "candidateProfileId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "level" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "candidate_skills_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "candidate_certifications" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "candidateProfileId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "issuer" TEXT,
  "issuedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "credentialUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "candidate_certifications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "candidate_languages" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "candidateProfileId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "proficiency" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "candidate_languages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "saved_jobs" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "candidateProfileId" UUID NOT NULL,
  "jobId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "saved_jobs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "saved_candidates" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "companyId" UUID NOT NULL,
  "candidateProfileId" UUID NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "saved_candidates_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "job_applications" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "jobId" UUID NOT NULL,
  "candidateId" UUID NOT NULL,
  "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
  "coverLetter" TEXT,
  "resumeUrl" TEXT,
  "resumeKey" TEXT,
  "expectedSalary" INTEGER,
  "availableFrom" TIMESTAMP(3),
  "withdrawnAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "job_application_events" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "applicationId" UUID NOT NULL,
  "status" "ApplicationStatus" NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "job_application_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "interviews" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "applicationId" UUID NOT NULL,
  "scheduledById" UUID NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3) NOT NULL,
  "timezone" TEXT NOT NULL DEFAULT 'UTC',
  "location" TEXT,
  "meetingUrl" TEXT,
  "status" "InterviewStatus" NOT NULL DEFAULT 'SCHEDULED',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notifications" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "type" "NotificationType" NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "metadata" JSONB,
  "readAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");
CREATE INDEX "companies_ownerId_idx" ON "companies"("ownerId");
CREATE INDEX "companies_status_idx" ON "companies"("status");
CREATE UNIQUE INDEX "jobs_companyId_slug_key" ON "jobs"("companyId", "slug");
CREATE INDEX "jobs_companyId_idx" ON "jobs"("companyId");
CREATE INDEX "jobs_status_idx" ON "jobs"("status");
CREATE INDEX "jobs_category_idx" ON "jobs"("category");
CREATE INDEX "jobs_location_idx" ON "jobs"("location");
CREATE INDEX "jobs_employmentType_idx" ON "jobs"("employmentType");
CREATE INDEX "jobs_experienceLevel_idx" ON "jobs"("experienceLevel");
CREATE INDEX "jobs_remotePolicy_idx" ON "jobs"("remotePolicy");
CREATE INDEX "jobs_featured_idx" ON "jobs"("featured");
CREATE INDEX "jobs_createdAt_idx" ON "jobs"("createdAt");
CREATE UNIQUE INDEX "job_analytics_jobId_key" ON "job_analytics"("jobId");
CREATE UNIQUE INDEX "candidate_profiles_userId_key" ON "candidate_profiles"("userId");
CREATE INDEX "candidate_education_candidateProfileId_idx" ON "candidate_education"("candidateProfileId");
CREATE INDEX "candidate_experience_candidateProfileId_idx" ON "candidate_experience"("candidateProfileId");
CREATE UNIQUE INDEX "candidate_skills_candidateProfileId_name_key" ON "candidate_skills"("candidateProfileId", "name");
CREATE INDEX "candidate_certifications_candidateProfileId_idx" ON "candidate_certifications"("candidateProfileId");
CREATE UNIQUE INDEX "candidate_languages_candidateProfileId_name_key" ON "candidate_languages"("candidateProfileId", "name");
CREATE UNIQUE INDEX "saved_jobs_candidateProfileId_jobId_key" ON "saved_jobs"("candidateProfileId", "jobId");
CREATE INDEX "saved_jobs_jobId_idx" ON "saved_jobs"("jobId");
CREATE UNIQUE INDEX "saved_candidates_companyId_candidateProfileId_key" ON "saved_candidates"("companyId", "candidateProfileId");
CREATE INDEX "saved_candidates_candidateProfileId_idx" ON "saved_candidates"("candidateProfileId");
CREATE UNIQUE INDEX "job_applications_jobId_candidateId_key" ON "job_applications"("jobId", "candidateId");
CREATE INDEX "job_applications_jobId_idx" ON "job_applications"("jobId");
CREATE INDEX "job_applications_candidateId_idx" ON "job_applications"("candidateId");
CREATE INDEX "job_applications_status_idx" ON "job_applications"("status");
CREATE INDEX "job_application_events_applicationId_idx" ON "job_application_events"("applicationId");
CREATE INDEX "interviews_applicationId_idx" ON "interviews"("applicationId");
CREATE INDEX "interviews_scheduledById_idx" ON "interviews"("scheduledById");
CREATE INDEX "interviews_startsAt_idx" ON "interviews"("startsAt");
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");
CREATE INDEX "notifications_type_idx" ON "notifications"("type");
CREATE INDEX "notifications_readAt_idx" ON "notifications"("readAt");
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

ALTER TABLE "companies" ADD CONSTRAINT "companies_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "job_analytics" ADD CONSTRAINT "job_analytics_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "candidate_profiles" ADD CONSTRAINT "candidate_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "candidate_education" ADD CONSTRAINT "candidate_education_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "candidate_experience" ADD CONSTRAINT "candidate_experience_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "candidate_skills" ADD CONSTRAINT "candidate_skills_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "candidate_certifications" ADD CONSTRAINT "candidate_certifications_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "candidate_languages" ADD CONSTRAINT "candidate_languages_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "saved_candidates" ADD CONSTRAINT "saved_candidates_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "saved_candidates" ADD CONSTRAINT "saved_candidates_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "job_application_events" ADD CONSTRAINT "job_application_events_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "job_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "job_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_scheduledById_fkey" FOREIGN KEY ("scheduledById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
