import crypto from "crypto";

const CSRF_SECRET = process.env.CSRF_SECRET || "workorajobs-csrf-protection-secret-key-2026";

export class CsrfProtection {
  /**
   * Generates a signed anti-CSRF token
   */
  static generateToken(sessionId: string): string {
    const random = crypto.randomBytes(16).toString("hex");
    const timestamp = Date.now();
    const data = `${sessionId}:${random}:${timestamp}`;
    const hmac = crypto.createHmac("sha256", CSRF_SECRET).update(data).digest("hex");
    return Buffer.from(`${data}:${hmac}`).toString("base64url");
  }

  /**
   * Validates anti-CSRF token against request session
   */
  static verifyToken(token: string, sessionId: string, maxAgeMs = 86400000): boolean {
    try {
      const decoded = Buffer.from(token, "base64url").toString("utf8");
      const parts = decoded.split(":");
      if (parts.length !== 4) return false;

      const [tokenSessionId, random, timestampStr, hmac] = parts;
      if (tokenSessionId !== sessionId) return false;

      const timestamp = parseInt(timestampStr, 10);
      if (Date.now() - timestamp > maxAgeMs) return false; // Token expired

      const expectedData = `${tokenSessionId}:${random}:${timestampStr}`;
      const expectedHmac = crypto.createHmac("sha256", CSRF_SECRET).update(expectedData).digest("hex");

      return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac));
    } catch {
      return false;
    }
  }
}
