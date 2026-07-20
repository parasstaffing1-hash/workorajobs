"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does Workora's AI matching score candidates?",
      answer:
        "Workora uses a deterministic parsing algorithm that cross-evaluates candidate resumes against 45+ technical parameters including GitHub commit volume, skill match density, and role domain fit. Zero hallucinations.",
    },
    {
      question: "What makes the Boolean Search Generator different?",
      answer:
        "Our Boolean generator builds pre-formatted X-Ray search strings optimized specifically for LinkedIn Recruiter, Google X-Ray, and GitHub. You can copy and execute search strings instantly with 1-click.",
    },
    {
      question: "Is the AI Resume Builder free for job seekers?",
      answer:
        "Yes! Candidates can build, format, and export ATS-compliant resumes in PDF and Word formats for free. Our engine guarantees 100% parse compliance with legacy ATS systems.",
    },
    {
      question: "How quickly can recruiters hire through Workora?",
      answer:
        "Because candidates in our portal are pre-vetted, the average time-to-hire is 14.8 minutes from search query to sequence initiation, compared to 45+ days with traditional staffing agencies.",
    },
    {
      question: "What security & privacy standards are maintained?",
      answer:
        "Workora maintains SOC 2 Type II compliance, 256-bit AES encryption at rest and in transit, Okta/Google SAML 2.0 SSO, and strict GDPR data privacy compliance.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <Container className="relative z-10 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4 border border-blue-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? We Have Answers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Frequently Asked <span className="text-gradient-hero">Questions.</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Everything you need to know about Workora's staffing engine, tools, and candidate matching.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-hero-card rounded-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white text-base sm:text-lg cursor-pointer select-none hover:text-blue-500 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <div className={`p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 bg-blue-500/10 text-blue-500" : ""}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </Container>
    </section>
  );
}
