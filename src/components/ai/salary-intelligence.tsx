"use client";

import {
  ArrowRightLeft,
  Building2,
  Calculator,
  Coins,
  DollarSign,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";

import { triggerConfetti } from "@/components/ai/gamification-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function SalaryIntelligence() {
  const [ctc, setCtc] = useState<number>(140000);
  const [joiningBonus, setJoiningBonus] = useState<number>(15000);
  const [variablePayPercent, setVariablePayPercent] = useState<number>(15);
  const [esopValue, setEsopValue] = useState<number>(30000);
  const [selectedCity, setSelectedCity] = useState("Toronto, ON");

  const [activeTab, setActiveTab] = useState<"breakdown" | "compare">("breakdown");

  // Multi-Offer Comparison state
  const [offerA, setOfferA] = useState({ company: "Northstar Cloud", base: 140000, bonus: 15000, esop: 30000, remote: "Hybrid" });
  const [offerB, setOfferB] = useState({ company: "Atlas Tech", base: 155000, bonus: 10000, esop: 20000, remote: "Remote" });

  // Calculations
  const variableAmount = (ctc * variablePayPercent) / 100;
  const baseSalary = ctc - variableAmount;
  const monthlyGross = Math.round(baseSalary / 12);
  const estimatedTaxMonthly = Math.round(monthlyGross * 0.22);
  const pfMonthly = Math.round(monthlyGross * 0.05);
  const netTakeHomeMonthly = monthlyGross - estimatedTaxMonthly - pfMonthly;

  const handleGenerateReport = () => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    const textReport = [
      `Salary breakdown report for candidate at ${selectedCity}:`,
      `- Annual CTC: $${ctc.toLocaleString()}`,
      `- Fixed Base Salary: $${baseSalary.toLocaleString()} / yr ($${monthlyGross.toLocaleString()} / mo)`,
      `- Performance Bonus: $${variableAmount.toLocaleString()} / yr (${variablePayPercent}%)`,
      `- Joining Bonus: $${joiningBonus.toLocaleString()}`,
      `- 4-Year ESOP value: $${esopValue.toLocaleString()}`,
      `- Estimated Monthly Taxes: $${estimatedTaxMonthly.toLocaleString()} / mo`,
      `- Estimated Monthly PF/Deductions: $${pfMonthly.toLocaleString()} / mo`,
      `- Net Monthly Take-Home Pay: $${netTakeHomeMonthly.toLocaleString()} / mo`,
      `\nOffer Comparison Overview:`,
      `- Offer A (${offerA.company}): Base $${offerA.base.toLocaleString()}, Bonus $${offerA.bonus.toLocaleString()}, Equity $${offerA.esop.toLocaleString()}, Model: ${offerA.remote}`,
      `- Offer B (${offerB.company}): Base $${offerB.base.toLocaleString()}, Bonus $${offerB.bonus.toLocaleString()}, Equity $${offerB.esop.toLocaleString()}, Model: ${offerB.remote}`,
    ].join("\n");

    const payload = {
      title: "Salary Calculator Analysis Report",
      originalUrl: "/ai-tools?tool=salary-intelligence",
      inputs: {
        ctc,
        joiningBonus,
        variablePayPercent,
        esopValue,
        selectedCity,
        offerA,
        offerB,
      },
      resultText: textReport,
      subMetrics: {
        overall: 88,
        ats: 90,
        content: 95,
        formatting: 100,
        keyword: 100,
        skills: 100,
        experience: 100,
      }
    };
    localStorage.setItem(`workora_tool_result_${id}`, JSON.stringify(payload));
    window.open(`/tools/salary-calculator/result?id=${id}`, "_blank");
  };

  return (
    <Card className="p-6 sm:p-8 border border-border/80 shadow-md bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-emerald-500" />
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Salary Intelligence & Offer Calculator
            </h2>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
              Take-Home Pay & Taxes
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Calculate take-home salary, CTC breakdown, tax deductions, ESOP vesting, and compare competing offers.
          </p>
        </div>

        <div className="flex gap-1.5 rounded-xl border border-border/80 bg-secondary/30 p-1">
          <Button
            onClick={() => setActiveTab("breakdown")}
            variant={activeTab === "breakdown" ? "accent" : "ghost"}
            size="sm"
            className="text-xs h-8"
          >
            CTC Breakdown
          </Button>
          <Button
            onClick={() => setActiveTab("compare")}
            variant={activeTab === "compare" ? "accent" : "ghost"}
            size="sm"
            className="text-xs h-8"
          >
            Compare Offers
          </Button>
        </div>
      </div>

      {activeTab === "breakdown" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Form Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground">Annual CTC ($ / Annual Package)</label>
              <Input
                type="number"
                value={ctc}
                onChange={(e) => setCtc(Number(e.target.value) || 0)}
                className="mt-1.5 text-xs font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">Joining Bonus ($)</label>
                <Input
                  type="number"
                  value={joiningBonus}
                  onChange={(e) => setJoiningBonus(Number(e.target.value) || 0)}
                  className="mt-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Variable Pay (%)</label>
                <Input
                  type="number"
                  value={variablePayPercent}
                  onChange={(e) => setVariablePayPercent(Number(e.target.value) || 0)}
                  className="mt-1.5 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">ESOP / Stock Grants ($)</label>
                <Input
                  type="number"
                  value={esopValue}
                  onChange={(e) => setEsopValue(Number(e.target.value) || 0)}
                  className="mt-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Target City</label>
                <Select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="mt-1.5 text-xs"
                >
                  <option value="Toronto, ON">Toronto, ON</option>
                  <option value="Vancouver, BC">Vancouver, BC</option>
                  <option value="New York, NY">New York, NY</option>
                  <option value="London, UK">London, UK</option>
                  <option value="Remote">Remote</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Estimated Monthly Take-Home Pay
                </span>
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  ${netTakeHomeMonthly.toLocaleString()} / mo
                </div>
              </div>
              <Wallet className="h-10 w-10 text-emerald-500 opacity-80" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/80 bg-secondary/20 p-4 text-xs space-y-1">
                <span className="text-muted-foreground font-semibold">Fixed Base Salary</span>
                <div className="text-lg font-bold text-foreground">${baseSalary.toLocaleString()} / yr</div>
              </div>
              <div className="rounded-xl border border-border/80 bg-secondary/20 p-4 text-xs space-y-1">
                <span className="text-muted-foreground font-semibold">Performance Bonus (15%)</span>
                <div className="text-lg font-bold text-foreground">${variableAmount.toLocaleString()} / yr</div>
              </div>
              <div className="rounded-xl border border-border/80 bg-secondary/20 p-4 text-xs space-y-1">
                <span className="text-muted-foreground font-semibold">Est. Annual Income Tax</span>
                <div className="text-lg font-bold text-red-500">${(estimatedTaxMonthly * 12).toLocaleString()}</div>
              </div>
              <div className="rounded-xl border border-border/80 bg-secondary/20 p-4 text-xs space-y-1">
                <span className="text-muted-foreground font-semibold">4-Yr ESOP Value</span>
                <div className="text-lg font-bold text-violet-500">${esopValue.toLocaleString()}</div>
              </div>
            </div>
            <Button
              onClick={handleGenerateReport}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs py-2.5 shadow-sm mt-4"
            >
              Analyze Salary & Generate Report
            </Button>
          </div>
        </div>
      )}

      {activeTab === "compare" && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <ArrowRightLeft className="h-4 w-4 text-primary" /> Side-by-Side Offer Matrix
          </h4>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Offer A */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-sm text-foreground">{offerA.company}</h5>
                <Badge className="bg-primary/20 text-primary text-[10px]">Offer 1</Badge>
              </div>
              <div className="text-xs space-y-1.5 text-muted-foreground">
                <div className="flex justify-between"><span>Base Salary:</span> <strong className="text-foreground">${offerA.base.toLocaleString()}</strong></div>
                <div className="flex justify-between"><span>Sign-on Bonus:</span> <strong className="text-foreground">${offerA.bonus.toLocaleString()}</strong></div>
                <div className="flex justify-between"><span>Stock Equity:</span> <strong className="text-foreground">${offerA.esop.toLocaleString()}</strong></div>
                <div className="flex justify-between"><span>Work Model:</span> <strong className="text-foreground">{offerA.remote}</strong></div>
              </div>
            </div>

            {/* Offer B */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-sm text-foreground">{offerB.company}</h5>
                <Badge className="bg-emerald-500/20 text-emerald-600 text-[10px]">Offer 2 (Higher Base)</Badge>
              </div>
              <div className="text-xs space-y-1.5 text-muted-foreground">
                <div className="flex justify-between"><span>Base Salary:</span> <strong className="text-foreground">${offerB.base.toLocaleString()}</strong></div>
                <div className="flex justify-between"><span>Sign-on Bonus:</span> <strong className="text-foreground">${offerB.bonus.toLocaleString()}</strong></div>
                <div className="flex justify-between"><span>Stock Equity:</span> <strong className="text-foreground">${offerB.esop.toLocaleString()}</strong></div>
                <div className="flex justify-between"><span>Work Model:</span> <strong className="text-foreground">{offerB.remote}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
