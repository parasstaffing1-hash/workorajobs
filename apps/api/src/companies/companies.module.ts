import { Module } from "@nestjs/common";

import { RolesGuard } from "../auth/guards/roles.guard";
import { StorageModule } from "../storage/storage.module";
import { CompaniesController } from "./companies.controller";
import { CompaniesService } from "./companies.service";

@Module({
  imports: [StorageModule],
  controllers: [CompaniesController],
  providers: [CompaniesService, RolesGuard],
  exports: [CompaniesService],
})
export class CompaniesModule {}
