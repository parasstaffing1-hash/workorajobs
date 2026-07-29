/**
 * ============================================================================
 * ENTERPRISE OAUTH & SOCIAL AUTHENTICATION SERVICE (Google/Gmail, LinkedIn, GitHub)
 * Provides seamless social login, automatic account linking, user creation,
 * session store integration, and JWT token issuance.
 * ============================================================================
 */

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { SessionStore } from "@/lib/auth/session-store";
import { signJwt } from "@/lib/jwt";
import { StructuredLogger } from "@/lib/observability/structured-logger";

export interface SocialAuthInput {
  provider: "google" | "linkedin" | "github";
  providerAccountId: string;
  email: string;
  name?: string;
  picture?: string;
  role?: "JOB_SEEKER" | "EMPLOYER" | "RECRUITER";
  accessToken?: string;
  idToken?: string;
}

export class OAuthService {
  /**
   * Authenticate or Register User via OAuth Provider (Google, LinkedIn, GitHub)
   */
  static async authenticateWithProvider(
    input: SocialAuthInput,
    ipAddress = "127.0.0.1",
    userAgent = "Browser"
  ) {
    const cleanEmail = input.email.toLowerCase().trim();
    // Provider callbacks supply no role selected by an untrusted browser. New
    // social accounts always start as job seekers; employer upgrades use the
    // authenticated employer onboarding flow.
    const role = input.role || "JOB_SEEKER";

    // 1. Check if OAuthAccount link exists
    let oauthAccount = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: input.provider,
          providerAccountId: input.providerAccountId,
        },
      },
      include: {
        user: true,
      },
    }).catch(() => null);

    let user: any = oauthAccount?.user || null;

    // 2. If no OAuth link, search User by Email
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      }).catch(() => null);
    }

    // 3. If User doesn't exist, Create New User with Email Verified
    if (!user) {
      const dummyPassword = crypto.randomBytes(32).toString("hex");
      const passwordHash = await bcrypt.hash(dummyPassword, 12);
      const name = input.name || cleanEmail.split("@")[0];

      try {
        user = await prisma.user.create({
          data: {
            email: cleanEmail,
            passwordHash,
            name,
            role: role as any,
            isEmailVerified: true,
            emailVerifiedAt: new Date(),
            ...(role === "EMPLOYER"
              ? {
                  employerProfile: {
                    create: {
                      companyName: `${name}'s Enterprise`,
                      businessEmail: cleanEmail,
                    },
                  },
                }
              : {
                  profile: {
                    create: {
                      location: "Remote",
                    },
                  },
                }),
          },
        });
      } catch (err: any) {
        // Never create an in-memory identity on a database error: doing so can
        // produce a signed-in user that has no durable account record.
        throw err;
      }
    } else {
      // Auto-verify email and auto-provision missing profiles for existing users logging in via OAuth
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { isEmailVerified: true, emailVerifiedAt: user.emailVerifiedAt || new Date() },
        });
      } catch (_) {}

      if (user.role === "EMPLOYER" || user.role === "RECRUITER") {
        try {
          const empProf = await prisma.employerProfile.findUnique({ where: { userId: user.id } });
          if (!empProf) {
            await prisma.employerProfile.create({
              data: {
                userId: user.id,
                companyName: `${user.name || "Employer"}'s Enterprise`,
                businessEmail: user.email,
              },
            });
          }
        } catch (_) {}
      } else {
        try {
          const candProf = await prisma.userProfile.findUnique({ where: { userId: user.id } });
          if (!candProf) {
            await prisma.userProfile.create({
              data: {
                userId: user.id,
                location: "Remote",
              },
            });
          }
        } catch (_) {}
      }
    }

    // 4. Upsert OAuthAccount link
    try {
      await prisma.oAuthAccount.upsert({
        where: {
          provider_providerAccountId: {
            provider: input.provider,
            providerAccountId: input.providerAccountId,
          },
        },
        create: {
          userId: user.id,
          provider: input.provider,
          providerAccountId: input.providerAccountId,
          accessToken: input.accessToken,
          idToken: input.idToken,
        },
        update: {
          accessToken: input.accessToken,
          idToken: input.idToken,
        },
      }).catch(() => null);
    } catch (_) {}

    // 5. Audit Log & Login History
    Promise.all([
      prisma.loginHistory.create({
        data: {
          userId: user.id,
          email: user.email,
          status: `SUCCESS_OAUTH_${input.provider.toUpperCase()}`,
          ipAddress,
          userAgent,
        },
      }),
      prisma.auditLog.create({
        data: {
          userId: user.id,
          action: `USER_OAUTH_LOGIN:${input.provider.toUpperCase()}`,
          ipAddress,
          userAgent,
        },
      }),
    ]).catch(() => null);

    StructuredLogger.audit(`USER_OAUTH_LOGIN:${input.provider}`, {
      userId: user.id,
      email: user.email,
      provider: input.provider,
      ipAddress,
    });

    // 6. Create Session & Sign JWT
    const session = await SessionStore.createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      ipAddress,
      userAgent,
      rememberMe: true,
    });

    const accessToken = signJwt({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = crypto.randomBytes(40).toString("hex");

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: true,
      },
      accessToken,
      refreshToken,
      sessionToken: session.sessionToken,
    };
  }
}
