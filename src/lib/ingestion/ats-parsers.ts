import { AtsProviderType, RawJobPayload } from "./types";

export class AtsParserRegistry {
  /**
   * Universal parser router based on provider type
   */
  static parse(provider: AtsProviderType, companyName: string, rawData: any): RawJobPayload[] {
    switch (provider) {
      case "GREENHOUSE":
        return this.parseGreenhouse(companyName, rawData);
      case "LEVER":
        return this.parseLever(companyName, rawData);
      case "ASHBY":
        return this.parseAshby(companyName, rawData);
      case "SMARTRECRUITERS":
        return this.parseSmartRecruiters(companyName, rawData);
      case "BAMBOOHR":
        return this.parseBambooHr(companyName, rawData);
      case "PERSONIO":
        return this.parsePersonio(companyName, rawData);
      case "RECRUITEE":
        return this.parseRecruitee(companyName, rawData);
      case "GENERIC_JSON":
      case "RSS_FEED":
      default:
        return this.parseGenericJson(companyName, rawData);
    }
  }

  // 1. Greenhouse Parser
  private static parseGreenhouse(companyName: string, data: any): RawJobPayload[] {
    if (!data?.jobs || !Array.isArray(data.jobs)) return [];
    return data.jobs.map((item: any) => ({
      sourceId: String(item.id),
      title: item.title || "Untitled Role",
      companyName,
      description: item.content || item.title || "No description provided.",
      location: item.location?.name || "Remote",
      workMode: item.location?.name?.toLowerCase().includes("remote") ? "Remote" : "On-site",
      department: item.departments?.[0]?.name || "Engineering",
      applyUrl: item.absolute_url || item.url || `https://boards.greenhouse.io/${companyName}/jobs/${item.id}`,
      publishedAt: item.updated_at || new Date().toISOString(),
    }));
  }

  // 2. Lever Parser
  private static parseLever(companyName: string, data: any): RawJobPayload[] {
    if (!Array.isArray(data)) return [];
    return data.map((item: any) => ({
      sourceId: String(item.id),
      title: item.text || "Untitled Role",
      companyName,
      description: item.descriptionPlain || item.description || "No description provided.",
      location: item.categories?.location || "Remote",
      workMode: item.workplaceType === "unrestricted" || item.categories?.location?.toLowerCase().includes("remote") ? "Remote" : "On-site",
      department: item.categories?.department || "Engineering",
      employmentType: item.categories?.commitment || "Full-time",
      applyUrl: item.hostedUrl || item.applyUrl,
      publishedAt: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
    }));
  }

  // 3. Ashby Parser
  private static parseAshby(companyName: string, data: any): RawJobPayload[] {
    const jobs = data?.jobs || data?.jobPostingList || [];
    if (!Array.isArray(jobs)) return [];
    return jobs.map((item: any) => ({
      sourceId: String(item.id),
      title: item.title || "Untitled Role",
      companyName,
      description: item.descriptionPlain || item.description || "No description provided.",
      location: item.locationName || item.location || "Remote",
      workMode: item.isRemote || item.locationName?.toLowerCase().includes("remote") ? "Remote" : "On-site",
      department: item.departmentName || "Engineering",
      applyUrl: item.jobUrl || item.applyUrl,
      publishedAt: item.publishedAt || new Date().toISOString(),
    }));
  }

  // 4. SmartRecruiters Parser
  private static parseSmartRecruiters(companyName: string, data: any): RawJobPayload[] {
    if (!data?.content || !Array.isArray(data.content)) return [];
    return data.content.map((item: any) => ({
      sourceId: String(item.id),
      title: item.name || "Untitled Role",
      companyName,
      description: item.jobAd?.sections?.jobDescription?.text || item.name || "No description provided.",
      location: `${item.location?.city || ""}, ${item.location?.country || ""}`.trim(),
      workMode: item.location?.remote ? "Remote" : "On-site",
      department: item.department?.label || "Engineering",
      applyUrl: item.ref || `https://jobs.smartrecruiters.com/${companyName}/${item.id}`,
      publishedAt: item.releasedDate || new Date().toISOString(),
    }));
  }

  // 5. BambooHR Parser
  private static parseBambooHr(companyName: string, data: any): RawJobPayload[] {
    const jobs = data?.result || data?.jobs || [];
    if (!Array.isArray(jobs)) return [];
    return jobs.map((item: any) => ({
      sourceId: String(item.id),
      title: item.jobTitle || item.title || "Untitled Role",
      companyName,
      description: item.jobDescription || item.description || "No description provided.",
      location: item.location?.city || "Remote",
      workMode: item.location?.city?.toLowerCase().includes("remote") ? "Remote" : "On-site",
      department: item.department || "General",
      applyUrl: item.url || `https://${companyName}.bamboohr.com/jobs/view.php?id=${item.id}`,
    }));
  }

  // 6. Personio Parser
  private static parsePersonio(companyName: string, data: any): RawJobPayload[] {
    const positions = data?.positions || data?.jobPostings || [];
    if (!Array.isArray(positions)) return [];
    return positions.map((item: any) => ({
      sourceId: String(item.id),
      title: item.name || "Untitled Role",
      companyName,
      description: item.jobDescriptions?.[0]?.value || "No description provided.",
      location: item.office || "Remote",
      workMode: item.office?.toLowerCase().includes("remote") ? "Remote" : "On-site",
      department: item.department || "Engineering",
      applyUrl: item.url || `https://${companyName}.personio.de/job/${item.id}`,
    }));
  }

  // 7. Recruitee Parser
  private static parseRecruitee(companyName: string, data: any): RawJobPayload[] {
    if (!data?.offers || !Array.isArray(data.offers)) return [];
    return data.offers.map((item: any) => ({
      sourceId: String(item.id),
      title: item.title || "Untitled Role",
      companyName,
      description: item.description || item.requirements || "No description provided.",
      location: item.location || "Remote",
      workMode: item.remote ? "Remote" : "On-site",
      department: item.department || "General",
      applyUrl: item.careers_url || `https://${companyName}.recruitee.com/o/${item.slug}`,
    }));
  }

  // 8. Generic JSON Parser
  private static parseGenericJson(companyName: string, data: any): RawJobPayload[] {
    const items = Array.isArray(data) ? data : data?.jobs || data?.data || [];
    if (!Array.isArray(items)) return [];
    return items.map((item: any, i: number) => ({
      sourceId: String(item.id || item.jobId || i),
      title: item.title || item.jobTitle || item.name || "Untitled Role",
      companyName,
      description: item.description || item.details || "No description provided.",
      location: item.location || item.city || "Remote",
      workMode: String(item.location || "").toLowerCase().includes("remote") ? "Remote" : "On-site",
      salaryMin: typeof item.salaryMin === "number" ? item.salaryMin : undefined,
      salaryMax: typeof item.salaryMax === "number" ? item.salaryMax : undefined,
      applyUrl: item.applyUrl || item.url || item.link || `https://${companyName.toLowerCase().replace(/\s+/g, "")}.com/careers`,
    }));
  }
}
