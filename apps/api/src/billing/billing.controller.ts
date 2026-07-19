import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { BillingService } from "./billing.service";
import {
  CouponDto,
  CreateCheckoutSessionDto,
  SubscriptionPlanDto,
} from "./dto/billing.dto";

@ApiTags("Billing")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("billing")
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Get("plans")
  @Roles(UserRole.ADMIN, UserRole.EMPLOYER)
  plans() {
    return this.billing.plans();
  }

  @Post("plans")
  @Roles(UserRole.ADMIN)
  upsertPlan(@Body() dto: SubscriptionPlanDto) {
    return this.billing.upsertPlan(dto);
  }

  @Get("subscriptions")
  @Roles(UserRole.ADMIN)
  subscriptions() {
    return this.billing.subscriptions();
  }

  @Get("invoices")
  @Roles(UserRole.ADMIN, UserRole.EMPLOYER)
  invoices(@CurrentUser() user: AuthenticatedUser) {
    return this.billing.invoices(user);
  }

  @Get("payments")
  @Roles(UserRole.ADMIN, UserRole.EMPLOYER)
  payments(@CurrentUser() user: AuthenticatedUser) {
    return this.billing.payments(user);
  }

  @Get("coupons")
  @Roles(UserRole.ADMIN)
  coupons() {
    return this.billing.coupons();
  }

  @Post("coupons")
  @Roles(UserRole.ADMIN)
  upsertCoupon(@Body() dto: CouponDto) {
    return this.billing.upsertCoupon(dto);
  }

  @Post("checkout-session")
  @Roles(UserRole.ADMIN, UserRole.EMPLOYER)
  createCheckoutSession(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCheckoutSessionDto,
  ) {
    return this.billing.createCheckoutSession(user, dto);
  }
}
