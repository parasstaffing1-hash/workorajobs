import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { QueueModule } from "../common/queue/queue.module";
import { VmsController } from "./vms.controller";
import { VmsService } from "./vms.service";

@Module({
  imports: [PrismaModule, QueueModule],
  controllers: [VmsController],
  providers: [VmsService],
  exports: [VmsService],
})
export class VmsModule {}
