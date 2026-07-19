import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { QueueModule } from "../common/queue/queue.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { EmailModule } from "../email/email.module";
import { RecruitmentWorkflowController } from "./recruitment-workflow.controller";
import { RecruitmentWorkflowService } from "./recruitment-workflow.service";

@Module({
  imports: [
    PrismaModule,
    QueueModule,
    NotificationsModule,
    EmailModule,
  ],
  controllers: [RecruitmentWorkflowController],
  providers: [RecruitmentWorkflowService],
  exports: [RecruitmentWorkflowService],
})
export class RecruitmentWorkflowModule {}
