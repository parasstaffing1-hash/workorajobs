import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { QueueModule } from "../common/queue/queue.module";
import { OperationsController } from "./operations.controller";
import { OperationsService } from "./operations.service";

@Module({
  imports: [PrismaModule, QueueModule],
  controllers: [OperationsController],
  providers: [OperationsService],
  exports: [OperationsService],
})
export class OperationsModule {}
