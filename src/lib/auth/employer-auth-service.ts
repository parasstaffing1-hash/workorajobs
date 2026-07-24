import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { SessionStore } from "@/lib/auth/session-store";
import { EmployerSignupInput, EmployerLoginInput } from "@/lib/auth/employer-validation-schemas";

const SALT_ROUNDS = 12;

export class EmployerAuthService {
  /**
   * Register a new Employer account with Company & EmployerProfile
   */
  static async registerEmployer(
    input: EmployerSignupInput,
    ipAddress?: string,
    userAgent?: string
  ) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.businessEmail.toLowerCase() },
    });

    if (existingUser) {
      throw new Error("An account with this business email address already exists.");
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    // Auto-link to matching domain company if exists
    const emailDomain = input.businessEmail.split("@")[1]?.toLowerCase();
    let company = null;
    if (emailDomain && !["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"].includes(emailDomain)) {
      company = await prisma.company.findFirst({
        where: { officialDomain: emailDomain },
      });
    }

    // Create User with Role.EMPLOYER and EmployerProfile
    const user = await prisma.user.create({
      data: {
        email: input.businessEmail.toLowerCase(),
        passwordHash,
        name: input.companyName,
        role: "EMPLOYER",
        isEmailVerified: false,
        employerProfile: {
          create: {
            companyName: input.companyName,
            businessEmail: input.businessEmail.toLowerCase(),
            phone: input.phone,
            companyId: company ? company.id : undefined,
          },
        },
      },
      include: {
        employerProfile: true,
      },
    });

    // Create Email Verification Token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(verificationToken).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.passwordReset.create({
      data: {
        email: user.email,
        tokenHash,
        expiresAt,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "EMPLOYER_REGISTERED",
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyName: user.employerProfile?.companyName,
      },
      verificationToken,
    };
  }

  /**
   * Employer Login
   */
  static async loginEmployer(
    input: EmployerLoginInput,
    ipAddress?: string,
    userAgent?: string
  ) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: { employerProfile: true },
    });

    if (!user || !user.passwordHash || user.role !== "EMPLOYER") {
      if (user) {
        await prisma.loginHistory.create({
          data: {
            userId: user.id,
            email: input.email,
            status: "FAILED_INVALID_ROLE",
            ipAddress,
            userAgent,
            failureReason: "User is not an employer account",
          },
        });
      }
      throw new Error("Invalid business email or password.");
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      await prisma.loginHistory.create({
        data: {
          userId: user.id,
          email: input.email,
          status: "FAILED_INVALID_PASSWORD",
          ipAddress,
          userAgent,
          failureReason: "Invalid password",
        },
      });
      throw new Error("Invalid business email or password.");
    }

    // Record Login History
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        email: user.email,
        status: "SUCCESS",
        ipAddress,
        userAgent,
      },
    });

    // Create Session
    const session = await SessionStore.createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      ipAddress,
      userAgent,
      rememberMe: input.rememberMe,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        companyName: user.employerProfile?.companyName,
      },
      sessionToken: session.sessionToken,
    };
  }

  /**
   * Generate Phone OTP for Employer
   */
  static async sendPhoneOtp(userId: string) {
    const employerProfile = await prisma.employerProfile.findUnique({
      where: { userId },
    });

    if (!employerProfile || !employerProfile.phone) {
      throw new Error("Phone number not registered for employer profile.");
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const phoneOtpHash = await bcrypt.hash(otpCode, 8);
    const phoneOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.employerProfile.update({
      where: { userId },
      data: {
        phoneOtpHash,
        phoneOtpExpiresAt,
      },
    });

    return { success: true, otpCode }; // Return OTP code for demo/testing
  }

  /**
   * Verify Phone OTP
   */
  static async verifyPhoneOtp(userId: string, otpCode: string) {
    const employerProfile = await prisma.employerProfile.findUnique({
      where: { userId },
    });

    if (!employerProfile || !employerProfile.phoneOtpHash || !employerProfile.phoneOtpExpiresAt) {
      throw new Error("No pending phone OTP verification request.");
    }

    if (new Date() > employerProfile.phoneOtpExpiresAt) {
      throw new Error("Phone OTP code has expired. Please request a new OTP.");
    }

    const isMatch = await bcrypt.compare(otpCode, employerProfile.phoneOtpHash);
    if (!isMatch) {
      throw new Error("Invalid OTP code.");
    }

    await prisma.employerProfile.update({
      where: { userId },
      data: {
        isPhoneVerified: true,
        phoneOtpHash: null,
        phoneOtpExpiresAt: null,
      },
    });

    return true;
  }
}
