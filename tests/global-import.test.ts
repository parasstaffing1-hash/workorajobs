/**
 * Unit & Integration Tests for Global All-Country Import Pipeline
 */

import { parseAllCountriesHtml, normalizeCountryInfo, EXCLUDED_AGGREGATE_SLUGS } from "../src/lib/global-import/country-discovery";
import { evaluateCandidateExclusion, parseCountryCompanyRows } from "../src/lib/global-import/company-extractor";
import { calculateMatchConfidence, normalizeCompanyName } from "../src/lib/company-import/duplicate-detector";
import { isAllowedCareersUrl } from "../src/lib/global-import/verification-enrichment";

describe("Global All-Country Import Pipeline Tests", () => {
  test("ISO Country Mapping & Alias Normalization", () => {
    const usa = normalizeCountryInfo("USA", "usa");
    expect(usa.name).toBe("United States");
    expect(usa.alpha2).toBe("US");
    expect(usa.alpha3).toBe("USA");

    const uk = normalizeCountryInfo("UK", "uk");
    expect(uk.name).toBe("United Kingdom");
    expect(uk.alpha2).toBe("GB");

    const uae = normalizeCountryInfo("UAE", "uae");
    expect(uae.name).toBe("United Arab Emirates");
    expect(uae.alpha2).toBe("AE");

    const czech = normalizeCountryInfo("Czechia", "czechia");
    expect(czech.name).toBe("Czech Republic");
    expect(czech.alpha2).toBe("CZ");
  });

  test("Aggregate Exclusions Filtering", () => {
    expect(EXCLUDED_AGGREGATE_SLUGS.has("european-union")).toBe(true);
    expect(EXCLUDED_AGGREGATE_SLUGS.has("global")).toBe(true);
    expect(EXCLUDED_AGGREGATE_SLUGS.has("etfs")).toBe(true);
    expect(EXCLUDED_AGGREGATE_SLUGS.has("usa")).toBe(false);
    expect(EXCLUDED_AGGREGATE_SLUGS.has("india")).toBe(false);
  });

  test("Non-Company Instrument Exclusion Engine", () => {
    expect(evaluateCandidateExclusion("Vanguard S&P 500 ETF").isExcluded).toBe(true);
    expect(evaluateCandidateExclusion("BlackRock Global Fund").isExcluded).toBe(true);
    expect(evaluateCandidateExclusion("Acquisition Corp SPAC").isExcluded).toBe(true);
    expect(evaluateCandidateExclusion("Apple Inc.").isExcluded).toBe(false);
    expect(evaluateCandidateExclusion("Tata Consultancy Services").isExcluded).toBe(false);
  });

  test("Careers Page ATS Verification", () => {
    expect(isAllowedCareersUrl("https://apple.myworkdayjobs.com/careers", "apple.com")).toBe(true);
    expect(isAllowedCareersUrl("https://job-boards.greenhouse.io/stripe", "stripe.com")).toBe(true);
    expect(isAllowedCareersUrl("https://www.apple.com/careers", "apple.com")).toBe(true);
  });

  test("Duplicate Detection Matching Confidence", () => {
    const candidate = { name: "Tata Consultancy Services Ltd", nseSymbol: "TCS" };
    const existing = { name: "Tata Consultancy Services", nseSymbol: "TCS" };
    const score = calculateMatchConfidence(candidate as any, existing as any);
    expect(score).toBeGreaterThanOrEqual(0.9);
  });
});
