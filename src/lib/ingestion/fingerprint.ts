import crypto from "crypto";
import { RawJobPayload } from "./types";

export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generates a SHA-256 fingerprint hash to prevent duplicate jobs across ATS providers.
 */
export function generateJobFingerprint(job: RawJobPayload): string {
  const normTitle = normalizeText(job.title);
  const normCompany = normalizeText(job.companyName);
  const normLocation = normalizeText(job.location || "remote");
  const normApply = normalizeText(job.applyUrl);

  const rawKey = `${normCompany}:${normTitle}:${normLocation}:${normApply}`;
  
  return crypto.createHash("sha256").update(rawKey).digest("hex");
}
