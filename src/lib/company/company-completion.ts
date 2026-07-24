export interface CompanyCompletionReport {
  score: number;
  level: "Elite Enterprise" | "Verified Hiring Brand" | "Growing Company" | "Basic Profile";
  missingItems: Array<{ field: string; label: string; points: number }>;
}

export function calculateCompanyCompletion(company: any): CompanyCompletionReport {
  let score = 0;
  const missingItems: Array<{ field: string; label: string; points: number }> = [];

  const checks = [
    { field: "logoUrl", label: "Company Logo", points: 15, valid: !!company?.logoUrl },
    { field: "name", label: "Company Name", points: 10, valid: !!company?.name },
    { field: "tagline", label: "Company Tagline", points: 5, valid: !!company?.tagline },
    { field: "description", label: "About Company Description", points: 15, valid: !!company?.description && company.description.length >= 20 },
    { field: "websiteUrl", label: "Website URL", points: 10, valid: !!company?.websiteUrl },
    { field: "careersUrl", label: "Career Page Link", points: 5, valid: !!company?.careersUrl },
    { field: "industry", label: "Industry Category", points: 5, valid: !!company?.industry },
    { field: "employeeRange", label: "Company Size", points: 5, valid: !!company?.employeeRange || !!company?.companySize },
    { field: "headquartersCity", label: "Headquarters Location", points: 5, valid: !!company?.headquartersCity },
    { field: "gstNumber", label: "GST Registration Number", points: 10, valid: !!company?.gstNumber },
    { field: "cinNumber", label: "CIN Number", points: 5, valid: !!company?.cinNumber },
    { field: "hiringEmail", label: "Hiring Contact Email", points: 5, valid: !!company?.hiringEmail },
    { field: "linkedinUrl", label: "LinkedIn Page URL", points: 5, valid: !!company?.linkedinUrl },
  ];

  checks.forEach((item) => {
    if (item.valid) {
      score += item.points;
    } else {
      missingItems.push({ field: item.field, label: item.label, points: item.points });
    }
  });

  const finalScore = Math.min(100, score);
  let level: CompanyCompletionReport["level"] = "Basic Profile";

  if (finalScore >= 85) level = "Elite Enterprise";
  else if (finalScore >= 70) level = "Verified Hiring Brand";
  else if (finalScore >= 50) level = "Growing Company";

  return {
    score: finalScore,
    level,
    missingItems,
  };
}
