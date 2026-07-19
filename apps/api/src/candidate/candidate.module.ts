import { Module } from "@nestjs/common";

import { AuditModule } from "../audit/audit.module";
import { RolesGuard } from "../auth/guards/roles.guard";
import { QueueModule } from "../common/queue/queue.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { StorageModule } from "../storage/storage.module";
import { CandidateController } from "./candidate.controller";
import { CandidateService } from "./candidate.service";
import { PublicCandidateController } from "./public-candidate.controller";

@Module({
  imports: [StorageModule, NotificationsModule, AuditModule, QueueModule],
  controllers: [CandidateController, PublicCandidateController],
  providers: [CandidateService, RolesGuard],
  exports: [CandidateService],
})
export class CandidateModule {}
