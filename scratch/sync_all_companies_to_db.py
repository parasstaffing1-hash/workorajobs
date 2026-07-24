# -*- coding: utf-8 -*-
import json
import os
import subprocess

# Node ESM script to seed/upsert all companies into Prisma database
script_content = """import { PrismaClient } from "@prisma/client";
import { companiesData } from "../src/data/companies.ts";

const prisma = new PrismaClient();

async function main() {
  console.log(`Starting sync of ${companiesData.length} companies into Prisma Database...`);

  // Ensure admin user exists for ownerId
  let adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: "directory-admin@workorajobs.com",
        name: "Directory System Admin",
        role: "ADMIN",
      },
    });
  }

  let createdCount = 0;
  let updatedCount = 0;

  for (const comp of companiesData) {
    const slug = comp.slug || comp.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

    const companyData = {
      slug,
      name: comp.name,
      officialName: comp.officialName || comp.name,
      displayName: comp.displayName || comp.name,
      legalName: comp.legalName || comp.name,
      alternateNames: comp.alternateNames || [],
      description: comp.overview || comp.shortDescription,
      shortDescription: comp.shortDescription,
      officialDomain: comp.officialDomain || comp.website.replace(/^https?:\\/\\//, "").split("/")[0],
      websiteUrl: comp.website,
      careersUrl: comp.careersUrl,
      logoUrl: comp.logoUrl,
      domain: comp.officialDomain || comp.website.replace(/^https?:\\/\\//, "").split("/")[0],
      rating: comp.glassdoorRating || 4.5,
      countryCode: comp.countryCode || (comp.country === "India" ? "IN" : "US"),
      headquartersCity: comp.headquartersCity || comp.headquarters.split(",")[0],
      headquartersState: comp.headquartersState || "",
      headquartersCountry: comp.headquartersCountry || comp.country,
      operatingCountries: comp.operatingCountries || [],
      industry: comp.industry,
      subIndustries: comp.subIndustries || [comp.subIndustry],
      companyType: comp.companyType || "Enterprise",
      ownershipType: comp.ownershipType || "Public",
      publicPrivateStatus: comp.publicPrivateStatus || "Public",
      startupStage: comp.startupStage || "Public",
      foundedYear: comp.foundedYear,
      employeeRange: comp.employeeRange || comp.employeeCount,
      tickerSymbols: comp.tickerSymbols || [comp.ticker],
      secCik: comp.secCik || null,
      nseSymbol: comp.nseSymbol || null,
      bseScripCode: comp.bseScripCode || null,
      isin: comp.isin || null,
      qualificationReason: comp.qualificationReason || "industry_leader",
      linkedinUrl: comp.linkedinUrl || null,
      indexingStatus: comp.indexingStatus || "published_indexable",
      contentQualityScore: comp.contentQualityScore || 95,
      ownerId: adminUser.id,
    };

    const existing = await prisma.company.findFirst({
      where: {
        OR: [{ slug }, { domain: companyData.domain }],
      },
    });

    if (existing) {
      await prisma.company.update({
        where: { id: existing.id },
        data: companyData,
      });
      updatedCount++;
    } else {
      await prisma.company.create({
        data: companyData,
      });
      createdCount++;
    }
  }

  console.log(`Synchronization Complete! Created: ${createdCount}, Updated: ${updatedCount}, Total: ${companiesData.length}`);
}

main()
  .catch((e) => {
    console.error("Database sync failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
""";

scratch_dir = os.path.join("scratch")
os.makedirs(scratch_dir, exist_ok=True)
node_script_path = os.path.join(scratch_dir, "sync_db.ts")

with open(node_script_path, "w", encoding="utf-8") as f:
  f.write(script_content)

print("Created scratch/sync_db.ts script for database sync!")
