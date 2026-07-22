import { RawJobPayload } from "./types";

export class JobValidator {
  /**
   * Validates raw job payload against production quality rules
   */
  static validate(job: RawJobPayload): { isValid: boolean; error?: string } {
    if (!job.title || job.title.trim().length < 2) {
      return { isValid: false, error: "Invalid job title (too short)" };
    }

    if (!job.companyName || job.companyName.trim().length < 2) {
      return { isValid: false, error: "Invalid company name" };
    }

    if (!job.description || job.description.trim().length < 10) {
      return { isValid: false, error: "Empty or insufficient job description" };
    }

    if (!job.applyUrl || !this.isValidUrl(job.applyUrl)) {
      return { isValid: false, error: "Invalid or missing apply URL" };
    }

    // Check closing date
    if (job.closingDate) {
      const closing = new Date(job.closingDate).getTime();
      if (closing < Date.now()) {
        return { isValid: false, error: "Job position has expired" };
      }
    }

    return { isValid: true };
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }
}
