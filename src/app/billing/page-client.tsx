"use client";

import { CreditCard } from "lucide-react";
import { useState } from "react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { adminNav, billingPlans, invoices } from "@/data/platform";



export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("Starter");

  const handleCheckout = (planName: string) => {
    setSelectedPlan(planName);
    alert(`Plan selected: ${planName}! Redirecting to checkout...`);
  };

  return (
    <PlatformShell
      badge="Billing"
      description="Manage subscriptions, invoices, GST support, coupons, Stripe checkout structure and payment history."
      nav={adminNav}
      title="Billing"
    >
      <div className="space-y-6">
        <WorkflowCard
          action={
            <Button size="sm" onClick={() => handleCheckout(selectedPlan)}>
              <CreditCard aria-hidden="true" className="h-4 w-4" />
              Checkout
            </Button>
          }
          title="Subscription plans"
        >
          <div className="grid gap-3">
            {billingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`interactive-border grid gap-2 rounded-md border p-4 shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 md:grid-cols-[1fr_auto] ${
                  selectedPlan === plan.name
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border/70 bg-card/70 hover:border-primary/20 hover:shadow-premium"
                }`}
                onClick={() => setSelectedPlan(plan.name)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">{plan.name}</h2>
                    {plan.name === "Starter" && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Current Plan
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.features}</p>
                </div>
                <span className="text-sm font-medium text-primary">
                  {plan.price}
                </span>
              </div>
            ))}
          </div>
        </WorkflowCard>
        <WorkflowCard title="Payment history">
          <RecordList
            items={invoices.map((invoice) => ({
              title: invoice.number,
              meta: invoice.company,
              value: invoice.status,
            }))}
          />
        </WorkflowCard>
      </div>
    </PlatformShell>
  );
}
