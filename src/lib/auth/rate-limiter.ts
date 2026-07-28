import { redis } from "@/lib/redis";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  totalLimit: number;
}

const LOCAL_LIMITS = new Map<string, { count: number; expiresAt: number }>();

function checkLocalLimit(redisKey: string, maxAttempts: number, windowSeconds: number): RateLimitResult {
  const now = Date.now();
  const existing = LOCAL_LIMITS.get(redisKey);
  const isActive = Boolean(existing && existing.expiresAt > now);
  const expiresAt = isActive && existing ? existing.expiresAt : now + windowSeconds * 1000;
  const count = isActive && existing ? existing.count + 1 : 1;

  LOCAL_LIMITS.set(redisKey, { count, expiresAt });

  for (const [key, value] of LOCAL_LIMITS.entries()) {
    if (value.expiresAt <= now) {
      LOCAL_LIMITS.delete(key);
    }
  }

  return {
    allowed: count <= maxAttempts,
    remaining: Math.max(0, maxAttempts - count),
    resetSeconds: Math.max(1, Math.ceil((expiresAt - now) / 1000)),
    totalLimit: maxAttempts,
  };
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
    } catch {
      console.warn("Rate limiter Redis unavailable; using local fallback limiter.");
      return checkLocalLimit(redisKey, maxAttempts, windowSeconds);
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
    LOCAL_LIMITS.delete(redisKey);
  }
}
