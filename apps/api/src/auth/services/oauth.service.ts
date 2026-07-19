import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OAuthProvider } from "@prisma/client";
import { randomBytes } from "node:crypto";

import { RedisService } from "../../redis/redis.service";

export type OAuthProviderName = "google" | "linkedin";

export type ExternalOAuthProfile = {
  provider: OAuthProvider;
  providerAccountId: string;
  email: string;
  firstName: string;
  lastName: string;
};

type OAuthTokenResponse = {
  access_token?: string;
  id_token?: string;
  token_type?: string;
  expires_in?: number;
};

type OAuthUserInfo = {
  sub?: string;
  id?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
};

const STATE_TTL_SECONDS = 10 * 60;

@Injectable()
export class OAuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {}

  async getAuthorizationUrl(provider: OAuthProviderName) {
    const state = randomBytes(24).toString("base64url");
    await this.redis.set(`oauth_state:${state}`, provider, STATE_TTL_SECONDS);

    if (provider === "google") {
      const clientId = this.config.get<string>("oauth.google.clientId");
      const callbackUrl = this.config.getOrThrow<string>(
        "oauth.google.callbackUrl",
      );
      if (!clientId)
        throw new ServiceUnavailableException(
          "Google OAuth is not configured.",
        );

      const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      url.searchParams.set("client_id", clientId);
      url.searchParams.set("redirect_uri", callbackUrl);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", "openid email profile");
      url.searchParams.set("state", state);
      url.searchParams.set("access_type", "offline");
      url.searchParams.set("prompt", "consent");
      return url.toString();
    }

    const clientId = this.config.get<string>("oauth.linkedin.clientId");
    const callbackUrl = this.config.getOrThrow<string>(
      "oauth.linkedin.callbackUrl",
    );
    if (!clientId)
      throw new ServiceUnavailableException(
        "LinkedIn OAuth is not configured.",
      );

    const url = new URL("https://www.linkedin.com/oauth/v2/authorization");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", callbackUrl);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid profile email");
    url.searchParams.set("state", state);
    return url.toString();
  }

  async exchangeCodeForProfile(
    provider: OAuthProviderName,
    code: string,
    state: string,
  ): Promise<ExternalOAuthProfile> {
    const savedProvider = await this.redis.get(`oauth_state:${state}`);
    if (savedProvider !== provider) {
      throw new BadRequestException("Invalid OAuth state.");
    }
    await this.redis.del(`oauth_state:${state}`);

    if (provider === "google") {
      return this.exchangeGoogleCode(code);
    }

    return this.exchangeLinkedInCode(code);
  }

  private async exchangeGoogleCode(
    code: string,
  ): Promise<ExternalOAuthProfile> {
    const token = await this.fetchToken("https://oauth2.googleapis.com/token", {
      client_id: this.config.getOrThrow<string>("oauth.google.clientId"),
      client_secret: this.config.getOrThrow<string>(
        "oauth.google.clientSecret",
      ),
      redirect_uri: this.config.getOrThrow<string>("oauth.google.callbackUrl"),
      grant_type: "authorization_code",
      code,
    });
    const userInfo = await this.fetchUserInfo(
      "https://openidconnect.googleapis.com/v1/userinfo",
      token,
    );

    return this.toProfile(OAuthProvider.GOOGLE, userInfo);
  }

  private async exchangeLinkedInCode(
    code: string,
  ): Promise<ExternalOAuthProfile> {
    const token = await this.fetchToken(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        client_id: this.config.getOrThrow<string>("oauth.linkedin.clientId"),
        client_secret: this.config.getOrThrow<string>(
          "oauth.linkedin.clientSecret",
        ),
        redirect_uri: this.config.getOrThrow<string>(
          "oauth.linkedin.callbackUrl",
        ),
        grant_type: "authorization_code",
        code,
      },
    );
    const userInfo = await this.fetchUserInfo(
      "https://api.linkedin.com/v2/userinfo",
      token,
    );

    return this.toProfile(OAuthProvider.LINKEDIN, userInfo);
  }

  private async fetchToken(url: string, body: Record<string, string>) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(body),
    });

    if (!response.ok)
      throw new BadRequestException("OAuth token exchange failed.");
    const token = (await response.json()) as OAuthTokenResponse;
    if (!token.access_token)
      throw new BadRequestException(
        "OAuth provider did not return access token.",
      );
    return token.access_token;
  }

  private async fetchUserInfo(url: string, token: string) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok)
      throw new BadRequestException("OAuth profile lookup failed.");
    return (await response.json()) as OAuthUserInfo;
  }

  private toProfile(
    provider: OAuthProvider,
    userInfo: OAuthUserInfo,
  ): ExternalOAuthProfile {
    const providerAccountId = userInfo.sub ?? userInfo.id;
    if (!providerAccountId || !userInfo.email) {
      throw new BadRequestException(
        "OAuth provider returned an incomplete profile.",
      );
    }

    const [fallbackFirstName, ...fallbackLastName] = (
      userInfo.name ?? "Workora User"
    ).split(" ");
    return {
      provider,
      providerAccountId,
      email: userInfo.email.toLowerCase(),
      firstName: userInfo.given_name ?? fallbackFirstName,
      lastName: userInfo.family_name ?? fallbackLastName.join(" ") ?? "User",
    };
  }
}
