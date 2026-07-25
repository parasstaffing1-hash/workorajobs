"use client";

import { useState } from "react";
import RazorpayCheckoutButton from "@/components/payments/RazorpayCheckoutButton";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    title: string;
    amount: number;
    description: string;
  }>({
    id: "featured-job-test",
    title: "Featured Job Listing (Test)",
    amount: 1,
    description: "Highlight your job posting at the top of search results for 30 days.",
  });

  const products = [
    {
      id: "featured-job-test",
      title: "Featured Job Listing (Test)",
      amount: 1,
      badge: "Quick Test",
      description: "Highlight your job posting at the top of search results for 30 days.",
      features: [
        "Top of search results placement",
        "Featured badge on job card",
        "Direct email notifications to matching candidates",
        "Basic applicant analytics",
      ],
      recommended: false,
    },
    {
      id: "resume-ai-pro",
      title: "AI Candidate Career Pass",
      amount: 499,
      badge: "Popular for Job Seekers",
      description: "AI-powered resume optimization, ATS match scoring, and priority application delivery.",
      features: [
        "Unlimited AI Resume Match Scores",
        "Automatic keyword optimization for ATS",
        "Priority badge on submitted applications",
        "Direct Recruiter view notifications",
      ],
      recommended: true,
    },
    {
      id: "recruiter-pro",
      title: "Employer Hiring Suite",
      amount: 4999,
      badge: "For Recruiting Teams",
      description: "Enterprise candidate sourcing, automated candidate ranking, and unlimited job postings.",
      features: [
        "Unlimited active job postings",
        "Full ATS candidate pipeline access",
        "Boolean candidate search engine",
        "Dedicated account manager & SLA",
      ],
      recommended: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="max-w-6xl w-full space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <span>⚡ Razorpay Web Checkout Integration</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-balance">
            Flexible Plans for Employers & Job Seekers
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Choose a plan below to test Razorpay Standard Checkout. Instant order creation, secure payment processing, and HMAC-SHA256 signature verification.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {products.map((product) => {
            const isSelected = selectedProduct.id === product.id;
            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`relative flex flex-col justify-between p-8 rounded-3xl transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 border-2 border-blue-500 shadow-2xl shadow-blue-500/10 scale-[1.02]"
                    : "bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                }`}
              >
                {product.recommended && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest py-1 px-4 rounded-full shadow-md">
                    {product.badge}
                  </div>
                )}

                <div>
                  {!product.recommended && (
                    <span className="inline-block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {product.badge}
                    </span>
                  )}
                  <h2 className="text-xl font-bold text-white mb-2">{product.title}</h2>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">{product.description}</p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-white">₹{product.amount}</span>
                    <span className="text-xs text-slate-400 font-medium">/ purchase</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs text-slate-300">
                        <svg
                          className="h-4 w-4 text-blue-400 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    className={`w-full py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {isSelected ? "Selected for Checkout" : "Select Plan"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Plan Checkout Panel */}
        <div className="glass-panel bg-slate-900/90 border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto text-center space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="space-y-1">
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Active Selection</span>
            <h3 className="text-2xl font-bold">{selectedProduct.title}</h3>
            <p className="text-sm text-slate-400">Total Due: <strong className="text-white text-lg">₹{selectedProduct.amount}</strong></p>
          </div>

          <div className="flex justify-center">
            <RazorpayCheckoutButton
              amount={selectedProduct.amount}
              title={selectedProduct.title}
              description={selectedProduct.description}
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Razorpay Key: rzp_test_...5Dw7EcN5</span>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> Test Gateway Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
