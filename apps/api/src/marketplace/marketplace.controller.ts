import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InstallAppDto, PublishAppDto, SubmitReviewDto } from "./dto/marketplace.dto";
import { MarketplaceService } from "./marketplace.service";

@ApiTags("Marketplace & Partners")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.RECRUITER)
@Controller("marketplace")
export class MarketplaceController {
  constructor(private readonly marketplace: MarketplaceService) {}

  @Post("apps")
  publishApp(@Body() dto: PublishAppDto) {
    return this.marketplace.publishApp(dto);
  }

  @Get("apps")
  listApps() {
    return this.marketplace.listApps();
  }

  @Post("install")
  installApp(@Body() dto: InstallAppDto) {
    return this.marketplace.installApp(dto);
  }

  @Post("apps/:id/reviews")
  submitReview(@Param("id") id: string, @Body() dto: SubmitReviewDto) {
    return this.marketplace.submitReview(id, dto);
  }
}
