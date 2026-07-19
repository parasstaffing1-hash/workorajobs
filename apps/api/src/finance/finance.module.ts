import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { QueueModule } from "../common/queue/queue.module";
import { FinanceController } from "./finance.controller";
import { FinanceService } from "./finance.service";

@Module({
  imports: [PrismaModule, QueueModule],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
