/**
 * Executable CLI Entry Script for WorkoraJobs All-Country Company Importer
 */

import { parseCLIOptions, runDiscoverCountries, runImportPipeline } from "../src/lib/global-import/pipeline-cli";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "help";
  const options = parseCLIOptions(args);

  console.log(`\n======================================================`);
  console.log(`WORKORAJOBS COMPANY IMPORT PIPELINE CLI`);
  console.log(`Command: ${command}`);
  console.log(`======================================================\n`);

  if (command === "discover-countries") {
    const discovered = await runDiscoverCountries(options);
    console.log(`Discovered ${discovered.length} countries.`);
  } else if (command === "import-country" || command === "import-all-countries" || command === "pilot") {
    if (command === "import-all-countries" && !options.allCountries) {
      options.allCountries = true;
    }
    const report = await runImportPipeline(options);
    console.log(`\n--- IMPORT PIPELINE SUMMARY ---`);
    console.log(`Countries Discovered: ${report.countriesDiscovered}`);
    console.log(`Pilot Countries: ${report.pilotCountriesSelected.join(", ")}`);
    console.log(`Companies Parsed: ${report.companiesParsed}`);
    console.log(`Companies Verified: ${report.companiesVerified}`);
    console.log(`New Companies Created: ${report.newCompaniesCreated}`);
    console.log(`Existing Companies Updated: ${report.existingCompaniesUpdated}`);
    console.log(`Excluded Records: ${report.excludedRecords.length}`);
    console.log(`Pages Marked Indexable: ${report.pagesMarkedIndexable}`);
    console.log(`Pages Marked Noindex: ${report.pagesMarkedNoindex}`);
  } else if (command === "report") {
    const report = await runImportPipeline({ ...options, dryRun: true });
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`Available commands:
  - discover-countries
  - import-country -- --country=india
  - import-all-countries -- --all-countries
  - pilot
  - report
    `);
  }
}

main().catch((e) => {
  console.error("CLI Execution failed:", e);
  process.exit(1);
});
