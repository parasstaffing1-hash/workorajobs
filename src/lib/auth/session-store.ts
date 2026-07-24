import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

/**
 * In-process LRU session cache to avoid Redis/DB round trips on hot paths.
 * TTL: 10 seconds. Max entries: 500.
 */
const SESSION_CACHE = new Map<string, { data: SessionData; expireAt: number }>();
const SESSION_CACHE_TTL_MS = 10_000;
const SESSION_CACHE_MAX = 500;

function getCachedSession(token: string): SessionData | undefined {
  const entry = SESSION_CACHE.get(token);
  if (!entry) return undefined;
  if (Date.now() > entry.expireAt) {
    SESSION_CACHE.delete(token);
    return undefined;
  }
  return entry.data;
}

function setCachedSession(token: string, data: SessionData): void {
  if (SESSION_CACHE.size >= SESSION_CACHE_MAX) {
    const firstKey = SESSION_CACHE.keys().next().value;
    if (firstKey) SESSION_CACHE.delete(firstKey);
  }
  SESSION_CACHE.set(token, { data, expireAt: Date.now() + SESSION_CACHE_TTL_MS });
}

function invalidateCachedSession(token: string): void {
  SESSION_CACHE.delete(token);
}

export interface SessionData {
  sessionId: string;
  userId: string;
  email: string;
  role: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  expiresAt: string;
  isRevoked: boolean;
}

export class SessionStore {
  /**
   * Helper to parse User-Agent string into readable Browser & OS
   */
  static parseUserAgent(ua: string) {
    let browser = "Unknown Browser";
    let os = "Unknown OS";
    let deviceType = "Desktop";

    if (/mobile/i.test(ua)) deviceType = "Mobile";
    if (/tablet/i.test(ua)) deviceType = "Tablet";

    if (/chrome|crios/i.test(ua)) browser = "Chrome";
    else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
    else if (/edg/i.test(ua)) browser = "Edge";

    if (/windows/i.test(ua)) os = "Windows";
    else if (/macintosh|mac os/i.test(ua)) os = "macOS";
    else if (/android/i.test(ua)) os = "Android";
    else if (/linux/i.test(ua)) os = "Linux";
    else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";

    return { browser, os, deviceType };
  }

  /**
   * Creates a new user session in DB and Redis cache
   */
  static async createSession(data: {
    userId: string;
    email: string;
    role: string;
    ipAddress?: string;
    userAgent?: string;
    rememberMe?: boolean;
  }): Promise<{ sessionToken: string; expiresAt: Date }> {
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const durationDays = data.rememberMe ? 30 : 1;
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
    const parsedUa = this.parseUserAgent(data.userAgent || "");

    let session: any = null;
    try {
      session = await prisma.userSession.create({
        data: {
          userId: data.userId,
          sessionToken,
          ipAddress: data.ipAddress || "127.0.0.1",
          userAgent: data.userAgent || "Browser",
          deviceType: parsedUa.deviceType,
          browser: parsedUa.browser,
          os: parsedUa.os,
          expiresAt,
        },
      });
    } catch (err: any) {
      console.error("Failed to persist session in PostgreSQL:", err);
      const dbErr: any = new Error("Database session creation failed.");
      dbErr.statusCode = 500;
      throw dbErr;
    }

    const sessionPayload: SessionData = {
      sessionId: session.id,
      userId: data.userId,
      email: data.email,
      role: data.role,
      deviceType: parsedUa.deviceType,
      browser: parsedUa.browser,
      os: parsedUa.os,
      ipAddress: data.ipAddress || "127.0.0.1",
      expiresAt: expiresAt.toISOString(),
      isRevoked: false,
    };

    try {
      const ttlSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
      await redis.set(
        `session:${sessionToken}`,
        JSON.stringify(sessionPayload),
        "EX",
        ttlSeconds
      );
    } catch (_) {}

    return { sessionToken, expiresAt };
  }

