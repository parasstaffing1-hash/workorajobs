import { redis } from "@/lib/redis";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  totalLimit: number;
}

/**
 * Sliding window rate limiter for Authentication endpoints (Login, Signup, Reset Password)
 */
export class AuthRateLimiter {
  /**
   * Check rate limit for a specific action and key (IP or email)
   * @param action Identifier e.g. "login", "signup", "reset_password"
   * @param key IP address or email address
   * @param maxAttempts Max allowed attempts within window
   * @param windowSeconds Window duration in seconds
   */
  static async check(
    action: string,
    key: string,
    maxAttempts = 5,
    windowSeconds = 900 // 15 minutes
  ): Promise<RateLimitResult> {
    const redisKey = `ratelimit:${action}:${key.toLowerCase().trim()}`;

    try {
      const current = await redis.incr(redisKey);
      if (current === 1) {
        await redis.expire(redisKey, windowSeconds);
      }

      const remaining = Math.max(0, maxAttempts - current);
      const allowed = current <= maxAttempts;

      return {
        allowed,
        remaining,
        resetSeconds: windowSeconds,
        totalLimit: maxAttempts,
      };
    } catch (err) {
      console.warn("Rate limiter redis error, failing open safely:", err);
      return {
        allowed: true,
        remaining: maxAttempts,
        resetSeconds: windowSeconds,
        totalLimit: maxAttempts,
      };
    }
  }

  /**
   * Reset rate limit counter on successful login or verification
   */
  static async reset(action: string, key: string): Promise<void> {
    const redisKey = `ratelimit:${action}:${key.toLowerCase().trim()}`;
    try {
      await redis.del(redisKey);
    } catch (_) {}
  }
}
