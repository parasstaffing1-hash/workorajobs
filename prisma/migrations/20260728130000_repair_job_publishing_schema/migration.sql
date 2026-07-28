-- Bring the legacy Company and Job tables up to the scalar shape expected by
-- the root Next.js Prisma client. This migration is additive and preserves all
-- existing companies and jobs.

BEGIN;

ALTER TABLE "Company"
  ADD COLUMN IF NOT EXISTS "slug" TEXT,
  ADD COLUMN IF NOT EXISTS "officialName" TEXT,
  ADD COLUMN IF NOT EXISTS "displayName" TEXT,
  ADD COLUMN IF NOT EXISTS "legalName" TEXT,
  ADD COLUMN IF NOT EXISTS "alternateNames" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "formerNames" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "shortDescription" TEXT,
  ADD COLUMN IF NOT EXISTS "officialDomain" TEXT,
  ADD COLUMN IF NOT EXISTS "careersUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "logoSource" TEXT,
  ADD COLUMN IF NOT EXISTS "logoAltText" TEXT,
  ADD COLUMN IF NOT EXISTS "domain" TEXT,
  ADD COLUMN IF NOT EXISTS "rating" DOUBLE PRECISION DEFAULT 4.5,
  ADD COLUMN IF NOT EXISTS "countryCode" TEXT DEFAULT 'US',
  ADD COLUMN IF NOT EXISTS "headquartersCity" TEXT,
  ADD COLUMN IF NOT EXISTS "headquartersState" TEXT,
  ADD COLUMN IF NOT EXISTS "headquartersCountry" TEXT DEFAULT 'United States',
  ADD COLUMN IF NOT EXISTS "operatingCountries" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "industry" TEXT,
  ADD COLUMN IF NOT EXISTS "subIndustries" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "companyType" TEXT DEFAULT 'Enterprise',
  ADD COLUMN IF NOT EXISTS "ownershipType" TEXT DEFAULT 'Public',
  ADD COLUMN IF NOT EXISTS "publicPrivateStatus" TEXT DEFAULT 'Public',
  ADD COLUMN IF NOT EXISTS "startupStage" TEXT,
  ADD COLUMN IF NOT EXISTS "foundedYear" INTEGER,
  ADD COLUMN IF NOT EXISTS "employeeRange" TEXT,
  ADD COLUMN IF NOT EXISTS "companySizeSource" TEXT,
  ADD COLUMN IF NOT EXISTS "exchangeListings" JSONB,
  ADD COLUMN IF NOT EXISTS "tickerSymbols" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "secCik" TEXT,
  ADD COLUMN IF NOT EXISTS "nseSymbol" TEXT,
  ADD COLUMN IF NOT EXISTS "bseScripCode" TEXT,
  ADD COLUMN IF NOT EXISTS "isin" TEXT,
  ADD COLUMN IF NOT EXISTS "qualificationReason" TEXT,
  ADD COLUMN IF NOT EXISTS "linkedinUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "otherVerifiedSocialUrls" JSONB,
  ADD COLUMN IF NOT EXISTS "remoteWorkStatus" TEXT DEFAULT 'Hybrid',
  ADD COLUMN IF NOT EXISTS "internshipStatus" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "graduateProgramStatus" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "activeJobCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "lastJobVerifiedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "lastCompanyVerifiedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "dataSources" JSONB,
  ADD COLUMN IF NOT EXISTS "fieldProvenance" JSONB,
  ADD COLUMN IF NOT EXISTS "verificationStatus" TEXT DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS "seoTitle" TEXT,
  ADD COLUMN IF NOT EXISTS "metaDescription" TEXT,
  ADD COLUMN IF NOT EXISTS "canonicalUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "indexingStatus" TEXT DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS "contentQualityScore" INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "tagline" TEXT,
  ADD COLUMN IF NOT EXISTS "coverImageUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "branchOffices" JSONB,
  ADD COLUMN IF NOT EXISTS "gstNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "cinNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "hiringEmail" TEXT,
  ADD COLUMN IF NOT EXISTS "hrContact" JSONB,
  ADD COLUMN IF NOT EXISTS "recruiterContact" JSONB,
  ADD COLUMN IF NOT EXISTS "twitterUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "facebookUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "youtubeUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "githubUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "isGstVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "isCinVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "isWebsiteVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "Company_slug_key" ON "Company"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "Company_officialDomain_key" ON "Company"("officialDomain");