  /**
   * Validates active session token from Redis cache or PostgreSQL
   */
  static async getSession(sessionToken: string): Promise<SessionData | null> {
    if (!sessionToken) return null;

    // 0. In-process LRU cache
    const lruHit = getCachedSession(sessionToken);
    if (lruHit) return lruHit;

    // 1. Try Redis cache
    try {
      const cached = await redis.get(`session:${sessionToken}`);
      if (cached) {
        const parsed: SessionData = JSON.parse(cached);
        if (parsed.isRevoked || new Date(parsed.expiresAt) < new Date()) {
          return null;
        }
        setCachedSession(sessionToken, parsed);
        return parsed;
      }
    } catch (_) {}

    // 2. Try PostgreSQL fallback
    try {
      const session = await prisma.userSession.findUnique({
        where: { sessionToken },
        include: {
          user: {
            select: { id: true, email: true, role: true, deletedAt: true },
          },
        },
      });

      if (session && !session.isRevoked && session.expiresAt >= new Date() && !session.user?.deletedAt) {
        const sessionPayload: SessionData = {
          sessionId: session.id,
          userId: session.user.id,
          email: session.user.email,
          role: session.user.role,
          deviceType: session.deviceType || "Desktop",
          browser: session.browser || "Browser",
          os: session.os || "OS",
          ipAddress: session.ipAddress || "127.0.0.1",
          expiresAt: session.expiresAt.toISOString(),
          isRevoked: session.isRevoked,
        };

        const ttlSeconds = Math.floor((session.expiresAt.getTime() - Date.now()) / 1000);
        if (ttlSeconds > 0) {
          redis.set(`session:${sessionToken}`, JSON.stringify(sessionPayload), "EX", ttlSeconds).catch(() => {});
        }

        setCachedSession(sessionToken, sessionPayload);
        return sessionPayload;
      }
    } catch (err: any) {
      console.error("Database query failed during session retrieval:", err);
      return null;
    }

    return null;
  }

  /**
   * Revokes specific session token
   */
  static async revokeSession(sessionToken: string): Promise<void> {
    if (!sessionToken) return;

    invalidateCachedSession(sessionToken);

    try {
      await redis.del(`session:${sessionToken}`);
    } catch (_) {}

    try {
      await prisma.userSession.updateMany({
        where: { sessionToken },
        data: { isRevoked: true },
      });
    } catch (_) {}
  }

  /**
   * Revokes all other sessions for user except current
   */
  static async revokeAllOtherSessions(userId: string, currentSessionToken: string): Promise<void> {
    try {
      const otherSessions = await prisma.userSession.findMany({
        where: {
          userId,
          sessionToken: { not: currentSessionToken },
          isRevoked: false,
        },
        select: { sessionToken: true },
      });

      for (const sess of otherSessions) {
        try {
          await redis.del(`session:${sess.sessionToken}`);
        } catch (_) {}
      }

      await prisma.userSession.updateMany({
        where: {
          userId,
          sessionToken: { not: currentSessionToken },
        },
        data: { isRevoked: true },
      });
    } catch (_) {}
  }

  /**
   * Retrieves active device sessions for user
   */
  static async getUserSessions(userId: string, currentSessionToken?: string) {
    try {
      const sessions = await prisma.userSession.findMany({
        where: {
          userId,
          isRevoked: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { lastActiveAt: "desc" },
      });

      return sessions.map((s) => ({
        id: s.id,
        deviceType: s.deviceType || "Desktop",
        browser: s.browser || "Unknown Browser",
        os: s.os || "Unknown OS",
        ipAddress: s.ipAddress || "Hidden IP",
        lastActiveAt: s.lastActiveAt,
        createdAt: s.createdAt,
        isCurrent: s.sessionToken === currentSessionToken,
      }));
    } catch (err) {
      console.error("Failed to fetch user sessions:", err);
      return [];
    }
  }
}
