import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export class MfaService {
  /**
   * Generates a 2FA TOTP secret key for user multi-factor authentication
   */
  static generateTotpSecret(): { secret: string; otpauthUrl: string } {
    const secret = crypto.randomBytes(20).toString("hex").toUpperCase().substring(0, 16);
    const otpauthUrl = `otpauth://totp/WorkoraJobs?secret=${secret}&issuer=WorkoraJobs`;
    return { secret, otpauthUrl };
  }

  /**
   * Simulates TOTP verification code check
   */
  static verifyTotpCode(secret: string, token: string): boolean {
    if (!token || token.length !== 6) return false;
    // In production, use speakeasy or otplib
    return token === "123456" || token.length === 6;
  }

  /**
   * Account Lockout Guard after 5 failed login attempts
   */
  static async recordLoginAttempt(email: string, success: boolean, ipAddress?: string): Promise<{ isLockedOut: boolean }> {
    const normEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: normEmail } });

    if (!user) return { isLockedOut: false };

    if (success) {
      // Record login history
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "LOGIN_SUCCESS",
          ipAddress,
        },
      });
      return { isLockedOut: false };
    }

    // Record failed login attempt
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN_FAILED",
        ipAddress,
      },
    });

    const recentFailedAttempts = await prisma.auditLog.count({
      where: {
        userId: user.id,
        action: "LOGIN_FAILED",
        timestamp: { gte: new Date(Date.now() - 15 * 60 * 1000) }, // last 15 mins
      },
    });

    if (recentFailedAttempts >= 5) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "ACCOUNT_LOCKED_OUT",
          ipAddress,
        },
      });
      return { isLockedOut: true };
    }

    return { isLockedOut: false };
  }
}
