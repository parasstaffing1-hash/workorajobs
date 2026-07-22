import { prisma } from "@/lib/prisma";

export class SubscriptionService {
  /**
   * Initializes default billing plans if none exist
   */
  static async seedDefaultPlans() {
    const existing = await prisma.billingPlan.count();
    if (existing > 0) return;

    await prisma.billingPlan.createMany({
      data: [
        {
          name: "Free",
          slug: "free",
          description: "Starter free plan for job seekers and small employers",
          priceMonthlyCents: 0,
          priceYearlyCents: 0,
          maxJobs: 2,
          maxRecruiters: 1,
          maxResumeViews: 10,
        },
        {
          name: "Professional",
          slug: "professional",
          description: "For growing companies & active hiring managers",
          priceMonthlyCents: 9900, // $99/mo
          priceYearlyCents: 99000,
          maxJobs: 25,
          maxRecruiters: 5,
          maxResumeViews: 250,
          hasAiCredits: true,
        },
        {
          name: "Enterprise",
          slug: "enterprise",
          description: "Unlimited hiring operating platform for global enterprises",
          priceMonthlyCents: 29900, // $299/mo
          priceYearlyCents: 299000,
          maxJobs: 9999,
          maxRecruiters: 50,
          maxResumeViews: 10000,
          hasApiAccess: true,
          hasAiCredits: true,
        },
      ],
    });
  }

  /**
   * Subscribes user to a billing plan
   */
  static async subscribe(userId: string, planSlug: string, billingCycle: "MONTHLY" | "YEARLY" = "MONTHLY") {
    await this.seedDefaultPlans();

    const plan = await prisma.billingPlan.findUnique({
      where: { slug: planSlug },
    });

    if (!plan) {
      throw new Error(`Billing plan '${planSlug}' not found.`);
    }

    const durationDays = billingCycle === "YEARLY" ? 365 : 30;
    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    // Cancel active subscriptions
    await prisma.billingSubscription.updateMany({
      where: { userId, status: "ACTIVE" },
      data: { status: "CANCELLED" },
    });

    const subscription = await prisma.billingSubscription.create({
      data: {
        userId,
        planId: plan.id,
        billingCycle,
        status: "ACTIVE",
        currentPeriodStart,
        currentPeriodEnd,
      },
      include: { plan: true },
    });

    // Log Audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: `SUBSCRIBED_TO_PLAN: ${plan.name}`,
      },
    });

    return subscription;
  }

  /**
   * Enforces feature limits (max job postings check)
   */
  static async canCreateJob(userId: string): Promise<{ allowed: boolean; limit: number; current: number }> {
    const activeSub = await prisma.billingSubscription.findFirst({
      where: { userId, status: "ACTIVE" },
      include: { plan: true },
    });

    const maxJobs = activeSub?.plan.maxJobs || 2;
    const currentJobs = await prisma.job.count({
      where: { postedById: userId, deletedAt: null },
    });

    return {
      allowed: currentJobs < maxJobs,
      limit: maxJobs,
      current: currentJobs,
    };
  }
}
