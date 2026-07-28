import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma, UserRole } from "@prisma/client";

import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { PrismaService } from "../prisma/prisma.service";
import {
  CouponDto,
  CreateCheckoutSessionDto,
  SubscriptionPlanDto,
} from "./dto/billing.dto";

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  plans() {
    return this.prisma.subscriptionPlan.findMany({
      orderBy: [{ active: "desc" }, { priceCents: "asc" }],
    });
  }

  upsertPlan(dto: SubscriptionPlanDto) {
    return this.prisma.subscriptionPlan.upsert({
      create: {
        ...dto,
        currency: dto.currency ?? "USD",
        features: dto.features as Prisma.InputJsonValue | undefined,
      },
      update: {
        name: dto.name,
        interval: dto.interval,
        priceCents: dto.priceCents,
        currency: dto.currency ?? "USD",
        stripePriceId: dto.stripePriceId,
        features: dto.features as Prisma.InputJsonValue | undefined,
      },
      where: { key: dto.key },
    });
  }

  subscriptions() {
    return this.prisma.billingSubscription.findMany({
      include: { company: true, plan: true, invoices: true },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
  }

  invoices(user: AuthenticatedUser) {
    return this.prisma.invoice.findMany({
      include: { company: true, subscription: { include: { plan: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
      where: this.companyScope(user),
    });
  }

  payments(user: AuthenticatedUser) {
    return this.prisma.payment.findMany({
      include: { company: true, invoice: true },
      orderBy: { createdAt: "desc" },
      take: 100,
      where: this.companyScope(user),
    });
  }

  coupons() {
    return this.prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  upsertCoupon(dto: CouponDto) {
    return this.prisma.coupon.upsert({
      create: dto,
      update: {
        percentOff: dto.percentOff,
        amountOffCents: dto.amountOffCents,
      },
      where: { code: dto.code },
    });
  }

  async createCheckoutSession(
    user: AuthenticatedUser,
    dto: CreateCheckoutSessionDto,
  ) {
    const [company, plan] = await Promise.all([
      this.prisma.company.findUnique({ where: { id: dto.companyId } }),
      this.prisma.subscriptionPlan.findUnique({ where: { id: dto.planId } }),
    ]);
    if (!company) throw new BadRequestException("Company not found.");
    if (!plan) throw new BadRequestException("Subscription plan not found.");
    if (user.role !== UserRole.ADMIN && company.ownerId !== user.sub) {
      throw new ForbiddenException(
        "Company billing is not owned by this user.",
      );
    }

    const subscription = await this.prisma.billingSubscription.findFirst({
      select: { id: true },
      where: { companyId: company.id },
    });
    if (subscription) {
      await this.prisma.billingSubscription.update({
        data: {
          planId: plan.id,
          gstNumber: dto.gstNumber,
        },
        where: { id: subscription.id },
      });
    } else {
      await this.prisma.billingSubscription.create({
        data: {
          companyId: company.id,
          planId: plan.id,
          status: "INCOMPLETE",
          gstNumber: dto.gstNumber,
        },
      });
    }

    const razorpayKeyId = this.config.get<string>("billing.razorpayKeyId");
    const razorpayKeySecret = this.config.get<string>("billing.razorpayKeySecret");
    if (!razorpayKeyId || !razorpayKeySecret) {
      return {
        provider: "razorpay",
        setupRequired: true,
        requiredEnvironment: [
          "RAZORPAY_KEY_ID",
          "RAZORPAY_KEY_SECRET",
          "RAZORPAY_WEBHOOK_SECRET",
        ],
      };
    }

    this.logger.warn(
      "Legacy Nest billing endpoint is configured for Razorpay but order creation is handled by the Go /api/v1/payments/razorpay/orders endpoint.",
    );
    return {
      provider: "razorpay",
      setupRequired: false,
      handoffEndpoint: "/api/v1/payments/razorpay/orders",
      amount: plan.priceCents,
      currency: plan.currency,
      companyId: company.id,
      planId: plan.id,
    };
  }

  private companyScope(user: AuthenticatedUser) {
    if (user.role === UserRole.ADMIN) return undefined;
    return { company: { ownerId: user.sub } };
  }
}
