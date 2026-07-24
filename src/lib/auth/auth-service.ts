import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signJwt, verifyJwt } from "@/lib/jwt";
import { SessionStore } from "./session-store";
import { AuthRateLimiter } from "./rate-limiter";
import { UserRole } from "./rbac";

export class AuthService {
  /**
   * Hashes plain text password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /**
   * Compares plain password with stored hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Registers a new Job Seeker account with email verification token, password hashing, and audit log
   */
  static async registerJobSeeker(data: {
    email: string;
    password: string;
    name: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const normEmail = data.email.toLowerCase().trim();

    // 1. Rate Limiting Check for Signup
    const rateLimit = await AuthRateLimiter.check("signup", data.ipAddress || normEmail, 5, 3600);
    if (!rateLimit.allowed) {
      throw new Error(`Too many registration attempts. Please try again in 1 hour.`);
    }

    // 2. Check duplicate email
    const existing = await prisma.user.findUnique({ where: { email: normEmail } });
    if (existing) {
      throw new Error("An account with this email address already exists. Please login instead.");
    }

    const passwordHash = await this.hashPassword(data.password);

    // 3. Create User & Profile
    const user = await prisma.user.create({
      data: {
        email: normEmail,
        passwordHash,
        name: data.name.trim(),
        role: "JOB_SEEKER",
        isEmailVerified: false,
        profile: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    // 4. Generate Email Verification Token (Expires in 24 hours)
    const verificationTokenRaw = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(verificationTokenRaw).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.emailVerification.create({
      data: {
        email: normEmail,
        tokenHash,
        expiresAt,
      },
    });

    // 5. Create Audit Log & Activity Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "JOB_SEEKER_REGISTERED",
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });

    return {
      user,
      verificationToken: verificationTokenRaw,
    };
  }

  /**
   * Enterprise Login for Job Seekers with Rate Limiting, Device Tracking & Session Management
   */
  static async loginJobSeeker(data: {
    email: string;
    password: string;
    rememberMe?: boolean;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const normEmail = data.email.toLowerCase().trim();
    const rateKey = `${data.ipAddress || "ip"}:${normEmail}`;

    // 1. Rate Limiting Check (5 failed attempts per 15 minutes)
    const rateLimit = await AuthRateLimiter.check("login", rateKey, 5, 900);
    if (!rateLimit.allowed) {
      // Record Failed Login History
      await prisma.loginHistory.create({
        data: {
          email: normEmail,
          status: "FAILED_RATE_LIMITED",
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          failureReason: "Too many failed attempts. Rate limited.",
        },
      });
      throw new Error("Account temporarily locked due to multiple failed login attempts. Please try again in 15 minutes.");
    }

    const user = await prisma.user.findUnique({
      where: { email: normEmail },
      include: { profile: true, employerProfile: true, twoFactor: true },
    });

    if (!user || !user.passwordHash || user.deletedAt) {
      await prisma.loginHistory.create({
        data: {
          email: normEmail,
          status: "FAILED_INVALID_PASSWORD",
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          failureReason: "Invalid email or password",
        },
      });
      throw new Error("Invalid email or password.");
    }

    const isMatch = await this.comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      await prisma.loginHistory.create({
        data: {
          userId: user.id,
          email: normEmail,
          status: "FAILED_INVALID_PASSWORD",
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          failureReason: "Invalid password",
        },
      });
      throw new Error("Invalid email or password.");
    }

    // 2. Check 2FA if enabled
    if (user.twoFactor && user.twoFactor.isEnabled) {
      return {
        requiresTwoFactor: true,
        userId: user.id,
        email: user.email,
      };
    }

    // 3. Clear rate limiter counter on success
    await AuthRateLimiter.reset("login", rateKey);

    // 4. Generate JWT Access Token (15m expiration)
    const accessToken = signJwt({
      userId: user.id,
      email: user.email,
      role: user.role,
    }, 900);

    // 5. Generate Refresh Token (30d expiration) & Save in DB
    const refreshTokenRaw = crypto.randomBytes(32).toString("hex");
    const refreshTokenHash = crypto.createHash("sha256").update(refreshTokenRaw).digest("hex");
    const refreshExpiresAt = new Date(Date.now() + (data.rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt: refreshExpiresAt,
      },
    });

    // 6. Create Device Session in Redis & DB
    const session = await SessionStore.createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      rememberMe: data.rememberMe,
    });

