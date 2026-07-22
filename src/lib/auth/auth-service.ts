import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signJwt, verifyJwt } from "@/lib/jwt";
import { RbacGuard, UserRole } from "./rbac";

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
   * Registers a new user with duplicate email check, password hashing, profile creation & audit log
   */
  static async register(data: {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
  }) {
    const normEmail = data.email.toLowerCase().trim();
    
    // Check duplicate email
    const existing = await prisma.user.findUnique({ where: { email: normEmail } });
    if (existing) {
      throw new Error("An account with this email already exists.");
    }

    const passwordHash = await this.hashPassword(data.password);
    const assignedRole = data.role || "JOB_SEEKER";

    const user = await prisma.user.create({
      data: {
        email: normEmail,
        passwordHash,
        name: data.name,
        role: assignedRole as any,
        profile: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_REGISTERED",
      },
    });

    return user;
  }

  /**
   * Logs in a user, generates access JWT (15m) and refresh token (30d) with token rotation
   */
  static async login(data: { email: string; password: string }) {
    const normEmail = data.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normEmail },
      include: { profile: true, employerProfile: true },
    });

    if (!user || !user.passwordHash || user.deletedAt) {
      throw new Error("Invalid email or password.");
    }

    const isMatch = await this.comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error("Invalid email or password.");
    }

    // Generate JWT access token (15m expiration)
    const accessToken = signJwt({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Generate Refresh token (30d expiration) & save hash in DB
    const refreshTokenRaw = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(refreshTokenRaw).digest("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_LOGGED_IN",
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.profile,
        employerProfile: user.employerProfile,
      },
      accessToken,
      refreshToken: refreshTokenRaw,
    };
  }

  /**
   * Refresh token rotation: exchanges valid refresh token for a new access token
   */
  static async refreshTokens(rawRefreshToken: string) {
    const tokenHash = crypto.createHash("sha256").update(rawRefreshToken).digest("hex");
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      throw new Error("Invalid or expired refresh token.");
    }

    // Revoke old token (Rotation)
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    // Issue new Access & Refresh Token pair
    const accessToken = signJwt({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    const newRawRefreshToken = crypto.randomBytes(32).toString("hex");
    const newTokenHash = crypto.createHash("sha256").update(newRawRefreshToken).digest("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
      data: {
        userId: storedToken.user.id,
        tokenHash: newTokenHash,
        expiresAt,
      },
    });

    return { accessToken, refreshToken: newRawRefreshToken };
  }

  /**
   * Invalidates active refresh token session on logout
   */
  static async logout(rawRefreshToken: string) {
    if (!rawRefreshToken) return;
    const tokenHash = crypto.createHash("sha256").update(rawRefreshToken).digest("hex");
    await prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { isRevoked: true },
    });
  }

  /**
   * Initiates password reset token creation
   */
  static async forgotPassword(email: string) {
    const normEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: normEmail } });
    if (!user) return { success: true }; // Prevent email enumeration

    const resetTokenRaw = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(resetTokenRaw).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordReset.create({
      data: {
        email: normEmail,
        tokenHash,
        expiresAt,
      },
    });

    return { success: true, resetToken: resetTokenRaw };
  }

  /**
   * Resets user password using reset token
   */
  static async resetPassword(resetTokenRaw: string, newPassword: string) {
    const tokenHash = crypto.createHash("sha256").update(resetTokenRaw).digest("hex");
    const resetRecord = await prisma.passwordReset.findUnique({ where: { tokenHash } });

    if (!resetRecord || resetRecord.isUsed || resetRecord.expiresAt < new Date()) {
      throw new Error("Invalid or expired password reset token.");
    }

    const passwordHash = await this.hashPassword(newPassword);

    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { passwordHash },
    });

    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { isUsed: true },
    });

    return { success: true };
  }
}
