import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { SecurityModule } from "../security/security.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { OAuthService } from "./services/oauth.service";

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    SecurityModule,
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (config: ConfigService) => ({
          secret: config.get<string>('JWT_ACCESS_SECRET'),
          signOptions: { expiresIn: config.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m' },
        }),
      }),
  ],
  controllers: [AuthController],
  providers: [AuthService, OAuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
