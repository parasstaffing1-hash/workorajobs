import { Module } from "@nestjs/common";

import { RolesGuard } from "../auth/guards/roles.guard";
import { ProfilesController } from "./profiles.controller";
import { ProfilesService } from "./profiles.service";

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService, RolesGuard],
  exports: [ProfilesService],
})
export class ProfilesModule {}
