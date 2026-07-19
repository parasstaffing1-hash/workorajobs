CREATE TYPE "HiringStageType" AS ENUM ('APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'HIRED');
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED');
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE "AutomationEventType" AS ENUM ('RESUME_PROCESSING', 'APPLICATION_PROCESSING', 'INTERVIEW_REMINDER', 'FOLLOW_UP_EMAIL', 'STATUS_CHANGE_NOTIFICATION', 'CANDIDATE_MATCHING', 'RECRUITER_ALERT');
CREATE TYPE "AutomationRunStatus" AS ENUM ('QUEUED', 'SUCCEEDED', 'FAILED', 'SKIPPED');
CREATE TYPE "AiArtifactType" AS ENUM ('RESUME_ANALYSIS', 'RESUME_SCORE', 'CANDIDATE_MATCH', 'SKILL_GAP', 'JOB_DESCRIPTION', 'INTERVIEW_QUESTIONS', 'CANDIDATE_SUMMARY', 'HIRING_ASSISTANT');
CREATE TYPE "EmailTemplateType" AS ENUM ('INTERVIEW_INVITATION', 'OFFER_EMAIL', 'REJECTION_EMAIL', 'FOLLOW_UP', 'REMINDER');

ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'RECRUITER_ALERT';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'STATUS_CHANGE_NOTIFICATION';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'FOLLOW_UP_EMAIL';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'INTERVIEW_REMINDER';

ALTER TABLE "jobs" ADD COLUMN "assignedRecruiterId" UUID;
ALTER TABLE "candidate_profiles" ADD COLUMN "assignedRecruiterId" UUID;
ALTER TABLE "job_applications" ADD COLUMN "currentStageId" UUID;

CREATE TABLE "recruiter_assignments" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "recruiterId" UUID NOT NULL,
  "jobId" UUID,
  "candidateProfileId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "recruiter_assignments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "saved_searches" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "recruiterId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "query" TEXT,
  "filters" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "saved_searches_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "recruiter_tasks" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "recruiterId" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "dueAt" TIMESTAMP(3),
  "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
  "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
  "relatedJobId" UUID,
  "relatedCandidateProfileId" UUID,
  "relatedApplicationId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "recruiter_tasks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "candidate_notes" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "candidateProfileId" UUID NOT NULL,
  "authorId" UUID NOT NULL,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "candidate_notes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "candidate_tags" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "color" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "candidate_tags_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "candidate_profile_tags" (
  "candidateProfileId" UUID NOT NULL,
  "tagId" UUID NOT NULL,
  "assignedById" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "candidate_profile_tags_pkey" PRIMARY KEY ("candidateProfileId", "tagId")
);

CREATE TABLE "candidate_ratings" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "candidateProfileId" UUID NOT NULL,
  "jobId" UUID,
  "recruiterId" UUID NOT NULL,
  "score" INTEGER NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "candidate_ratings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "candidate_duplicates" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "primaryCandidateProfileId" UUID NOT NULL,
  "duplicateCandidateProfileId" UUID NOT NULL,
  "score" DOUBLE PRECISION NOT NULL,
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "candidate_duplicates_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "resume_indexes" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "candidateProfileId" UUID NOT NULL,
  "rawText" TEXT,
  "keywords" TEXT[] NOT NULL,
  "skills" TEXT[] NOT NULL,
  "certifications" TEXT[] NOT NULL,
  "education" TEXT[] NOT NULL,
  "indexedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "resume_indexes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "hiring_stages" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "jobId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "type" "HiringStageType" NOT NULL,
  "position" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "hiring_stages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "application_stage_history" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "applicationId" UUID NOT NULL,
  "stageId" UUID,
  "changedById" UUID,
  "status" "ApplicationStatus",
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "application_stage_history_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ai_artifacts" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "type" "AiArtifactType" NOT NULL,
  "userId" UUID,
  "candidateProfileId" UUID,
  "jobId" UUID,
  "applicationId" UUID,
  "prompt" TEXT NOT NULL,
  "result" JSONB NOT NULL,
  "score" DOUBLE PRECISION,
  "model" TEXT,
  "provider" TEXT NOT NULL DEFAULT 'heuristic',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ai_artifacts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "automation_webhooks" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "eventType" "AutomationEventType" NOT NULL,
  "name" TEXT NOT NULL,
  "secretHash" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "targetUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "automation_webhooks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "automation_runs" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "webhookId" UUID,
  "eventType" "AutomationEventType" NOT NULL,
  "actorId" UUID,
  "payload" JSONB NOT NULL,
  "status" "AutomationRunStatus" NOT NULL DEFAULT 'QUEUED',
  "response" JSONB,
  "error" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "automation_runs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "email_templates" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "type" "EmailTemplateType" NOT NULL,
  "name" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdById" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "jobs_assignedRecruiterId_idx" ON "jobs"("assignedRecruiterId");
CREATE INDEX "candidate_profiles_assignedRecruiterId_idx" ON "candidate_profiles"("assignedRecruiterId");
CREATE INDEX "job_applications_currentStageId_idx" ON "job_applications"("currentStageId");
CREATE INDEX "recruiter_assignments_recruiterId_idx" ON "recruiter_assignments"("recruiterId");
CREATE INDEX "recruiter_assignments_jobId_idx" ON "recruiter_assignments"("jobId");
CREATE INDEX "recruiter_assignments_candidateProfileId_idx" ON "recruiter_assignments"("candidateProfileId");
CREATE INDEX "saved_searches_recruiterId_idx" ON "saved_searches"("recruiterId");
CREATE INDEX "recruiter_tasks_recruiterId_idx" ON "recruiter_tasks"("recruiterId");
CREATE INDEX "recruiter_tasks_status_idx" ON "recruiter_tasks"("status");
CREATE INDEX "recruiter_tasks_dueAt_idx" ON "recruiter_tasks"("dueAt");
CREATE INDEX "recruiter_tasks_relatedJobId_idx" ON "recruiter_tasks"("relatedJobId");
CREATE INDEX "recruiter_tasks_relatedCandidateProfileId_idx" ON "recruiter_tasks"("relatedCandidateProfileId");
CREATE INDEX "recruiter_tasks_relatedApplicationId_idx" ON "recruiter_tasks"("relatedApplicationId");
CREATE INDEX "candidate_notes_candidateProfileId_idx" ON "candidate_notes"("candidateProfileId");
CREATE INDEX "candidate_notes_authorId_idx" ON "candidate_notes"("authorId");
CREATE UNIQUE INDEX "candidate_tags_name_key" ON "candidate_tags"("name");
CREATE INDEX "candidate_profile_tags_tagId_idx" ON "candidate_profile_tags"("tagId");
CREATE INDEX "candidate_profile_tags_assignedById_idx" ON "candidate_profile_tags"("assignedById");
CREATE INDEX "candidate_ratings_candidateProfileId_idx" ON "candidate_ratings"("candidateProfileId");
CREATE INDEX "candidate_ratings_jobId_idx" ON "candidate_ratings"("jobId");
CREATE INDEX "candidate_ratings_recruiterId_idx" ON "candidate_ratings"("recruiterId");
CREATE UNIQUE INDEX "candidate_duplicates_primaryCandidateProfileId_duplicateCandidateProfileId_key" ON "candidate_duplicates"("primaryCandidateProfileId", "duplicateCandidateProfileId");
CREATE INDEX "candidate_duplicates_duplicateCandidateProfileId_idx" ON "candidate_duplicates"("duplicateCandidateProfileId");
CREATE UNIQUE INDEX "resume_indexes_candidateProfileId_key" ON "resume_indexes"("candidateProfileId");
CREATE UNIQUE INDEX "hiring_stages_jobId_position_key" ON "hiring_stages"("jobId", "position");
CREATE INDEX "hiring_stages_jobId_idx" ON "hiring_stages"("jobId");
CREATE INDEX "hiring_stages_type_idx" ON "hiring_stages"("type");
CREATE INDEX "application_stage_history_applicationId_idx" ON "application_stage_history"("applicationId");
CREATE INDEX "application_stage_history_stageId_idx" ON "application_stage_history"("stageId");
CREATE INDEX "application_stage_history_changedById_idx" ON "application_stage_history"("changedById");
CREATE INDEX "ai_artifacts_type_idx" ON "ai_artifacts"("type");
CREATE INDEX "ai_artifacts_userId_idx" ON "ai_artifacts"("userId");
CREATE INDEX "ai_artifacts_candidateProfileId_idx" ON "ai_artifacts"("candidateProfileId");
CREATE INDEX "ai_artifacts_jobId_idx" ON "ai_artifacts"("jobId");
CREATE INDEX "ai_artifacts_applicationId_idx" ON "ai_artifacts"("applicationId");
CREATE INDEX "automation_webhooks_eventType_idx" ON "automation_webhooks"("eventType");
CREATE INDEX "automation_webhooks_active_idx" ON "automation_webhooks"("active");
CREATE INDEX "automation_runs_webhookId_idx" ON "automation_runs"("webhookId");
CREATE INDEX "automation_runs_eventType_idx" ON "automation_runs"("eventType");
CREATE INDEX "automation_runs_actorId_idx" ON "automation_runs"("actorId");
CREATE INDEX "automation_runs_status_idx" ON "automation_runs"("status");
CREATE INDEX "automation_runs_createdAt_idx" ON "automation_runs"("createdAt");
CREATE UNIQUE INDEX "email_templates_type_name_key" ON "email_templates"("type", "name");
CREATE INDEX "email_templates_active_idx" ON "email_templates"("active");
CREATE INDEX "email_templates_createdById_idx" ON "email_templates"("createdById");

ALTER TABLE "jobs" ADD CONSTRAINT "jobs_assignedRecruiterId_fkey" FOREIGN KEY ("assignedRecruiterId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "candidate_profiles" ADD CONSTRAINT "candidate_profiles_assignedRecruiterId_fkey" FOREIGN KEY ("assignedRecruiterId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_currentStageId_fkey" FOREIGN KEY ("currentStageId") REFERENCES "hiring_stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "recruiter_assignments" ADD CONSTRAINT "recruiter_assignments_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "recruiter_assignments" ADD CONSTRAINT "recruiter_assignments_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "recruiter_assignments" ADD CONSTRAINT "recruiter_assignments_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "saved_searches" ADD CONSTRAINT "saved_searches_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "recruiter_tasks" ADD CONSTRAINT "recruiter_tasks_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "recruiter_tasks" ADD CONSTRAINT "recruiter_tasks_relatedJobId_fkey" FOREIGN KEY ("relatedJobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "recruiter_tasks" ADD CONSTRAINT "recruiter_tasks_relatedCandidateProfileId_fkey" FOREIGN KEY ("relatedCandidateProfileId") REFERENCES "candidate_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "recruiter_tasks" ADD CONSTRAINT "recruiter_tasks_relatedApplicationId_fkey" FOREIGN KEY ("relatedApplicationId") REFERENCES "job_applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "candidate_notes" ADD CONSTRAINT "candidate_notes_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "candidate_notes" ADD CONSTRAINT "candidate_notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "candidate_profile_tags" ADD CONSTRAINT "candidate_profile_tags_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "candidate_profile_tags" ADD CONSTRAINT "candidate_profile_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "candidate_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "candidate_profile_tags" ADD CONSTRAINT "candidate_profile_tags_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "candidate_ratings" ADD CONSTRAINT "candidate_ratings_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "candidate_ratings" ADD CONSTRAINT "candidate_ratings_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "candidate_ratings" ADD CONSTRAINT "candidate_ratings_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "candidate_duplicates" ADD CONSTRAINT "candidate_duplicates_primaryCandidateProfileId_fkey" FOREIGN KEY ("primaryCandidateProfileId") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "candidate_duplicates" ADD CONSTRAINT "candidate_duplicates_duplicateCandidateProfileId_fkey" FOREIGN KEY ("duplicateCandidateProfileId") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "resume_indexes" ADD CONSTRAINT "resume_indexes_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "hiring_stages" ADD CONSTRAINT "hiring_stages_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "application_stage_history" ADD CONSTRAINT "application_stage_history_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "job_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "application_stage_history" ADD CONSTRAINT "application_stage_history_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "hiring_stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "application_stage_history" ADD CONSTRAINT "application_stage_history_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ai_artifacts" ADD CONSTRAINT "ai_artifacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ai_artifacts" ADD CONSTRAINT "ai_artifacts_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "candidate_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ai_artifacts" ADD CONSTRAINT "ai_artifacts_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ai_artifacts" ADD CONSTRAINT "ai_artifacts_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "job_applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "automation_runs" ADD CONSTRAINT "automation_runs_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "automation_webhooks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "automation_runs" ADD CONSTRAINT "automation_runs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "email_templates" ADD CONSTRAINT "email_templates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
