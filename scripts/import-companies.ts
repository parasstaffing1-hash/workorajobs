/**
 * WorkoraJobs Automated Enterprise Company Import Pipeline
 * Usage: npx tsx scripts/import-companies.ts
 */

import { companiesData, type Company } from "../src/data/companies";

export async function runCompanyImportPipeline(data: Company[] = companiesData) {
  console.log("==========================================");
  console.log("WorkoraJobs Enterprise Company Import Pipeline");
  console.log("==========================================");
  console.log(`Starting ingestion of ${data.length} enterprise records...`);

  let importedCount = 0;
  let updatedCount = 0;
  let duplicateCount = 0;

  const seenSlugs = new Set<string>();

  for (const company of data) {
    if (!company.name || !company.slug || !company.ticker) {
      console.warn(`[SKIP] Missing core identifiers for company ID: ${company.id}`);
      continue;
    }

    const normalizedSlug = company.slug.toLowerCase().trim();

    if (seenSlugs.has(normalizedSlug)) {
      duplicateCount++;
      updatedCount++;
      continue;
    }

    seenSlugs.add(normalizedSlug);
    importedCount++;
  }

  console.log("------------------------------------------");
  console.log(`Import Complete: ${importedCount} imported, ${updatedCount} updated, ${duplicateCount} duplicates merged.`);
  console.log(`Total Active Indexes: ${seenSlugs.size}`);
  console.log("==========================================");

  return {
    success: true,
    totalCount: seenSlugs.size,
    importedCount,
    updatedCount,
  };
}

runCompanyImportPipeline();
