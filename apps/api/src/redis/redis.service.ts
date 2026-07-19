import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(private readonly config: ConfigService) {
    this.client = new Redis(this.config.getOrThrow<string>("redis.url"), {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
    } catch (error) {
      this.logger.warn(
        `Redis connection was not established at startup: ${
          error instanceof Error ? error.message : "unknown error"
        }`,
      );
    }
  }

  async onModuleDestroy() {
    this.client.disconnect();
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.client.set(key, value, "EX", ttlSeconds);
      return;
    }
    await this.client.set(key, value);
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async ping() {
    return this.client.ping();
  }
}
