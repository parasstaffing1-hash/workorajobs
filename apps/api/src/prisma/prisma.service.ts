import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error: any) {
      console.warn("⚠️ Prisma database connection failed during initialization:", error.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
