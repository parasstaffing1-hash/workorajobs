import { Injectable } from "@nestjs/common";
import { createHash, randomBytes } from "node:crypto";

import { RedisService } from "../../redis/redis.service";

const CSRF_TTL_SECONDS = 15 * 60;

@Injectable()
export class CsrfService {
  constructor(private readonly redis: RedisService) {}

  async createToken() {
    const token = randomBytes(32).toString("base64url");
    await this.redis.set(this.key(token), "1", CSRF_TTL_SECONDS);
    return {
      token,
      expiresInSeconds: CSRF_TTL_SECONDS,
    };
  }

  async verifyToken(token: string) {
    const key = this.key(token);
    const exists = await this.redis.get(key);
    if (!exists) return false;
    await this.redis.del(key);
    return true;
  }

  private key(token: string) {
    return `csrf:${createHash("sha256").update(token).digest("hex")}`;
  }
}
