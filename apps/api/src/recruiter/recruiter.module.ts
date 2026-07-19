import { Module } from "@nestjs/common";

import { AuditModule } from "../audit/audit.module";
import { PrismaModule } from "../prisma/prisma.module";
import { RecruiterController } from "./recruiter.controller";
import { RecruiterService } from "./recruiter.service";

@Module({
  imports: [AuditModule, PrismaModule],
  controllers: [RecruiterController],
  providers: [RecruiterService],
  exports: [RecruiterService],
})
export class RecruiterModule {}
