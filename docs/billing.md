# WorkoraJobs Enterprise Billing & Payment Platform Guide

This document provides complete technical documentation for the payment provider abstraction layer, subscription plans, invoicing engine, promo coupons, tax rules, and financial MRR/ARR analytics built for WorkoraJobs.

---

## 1. Payment Provider Abstraction Layer

Location: `src/lib/billing/provider.ts`

- Configurable via `PAYMENT_PROVIDER` environment variable (`STRIPE`, `RAZORPAY`, `PAYPAL`, `MANUAL`).
- Dynamically creates provider-specific payment intents without modifying core business logic.

---

## 2. Subscription Plans & Feature Gating

Location: `src/lib/billing/subscription-service.ts`

### Default Plans
- **`Free`**: $0/mo — Max 2 jobs, 1 recruiter, 10 resume views.
- **`Professional`**: $99/mo ($990/yr) — Max 25 jobs, 5 recruiters, 250 resume views, AI credits.
- **`Enterprise`**: $299/mo ($2990/yr) — Max 9999 jobs, 50 recruiters, 10,000 resume views, API access.

Enforced via `SubscriptionService.canCreateJob(userId)`.

---

## 3. Invoicing & Tax Calculations

Location: `src/lib/billing/invoicing.ts`

- Generates unique invoice numbers (`INV-TIMESTAMP-RANDOM`).
- Applies country-specific tax rules (GST, VAT, Sales Tax) from `TaxRate` table.
- Formats line items and PDF download links (`/api/v1/billing/invoices/INV-XXXX/pdf`).

---

## 4. Promo Coupons & Credit Wallet

- **Coupons**: `src/lib/billing/coupons.ts` supports percentage discounts and fixed amount promo codes (`CouponService.applyCoupon`).
- **Credit Wallet**: `src/lib/billing/wallet.ts` tracks promotional credits and referral rewards.

---

## 5. REST API Reference

- `POST /api/v1/billing/subscriptions` - Subscribe or upgrade plan (`planSlug`, `billingCycle`)
- `GET /api/v1/billing/subscriptions` - Fetch active user subscription
- `DELETE /api/v1/billing/subscriptions` - Schedule subscription cancellation
- `POST /api/v1/billing/payments` - Create payment intent & generate invoice
- `GET /api/v1/billing/invoices` - List user invoices
- `POST /api/v1/billing/coupons` - Validate & apply promo coupon code
- `GET /api/v1/billing/wallet` - View credit wallet balance & transactions
- `GET /api/v1/billing/revenue` - MRR, ARR, LTV, ARPU financial metrics (Admin only)
