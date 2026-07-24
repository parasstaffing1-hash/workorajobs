/**
 * ============================================================================
 * ENTERPRISE AUTHENTICATION CONTROLLER (PRODUCTION-GRADE)
 * Standardized Signup, Login, Password Reset, and Email Verification logic.
 * Zero demo/fallback mock users. Real DB & bcrypt validation.
 * ============================================================================
 */

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { SessionStore } from "@/lib/auth/session-store";
import { signJwt } from "@/lib/jwt";

export interface SignupInput {
  email: string;
  password: string;
  role?: "JOB_SEEKER" | "EMPLOYER" | "RECRUITER";
  name?: string;
  companyName?: string;
  companySize?: string;
  country?: string;
  location?: string;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export class EnterpriseAuthController {
  /**
   * Universal Signup Handler
   */
  static async signup(input: SignupInput, ipAddress = "127.0.0.1", userAgent = "Browser") {
    if (!input.email || !input.password) {
      const err: any = new Error("Email and password are required.");
      err.statusCode = 400;
      throw err;
    }

    const cleanEmail = input.email.toLowerCase().trim();

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: { id: true },
    }).catch((err) => {
      console.error("Database connection error during signup check:", err);
      const dbErr: any = new Error("Database service unavailable.");
      dbErr.statusCode = 500;
      throw dbErr;
    });

    if (existingUser) {
      const dupErr: any = new Error("An account with this email address already exists.");
      dupErr.statusCode = 409; // Conflict
      throw dupErr;
    }

    // 2. Hash password with bcrypt
    const passwordHash = await bcrypt.hash(input.password, 12);
    const role = input.role || "JOB_SEEKER";
    const name = input.name || input.companyName || cleanEmail.split("@")[0];

    // 3. Create real user record in PostgreSQL
    let user: any;
    try {
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          passwordHash,
          name,
          role,
          isEmailVerified: false,
          ...(role === "EMPLOYER"
            ? {
                employerProfile: {
                  create: {
                    companyName: input.companyName || `${name}'s Company`,
                    businessEmail: cleanEmail,
                  },
                },
              }
            : {
                profile: {
                  create: {
                    location: input.location || "Remote",
                  },
                },
              }),
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isEmailVerified: true,
        },
      });
    } catch (err: any) {
      console.error("Prisma user creation error:", err);
      const createErr: any = new Error("Failed to create user account. Please check database connectivity.");
      createErr.statusCode = 500;
      throw createErr;
    }

    // 4. Create verification token & audit log
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    Promise.all([
      prisma.passwordReset.create({
        data: {
          email: cleanEmail,
          tokenHash: crypto.createHash("sha256").update(verificationToken).digest("hex"),
          expiresAt,
        },
      }),
      prisma.auditLog.create({
        data: {
          userId: user.id,
          action: `USER_REGISTERED:${role}`,
          ipAddress,
          userAgent,
        },
      }),
    ]).catch(() => null);

    // 5. Create Session in DB/Redis
    const session = await SessionStore.createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      ipAddress,
      userAgent,
    });

    const accessToken = signJwt({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = crypto.randomBytes(40).toString("hex");

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
      refreshToken,
      sessionToken: session.sessionToken,
      verificationToken,
    };
  }

  /**
   * Universal Login Handler
   */
  static async login(input: LoginInput, ipAddress = "127.0.0.1", userAgent = "Browser") {
    if (!input.email || !input.password) {
      const err: any = new Error("Email and password are required.");
      err.statusCode = 400;
      throw err;
    }

    const cleanEmail = input.email.toLowerCase().trim();

    // 1. Fetch user from Database
    let dbUser: any;
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isEmailVerified: true,
          passwordHash: true,
          deletedAt: true,
        },
      });
    } catch (err: any) {
      console.error("Database connection error during login:", err);
      const dbErr: any = new Error("Database service unavailable.");
      dbErr.statusCode = 500;
      throw dbErr;
    }

    // 2. Reject if user does not exist, has no password, or is deleted
    if (!dbUser || !dbUser.passwordHash || dbUser.deletedAt) {
      const invalidErr: any = new Error("Invalid email or password.");
      invalidErr.statusCode = 401; // Unauthorized
      throw invalidErr;
    }

    // 3. Verify password with bcrypt
    const isMatch = await bcrypt.compare(input.password, dbUser.passwordHash).catch(() => false);
    if (!isMatch) {
      prisma.loginHistory.create({
        data: {
          userId: dbUser.id,
          email: cleanEmail,
          status: "FAILED_INVALID_PASSWORD",
          ipAddress,
          userAgent,
        },
      }).catch(() => null);

      const invalidErr: any = new Error("Invalid email or password.");
      invalidErr.statusCode = 401; // Unauthorized
      throw invalidErr;
    }

    // 4. Record successful login audit
    Promise.all([
      prisma.loginHistory.create({
        data: {
          userId: dbUser.id,
          email: dbUser.email,
          status: "SUCCESS",
          ipAddress,
          userAgent,
        },
      }),
      prisma.auditLog.create({
        data: {
          userId: dbUser.id,
          action: "USER_LOGGED_IN",
          ipAddress,
          userAgent,
        },
      }),
    ]).catch(() => null);

    // 5. Create Session & Tokens
    const session = await SessionStore.createSession({
      userId: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
      ipAddress,
      userAgent,
      rememberMe: input.rememberMe,
    });

    const accessToken = signJwt({ userId: dbUser.id, email: dbUser.email, role: dbUser.role });
    const refreshToken = crypto.randomBytes(40).toString("hex");

    return {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        isEmailVerified: dbUser.isEmailVerified,
      },
      accessToken,
      refreshToken,
      sessionToken: session.sessionToken,
    };
  }

  /**
   * Request Password Reset
   */
  static async requestPasswordReset(email: string, ipAddress = "127.0.0.1") {
    if (!email) {
      const err: any = new Error("Email address is required.");
      err.statusCode = 400;
      throw err;
    }

    const cleanEmail = email.toLowerCase().trim();
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    try {
      await prisma.passwordReset.create({
        data: {
          email: cleanEmail,
          tokenHash,
          expiresAt,
        },
      });
    } catch (_) {}

    return { success: true, resetToken };
  }

  /**
   * Perform Password Reset
   */
  static async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) {
      const err: any = new Error("Token and new password are required.");
      err.statusCode = 400;
      throw err;
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const record = await prisma.passwordReset.findFirst({
      where: { tokenHash, isUsed: false, expiresAt: { gt: new Date() } },
    }).catch(() => null);

    if (!record) {
      const err: any = new Error("Password reset token is invalid or expired.");
      err.statusCode = 400;
      throw err;
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email: record.email },
      data: { passwordHash },
    });

    await prisma.passwordReset.update({
      where: { id: record.id },
      data: { isUsed: true },
    });

    return { success: true };
  }

  /**
   * Verify Email Address
   */
  static async verifyEmail(token: string) {
    if (!token) {
      const err: any = new Error("Verification token is required.");
      err.statusCode = 400;
      throw err;
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const record = await prisma.passwordReset.findFirst({
      where: { tokenHash, isUsed: false, expiresAt: { gt: new Date() } },
    }).catch(() => null);

    if (!record) {
      const err: any = new Error("Verification token is invalid or expired.");
      err.statusCode = 400;
      throw err;
    }

    await prisma.user.update({
      where: { email: record.email },
      data: { isEmailVerified: true, emailVerifiedAt: new Date() },
    });

    await prisma.passwordReset.update({
      where: { id: record.id },
      data: { isUsed: true },
    });

    return { success: true };
  }
}
