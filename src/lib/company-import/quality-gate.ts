/**
 * Company Directory Content Quality Gate & Indexing Status Engine
 */

export interface QualityGateInput {
  name: string;
  officialDomain?: string;
  websiteUrl?: string;
  careersUrl?: string;
  countryCode?: string;
  industry?: string;
  description?: string;
  activeJobCount?: number;
  internshipStatus?: boolean;
  graduateProgramStatus?: boolean;
  headquartersCity?: string;
}

export interface QualityGateResult {
  score: number; // 0 - 100
  indexingStatus: "published_indexable" | "published_noindex" | "draft" | "review_required";
  reasons: string[];
}

export function evaluateCompanyQuality(company: QualityGateInput): QualityGateResult {
  let score = 0;
  const reasons: string[] = [];

  if (company.name && company.name.length > 2) {
    score += 15;
  } else {
    reasons.push("Missing valid official name");
  }

  if (company.officialDomain || company.websiteUrl) {
    score += 15;
  } else {
    reasons.push("Missing official domain");
  }

  if (company.careersUrl) {
    score += 15;
  } else {
    reasons.push("Missing verified careers URL");
  }

  if (company.countryCode && company.headquartersCity) {
    score += 15;
  } else {
    reasons.push("Incomplete headquarters location");
  }

  if (company.industry) {
    score += 10;
  } else {
    reasons.push("Missing industry classification");
  }

  if (company.description && company.description.length >= 80) {
    score += 15;
  } else {
    reasons.push("Short or missing company description");
  }

  if ((company.activeJobCount && company.activeJobCount > 0) || company.careersUrl || company.internshipStatus) {
    score += 15;
  }

  let indexingStatus: QualityGateResult["indexingStatus"] = "published_noindex";

  if (score >= 70 && company.officialDomain && company.careersUrl) {
    indexingStatus = "published_indexable";
  } else if (score < 40) {
    indexingStatus = "review_required";
  }

  return {
    score,
    indexingStatus,
    reasons,
  };
}
