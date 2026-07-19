import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { AdminModule } from "./admin/admin.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { AuditModule } from "./audit/audit.module";
import { ApplicationsModule } from "./applications/applications.module";
import { AtsModule } from "./ats/ats.module";
import { AuthModule } from "./auth/auth.module";
import { AutomationModule } from "./automation/automation.module";
import { BillingModule } from "./billing/billing.module";
import { CandidateModule } from "./candidate/candidate.module";
import { CompaniesModule } from "./companies/companies.module";
import { CommunicationModule } from "./communication/communication.module";
import { configuration } from "./config/configuration";
import { validateEnv } from "./config/env.validation";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { EmailModule } from "./email/email.module";
import { HealthModule } from "./health/health.module";
import { JobsModule } from "./jobs/jobs.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProfilesModule } from "./profiles/profiles.module";
import { CrmModule } from "./crm/crm.module";
import { RecruiterModule } from "./recruiter/recruiter.module";
import { TalentModule } from "./recruiter/talent/talent.module";
import { RedisModule } from "./redis/redis.module";
import { SanitizeMiddleware } from "./security/middleware/sanitize.middleware";
import { SecurityModule } from "./security/security.module";
import { StorageModule } from "./storage/storage.module";
import { UsersModule } from "./users/users.module";
import { PrepModule } from './prep/prep.module';
import { QueueModule } from "./common/queue/queue.module";
import { RecruitmentWorkflowModule } from "./recruitment-workflow/recruitment-workflow.module";
import { VmsModule } from "./vms/vms.module";
import { WorkforceModule } from "./workforce/workforce.module";
import { FinanceModule } from "./finance/finance.module";
import { MarketplaceModule } from "./marketplace/marketplace.module";
import { OperationsModule } from "./operations/operations.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "apps/api/.env", "../../.env"],
      load: [configuration],
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),
    PrismaModule,
    RedisModule,
    AuditModule,
    SecurityModule,
    StorageModule,
    EmailModule,
    NotificationsModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    CompaniesModule,
    JobsModule,
    CandidateModule,
    ApplicationsModule,
    RecruiterModule,
    TalentModule,
    AtsModule,
    AutomationModule,
    AdminModule,
    CrmModule,
    AnalyticsModule,
    BillingModule,
    CommunicationModule,
    HealthModule, PrepModule,
    QueueModule,
    RecruitmentWorkflowModule,
    VmsModule,
    WorkforceModule,
    FinanceModule,
    MarketplaceModule,
    OperationsModule,
  ],
  providers: [
    HttpExceptionFilter,
    LoggingInterceptor,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SanitizeMiddleware).forRoutes("*");
  }
}
