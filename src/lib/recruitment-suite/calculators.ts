// WorkoraJobs Recruitment Suite — Deterministic Payroll, Tax & Calculators

export interface SalaryBreakup {
  ctc: number;
  monthlyCtc: number;
  basic: number;
  hra: number;
  lta: number;
  employerPf: number;
  gratuity: number;
  bonus: number;
  monthlySpecialAllowance: number;
  grossSalary: number;
  netInHand: number;
}

export function calculateCompensationBreakup(
  ctc: number,
  bonusPercent = 10,
  includePf = true
): SalaryBreakup {
  const monthlyCtc = Math.round(ctc / 12);
  
  // Basic is standard 50% of CTC
  const basic = Math.round((ctc * 0.5) / 12);
  // HRA is standard 50% of Basic
  const hra = Math.round(basic * 0.5);
  // LTA is standard 5% of Basic
  const lta = Math.round(basic * 0.1);
  // Employer PF: 12% of Basic or 1800 per month cap
  const employerPf = includePf ? Math.round(Math.min(1800, basic * 0.12)) : 0;
  // Gratuity: Basic * 4.81%
  const gratuity = Math.round(basic * 0.0481);
  // Bonus amount
  const bonus = Math.round((ctc * (bonusPercent / 100)) / 12);

  // Special Allowance is the balancing figure
  const deductionsAndFixed = basic + hra + lta + employerPf + gratuity + bonus;
  const monthlySpecialAllowance = Math.max(0, monthlyCtc - deductionsAndFixed);

  const grossSalary = basic + hra + lta + monthlySpecialAllowance;
  // Net In-Hand is gross minus standard employee PF
  const employeePf = employerPf;
  const netInHand = Math.max(0, grossSalary - employeePf);

  return {
    ctc,
    monthlyCtc,
    basic,
    hra,
    lta,
    employerPf,
    gratuity,
    bonus,
    monthlySpecialAllowance,
    grossSalary,
    netInHand
  };
}

export interface TaxResult {
  taxableIncome: number;
  taxAmount: number;
  regime: "OLD" | "NEW";
}

export function calculateIncomeTaxOldVsNew(
  grossIncome: number,
  deductions80C = 0,
  hraExempt = 0,
  otherDeductions = 0
): { oldRegime: TaxResult; newRegime: TaxResult } {
  // New Regime Calculation (FY 2026-27 Slabs)
  const newStandardDeduction = 75000;
  const newTaxableIncome = Math.max(0, grossIncome - newStandardDeduction);
  
  let newTax = 0;
  // Slabs: 0-4L (0%), 4-8L (5%), 8-12L (10%), 12-16L (15%), 16-20L (20%), 20-24L (25%), >24L (30%)
  if (newTaxableIncome > 2400000) {
    newTax += (newTaxableIncome - 2400000) * 0.30;
    newTax += 400000 * 0.25; // 20-24L
    newTax += 400000 * 0.20; // 16-20L
    newTax += 400000 * 0.15; // 12-16L
    newTax += 400000 * 0.10; // 8-12L
    newTax += 400000 * 0.05; // 4-8L
  } else if (newTaxableIncome > 2000000) {
    newTax += (newTaxableIncome - 2000000) * 0.25;
    newTax += 400000 * 0.20;
    newTax += 400000 * 0.15;
    newTax += 400000 * 0.10;
    newTax += 400000 * 0.05;
  } else if (newTaxableIncome > 1600000) {
    newTax += (newTaxableIncome - 1600000) * 0.20;
    newTax += 400000 * 0.15;
    newTax += 400000 * 0.10;
    newTax += 400000 * 0.05;
  } else if (newTaxableIncome > 1200000) {
    newTax += (newTaxableIncome - 1200000) * 0.15;
    newTax += 400000 * 0.10;
    newTax += 400000 * 0.05;
  } else if (newTaxableIncome > 800000) {
    newTax += (newTaxableIncome - 800000) * 0.10;
    newTax += 400000 * 0.05;
  } else if (newTaxableIncome > 400000) {
    newTax += (newTaxableIncome - 400000) * 0.05;
  }
  // Rebate under section 87A for New Regime: full rebate if taxable income <= 12L (under 2026-27 proposals)
  if (newTaxableIncome <= 1200000) {
    newTax = 0;
  }

  // Old Regime Calculation
  const oldStandardDeduction = 50000;
  const totalOldDeductions = oldStandardDeduction + Math.min(150000, deductions80C) + hraExempt + otherDeductions;
  const oldTaxableIncome = Math.max(0, grossIncome - totalOldDeductions);

  let oldTax = 0;
  // Slabs: 0-2.5L (0%), 2.5-5L (5%), 5-10L (20%), >10L (30%)
  if (oldTaxableIncome > 1000000) {
    oldTax += (oldTaxableIncome - 1000000) * 0.30;
    oldTax += 500000 * 0.20; // 5-10L
    oldTax += 250000 * 0.05; // 2.5-5L
  } else if (oldTaxableIncome > 500000) {
    oldTax += (oldTaxableIncome - 500000) * 0.20;
    oldTax += 250000 * 0.05;
  } else if (oldTaxableIncome > 250000) {
    oldTax += (oldTaxableIncome - 250000) * 0.05;
  }
  // Rebate under section 87A for Old Regime: full rebate if taxable income <= 5L
  if (oldTaxableIncome <= 500000) {
    oldTax = 0;
  }

  return {
    oldRegime: { taxableIncome: oldTaxableIncome, taxAmount: Math.round(oldTax), regime: "OLD" },
    newRegime: { taxableIncome: newTaxableIncome, taxAmount: Math.round(newTax), regime: "NEW" }
  };
}

// SIP & Compounding calculators
export interface SipResult {
  investedAmount: number;
  totalValue: number;
  wealthGained: number;
}

export function calculateSipCompounding(
  monthlyInvestment: number,
  expectedReturnRate: number,
  years: number
): SipResult {
  const months = years * 12;
  const monthlyRate = expectedReturnRate / 12 / 100;
  
  let totalValue = 0;
  for (let i = 0; i < months; i++) {
    totalValue = (totalValue + monthlyInvestment) * (1 + monthlyRate);
  }

  const investedAmount = monthlyInvestment * months;
  const wealthGained = Math.max(0, totalValue - investedAmount);

  return {
    investedAmount: Math.round(investedAmount),
    totalValue: Math.round(totalValue),
    wealthGained: Math.round(wealthGained)
  };
}

// Notice Period & Last Working Day Calculator
export interface EmploymentCalendarResult {
  lastWorkingDay: string;
  totalDays: number;
  businessDays: number;
}

export function calculateLastWorkingDay(
  startDateStr: string,
  noticePeriodDays: number
): EmploymentCalendarResult {
  const startDate = new Date(startDateStr);
  if (isNaN(startDate.getTime())) {
    return { lastWorkingDay: "", totalDays: 0, businessDays: 0 };
  }

  const lastDate = new Date(startDate.getTime() + noticePeriodDays * 24 * 60 * 60 * 1000);
  
  // Calculate business days (Monday-Friday)
  let businessDays = 0;
  const tempDate = new Date(startDate.getTime());
  while (tempDate <= lastDate) {
    const day = tempDate.getDay();
    if (day !== 0 && day !== 6) {
      businessDays++;
    }
    tempDate.setDate(tempDate.getDate() + 1);
  }

  return {
    lastWorkingDay: lastDate.toISOString().split("T")[0],
    totalDays: noticePeriodDays,
    businessDays
  };
}
