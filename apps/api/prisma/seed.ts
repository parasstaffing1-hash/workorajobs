import {
  AiArtifactType,
  ApplicationStatus,
  AutomationEventType,
  AutomationRunStatus,
  BillingInterval,
  BillingSubscriptionStatus,
  CommunicationChannel,
  ContentStatus,
  DeliveryStatus,
  EmailTemplateType,
  EmploymentType,
  ExportStatus,
  ExperienceLevel,
  FeatureFlagEnvironment,
  HiringStageType,
  InvoiceStatus,
  InterviewStatus,
  JobStatus,
  LeadStatus,
  MediaAssetType,
  NotificationType,
  PaymentStatus,
  PrismaClient,
  RemotePolicy,
  SalesStage,
  SystemSettingType,
  TaskPriority,
  TaskStatus,
  UserRole,
  UserStatus,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const demoUsers = [
  {
    email: "admin@workorajobs.com",
    firstName: "Amara",
    lastName: "Stone",
    role: UserRole.ADMIN,
    headline: "Platform Administrator",
    companyName: "Workora Jobs",
    country: "United States",
    city: "New York",
  },
  {
    email: "employer@northstarcloud.com",
    firstName: "Maya",
    lastName: "Chen",
    role: UserRole.EMPLOYER,
    headline: "VP People",
    companyName: "Northstar Cloud",
    country: "United States",
    city: "San Francisco",
  },
  {
    email: "candidate@example.com",
    firstName: "Daniel",
    lastName: "Okoro",
    role: UserRole.CANDIDATE,
    headline: "Senior Product Manager",
    companyName: null,
    country: "Canada",
    city: "Toronto",
  },
  {
    email: "recruiter@workorajobs.com",
    firstName: "Elena",
    lastName: "Ruiz",
    role: UserRole.RECRUITER,
    headline: "Global Talent Partner",
    companyName: "Workora Jobs",
    country: "United Kingdom",
    city: "London",
  },
  {
    email: "candidate.duplicate@example.com",
    firstName: "Danielle",
    lastName: "Okoro",
    role: UserRole.CANDIDATE,
    headline: "Product Strategy Lead",
    companyName: null,
    country: "Canada",
    city: "Toronto",
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("WorkoraDemo!2026", 12);
  const usersByEmail = new Map<string, { id: string; email: string }>();

  for (const demoUser of demoUsers) {
    const user = await prisma.user.upsert({
      create: {
        email: demoUser.email,
        passwordHash,
        role: demoUser.role,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
        profile: {
          create: {
            firstName: demoUser.firstName,
            lastName: demoUser.lastName,
            headline: demoUser.headline,
            companyName: demoUser.companyName,
            country: demoUser.country,
            city: demoUser.city,
            bio: "Seeded Phase 2 demo account for backend, authentication and RBAC verification.",
          },
        },
      },
      update: {
        passwordHash,
        role: demoUser.role,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
        profile: {
          upsert: {
            create: {
              firstName: demoUser.firstName,
              lastName: demoUser.lastName,
              headline: demoUser.headline,
              companyName: demoUser.companyName,
              country: demoUser.country,
              city: demoUser.city,
              bio: "Seeded Phase 2 demo account for backend, authentication and RBAC verification.",
            },
            update: {
              firstName: demoUser.firstName,
              lastName: demoUser.lastName,
              headline: demoUser.headline,
              companyName: demoUser.companyName,
              country: demoUser.country,
              city: demoUser.city,
            },
          },
        },
      },
      where: {
        email: demoUser.email,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: "seed.user.upserted",
        entity: "User",
        entityId: user.id,
        metadata: {
          role: demoUser.role,
        },
      },
    });
    usersByEmail.set(demoUser.email, user);
  }

  const employer = usersByEmail.get("employer@northstarcloud.com");
  const candidate = usersByEmail.get("candidate@example.com");
  const duplicateCandidate = usersByEmail.get(
    "candidate.duplicate@example.com",
  );
  const recruiter = usersByEmail.get("recruiter@workorajobs.com");
  if (!employer || !candidate || !recruiter) return;

  const company = await prisma.company.upsert({
    create: {
      ownerId: employer.id,
      name: "Northstar Cloud",
      slug: "northstar-cloud",
      status: "ACTIVE",
      website: "https://northstar.example",
      industry: "Technology",
      size: "201-500",
      headquarters: "San Francisco, United States",
      description:
        "Enterprise cloud platform building globally distributed product, design and engineering teams.",
      settings: {
        autoReplyApplications: true,
        interviewReminders: true,
        hiringContactEmail: "careers@northstar.example",
      },
      subscriptionPlan: "growth",
      subscriptionStatus: "active",
    },
    update: {
      ownerId: employer.id,
      status: "ACTIVE",
      website: "https://northstar.example",
      industry: "Technology",
      size: "201-500",
      headquarters: "San Francisco, United States",
    },
    where: {
      slug: "northstar-cloud",
    },
  });

  const designerJob = await prisma.job.upsert({
    create: {
      companyId: company.id,
      createdById: employer.id,
      assignedRecruiterId: recruiter.id,
      title: "Senior Product Designer",
      slug: "senior-product-designer",
      summary: "Lead UX for Workora-style enterprise hiring workflows.",
      description:
        "Own end-to-end product design for enterprise recruiting workflows, candidate experiences and design systems.",
      responsibilities:
        "Lead discovery, design product workflows, partner with engineering and maintain a high-quality design system.",
      requirements:
        "7+ years designing B2B SaaS products, strong systems thinking and excellent product judgment.",
      benefits:
        "Remote-first team, global benefits, learning budget and flexible work.",
      category: "Design",
      location: "Remote, Europe",
      country: "United Kingdom",
      salaryMin: 110000,
      salaryMax: 145000,
      salaryCurrency: "USD",
      employmentType: EmploymentType.FULL_TIME,
      experienceLevel: ExperienceLevel.SENIOR,
      remotePolicy: RemotePolicy.REMOTE,
      status: JobStatus.PUBLISHED,
      featured: true,
      publishedAt: new Date(),
      analytics: {
        create: {
          views: 1840,
          saves: 34,
          applications: 58,
          shortlisted: 11,
          interviews: 5,
        },
      },
    },
    update: {
      status: JobStatus.PUBLISHED,
      featured: true,
      publishedAt: new Date(),
      assignedRecruiterId: recruiter.id,
    },
    where: {
      companyId_slug: {
        companyId: company.id,
        slug: "senior-product-designer",
      },
    },
  });

  await prisma.job.upsert({
    create: {
      companyId: company.id,
      createdById: employer.id,
      title: "Staff Backend Engineer",
      slug: "staff-backend-engineer",
      summary:
        "Build secure backend systems for enterprise recruiting products.",
      description:
        "Design APIs, data models and scalable services for global hiring workflows.",
      category: "Engineering",
      location: "Toronto, Canada",
      country: "Canada",
      salaryMin: 155000,
      salaryMax: 190000,
      salaryCurrency: "USD",
      employmentType: EmploymentType.FULL_TIME,
      experienceLevel: ExperienceLevel.LEAD,
      remotePolicy: RemotePolicy.HYBRID,
      status: JobStatus.DRAFT,
      analytics: { create: {} },
    },
    update: {
      status: JobStatus.DRAFT,
    },
    where: {
      companyId_slug: {
        companyId: company.id,
        slug: "staff-backend-engineer",
      },
    },
  });

  const candidateProfile = await prisma.candidateProfile.upsert({
    create: {
      userId: candidate.id,
      assignedRecruiterId: recruiter.id,
      linkedinUrl: "https://linkedin.com/in/daniel-okoro",
      portfolioUrl: "https://danielokoro.example",
      preferredLocation: "Remote, Americas",
      salaryExpectationMin: 130000,
      salaryExpectationMax: 155000,
      preferredJobType: EmploymentType.FULL_TIME,
      availability: "Available in 2 weeks",
      completionScore: 86,
    },
    update: {
      assignedRecruiterId: recruiter.id,
      linkedinUrl: "https://linkedin.com/in/daniel-okoro",
      portfolioUrl: "https://danielokoro.example",
      preferredLocation: "Remote, Americas",
      completionScore: 86,
    },
    where: {
      userId: candidate.id,
    },
  });

  const duplicateProfile = duplicateCandidate
    ? await prisma.candidateProfile.upsert({
        create: {
          userId: duplicateCandidate.id,
          assignedRecruiterId: recruiter.id,
          linkedinUrl: "https://linkedin.com/in/danielle-okoro",
          preferredLocation: "Toronto, Canada",
          salaryExpectationMin: 125000,
          salaryExpectationMax: 150000,
          preferredJobType: EmploymentType.FULL_TIME,
          availability: "Available in 30 days",
          completionScore: 72,
        },
        update: {
          assignedRecruiterId: recruiter.id,
          preferredLocation: "Toronto, Canada",
          completionScore: 72,
        },
        where: {
          userId: duplicateCandidate.id,
        },
      })
    : null;

  await Promise.all([
    prisma.candidateEducation.deleteMany({
      where: { candidateProfileId: candidateProfile.id },
    }),
    prisma.candidateExperience.deleteMany({
      where: { candidateProfileId: candidateProfile.id },
    }),
    prisma.candidateSkill.deleteMany({
      where: { candidateProfileId: candidateProfile.id },
    }),
    prisma.candidateCertification.deleteMany({
      where: { candidateProfileId: candidateProfile.id },
    }),
    prisma.candidateLanguage.deleteMany({
      where: { candidateProfileId: candidateProfile.id },
    }),
  ]);
  await prisma.candidateEducation.create({
    data: {
      candidateProfileId: candidateProfile.id,
      institution: "University of Toronto",
      degree: "Bachelor of Commerce",
      fieldOfStudy: "Management and Digital Strategy",
    },
  });
  await prisma.candidateExperience.create({
    data: {
      candidateProfileId: candidateProfile.id,
      company: "Orbit Commerce",
      title: "Senior Product Manager",
      location: "Toronto, Canada",
      current: true,
      description:
        "Led marketplace workflows, analytics and growth experiments.",
    },
  });
  await prisma.candidateSkill.createMany({
    data: [
      "Product strategy",
      "Marketplace design",
      "SQL",
      "Stakeholder management",
    ].map((name) => ({
      candidateProfileId: candidateProfile.id,
      name,
      level: "Advanced",
    })),
    skipDuplicates: true,
  });
  await prisma.candidateCertification.create({
    data: {
      candidateProfileId: candidateProfile.id,
      name: "Certified Scrum Product Owner",
      issuer: "Scrum Alliance",
    },
  });
  await prisma.candidateLanguage.createMany({
    data: [
      {
        candidateProfileId: candidateProfile.id,
        name: "English",
        proficiency: "Native",
      },
      {
        candidateProfileId: candidateProfile.id,
        name: "French",
        proficiency: "Professional",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.savedJob.upsert({
    create: {
      candidateProfileId: candidateProfile.id,
      jobId: designerJob.id,
    },
    update: {},
    where: {
      candidateProfileId_jobId: {
        candidateProfileId: candidateProfile.id,
        jobId: designerJob.id,
      },
    },
  });
  await prisma.savedCandidate.upsert({
    create: {
      companyId: company.id,
      candidateProfileId: candidateProfile.id,
      notes: "Strong product systems background.",
    },
    update: {
      notes: "Strong product systems background.",
    },
    where: {
      companyId_candidateProfileId: {
        companyId: company.id,
        candidateProfileId: candidateProfile.id,
      },
    },
  });

  const application = await prisma.jobApplication.upsert({
    create: {
      jobId: designerJob.id,
      candidateId: candidate.id,
      status: ApplicationStatus.SHORTLISTED,
      coverLetter:
        "I am excited by Northstar Cloud's enterprise product design challenge.",
      expectedSalary: 145000,
    },
    update: {
      status: ApplicationStatus.SHORTLISTED,
    },
    where: {
      jobId_candidateId: {
        jobId: designerJob.id,
        candidateId: candidate.id,
      },
    },
  });

  const stageDefinitions = [
    { name: "Applied", type: HiringStageType.APPLIED, position: 0 },
    { name: "Recruiter screen", type: HiringStageType.SCREENING, position: 1 },
    { name: "Interview", type: HiringStageType.INTERVIEW, position: 2 },
    { name: "Offer", type: HiringStageType.OFFER, position: 3 },
    { name: "Rejected", type: HiringStageType.REJECTED, position: 4 },
  ];
  const stages = [];
  for (const stage of stageDefinitions) {
    stages.push(
      await prisma.hiringStage.upsert({
        create: {
          jobId: designerJob.id,
          name: stage.name,
          type: stage.type,
          position: stage.position,
        },
        update: {
          name: stage.name,
          type: stage.type,
        },
        where: {
          jobId_position: {
            jobId: designerJob.id,
            position: stage.position,
          },
        },
      }),
    );
  }
  const screeningStage = stages.find(
    (stage) => stage.type === HiringStageType.SCREENING,
  );
  if (screeningStage) {
    await prisma.jobApplication.update({
      data: { currentStageId: screeningStage.id },
      where: { id: application.id },
    });
  }
  await prisma.jobApplicationEvent.deleteMany({
    where: { applicationId: application.id },
  });
  await prisma.jobApplicationEvent.createMany({
    data: [
      {
        applicationId: application.id,
        status: ApplicationStatus.SUBMITTED,
        note: "Application submitted.",
      },
      {
        applicationId: application.id,
        status: ApplicationStatus.REVIEWING,
        note: "Recruiter review started.",
      },
      {
        applicationId: application.id,
        status: ApplicationStatus.SHORTLISTED,
        note: "Candidate shortlisted.",
      },
    ],
  });
  await prisma.applicationStageHistory.deleteMany({
    where: { applicationId: application.id },
  });
  if (screeningStage) {
    await prisma.applicationStageHistory.createMany({
      data: [
        {
          applicationId: application.id,
          stageId: stages[0].id,
          changedById: recruiter.id,
          status: ApplicationStatus.SUBMITTED,
          note: "Application entered ATS.",
        },
        {
          applicationId: application.id,
          stageId: screeningStage.id,
          changedById: recruiter.id,
          status: ApplicationStatus.REVIEWING,
          note: "Recruiter screen started.",
        },
      ],
    });
  }
  await prisma.interview.deleteMany({
    where: { applicationId: application.id },
  });
  await prisma.interview.create({
    data: {
      applicationId: application.id,
      scheduledById: recruiter.id,
      startsAt: new Date("2026-07-16T14:00:00.000Z"),
      endsAt: new Date("2026-07-16T15:00:00.000Z"),
      timezone: "UTC",
      meetingUrl: "https://meet.example/workora-demo",
      status: InterviewStatus.SCHEDULED,
      notes: "Portfolio review and product thinking session.",
    },
  });
  await prisma.notification.createMany({
    data: [
      {
        userId: candidate.id,
        type: NotificationType.APPLICATION_SUBMITTED,
        title: "Application submitted",
        body: "Your application for Senior Product Designer was submitted.",
        metadata: { jobId: designerJob.id, applicationId: application.id },
      },
      {
        userId: candidate.id,
        type: NotificationType.INTERVIEW_SCHEDULED,
        title: "Interview scheduled",
        body: "Your interview with Northstar Cloud has been scheduled.",
        metadata: { applicationId: application.id },
      },
      {
        userId: employer.id,
        type: NotificationType.APPLICATION_SUBMITTED,
        title: "New applicant",
        body: "Daniel Okoro applied for Senior Product Designer.",
        metadata: { jobId: designerJob.id, applicationId: application.id },
      },
    ],
  });

  await prisma.recruiterAssignment.deleteMany({
    where: { recruiterId: recruiter.id },
  });
  await prisma.recruiterAssignment.createMany({
    data: [
      { recruiterId: recruiter.id, jobId: designerJob.id },
      { recruiterId: recruiter.id, candidateProfileId: candidateProfile.id },
    ],
  });

  await prisma.savedSearch.deleteMany({ where: { recruiterId: recruiter.id } });
  await prisma.savedSearch.create({
    data: {
      recruiterId: recruiter.id,
      name: "Senior product leaders in Canada",
      query: '"Product Manager" AND SQL',
      filters: {
        location: "Canada",
        skills: ["SQL", "Product strategy"],
        availability: "30 days",
      },
    },
  });

  await prisma.recruiterTask.deleteMany({
    where: { recruiterId: recruiter.id },
  });
  await prisma.recruiterTask.createMany({
    data: [
      {
        recruiterId: recruiter.id,
        title: "Prepare shortlist packet",
        description:
          "Summarize top evidence and interview risks for hiring manager review.",
        dueAt: new Date("2026-07-15T17:00:00.000Z"),
        priority: TaskPriority.HIGH,
        status: TaskStatus.IN_PROGRESS,
        relatedJobId: designerJob.id,
        relatedCandidateProfileId: candidateProfile.id,
        relatedApplicationId: application.id,
      },
      {
        recruiterId: recruiter.id,
        title: "Send interview reminder",
        dueAt: new Date("2026-07-16T09:00:00.000Z"),
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        relatedApplicationId: application.id,
      },
    ],
  });

  await prisma.candidateNote.deleteMany({
    where: { candidateProfileId: candidateProfile.id },
  });
  await prisma.candidateNote.create({
    data: {
      candidateProfileId: candidateProfile.id,
      authorId: recruiter.id,
      body: "Strong marketplace and systems thinking. Confirm depth of design partnership in interview.",
    },
  });

  const highIntentTag = await prisma.candidateTag.upsert({
    create: { name: "High intent", color: "emerald" },
    update: { color: "emerald" },
    where: { name: "High intent" },
  });
  await prisma.candidateProfileTag.upsert({
    create: {
      candidateProfileId: candidateProfile.id,
      tagId: highIntentTag.id,
      assignedById: recruiter.id,
    },
    update: { assignedById: recruiter.id },
    where: {
      candidateProfileId_tagId: {
        candidateProfileId: candidateProfile.id,
        tagId: highIntentTag.id,
      },
    },
  });

  await prisma.candidateRating.deleteMany({
    where: {
      candidateProfileId: candidateProfile.id,
      recruiterId: recruiter.id,
    },
  });
  await prisma.candidateRating.create({
    data: {
      candidateProfileId: candidateProfile.id,
      recruiterId: recruiter.id,
      jobId: designerJob.id,
      score: 4,
      notes: "Strong product judgment; validate hands-on design craft depth.",
    },
  });

  await prisma.resumeIndex.upsert({
    create: {
      candidateProfileId: candidateProfile.id,
      rawText:
        "Senior Product Manager with SQL, marketplace strategy, stakeholder management and enterprise workflow experience.",
      keywords: ["product", "marketplace", "sql", "stakeholder", "enterprise"],
      skills: ["Product strategy", "Marketplace design", "SQL"],
      certifications: ["Certified Scrum Product Owner"],
      education: ["Bachelor of Commerce"],
    },
    update: {
      rawText:
        "Senior Product Manager with SQL, marketplace strategy, stakeholder management and enterprise workflow experience.",
      keywords: ["product", "marketplace", "sql", "stakeholder", "enterprise"],
      skills: ["Product strategy", "Marketplace design", "SQL"],
      certifications: ["Certified Scrum Product Owner"],
      education: ["Bachelor of Commerce"],
      indexedAt: new Date(),
    },
    where: { candidateProfileId: candidateProfile.id },
  });

  if (duplicateProfile) {
    await prisma.candidateDuplicate.upsert({
      create: {
        primaryCandidateProfileId: candidateProfile.id,
        duplicateCandidateProfileId: duplicateProfile.id,
        score: 0.82,
        reason: "Similar name, location and product leadership background.",
      },
      update: {
        score: 0.82,
        reason: "Similar name, location and product leadership background.",
      },
      where: {
        primaryCandidateProfileId_duplicateCandidateProfileId: {
          primaryCandidateProfileId: candidateProfile.id,
          duplicateCandidateProfileId: duplicateProfile.id,
        },
      },
    });
  }

  await prisma.aiArtifact.deleteMany({
    where: { userId: recruiter.id, candidateProfileId: candidateProfile.id },
  });
  await prisma.aiArtifact.create({
    data: {
      type: AiArtifactType.CANDIDATE_MATCH,
      userId: recruiter.id,
      candidateProfileId: candidateProfile.id,
      jobId: designerJob.id,
      applicationId: application.id,
      prompt: "Evaluate Daniel Okoro for Senior Product Designer.",
      result: {
        summary:
          "Strong adjacent product systems background with interview validation recommended.",
        signals: ["SQL", "marketplace", "stakeholder management"],
        recommendations: [
          "Portfolio review",
          "Design-system collaboration questions",
        ],
      },
      score: 78,
      model: "local-seed",
      provider: "heuristic",
    },
  });

  await prisma.automationWebhook.deleteMany({
    where: { name: "Demo candidate matching workflow" },
  });
  await prisma.automationWebhook.create({
    data: {
      eventType: AutomationEventType.CANDIDATE_MATCHING,
      name: "Demo candidate matching workflow",
      targetUrl: null,
      active: true,
    },
  });

  await prisma.automationRun.create({
    data: {
      eventType: AutomationEventType.CANDIDATE_MATCHING,
      actorId: recruiter.id,
      payload: {
        candidateProfileId: candidateProfile.id,
        jobId: designerJob.id,
      },
      status: AutomationRunStatus.SKIPPED,
      response: {
        reason: "n8n target is not configured in seed data.",
      },
    },
  });

  const templates = [
    {
      type: EmailTemplateType.INTERVIEW_INVITATION,
      name: "Default interview invitation",
      subject: "Interview invitation for {{jobTitle}}",
      body: "Hi {{candidateName}}, your interview for {{jobTitle}} is scheduled for {{startsAt}}.",
    },
    {
      type: EmailTemplateType.OFFER_EMAIL,
      name: "Default offer email",
      subject: "Offer details for {{jobTitle}}",
      body: "Hi {{candidateName}}, congratulations. Offer details for {{jobTitle}} are ready for review.",
    },
    {
      type: EmailTemplateType.REJECTION_EMAIL,
      name: "Default rejection email",
      subject: "Application update for {{jobTitle}}",
      body: "Hi {{candidateName}}, thank you for your interest in {{jobTitle}}. We are not moving forward at this time.",
    },
    {
      type: EmailTemplateType.FOLLOW_UP,
      name: "Default follow up",
      subject: "Following up on {{jobTitle}}",
      body: "Hi {{candidateName}}, sharing a quick follow-up about {{jobTitle}}.",
    },
    {
      type: EmailTemplateType.REMINDER,
      name: "Default reminder",
      subject: "Reminder: {{jobTitle}} interview",
      body: "Hi {{candidateName}}, this is a reminder for your upcoming {{jobTitle}} interview.",
    },
  ];
  for (const template of templates) {
    await prisma.emailTemplate.upsert({
      create: {
        ...template,
        createdById: recruiter.id,
      },
      update: {
        subject: template.subject,
        body: template.body,
        active: true,
      },
      where: {
        type_name: {
          type: template.type,
          name: template.name,
        },
      },
    });
  }

  const permissions = [
    ["admin.dashboard.read", "admin", "read"],
    ["users.manage", "users", "manage"],
    ["roles.manage", "roles", "manage"],
    ["crm.manage", "crm", "manage"],
    ["analytics.read", "analytics", "read"],
    ["billing.manage", "billing", "manage"],
    ["content.manage", "content", "manage"],
    ["settings.manage", "settings", "manage"],
  ] as const;
  const adminRole = await prisma.platformRole.upsert({
    create: {
      key: "enterprise-admin",
      name: "Enterprise Admin",
      description: "Full Workora platform administration access.",
      system: true,
    },
    update: {
      name: "Enterprise Admin",
      description: "Full Workora platform administration access.",
      system: true,
    },
    where: { key: "enterprise-admin" },
  });
  for (const [key, resource, action] of permissions) {
    const permission = await prisma.platformPermission.upsert({
      create: {
        key,
        resource,
        action,
        description: `Allows ${action} on ${resource}.`,
      },
      update: {
        resource,
        action,
        description: `Allows ${action} on ${resource}.`,
      },
      where: { key },
    });
    await prisma.platformRolePermission.upsert({
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
      update: {},
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
    });
  }
  const admin = usersByEmail.get("admin@workorajobs.com");
  if (admin) {
    await prisma.platformRoleAssignment.upsert({
      create: {
        userId: admin.id,
        roleId: adminRole.id,
      },
      update: {},
      where: {
        userId_roleId: {
          userId: admin.id,
          roleId: adminRole.id,
        },
      },
    });
  }

  const settings = [
    {
      key: "maintenance_mode",
      value: { enabled: false, message: "Workora Jobs is operational." },
      type: SystemSettingType.JSON,
      description: "Global maintenance mode control.",
    },
    {
      key: "password_policy",
      value: { minLength: 12, requireMixedCase: true, requireNumber: true },
      type: SystemSettingType.JSON,
      description: "Enterprise password policy.",
    },
    {
      key: "cache_ttl_seconds",
      value: 60,
      type: SystemSettingType.NUMBER,
      description: "Default API cache TTL.",
    },
  ];
  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      create: setting,
      update: {
        value: setting.value,
        type: setting.type,
        description: setting.description,
      },
      where: { key: setting.key },
    });
  }

  const featureFlags = [
    {
      key: "ai_hiring_assistant",
      name: "AI Hiring Assistant",
      enabled: true,
      environment: FeatureFlagEnvironment.GLOBAL,
      rolloutPercentage: 100,
    },
    {
      key: "billing_self_service",
      name: "Billing self service",
      enabled: true,
      environment: FeatureFlagEnvironment.GLOBAL,
      rolloutPercentage: 100,
    },
    {
      key: "maintenance_banner",
      name: "Maintenance banner",
      enabled: false,
      environment: FeatureFlagEnvironment.PRODUCTION,
      rolloutPercentage: 0,
    },
  ];
  for (const flag of featureFlags) {
    await prisma.featureFlag.upsert({
      create: flag,
      update: flag,
      where: {
        key_environment: {
          key: flag.key,
          environment: flag.environment,
        },
      },
    });
  }

  await prisma.contentPage.upsert({
    create: {
      slug: "enterprise-hiring-guide",
      title: "Enterprise Hiring Guide",
      excerpt: "Operational guidance for global staffing leaders.",
      body: "A production content record managed through the Workora admin content system.",
      status: ContentStatus.PUBLISHED,
      authorId: admin?.id,
      publishedAt: new Date(),
    },
    update: {
      title: "Enterprise Hiring Guide",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    where: { slug: "enterprise-hiring-guide" },
  });

  await prisma.mediaAsset.upsert({
    create: {
      type: MediaAssetType.DOCUMENT,
      key: "documents/demo/workora-platform-overview.pdf",
      url: "local-storage://documents/demo/workora-platform-overview.pdf",
      originalName: "workora-platform-overview.pdf",
      mimeType: "application/pdf",
      size: 128000,
      uploadedById: admin?.id,
      companyId: company.id,
      metadata: { purpose: "Demo media library asset" },
    },
    update: {
      uploadedById: admin?.id,
      companyId: company.id,
    },
    where: { key: "documents/demo/workora-platform-overview.pdf" },
  });

  await prisma.crmLead.deleteMany({
    where: { email: "people@atlasfinance.example" },
  });
  const lead = await prisma.crmLead.create({
    data: {
      ownerId: recruiter.id,
      companyName: "Atlas Finance",
      contactName: "Nora Ellis",
      email: "people@atlasfinance.example",
      phone: "+1-555-0199",
      source: "Inbound demo request",
      status: LeadStatus.QUALIFIED,
      value: 125000,
    },
  });
  await prisma.crmClient.deleteMany({ where: { name: "Northstar Cloud" } });
  const crmClient = await prisma.crmClient.create({
    data: {
      companyId: company.id,
      ownerId: recruiter.id,
      name: "Northstar Cloud",
      industry: "Technology",
      website: "https://northstar.example",
      billingEmail: "finance@northstar.example",
    },
  });
  const contact = await prisma.crmContact.create({
    data: {
      clientId: crmClient.id,
      firstName: "Maya",
      lastName: "Chen",
      email: "employer@northstarcloud.com",
      title: "VP People",
    },
  });
  const opportunity = await prisma.salesOpportunity.create({
    data: {
      clientId: crmClient.id,
      ownerId: recruiter.id,
      name: "Northstar expansion hiring program",
      stage: SalesStage.PROPOSAL,
      value: 240000,
      closeDate: new Date("2026-08-31T00:00:00.000Z"),
    },
  });
  await prisma.crmNote.create({
    data: {
      authorId: recruiter.id,
      leadId: lead.id,
      body: "Qualified lead for global staffing support.",
    },
  });
  await prisma.crmTask.create({
    data: {
      ownerId: recruiter.id,
      clientId: crmClient.id,
      contactId: contact.id,
      title: "Follow up on proposal terms",
      dueAt: new Date("2026-07-18T12:00:00.000Z"),
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
    },
  });
  await prisma.crmActivity.create({
    data: {
      actorId: recruiter.id,
      clientId: crmClient.id,
      contactId: contact.id,
      opportunityId: opportunity.id,
      type: "MEETING",
      title: "Discovery call completed",
      metadata: { outcome: "Expansion proposal requested" },
    },
  });

  const plan = await prisma.subscriptionPlan.upsert({
    create: {
      key: "growth-monthly",
      name: "Growth",
      description: "Employer hiring suite for scaling teams.",
      interval: BillingInterval.MONTHLY,
      priceCents: 29900,
      currency: "USD",
      stripePriceId: "price_configure_in_stripe",
      features: {
        jobs: 25,
        recruiters: 5,
        ats: true,
        analytics: true,
      },
    },
    update: {
      priceCents: 29900,
      active: true,
    },
    where: { key: "growth-monthly" },
  });
  await prisma.billingSubscription.deleteMany({
    where: { companyId: company.id },
  });
  const subscription = await prisma.billingSubscription.create({
    data: {
      companyId: company.id,
      planId: plan.id,
      status: BillingSubscriptionStatus.ACTIVE,
      gstNumber: "29ABCDE1234F1Z5",
      currentPeriodStart: new Date("2026-07-01T00:00:00.000Z"),
      currentPeriodEnd: new Date("2026-08-01T00:00:00.000Z"),
    },
  });
  await prisma.invoice.deleteMany({ where: { companyId: company.id } });
  const invoice = await prisma.invoice.create({
    data: {
      companyId: company.id,
      subscriptionId: subscription.id,
      number: "INV-WORKORA-0001",
      status: InvoiceStatus.PAID,
      subtotalCents: 29900,
      taxCents: 5382,
      totalCents: 35282,
      currency: "USD",
      gstNumber: "29ABCDE1234F1Z5",
      paidAt: new Date(),
    },
  });
  await prisma.payment.create({
    data: {
      companyId: company.id,
      invoiceId: invoice.id,
      status: PaymentStatus.SUCCEEDED,
      amountCents: 35282,
      currency: "USD",
      provider: "stripe",
      providerPaymentId: "pi_seed_invoice_0001",
      paidAt: new Date(),
    },
  });
  await prisma.coupon.upsert({
    create: {
      code: "WORKORA10",
      description: "Demo ten percent launch coupon.",
      percentOff: 10,
      active: true,
    },
    update: {
      percentOff: 10,
      active: true,
    },
    where: { code: "WORKORA10" },
  });

  await prisma.analyticsReport.create({
    data: {
      title: "Hiring performance overview",
      type: "hiring",
      summary: {
        applications: 58,
        interviews: 5,
        conversionRate: 8.6,
      },
      createdById: admin?.id,
    },
  });
  await prisma.csvExport.create({
    data: {
      type: "applications",
      status: ExportStatus.READY,
      filename: "applications-demo.csv",
      url: "local-storage://exports/applications-demo.csv",
      createdById: admin?.id,
      completedAt: new Date(),
    },
  });

  const providers = [
    { channel: CommunicationChannel.EMAIL, name: "workora-email" },
    { channel: CommunicationChannel.SMS, name: "sms-provider" },
    { channel: CommunicationChannel.WHATSAPP, name: "whatsapp-provider" },
    { channel: CommunicationChannel.PUSH, name: "push-provider" },
  ];
  for (const provider of providers) {
    await prisma.communicationProvider.upsert({
      create: {
        ...provider,
        enabled: provider.channel === CommunicationChannel.EMAIL,
        config: { mode: "env-required" },
      },
      update: {
        enabled: provider.channel === CommunicationChannel.EMAIL,
        config: { mode: "env-required" },
      },
      where: {
        channel_name: {
          channel: provider.channel,
          name: provider.name,
        },
      },
    });
  }
  const latestNotification = await prisma.notification.findFirst({
    orderBy: { createdAt: "desc" },
    where: { userId: candidate.id },
  });
  await prisma.notificationDelivery.create({
    data: {
      notificationId: latestNotification?.id,
      channel: CommunicationChannel.EMAIL,
      recipient: candidate.email,
      status: DeliveryStatus.QUEUED,
      provider: "workora-email",
      payload: {
        subject: latestNotification?.title ?? "Workora notification",
      },
    },
  });

  const searchDocuments = [
    {
      entity: "Job",
      entityId: designerJob.id,
      title: designerJob.title,
      content: `${designerJob.summary} ${designerJob.description}`,
      keywords: ["design", "product", "remote", "enterprise"],
      url: `/jobs/${designerJob.id}`,
      weight: 5,
    },
    {
      entity: "CandidateProfile",
      entityId: candidateProfile.id,
      title: "Daniel Okoro",
      content:
        "Senior Product Manager with SQL and marketplace strategy experience.",
      keywords: ["candidate", "product", "sql", "marketplace"],
      url: `/admin/search?candidate=${candidateProfile.id}`,
      weight: 4,
    },
    {
      entity: "Company",
      entityId: company.id,
      title: company.name,
      content: company.description ?? "Enterprise cloud platform.",
      keywords: ["company", "technology", "cloud"],
      url: `/admin/search?company=${company.id}`,
      weight: 3,
    },
  ];
  for (const document of searchDocuments) {
    await prisma.searchIndexDocument.upsert({
      create: document,
      update: {
        title: document.title,
        content: document.content,
        keywords: document.keywords,
        url: document.url,
        weight: document.weight,
      },
      where: {
        entity_entityId: {
          entity: document.entity,
          entityId: document.entityId,
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
