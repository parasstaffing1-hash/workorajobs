import { Module } from "@nestjs/common";

import { AuditModule } from "../audit/audit.module";
import { PrismaModule } from "../prisma/prisma.module";
import { AtsController } from "./ats.controller";
import { AtsService } from "./ats.service";

@Module({
  imports: [AuditModule, PrismaModule],
  controllers: [AtsController],
  providers: [AtsService],
  exports: [AtsService],
})
export class AtsModule {}
