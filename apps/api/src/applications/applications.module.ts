import { Module } from "@nestjs/common";

import { RolesGuard } from "../auth/guards/roles.guard";
import { CandidateModule } from "../candidate/candidate.module";
import { EmailModule } from "../email/email.module";
import { JobsModule } from "../jobs/jobs.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { ApplicationsController } from "./applications.controller";
import { ApplicationsService } from "./applications.service";

@Module({
  imports: [CandidateModule, JobsModule, NotificationsModule, EmailModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, RolesGuard],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
