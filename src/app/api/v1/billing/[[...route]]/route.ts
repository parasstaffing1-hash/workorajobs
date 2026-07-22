import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { RbacGuard } from "@/lib/auth/rbac";
import { PaymentProviderFactory } from "@/lib/billing/provider";
import { SubscriptionService } from "@/lib/billing/subscription-service";
import { InvoicingEngine } from "@/lib/billing/invoicing";
import { CouponService } from "@/lib/billing/coupons";
import { WalletService } from "@/lib/billing/wallet";
import { RevenueDashboardService } from "@/lib/billing/revenue-dashboard";

export const dynamic = "force-dynamic";

function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  return verifyJwt(token);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. GET /api/v1/billing/subscriptions
    if (subPath === "subscriptions" || subPath === "") {
      const activeSub = await prisma.billingSubscription.findFirst({
        where: { userId: authUser.userId, status: "ACTIVE" },
        include: { plan: true },
      });
      return NextResponse.json({ success: true, subscription: activeSub });
    }

    // 2. GET /api/v1/billing/invoices
    if (subPath === "invoices") {
      const invoices = await prisma.invoice.findMany({
        where: { userId: authUser.userId },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, count: invoices.length, invoices });
    }

    // 3. GET /api/v1/billing/wallet
    if (subPath === "wallet") {
      const wallet = await WalletService.getOrCreateWallet(authUser.userId);
      return NextResponse.json({ success: true, wallet });
    }

    // 4. GET /api/v1/billing/revenue (Admin Only)
    if (subPath === "revenue" || subPath === "dashboard") {
      if (!RbacGuard.isAdmin(authUser.role)) {
        return NextResponse.json({ success: false, error: "Forbidden. Admin access required." }, { status: 403 });
      }
      const metrics = await RevenueDashboardService.getRevenueMetrics();
      return NextResponse.json({ success: true, metrics });
    }

    return NextResponse.json({ success: false, error: `Route GET /api/v1/billing/${subPath} not found` }, { status: 404 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Billing query failed" }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 1. POST /api/v1/billing/subscriptions
    if (subPath === "subscriptions" || subPath === "") {
      const sub = await SubscriptionService.subscribe(authUser.userId, body.planSlug, body.billingCycle);
      return NextResponse.json({ success: true, subscription: sub }, { status: 201 });
    }

    // 2. POST /api/v1/billing/payments (Create payment intent)
    if (subPath === "payments") {
      const intent = await PaymentProviderFactory.createPaymentIntent(body.amountCents, body.currency || "USD");
      
      await prisma.paymentTransaction.create({
        data: {
          userId: authUser.userId,
          amountCents: body.amountCents,
          currency: body.currency || "USD",
          provider: intent.provider,
          providerPaymentId: intent.paymentId,
          status: "SUCCESS",
        },
      });

      const invoice = await InvoicingEngine.createInvoice({
        userId: authUser.userId,
        items: [{ description: body.description || "WorkoraJobs Package Purchase", amountCents: body.amountCents }],
        countryCode: body.countryCode,
      });

      return NextResponse.json({ success: true, paymentIntent: intent, invoice }, { status: 201 });
    }

    // 3. POST /api/v1/billing/coupons (Apply promo coupon)
    if (subPath === "coupons") {
      const result = await CouponService.applyCoupon(body.code, authUser.userId, body.amountCents || 9900);
      return NextResponse.json({ success: true, coupon: result });
    }

    return NextResponse.json({ success: false, error: `Route POST /api/v1/billing/${subPath} not found` }, { status: 404 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Billing operation failed" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // 1. DELETE /api/v1/billing/subscriptions (Cancel subscription)
  if (subPath === "subscriptions" || subPath === "") {
    await prisma.billingSubscription.updateMany({
      where: { userId: authUser.userId, status: "ACTIVE" },
      data: { cancelAtPeriodEnd: true },
    });

    return NextResponse.json({ success: true, message: "Subscription will cancel at the end of the current period." });
  }

  return NextResponse.json({ success: false, error: `Route DELETE /api/v1/billing/${subPath} not found` }, { status: 404 });
}