    // 7. Log Success Login History & Audit Log
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        email: normEmail,
        status: "SUCCESS",
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "JOB_SEEKER_LOGGED_IN",
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });

    return {
      requiresTwoFactor: false,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        profile: user.profile,
      },
      accessToken,
      refreshToken: refreshTokenRaw,
      sessionToken: session.sessionToken,
    };
  }

  /**
   * Verifies Email Address using raw verification token
   */
  static async verifyEmail(tokenRaw: string) {
    const tokenHash = crypto.createHash("sha256").update(tokenRaw).digest("hex");
    const record = await prisma.emailVerification.findUnique({
      where: { tokenHash },
    });

    if (!record || record.isVerified || record.expiresAt < new Date()) {
      throw new Error("Invalid or expired email verification token.");
    }

    // Mark user verified
    const user = await prisma.user.update({
      where: { email: record.email },
      data: {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    // Mark token as verified
    await prisma.emailVerification.update({
      where: { id: record.id },
      data: { isVerified: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "EMAIL_VERIFIED",
      },
    });

    return { success: true, user };
  }

  /**
   * Resends verification email token
   */
  static async resendVerificationEmail(email: string, ipAddress?: string) {
    const normEmail = email.toLowerCase().trim();

    // Rate Limiting Check (3 attempts per hour)
    const rateLimit = await AuthRateLimiter.check("resend_verify", normEmail, 3, 3600);
    if (!rateLimit.allowed) {
      throw new Error("Too many verification requests. Please check your inbox or try again in 1 hour.");
    }

    const user = await prisma.user.findUnique({ where: { email: normEmail } });
    if (!user) return { success: true }; // Prevent email enumeration

    if (user.isEmailVerified) {
      return { success: true, message: "Your email address is already verified." };
    }

    const verificationTokenRaw = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(verificationTokenRaw).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.emailVerification.create({
      data: {
        email: normEmail,
        tokenHash,
        expiresAt,
      },
    });

    return { success: true, verificationToken: verificationTokenRaw };
  }

  /**
   * Initiates Password Reset flow with token generation
   */
  static async forgotPassword(email: string, ipAddress?: string) {
    const normEmail = email.toLowerCase().trim();

    // Rate limit password reset requests (3 per hour per email)
    const rateLimit = await AuthRateLimiter.check("forgot_password", normEmail, 3, 3600);
    if (!rateLimit.allowed) {
      throw new Error("Too many password reset requests. Please check your email inbox or try again in 1 hour.");
    }

    const user = await prisma.user.findUnique({ where: { email: normEmail } });
    if (!user) return { success: true }; // Prevent enumeration

    const resetTokenRaw = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(resetTokenRaw).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

    await prisma.passwordReset.create({
      data: {
        email: normEmail,
        tokenHash,
        expiresAt,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "PASSWORD_RESET_REQUESTED",
        ipAddress,
      },
    });

    return { success: true, resetToken: resetTokenRaw };
  }

  /**
   * Resets password using token and revokes all active sessions for security
   */
  static async resetPassword(resetTokenRaw: string, newPassword: string) {
    const tokenHash = crypto.createHash("sha256").update(resetTokenRaw).digest("hex");
    const resetRecord = await prisma.passwordReset.findUnique({ where: { tokenHash } });

    if (!resetRecord || resetRecord.isUsed || resetRecord.expiresAt < new Date()) {
      throw new Error("Invalid or expired password reset link. Please request a new link.");
    }

    const passwordHash = await this.hashPassword(newPassword);

    const user = await prisma.user.update({
      where: { email: resetRecord.email },
      data: { passwordHash },
    });

    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { isUsed: true },
    });

    // Revoke all active sessions and refresh tokens for security
    await prisma.refreshToken.updateMany({
      where: { userId: user.id },
      data: { isRevoked: true },
    });

    await prisma.userSession.updateMany({
      where: { userId: user.id },
      data: { isRevoked: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "PASSWORD_RESET_COMPLETED",
      },
    });

    return { success: true };
  }

  /**
   * Exchanges valid refresh token for a new access token & refresh token pair (Rotation)
   */
  static async refreshTokens(rawRefreshToken: string) {
    const tokenHash = crypto.createHash("sha256").update(rawRefreshToken).digest("hex");
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      throw new Error("Invalid or expired refresh token. Please login again.");
    }

    // Revoke old token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    const accessToken = signJwt({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    }, 900);

    const newRawRefreshToken = crypto.randomBytes(32).toString("hex");
    const newTokenHash = crypto.createHash("sha256").update(newRawRefreshToken).digest("hex");

    await prisma.refreshToken.create({
      data: {
        userId: storedToken.user.id,
        tokenHash: newTokenHash,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken: newRawRefreshToken };
  }

  /**
   * Handles user logout by revoking session and refresh token
   */
  static async logout(sessionToken?: string, refreshTokenRaw?: string) {
    if (sessionToken) {
      await SessionStore.revokeSession(sessionToken);
    }
    if (refreshTokenRaw) {
      const tokenHash = crypto.createHash("sha256").update(refreshTokenRaw).digest("hex");
      await prisma.refreshToken.updateMany({
        where: { tokenHash },
        data: { isRevoked: true },
      });
    }
  }

  /**
   * Handle OAuth (Google / LinkedIn) login or auto-registration
   */
  static async handleOAuthLogin(data: {
    provider: "google" | "linkedin";
    providerAccountId: string;
    email: string;
    name: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const normEmail = data.email.toLowerCase().trim();

    let user = await prisma.user.findUnique({
      where: { email: normEmail },
      include: { profile: true, oauthAccounts: true },
    });

    if (!user) {
      // Auto-register via OAuth
      user = await prisma.user.create({
        data: {
          email: normEmail,
          name: data.name,
          role: "JOB_SEEKER",
          isEmailVerified: true, // OAuth provider verifies email
          emailVerifiedAt: new Date(),
          profile: { create: {} },
          oauthAccounts: {
            create: {
              provider: data.provider,
              providerAccountId: data.providerAccountId,
            },
          },
        },
        include: { profile: true, oauthAccounts: true },
      });
    } else {
      // Check if OAuth account is linked
      const existingAccount = user.oauthAccounts.find(
        (acc) => acc.provider === data.provider && acc.providerAccountId === data.providerAccountId
      );
      if (!existingAccount) {
        await prisma.oAuthAccount.create({
          data: {
            userId: user.id,
            provider: data.provider,
            providerAccountId: data.providerAccountId,
          },
        });
      }
    }

    const accessToken = signJwt({
      userId: user.id,
      email: user.email,
      role: user.role,
    }, 900);

    const session = await SessionStore.createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      rememberMe: true,
    });

    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        email: normEmail,
        status: "SUCCESS",
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        profile: user.profile,
      },
      accessToken,
      sessionToken: session.sessionToken,
    };
  }
}
