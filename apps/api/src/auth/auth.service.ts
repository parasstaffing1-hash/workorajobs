import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { OAuthProvider, User, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { Request } from "express";
import { createHash, randomBytes } from "node:crypto";

import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { OAuthProviderName, OAuthService } from "./services/oauth.service";
import { AuthenticatedUser } from "./types/authenticated-user.type";
import { JwtPayload } from "./types/jwt-payload.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly audit: AuditService,
    private readonly oauth: OAuthService,
  ) {}

  async register(dto: RegisterDto, request: Request) {
    const email = dto.email.toLowerCase();
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const role =
      dto.role === UserRole.EMPLOYER ? UserRole.EMPLOYER : UserRole.CANDIDATE;

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
        status: UserStatus.PENDING_VERIFICATION,
        profile: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
          },
        },
      },
      include: {
        profile: true,
      },
    });
    const verificationToken = await this.createEmailVerificationToken(user.id);
    await this.audit.record({
      actorId: user.id,
      action: "auth.registered",
      entity: "User",
      entityId: user.id,
      request,
    });

    return {
      user: this.toPublicUser(user),
      emailVerificationTokenPreview: this.previewSecret(verificationToken),
    };
  }

  async login(dto: LoginDto, request: Request) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email.toLowerCase(),
      },
      include: {
        profile: true,
      },
    });

    if (
      !user?.passwordHash ||
      !(await bcrypt.compare(dto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    if (user.status === UserStatus.DISABLED) {
      throw new ForbiddenException("User account is disabled.");
    }

    const tokens = await this.createSessionAndTokens(user, request);
    await this.prisma.user.update({
      data: {
        lastLoginAt: new Date(),
      },
      where: {
        id: user.id,
      },
    });
    await this.audit.record({
      actorId: user.id,
      action: "auth.login",
      entity: "Session",
      entityId: tokens.sessionId,
      request,
    });

    return {
      user: this.toPublicUser(user),
      ...tokens,
    };
  }

  async refresh(refreshToken: string, request: Request) {
    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.config.getOrThrow<string>("auth.refreshSecret"),
      });
    } catch {
      throw new UnauthorizedException("Invalid refresh token.");
    }

    const session = await this.prisma.session.findFirst({
      where: {
        id: payload.sessionId,
        userId: payload.sub,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!session || session.refreshTokenHash !== this.hashToken(refreshToken)) {
      throw new UnauthorizedException("Refresh session is no longer valid.");
    }

    const tokens = await this.issueTokenPair(session.user, session.id);
    await this.prisma.session.update({
      data: {
        refreshTokenHash: this.hashToken(tokens.refreshToken),
        expiresAt: this.refreshExpiry(),
      },
      where: {
        id: session.id,
      },
    });
    await this.audit.record({
      actorId: session.userId,
      action: "auth.refresh",
      entity: "Session",
      entityId: session.id,
      request,
    });

    return tokens;
  }

  async logout(user: AuthenticatedUser, request: Request) {
    await this.revokeSession(user, user.sessionId, request);
    return {
      success: true,
    };
  }

  async forgotPassword(email: string, request: Request) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      return {
        success: true,
      };
    }

    const token = randomBytes(32).toString("base64url");
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(token),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    await this.audit.record({
      actorId: user.id,
      action: "auth.password_reset_requested",
      entity: "User",
      entityId: user.id,
      request,
    });

    return {
      success: true,
      resetTokenPreview: this.previewSecret(token),
    };
  }

  async resetPassword(dto: ResetPasswordDto, request: Request) {
    const tokenHash = this.hashToken(dto.token);
    const token = await this.prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!token)
      throw new BadRequestException("Invalid or expired reset token.");

    await this.prisma.$transaction([
      this.prisma.user.update({
        data: {
          passwordHash: await bcrypt.hash(dto.password, 12),
        },
        where: {
          id: token.userId,
        },
      }),
      this.prisma.passwordResetToken.update({
        data: {
          usedAt: new Date(),
        },
        where: {
          id: token.id,
        },
      }),
      this.prisma.session.updateMany({
        data: {
          revokedAt: new Date(),
        },
        where: {
          userId: token.userId,
          revokedAt: null,
        },
      }),
    ]);
    await this.audit.record({
      actorId: token.userId,
      action: "auth.password_reset_completed",
      entity: "User",
      entityId: token.userId,
      request,
    });

    return {
      success: true,
    };
  }

  async verifyEmail(token: string, request: Request) {
    const verificationToken =
      await this.prisma.emailVerificationToken.findFirst({
        where: {
          tokenHash: this.hashToken(token),
          usedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

    if (!verificationToken) {
      throw new BadRequestException(
        "Invalid or expired email verification token.",
      );
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        data: {
          status: UserStatus.ACTIVE,
          emailVerifiedAt: new Date(),
        },
        where: {
          id: verificationToken.userId,
        },
      }),
      this.prisma.emailVerificationToken.update({
        data: {
          usedAt: new Date(),
        },
        where: {
          id: verificationToken.id,
        },
      }),
    ]);
    await this.audit.record({
      actorId: verificationToken.userId,
      action: "auth.email_verified",
      entity: "User",
      entityId: verificationToken.userId,
      request,
    });

    return {
      success: true,
    };
  }

  getOAuthRedirectUrl(provider: OAuthProviderName) {
    return this.oauth.getAuthorizationUrl(provider);
  }

  async handleOAuthCallback(
    provider: OAuthProviderName,
    code: string,
    state: string,
    request: Request,
  ) {
    if (!code || !state)
      throw new BadRequestException("OAuth code and state are required.");
    const profile = await this.oauth.exchangeCodeForProfile(
      provider,
      code,
      state,
    );
    const user = await this.upsertOAuthUser(profile);
    const tokens = await this.createSessionAndTokens(user, request);
    await this.audit.record({
      actorId: user.id,
      action: `auth.oauth.${provider}`,
      entity: "Session",
      entityId: tokens.sessionId,
      request,
    });

    return {
      user: this.toPublicUser(user),
      ...tokens,
    };
  }

  async listSessions(userId: string) {
    return this.prisma.session.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        userAgent: true,
        ipAddress: true,
        expiresAt: true,
        revokedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        userId,
      },
    });
  }

  async revokeSession(
    user: AuthenticatedUser,
    sessionId: string,
    request: Request,
  ) {
    const session = await this.prisma.session.findFirst({
      where: {
        id: sessionId,
        userId: user.sub,
      },
    });
    if (!session) throw new NotFoundException("Session not found.");

    await this.prisma.session.update({
      data: {
        revokedAt: new Date(),
      },
      where: {
        id: sessionId,
      },
    });
    await this.audit.record({
      actorId: user.sub,
      action: "auth.session_revoked",
      entity: "Session",
      entityId: sessionId,
      request,
    });

    return {
      success: true,
    };
  }

  private async upsertOAuthUser(profile: {
    provider: OAuthProvider;
    providerAccountId: string;
    email: string;
    firstName: string;
    lastName: string;
  }) {
    const existingAccount = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: profile.provider,
          providerAccountId: profile.providerAccountId,
        },
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (existingAccount) return existingAccount.user;

    return this.prisma.user.upsert({
      create: {
        email: profile.email,
        role: UserRole.CANDIDATE,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
        oauthAccounts: {
          create: {
            provider: profile.provider,
            providerAccountId: profile.providerAccountId,
          },
        },
        profile: {
          create: {
            firstName: profile.firstName,
            lastName: profile.lastName,
          },
        },
      },
      include: {
        profile: true,
      },
      update: {
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
        oauthAccounts: {
          connectOrCreate: {
            create: {
              provider: profile.provider,
              providerAccountId: profile.providerAccountId,
            },
            where: {
              provider_providerAccountId: {
                provider: profile.provider,
                providerAccountId: profile.providerAccountId,
              },
            },
          },
        },
      },
      where: {
        email: profile.email,
      },
    });
  }

  private async createSessionAndTokens(user: User, request: Request) {
    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: "pending",
        expiresAt: this.refreshExpiry(),
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
      },
    });
    const tokens = await this.issueTokenPair(user, session.id);
    await this.prisma.session.update({
      data: {
        refreshTokenHash: this.hashToken(tokens.refreshToken),
      },
      where: {
        id: session.id,
      },
    });

    return tokens;
  }

  private async issueTokenPair(user: User, sessionId: string) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.getOrThrow<string>("auth.accessSecret"),
        expiresIn: this.config.getOrThrow<string>("auth.accessExpiresIn"),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.getOrThrow<string>("auth.refreshSecret"),
        expiresIn: this.config.getOrThrow<string>("auth.refreshExpiresIn"),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: this.config.getOrThrow<string>("auth.accessExpiresIn"),
      sessionId,
    };
  }

  private async createEmailVerificationToken(userId: string) {
    const token = randomBytes(32).toString("base64url");
    await this.prisma.emailVerificationToken.create({
      data: {
        userId,
        tokenHash: this.hashToken(token),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    return token;
  }

  private refreshExpiry() {
    return new Date(
      Date.now() +
        this.durationToMs(
          this.config.getOrThrow<string>("auth.refreshExpiresIn"),
        ),
    );
  }

  private durationToMs(value: string) {
    const match = value.match(/^(\d+)(s|m|h|d)$/);
    if (!match) return 30 * 24 * 60 * 60 * 1000;
    const amount = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return amount * multipliers[unit];
  }

  private hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }

  private previewSecret(secret: string) {
    return this.config.getOrThrow<string>("app.nodeEnv") === "production"
      ? undefined
      : secret;
  }

  private toPublicUser(user: User & { profile?: unknown }) {
    const { passwordHash, ...safeUser } = user;
    void passwordHash;
    return safeUser;
  }
}
