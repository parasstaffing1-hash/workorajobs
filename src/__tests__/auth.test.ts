import bcrypt from "bcryptjs";
import { signJwt, verifyJwt } from "@/lib/jwt";
import { SessionStore } from "@/lib/auth/session-store";

export async function runAuthTestSuite() {
  const results: string[] = [];

  // Test 1: Password Hashing
  const password = "SuperSecretPassword123!";
  const hash = await bcrypt.hash(password, 10);
  const isMatch = await bcrypt.compare(password, hash);
  if (isMatch) results.push("✓ Password hashing & comparison verified");

  // Test 2: JWT Token Generation & Verification
  const payload = { userId: "user-123", email: "test@workorajobs.com", role: "EMPLOYER" };
  const token = signJwt(payload);
  const decoded = verifyJwt(token);
  if (decoded?.userId === "user-123" && decoded?.role === "EMPLOYER") {
    results.push("✓ JWT Token generation & verification verified");
  }

  // Test 3: User Agent Metadata Parser
  const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36";
  const parsed = SessionStore.parseUserAgent(ua);
  if (parsed.browser === "Chrome" && parsed.os === "Windows") {
    results.push("✓ User Agent session parser verified");
  }

  return results;
}
