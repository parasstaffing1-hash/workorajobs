import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { Request, Response } from "express";

import { CurrentUser } from "../common/decorators/current-user.decorator";
import { CsrfProtected } from "../security/decorators/csrf-protected.decorator";
import { CsrfGuard } from "../security/guards/csrf.guard";
import { CsrfService } from "../security/services/csrf.service";
import { AuthenticatedUser } from "./types/authenticated-user.type";
import { AuthService } from "./auth.service";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly csrf: CsrfService,
    private readonly config: ConfigService,
  ) {}

  @Get("csrf-token")
  async csrfToken(@Res({ passthrough: true }) response: Response) {
    const token = await this.csrf.createToken();
    response.cookie("workora_csrf", token.token, {
      httpOnly: false,
      sameSite: "lax",
      secure: this.config.getOrThrow<string>("app.nodeEnv") === "production",
      maxAge: token.expiresInSeconds * 1000,
    });
    return {
      csrfToken: token.token,
      expiresInSeconds: token.expiresInSeconds,
    };
  }

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post("register")
  register(@Body() dto: RegisterDto, @Req() request: Request) {
    return this.auth.register(dto, request);
  }

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post("login")
  login(@Body() dto: LoginDto, @Req() request: Request) {
    return this.auth.login(dto, request);
  }

  @CsrfProtected()
  @UseGuards(CsrfGuard)
  @Post("refresh")
  refresh(@Body() dto: RefreshTokenDto, @Req() request: Request) {
    return this.auth.refresh(dto.refreshToken, request);
  }

  @ApiBearerAuth()
  @CsrfProtected()
  @UseGuards(JwtAuthGuard, CsrfGuard)
  @Post("logout")
  logout(@CurrentUser() user: AuthenticatedUser, @Req() request: Request) {
    return this.auth.logout(user, request);
  }

  @Throttle({ default: { ttl: 60_000, limit: 3 } })
  @Post("forgot-password")
  forgotPassword(@Body() dto: ForgotPasswordDto, @Req() request: Request) {
    return this.auth.forgotPassword(dto.email, request);
  }

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post("reset-password")
  resetPassword(@Body() dto: ResetPasswordDto, @Req() request: Request) {
    return this.auth.resetPassword(dto, request);
  }

  @Post("verify-email")
  verifyEmail(@Body() dto: VerifyEmailDto, @Req() request: Request) {
    return this.auth.verifyEmail(dto.token, request);
  }

  @Get("google")
  async google(@Res() response: Response) {
    const url = await this.auth.getOAuthRedirectUrl("google");
    return response.redirect(url);
  }

  @Get("google/callback")
  googleCallback(
    @Req() request: Request,
    @Query("code") code: string,
    @Query("state") state: string,
  ) {
    return this.auth.handleOAuthCallback("google", code, state, request);
  }

  @Get("linkedin")
  async linkedin(@Res() response: Response) {
    const url = await this.auth.getOAuthRedirectUrl("linkedin");
    return response.redirect(url);
  }

  @Get("linkedin/callback")
  linkedinCallback(
    @Req() request: Request,
    @Query("code") code: string,
    @Query("state") state: string,
  ) {
    return this.auth.handleOAuthCallback("linkedin", code, state, request);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("sessions")
  sessions(@CurrentUser() user: AuthenticatedUser) {
    return this.auth.listSessions(user.sub);
  }

  @ApiBearerAuth()
  @CsrfProtected()
  @UseGuards(JwtAuthGuard, CsrfGuard)
  @Delete("sessions/:sessionId")
  revokeSession(
    @CurrentUser() user: AuthenticatedUser,
    @Param("sessionId") sessionId: string,
    @Req() request: Request,
  ) {
    return this.auth.revokeSession(user, sessionId, request);
  }
}
