import { Module } from "@nestjs/common";

import { RolesGuard } from "../auth/guards/roles.guard";
import { CompaniesModule } from "../companies/companies.module";
import { EmployerJobsController } from "./controllers/employer-jobs.controller";
import { PublicJobsController } from "./controllers/public-jobs.controller";
import { JobsService } from "./jobs.service";

@Module({
  imports: [CompaniesModule],
  controllers: [PublicJobsController, EmployerJobsController],
  providers: [JobsService, RolesGuard],
  exports: [JobsService],
})
export class JobsModule {}
