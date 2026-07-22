import { prisma } from "@/lib/prisma";

export class CouponService {
  /**
   * Creates a new promo coupon code
   */
  static async createCoupon(data: {
    code: string;
    discountPercent?: number;
    discountAmountCents?: number;
    maxRedemptions?: number;
    expiresAt?: Date;
  }) {
    return prisma.coupon.create({
      data: {
        code: data.code.toUpperCase().trim(),
        discountPercent: data.discountPercent,
        discountAmountCents: data.discountAmountCents,
        maxRedemptions: data.maxRedemptions,
        expiresAt: data.expiresAt,
      },
    });
  }

  /**
   * Validates & applies coupon code
   */
  static async applyCoupon(code: string, userId: string, originalAmountCents: number) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon || !coupon.isActive) {
      throw new Error("Invalid or expired coupon code.");
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new Error("Coupon code has expired.");
    }

    if (coupon.maxRedemptions && coupon.currentRedemptions >= coupon.maxRedemptions) {
      throw new Error("Coupon redemption limit reached.");
    }

    // Check if user redeemed before
    const previous = await prisma.couponRedemption.findUnique({
      where: { couponId_userId: { couponId: coupon.id, userId } },
    });

    if (previous) {
      throw new Error("You have already redeemed this coupon code.");
    }

    let discountCents = 0;
    if (coupon.discountPercent) {
      discountCents = Math.round((originalAmountCents * coupon.discountPercent) / 100);
    } else if (coupon.discountAmountCents) {
      discountCents = coupon.discountAmountCents;
    }

    // Record Redemption
    await prisma.couponRedemption.create({
      data: {
        couponId: coupon.id,
        userId,
      },
    });

    await prisma.coupon.update({
      where: { id: coupon.id },
      data: { currentRedemptions: coupon.currentRedemptions + 1 },
    });

    return {
      couponCode: coupon.code,
      discountCents,
      finalAmountCents: Math.max(0, originalAmountCents - discountCents),
    };
  }
}
