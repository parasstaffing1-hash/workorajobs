import { RecruiterFiltersInput } from "./validation";
import { BooleanSearchEngine } from "./engine";

export class FilterBuilder {
  private engine = new BooleanSearchEngine();

  /**
   * Compiles structured recruiter filters into a deterministic, optimized Boolean search query.
   */
  public async buildQuery(filters: Partial<RecruiterFiltersInput>): Promise<string> {
    const clauses: string[] = [];

    // Helper: Wrap term in quotes if it has spaces and isn't already quoted
    const quoteTerm = (t: string) => {
      const trimmed = t.trim();
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed;
      if (trimmed.startsWith("'") && trimmed.endsWith("'")) return `"${trimmed.slice(1, -1)}"`;
      return `"${trimmed}"`;
    };

    // 1. Current / Previous Designations
    if (filters.currentDesignation) {
      const expanded = await this.engine.expandTerm(quoteTerm(filters.currentDesignation));
      clauses.push(`(current_title:${expanded})`);
    }
    if (filters.previousDesignation) {
      const expanded = await this.engine.expandTerm(quoteTerm(filters.previousDesignation));
      clauses.push(`(previous_title:${expanded})`);
    }

    // 2. Workplace Models (Remote, Hybrid, Onsite)
    if (filters.workplaceModel && filters.workplaceModel !== "any") {
      clauses.push(`(workplace:${filters.workplaceModel.toUpperCase()})`);
    }

    // 3. Current / Previous Companies
    if (filters.currentCompany) {
      const expanded = await this.engine.expandTerm(quoteTerm(filters.currentCompany));
      clauses.push(`(current_company:${expanded})`);
    }
    if (filters.previousCompany) {
      const expanded = await this.engine.expandTerm(quoteTerm(filters.previousCompany));
      clauses.push(`(previous_company:${expanded})`);
    }
    if (filters.preferredEmployer) {
      const expanded = await this.engine.expandTerm(quoteTerm(filters.preferredEmployer));
      clauses.push(`(preferred_employer:${expanded})`);
    }

    // 4. Location & Radius
    if (filters.location) {
      const locationClause = quoteTerm(filters.location);
      if (filters.radiusMiles) {
        clauses.push(`(location:${locationClause} WITHIN ${filters.radiusMiles}miles)`);
      } else {
        clauses.push(`(location:${locationClause})`);
      }
    }

    // 5. Education & Credentials
    if (filters.degreeType) {
      const expanded = await this.engine.expandTerm(quoteTerm(filters.degreeType));
      clauses.push(`(degree:${expanded})`);
    }
    if (filters.preferredUniversity) {
      const expanded = await this.engine.expandTerm(quoteTerm(filters.preferredUniversity));
      clauses.push(`(university:${expanded})`);
    }
    if (filters.certification) {
      const expanded = await this.engine.expandTerm(quoteTerm(filters.certification));
      clauses.push(`(certification:${expanded})`);
    }

    // 6. Metadata Filters
    if (filters.noticePeriod) {
      clauses.push(`(notice_period:${quoteTerm(filters.noticePeriod)})`);
    }
    if (filters.industry) {
      const expanded = await this.engine.expandTerm(quoteTerm(filters.industry));
      clauses.push(`(industry:${expanded})`);
    }
    if (filters.employmentType) {
      clauses.push(`(employment_type:${quoteTerm(filters.employmentType)})`);
    }
    if (filters.visaStatus) {
      const expanded = await this.engine.expandTerm(quoteTerm(filters.visaStatus));
      clauses.push(`(visa:${expanded})`);
    }
    if (filters.securityClearance) {
      const expanded = await this.engine.expandTerm(quoteTerm(filters.securityClearance));
      clauses.push(`(security_clearance:${expanded})`);
    }
    if (filters.availability) {
      clauses.push(`(availability:${quoteTerm(filters.availability)})`);
    }
    if (filters.preferredSkillCategory) {
      clauses.push(`(skill_category:${quoteTerm(filters.preferredSkillCategory)})`);
    }

    // Experience Years Range
    if (filters.experienceYearsMin !== undefined || filters.experienceYearsMax !== undefined) {
      const min = filters.experienceYearsMin ?? 0;
      const max = filters.experienceYearsMax ?? 99;
      clauses.push(`(experience_years:[${min} TO ${max}])`);
    }

    // Salary Range
    if (filters.salaryMin !== undefined || filters.salaryMax !== undefined) {
      const min = filters.salaryMin ?? 0;
      const max = filters.salaryMax ?? 999999;
      clauses.push(`(salary_usd:[${min} TO ${max}])`);
    }

    // 7. Must Have Skills (AND join)
    if (filters.mustHave && filters.mustHave.length > 0) {
      const expandedMustHaves = await Promise.all(
        filters.mustHave.map(async (skill) => await this.engine.expandTerm(quoteTerm(skill)))
      );
      clauses.push(`(${expandedMustHaves.join(" AND ")})`);
    }

    // 8. Nice To Have Skills (OR join)
    if (filters.niceToHave && filters.niceToHave.length > 0) {
      const expandedNiceToHaves = await Promise.all(
        filters.niceToHave.map(async (skill) => await this.engine.expandTerm(quoteTerm(skill)))
      );
      clauses.push(`(${expandedNiceToHaves.join(" OR ")})`);
    }

    // 9. Exclude terms (NOT join)
    if (filters.exclude && filters.exclude.length > 0) {
      const expandedExcludes = await Promise.all(
        filters.exclude.map(async (term) => await this.engine.expandTerm(quoteTerm(term)))
      );
      clauses.push(`NOT (${expandedExcludes.join(" OR ")})`);
    }

    return clauses.join(" AND ");
  }
}
