"use client";

import { useState } from "react";
import RazorpayCheckoutButton from "@/components/payments/RazorpayCheckoutButton";

export default function RazorpayCheckoutPage() {
  const [selectedAmount, setSelectedAmount] = useState(500);

  const plans = [
    { name: "Test ₹1 Order", amount: 1, desc: "Minimum order test (100 paise)" },
    { name: "Pro Monthly", amount: 499, desc: "Full access to AI job matching & direct hiring" },
    { name: "Enterprise Pass", amount: 999, desc: "Unlimited job posts & candidate sourcing" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-2xl">
            ₹
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Razorpay Standard Checkout</h1>
            <p className="text-xs text-slate-400 font-mono">Environment: Enterprise Standard Checkout</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Select a plan below to initiate Razorpay Standard Web Checkout. You will be prompted with the official Razorpay payment modal.
        </p>

        <div className="grid grid-cols-1 gap-3 mb-8">
          {plans.map((plan) => (
            <button
              key={plan.amount}
              onClick={() => setSelectedAmount(plan.amount)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedAmount === plan.amount
                  ? "bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/30"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-base">{plan.name}</span>
                <span className="font-bold text-lg text-blue-400">₹{plan.amount}</span>
              </div>
              <p className="text-xs text-slate-400">{plan.desc}</p>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <RazorpayCheckoutButton
            amount={selectedAmount}
            title={`WorkoraJobs ₹${selectedAmount} Plan`}
            description="Production-grade Razorpay checkout integration"
          />
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Razorpay Standard Integration</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> Test Gateway Ready
          </span>
        </div>
      </div>
    </div>
  );
}
