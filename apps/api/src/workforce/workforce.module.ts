import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { QueueModule } from "../common/queue/queue.module";
import { WorkforceController } from "./workforce.controller";
import { WorkforceService } from "./workforce.service";

@Module({
  imports: [PrismaModule, QueueModule],
  controllers: [WorkforceController],
  providers: [WorkforceService],
  exports: [WorkforceService],
})
export class WorkforceModule {}
