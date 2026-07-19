import { PrismaClient, SearchIntentType, SeoPageStatus, SeoPageType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Enterprise SEO Database Layer...");

  // 1. Seed Permissions & System Settings
  const permissions = [
    { name: "seo:publish", description: "Allows publishing SEO pages and triggering ISR." },
    { name: "content:edit", description: "Allows editing generated page content and metadata." },
    { name: "analytics:view", description: "Allows viewing traffic and ranking analytics." },
    { name: "admin:all", description: "Full administrative access." },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: { description: perm.description },
      create: perm,
    });
  }

  await prisma.systemSetting.upsert({
    where: { key: "seo_platform_config" },
    update: {},
    create: {
      key: "seo_platform_config",
      valueJson: {
        maxPagesPerSitemapChunk: 50000,
        isrRevalidationWindowSeconds: 86400,
        defaultMetaTitleSuffix: " | Workora Career Intelligence",
        openRouterFallbackModel: "google/gemini-2.0-flash-lite-preview-02-05:free",
        autoIndexingEnabled: true,
      },
      description: "Global system configuration for programmatic SEO generation.",
    },
  });

  // 2. Seed Keyword Clusters & Target Keywords
  const techCluster = await prisma.keywordCluster.create({
    data: {
      name: "Engineering & Software Architecture",
      category: "Technology",
      keywords: {
        create: [
          {
            term: "Senior Product Designer salary Toronto",
            searchVolume: 4200,
            difficulty: 38,
            cpcCents: 450,
            intent: SearchIntentType.COMMERCIAL,
          },
          {
            term: "Staff Backend Engineer job description",
            searchVolume: 8900,
            difficulty: 42,
            cpcCents: 620,
            intent: SearchIntentType.INFORMATIONAL,
          },
          {
            term: "High volume rate limiter architecture",
            searchVolume: 2100,
            difficulty: 55,
            cpcCents: 380,
            intent: SearchIntentType.INFORMATIONAL,
          },
        ],
      },
    },
  });

  // 3. Seed Job Categories & Locations
  const locationToronto = await prisma.location.upsert({
    where: { slug: "toronto-canada" },
    update: {},
    create: {
      city: "Toronto",
      state: "Ontario",
      country: "Canada",
      slug: "toronto-canada",
      geoLat: 43.6532,
      geoLng: -79.3832,
    },
  });

  const categoryDesign = await prisma.jobCategory.upsert({
    where: { slug: "product-design" },
    update: {},
    create: {
      name: "Product & UX Design",
      slug: "product-design",
    },
  });

  // 4. Seed Programmatic SEO Page & Content Brief
  const brief = await prisma.contentBrief.create({
    data: {
      clusterId: techCluster.id,
      primaryKeyword: "Senior Product Designer salary Toronto",
      secondaryKeywords: ["UX Design Systems", "WCAG Accessibility", "Figma Design Tokens"],
      targetWordCount: 1800,
      outlineJson: {
        sections: [
          "Market Overview for Product Designers in Toronto",
          "Salary CTC Breakdown & Base Compensation",
          "Top Skills Required (Figma, Design Systems, UX Research)",
          "Frequently Asked Questions",
        ],
      },
    },
  });

  const samplePage = await prisma.seoPage.create({
    data: {
      slug: "senior-product-designer-salary-toronto",
      title: "Senior Product Designer Salary in Toronto (2026 Compensation Guide)",
      pageType: SeoPageType.SALARY_GUIDE,
      status: SeoPageStatus.PUBLISHED,
      qualityScore: 94,
      canonicalUrl: "https://workorajobs.com/salary/senior-product-designer-salary-toronto",
      clusterId: techCluster.id,
      contentBriefId: brief.id,
      publishedAt: new Date(),
      generatedContent: {
        create: {
          markdownContent: "# Senior Product Designer Salary in Toronto\n\nThe median salary for a Senior Product Designer in Toronto is $140,000...",
          htmlContent: "<h1>Senior Product Designer Salary in Toronto</h1><p>The median salary...</p>",
          version: 1,
          wordCount: 1840,
          readabilityScore: 78.5,
          checksum: "a8f9b2c3d4e5f67890",
        },
      },
      schemaDefinitions: {
        create: [
          {
            schemaType: "BreadcrumbList",
            schemaJson: {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://workorajobs.com" },
                { "@type": "ListItem", position: 2, name: "Salaries", item: "https://workorajobs.com/salary" },
                { "@type": "ListItem", position: 3, name: "Product Designer Toronto", item: "https://workorajobs.com/salary/senior-product-designer-salary-toronto" },
              ],
            },
          },
        ],
      },
      faqs: {
        create: [
          {
            question: "What is the average salary for a Senior Product Designer in Toronto?",
            answer: "The average base salary ranges between $125,000 and $155,000 annually, with total CTC reaching $175,000+ including bonuses and stock equity.",
            order: 1,
          },
        ],
      },
    },
  });

  console.log(`✅ Seed completed successfully! Sample Page ID: ${samplePage.id}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
