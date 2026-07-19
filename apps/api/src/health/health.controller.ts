import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { PrismaService } from "../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  async health() {
    const [database, redis] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    return {
      status:
        database.status === "up" && redis.status === "up" ? "ok" : "degraded",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        database,
        redis,
      },
    };
  }

  private async checkDatabase() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: "up",
      };
    } catch (error) {
      return {
        status: "down",
        error: error instanceof Error ? error.message : "unknown error",
      };
    }
  }

  private async checkRedis() {
    try {
      await this.redis.ping();
      return {
        status: "up",
      };
    } catch (error) {
      return {
        status: "down",
        error: error instanceof Error ? error.message : "unknown error",
      };
    }
  }
}