CREATE UNIQUE INDEX IF NOT EXISTS "Company_domain_key" ON "Company"("domain");
CREATE INDEX IF NOT EXISTS "Company_slug_idx" ON "Company"("slug");
CREATE INDEX IF NOT EXISTS "Company_name_idx" ON "Company"("name");
CREATE INDEX IF NOT EXISTS "Company_countryCode_idx" ON "Company"("countryCode");
CREATE INDEX IF NOT EXISTS "Company_industry_idx" ON "Company"("industry");
CREATE INDEX IF NOT EXISTS "Company_publicPrivateStatus_idx" ON "Company"("publicPrivateStatus");
CREATE INDEX IF NOT EXISTS "Company_indexingStatus_idx" ON "Company"("indexingStatus");
CREATE INDEX IF NOT EXISTS "Company_deletedAt_idx" ON "Company"("deletedAt");

ALTER TABLE "Job"
  ADD COLUMN IF NOT EXISTS "slug" TEXT,
  ADD COLUMN IF NOT EXISTS "responsibilities" TEXT,
  ADD COLUMN IF NOT EXISTS "requirements" TEXT,
  ADD COLUMN IF NOT EXISTS "department" TEXT,
  ADD COLUMN IF NOT EXISTS "salaryMin" INTEGER,
  ADD COLUMN IF NOT EXISTS "salaryMax" INTEGER,
  ADD COLUMN IF NOT EXISTS "currency" TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS "workMode" TEXT DEFAULT 'Remote',
  ADD COLUMN IF NOT EXISTS "experience" TEXT DEFAULT 'Mid Level',
  ADD COLUMN IF NOT EXISTS "education" TEXT,
  ADD COLUMN IF NOT EXISTS "skillsRequired" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "openingsCount" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "noticePeriod" TEXT DEFAULT 'Immediate',
  ADD COLUMN IF NOT EXISTS "benefits" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "screeningQuestions" JSONB,
  ADD COLUMN IF NOT EXISTS "externalApplyUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "deadlineAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "scheduledPublishAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
  ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "Job_slug_key" ON "Job"("slug");
CREATE INDEX IF NOT EXISTS "Job_companyId_idx" ON "Job"("companyId");
CREATE INDEX IF NOT EXISTS "Job_title_idx" ON "Job"("title");
CREATE INDEX IF NOT EXISTS "Job_slug_idx" ON "Job"("slug");
CREATE INDEX IF NOT EXISTS "Job_status_idx" ON "Job"("status");
CREATE INDEX IF NOT EXISTS "Job_location_idx" ON "Job"("location");
CREATE INDEX IF NOT EXISTS "Job_type_idx" ON "Job"("type");
CREATE INDEX IF NOT EXISTS "Job_postedAt_idx" ON "Job"("postedAt");
CREATE INDEX IF NOT EXISTS "Job_updatedAt_idx" ON "Job"("updatedAt");
CREATE INDEX IF NOT EXISTS "Job_salary_idx" ON "Job"("salary");
CREATE INDEX IF NOT EXISTS "Job_workMode_idx" ON "Job"("workMode");
CREATE INDEX IF NOT EXISTS "Job_experience_idx" ON "Job"("experience");
CREATE INDEX IF NOT EXISTS "Job_postedById_idx" ON "Job"("postedById");
CREATE INDEX IF NOT EXISTS "Job_status_postedAt_idx" ON "Job"("status", "postedAt" DESC);
CREATE INDEX IF NOT EXISTS "Job_companyId_status_idx" ON "Job"("companyId", "status");
CREATE INDEX IF NOT EXISTS "Job_deletedAt_idx" ON "Job"("deletedAt");

CREATE TABLE IF NOT EXISTS "JobVersionHistory" (
  "id" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "responsibilities" TEXT,
  "requirements" TEXT,
  "changedById" TEXT,
  "changeSummary" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "JobVersionHistory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "JobVersionHistory_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "JobVersionHistory_jobId_idx" ON "JobVersionHistory"("jobId");

COMMIT;

