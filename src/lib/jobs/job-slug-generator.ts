import crypto from "crypto";

export function generateJobSlug(title: string, companyName: string, location?: string): string {
  const base = `${title} ${companyName} ${location || ""}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const randomHash = crypto.randomBytes(3).toString("hex");
  return `${base.substring(0, 80)}-${randomHash}`;
}
