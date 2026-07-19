"use client";

import React, { useState } from "react";
import { 
  Calculator, 
  FileText, 
  Percent, 
  Calendar, 
  TrendingUp, 
  Printer, 
  Download 
} from "lucide-react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { recruiterNav } from "@/data/platform";
import { 
  calculateCompensationBreakup, 
  calculateIncomeTaxOldVsNew, 
  calculateSipCompounding, 
  calculateLastWorkingDay 
} from "@/lib/recruitment-suite/calculators";

export default function RecruiterPayrollPage() {
  // CTC calculator state
  const [ctc, setCtc] = useState(1200000);
  const [bonusPercent, setBonusPercent] = useState(10);
  const [includePf, setIncludePf] = useState(true);

  // Tax calculator state
  const [grossIncome, setGrossIncome] = useState(1500000);
  const [deductions80C, setDeductions80C] = useState(150000);
  const [hraExempt, setHraExempt] = useState(120000);

  // SIP calculator state
  const [monthlyInvest, setMonthlyInvest] = useState(10000);
  const [returnRate, setReturnRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);

  // Notice Period state
  const [startDate, setStartDate] = useState("2026-07-20");
  const [noticeDays, setNoticeDays] = useState(90);

  // Document Generator state
  const [candidateName, setCandidateName] = useState("Aisha Rahman");
  const [jobTitle, setJobTitle] = useState("Senior Product Designer");
  const [selectedDoc, setSelectedDoc] = useState("OFFER_LETTER");

  // Calculations
  const breakup = calculateCompensationBreakup(ctc, bonusPercent, includePf);
  const taxCompare = calculateIncomeTaxOldVsNew(grossIncome, deductions80C, hraExempt);
  const sipResult = calculateSipCompounding(monthlyInvest, returnRate, sipYears);
  const lastDayResult = calculateLastWorkingDay(startDate, noticeDays);

  const printDocument = () => {
    window.print();
  };

  return (
    <PlatformShell
      badge="Console"
      description="Calculate salary breakups, model taxation regimes, compound SIP wealth, track notice periods, and generate employment templates."
      nav={recruiterNav}
      title="Compensation & Payroll Studio"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Salary Breakup (Module 11) */}
        <WorkflowCard title="CTC & Compensation Breakup" action={<Calculator className="h-4 w-4 text-primary" />}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Annual CTC</label>
                <Input type="number" value={ctc} onChange={(e) => setCtc(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Bonus %</label>
                <Input type="number" value={bonusPercent} onChange={(e) => setBonusPercent(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Employer PF</label>
                <select 
                  value={includePf ? "true" : "false"} 
                  onChange={(e) => setIncludePf(e.target.value === "true")}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                >
                  <option value="true">Include</option>
                  <option value="false">Exclude</option>
                </select>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-secondary/30 p-4 text-xs space-y-2">
              <div className="flex justify-between border-b border-border/40 pb-1">
                <span className="font-medium text-muted-foreground">Component</span>
                <span className="font-semibold">Monthly Amount</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Basic Salary (50%)</span>
                <span>₹{breakup.basic.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>House Rent Allowance (HRA)</span>
                <span>₹{breakup.hra.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Leave Travel Allowance (LTA)</span>
                <span>₹{breakup.lta.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Employer PF Share</span>
                <span>₹{breakup.employerPf.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Gratuity Accrual (4.81%)</span>
                <span>₹{breakup.gratuity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Variable Bonus</span>
                <span>₹{breakup.bonus.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Special Allowance Balance</span>
                <span>₹{breakup.monthlySpecialAllowance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-border/40 pt-2 font-bold text-foreground">
                <span>Net In-Hand (Monthly)</span>
                <span className="text-primary">₹{breakup.netInHand.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </WorkflowCard>

        {/* Tax Regime Calculator (Module 12) */}
        <WorkflowCard title="Income Tax Comparison (FY 2026-27)" action={<Percent className="h-4 w-4 text-primary" />}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Gross Income</label>
                <Input type="number" value={grossIncome} onChange={(e) => setGrossIncome(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">80C Deductions</label>
                <Input type="number" value={deductions80C} onChange={(e) => setDeductions80C(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">HRA Exemptions</label>
                <Input type="number" value={hraExempt} onChange={(e) => setHraExempt(Number(e.target.value))} className="mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-slate-900/10 p-3 text-xs">
                <span className="font-semibold text-muted-foreground">New Regime (Default)</span>
                <div className="mt-2 text-lg font-bold text-emerald-600">₹{taxCompare.newRegime.taxAmount.toLocaleString()}</div>
                <p className="mt-1 text-[10px] text-muted-foreground">Taxable Income: ₹{taxCompare.newRegime.taxableIncome.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-border bg-slate-900/10 p-3 text-xs">
                <span className="font-semibold text-muted-foreground">Old Regime</span>
                <div className="mt-2 text-lg font-bold text-primary">₹{taxCompare.oldRegime.taxAmount.toLocaleString()}</div>
                <p className="mt-1 text-[10px] text-muted-foreground">Taxable Income: ₹{taxCompare.oldRegime.taxableIncome.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </WorkflowCard>

        {/* SIP Calculator (Module 20) */}
        <WorkflowCard title="SIP Compounding Calculator" action={<TrendingUp className="h-4 w-4 text-primary" />}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Monthly Invest</label>
                <Input type="number" value={monthlyInvest} onChange={(e) => setMonthlyInvest(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Expected Return %</label>
                <Input type="number" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Duration (Years)</label>
                <Input type="number" value={sipYears} onChange={(e) => setSipYears(Number(e.target.value))} className="mt-1" />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-secondary/30 p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invested Capital</span>
                <span className="font-semibold">₹{sipResult.investedAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Maturity Value</span>
                <span className="font-semibold text-emerald-600">₹{sipResult.totalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-border/40 pt-2 font-bold text-foreground">
                <span>Wealth Gain</span>
                <span className="text-primary">₹{sipResult.wealthGained.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </WorkflowCard>

        {/* Notice Period overlap (Module 13) */}
        <WorkflowCard title="Employment Notice Period Calendar" action={<Calendar className="h-4 w-4 text-primary" />}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Resignation Date</label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Notice Duration (Days)</label>
                <Input type="number" value={noticeDays} onChange={(e) => setNoticeDays(Number(e.target.value))} className="mt-1" />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-secondary/30 p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Notice Period Days</span>
                <span className="font-semibold">{lastDayResult.totalDays} calendar days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Net Business Days (Mon-Fri)</span>
                <span className="font-semibold text-primary">{lastDayResult.businessDays} working days</span>
              </div>
              <div className="flex justify-between border-t border-border/40 pt-2 font-bold text-foreground">
                <span>Last Working Day (LWD)</span>
                <span className="text-emerald-600">{lastDayResult.lastWorkingDay}</span>
              </div>
            </div>
          </div>
        </WorkflowCard>

        {/* Document Generator (Module 10) */}
        <WorkflowCard title="Document Generator & Exporter" action={<FileText className="h-4 w-4 text-primary" />}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Recipient Name</label>
                <Input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Job Designation</label>
                <Input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Document Type</label>
                <select 
                  value={selectedDoc} 
                  onChange={(e) => setSelectedDoc(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                >
                  <option value="OFFER_LETTER">Offer Letter</option>
                  <option value="APPOINTMENT_LETTER">Appointment Letter</option>
                  <option value="EXPERIENCE_LETTER">Experience Letter</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={printDocument} variant="accent" size="sm" className="w-full">
                <Printer className="h-3.5 w-3.5 mr-1" /> Print Document
              </Button>
            </div>

            {/* Print preview sheets */}
            <div id="print-sheet-preview" className="rounded-lg border border-border bg-card p-6 text-xs text-foreground font-serif leading-relaxed space-y-4 max-h-[300px] overflow-y-auto">
              <div className="text-center font-bold text-sm tracking-widest border-b pb-2">
                WORKORA JOBS STAFFING LTD
              </div>
              <p className="text-[10px] text-right text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
              
              {selectedDoc === "OFFER_LETTER" && (
                <div className="space-y-3">
                  <p className="font-bold">Subject: Conditional Offer of Employment</p>
                  <p>Dear {candidateName},</p>
                  <p>We are delighted to extend you an offer to join Workora Jobs Staffing Ltd in the role of <strong>{jobTitle}</strong>. Your starting annual CTC will be <strong>₹{ctc.toLocaleString()}</strong> as detailed in the attached schedule, with a target monthly net pay of <strong>₹{breakup.netInHand.toLocaleString()}</strong>.</p>
                  <p>Please return a signed copy of this offer letter to signify your acceptance.</p>
                  <p className="pt-4">Sincerely,</p>
                  <p className="font-semibold">Hiring Committee<br/>Workora Jobs Staffing Ltd.</p>
                </div>
              )}

              {selectedDoc === "APPOINTMENT_LETTER" && (
                <div className="space-y-3">
                  <p className="font-bold">Subject: Letter of Appointment</p>
                  <p>Dear {candidateName},</p>
                  <p>With reference to your acceptance of our offer, we are pleased to appoint you as <strong>{jobTitle}</strong> effective from the commencement date. Your probation period will be six months, upon completion of which you will be evaluated for regular employment.</p>
                  <p className="pt-4">Sincerely,</p>
                  <p className="font-semibold">Human Resources Operations<br/>Workora Jobs Staffing Ltd.</p>
                </div>
              )}

              {selectedDoc === "EXPERIENCE_LETTER" && (
                <div className="space-y-3">
                  <p className="font-bold">TO WHOMSOEVER IT MAY CONCERN</p>
                  <p>This is to certify that <strong>{candidateName}</strong> was employed with Workora Jobs Staffing Ltd in the capacity of <strong>{jobTitle}</strong> during the period from their official onboarding date to their Last Working Day. During this tenure, their conduct was found to be professional and exemplary.</p>
                  <p className="pt-4">Sincerely,</p>
                  <p className="font-semibold">Human Resources Manager<br/>Workora Jobs Staffing Ltd.</p>
                </div>
              )}
            </div>
          </div>
        </WorkflowCard>
      </div>
    </PlatformShell>
  );
}
