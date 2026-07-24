/**
 * ============================================================================
 * ENVIRONMENT VALIDATION & SECRETS ROTATION SERVICE
 * Validates mandatory environment variables on startup and supports dual-key
 * secret rotation for zero-downtime secret rotation.
 * ============================================================================
 */

import crypto from "crypto";

export interface EnvironmentConfig {
  nodeEnv: "development" | "production" | "test";
  databaseUrl: string;
  jwtSecret: string;
  jwtSecretPrevious?: string;
  redisUrl?: string;
  appUrl: string;
  sessionMaxAgeDays: number;
}

export class EnvValidator {
  private static cachedConfig: EnvironmentConfig | null = null;

  /**
   * Validate mandatory environment variables with strict checks
   */
  static validate(): EnvironmentConfig {
    if (this.cachedConfig) return this.cachedConfig;

    const nodeEnv = (process.env.NODE_ENV as any) || "development";
    const databaseUrl = process.env.DATABASE_URL || "";
    const jwtSecret = process.env.JWT_SECRET || "workora-super-secret-encryption-key-jwt-auth";
    const jwtSecretPrevious = process.env.JWT_SECRET_PREVIOUS;
    const redisUrl = process.env.REDIS_URL;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const warnings: string[] = [];

    if (nodeEnv === "production") {
      if (!databaseUrl || databaseUrl.includes("user:password")) {
        warnings.push("DATABASE_URL is missing or using default placeholder credentials");
      }
      if (jwtSecret.length < 32 || jwtSecret.includes("super-secret")) {
        warnings.push("JWT_SECRET is insecure (less than 32 characters or default key)");
      }
      if (!redisUrl) {
        warnings.push("REDIS_URL is not set — session store running in fallback mode");
      }
    }

    if (warnings.length > 0) {
      console.warn("\n⚠️ PRODUCTION SECURITY WARNINGS:");
      warnings.forEach((w) => console.warn(`   - ${w}`));
      console.warn("");
    }

    this.cachedConfig = {
      nodeEnv,
      databaseUrl,
      jwtSecret,
      jwtSecretPrevious,
      redisUrl,
      appUrl,
      sessionMaxAgeDays: parseInt(process.env.SESSION_MAX_AGE_DAYS || "30", 10),
    };

    return this.cachedConfig;
  }
}

/**
 * Dual-Key Secret Rotation Service
 * Enables zero-downtime secret rotation by verifying JWT signatures against
 * current key first, then fallback to previous key during transition window.
 */
export class SecretsRotationService {
  private static currentKeyBuffer: Buffer | null = null;
  private static previousKeyBuffer: Buffer | null = null;

  private static getKeys() {
    if (!this.currentKeyBuffer) {
      const config = EnvValidator.validate();
      this.currentKeyBuffer = Buffer.from(config.jwtSecret);
      this.previousKeyBuffer = config.jwtSecretPrevious
        ? Buffer.from(config.jwtSecretPrevious)
        : null;
    }
    return {
      current: this.currentKeyBuffer,
      previous: this.previousKeyBuffer,
    };
  }

  /**
   * Verify HMAC signature against active key, fallback to previous key if present
   */
  static verifyHmacSignature(headerAndPayload: string, signature: string): boolean {
    const { current, previous } = this.getKeys();

    // 1. Try current key
    const currentExpected = crypto
      .createHmac("sha256", current)
      .update(headerAndPayload)
      .digest("base64url");

    const sigBuf = Buffer.from(signature);
    const currBuf = Buffer.from(currentExpected);

    if (sigBuf.length === currBuf.length && crypto.timingSafeEqual(sigBuf, currBuf)) {
      return true;
    }

    // 2. Try previous key (during secret rotation window)
    if (previous) {
      const prevExpected = crypto
        .createHmac("sha256", previous)
        .update(headerAndPayload)
        .digest("base64url");

      const prevBuf = Buffer.from(prevExpected);
      if (sigBuf.length === prevBuf.length && crypto.timingSafeEqual(sigBuf, prevBuf)) {
        return true;
      }
    }

    return false;
  }
}
