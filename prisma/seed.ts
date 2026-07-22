import { PrismaClient, SearchIntentType, SeoPageStatus, SeoPageType, Role, JobType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Only run seeding in non-production environments
  if (process.env.NODE_ENV === "production") {
    console.log("⚠️ Skipping database seed: NODE_ENV is set to production.");
    return;
  }

  console.log("🌱 Seeding WorkoraJobs PostgreSQL Database (Development Data)...");

  // 1. Seed Users
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@workorajobs.com" },
    update: {},
    create: {
      email: "admin@workorajobs.com",
      name: "Workora Admin",
      role: Role.ADMIN,
    },
  });

  const recruiterUser = await prisma.user.upsert({
    where: { email: "recruiter@northstarcloud.com" },
    update: {},
    create: {
      email: "recruiter@northstarcloud.com",
      name: "Sarah Jenkins (Recruiter)",
      role: Role.RECRUITER,
    },
  });

  // 2. Seed Companies
  const companyNorthstar = await prisma.company.upsert({
    where: { domain: "northstarcloud.com" },
    update: {},
    create: {
      name: "Northstar Cloud",
      domain: "northstarcloud.com",
      websiteUrl: "https://northstarcloud.com",
      description: "Enterprise cloud orchestration and workforce platform.",
      rating: 4.9,
      ownerId: recruiterUser.id,
    },
  });

  // 3. Seed Skills
  const skills = [
    { name: "React", slug: "react", category: "Frontend" },
    { name: "TypeScript", slug: "typescript", category: "Languages" },
    { name: "Next.js", slug: "nextjs", category: "Frameworks" },
    { name: "PostgreSQL", slug: "postgresql", category: "Databases" },
    { name: "Python", slug: "python", category: "Languages" },
    { name: "Docker", slug: "docker", category: "DevOps" },
  ];

  for (const s of skills) {
    await prisma.skill.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }

  // 4. Seed Locations
  const locations = [
    { city: "Toronto", state: "Ontario", country: "Canada", slug: "toronto-canada", geoLat: 43.6532, geoLng: -79.3832 },
    { city: "San Francisco", state: "California", country: "USA", slug: "san-francisco-usa", geoLat: 37.7749, geoLng: -122.4194 },
    { city: "Bangalore", state: "Karnataka", country: "India", slug: "bangalore-india", geoLat: 12.9716, geoLng: 77.5946 },
    { city: "Remote", state: "Global", country: "Worldwide", slug: "remote-global", geoLat: 0.0, geoLng: 0.0 },
  ];

  for (const loc of locations) {
    await prisma.location.upsert({
      where: { slug: loc.slug },
      update: {},
      create: loc,
    });
  }

  // 5. Seed Jobs
  const sampleJobs = [
    {
      title: "Frontend Engineering Intern (Summer 2026)",
      description: "Join Northstar Cloud's frontend team to build accessible, high-performance UI components using React and TypeScript.",
      location: "Remote, North America",
      salary: 95000,
      type: JobType.INTERNSHIP,
      workMode: "Remote",
      experience: "Entry Level",
      companyId: companyNorthstar.id,
      postedById: recruiterUser.id,
    },
    {
      title: "Senior Cloud Infrastructure Architect",
      description: "Design resilient cross-border Kubernetes clusters and cloud security infrastructure.",
      location: "San Francisco, CA",
      salary: 185000,
      type: JobType.FULL_TIME,
      workMode: "Hybrid",
      experience: "Senior Level",
      companyId: companyNorthstar.id,
      postedById: adminUser.id,
    },
  ];

  for (const j of sampleJobs) {
    const existing = await prisma.job.findFirst({
      where: { title: j.title, companyId: j.companyId },
    });
    if (!existing) {
      await prisma.job.create({ data: j });
    }
  }

  // 6. Seed JobSource
  await prisma.jobSource.upsert({
    where: { name: "Direct Employer API" },
    update: {},
    create: {
      name: "Direct Employer API",
      url: "https://workorajobs.com/api/v1/jobs",
      isActive: true,
    },
  });

  console.log("✅ Seed completed successfully! Sample Users, Companies, Jobs, Skills, and Locations created.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
