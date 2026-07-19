// WorkoraJobs Recruitment Suite — Verification Spec Tests

import { parseResumeText, generateBooleanQuery, validateAtsFormat, type BooleanNode } from "./engines";
import { calculateCompensationBreakup, calculateIncomeTaxOldVsNew, calculateSipCompounding, calculateLastWorkingDay } from "./calculators";

describe("WorkoraJobs Recruitment Suite Tests", () => {
  
  describe("Resume Parser & ATS Checker", () => {
    it("should parse personal info, email, phone, and standard skills", () => {
      const sampleText = `
        Aisha Rahman
        Senior Product Designer
        aisha.rahman@example.com | +1 (416) 555-0198
        github.com/aisha/design-tokens
        Skills: React, TypeScript, Figma, UI/UX Designer, Tailwind CSS
        Experience: 8 years building SaaS platforms.
      `;
      
      const parsed = parseResumeText(sampleText);
      expect(parsed.name).toBe("Aisha Rahman");
      expect(parsed.email).toBe("aisha.rahman@example.com");
      expect(parsed.phone).toBe("+1 (416) 555-0198");
      expect(parsed.skills).toContain("React");
      expect(parsed.skills).toContain("TypeScript");
      expect(parsed.skills).toContain("Figma");
      expect(parsed.experienceYears).toBe(8);
    });

    it("should validate ATS format and flag placeholder template blocks", () => {
      const parsed = parseResumeText("Aisha Rahman [insert email] React");
      const warnings = validateAtsFormat(parsed);
      expect(warnings.some(w => w.id === "placeholder-text")).toBe(true);
    });
  });

  describe("Boolean Sourcing Query Translator", () => {
    it("should compile visual nodes into standard Boolean syntax", () => {
      const rootNode: BooleanNode = {
        operator: "AND",
        terms: ["Software Engineer"],
        children: [
          {
            operator: "OR",
            terms: ["React", "TypeScript"]
          }
        ]
      };

      const query = generateBooleanQuery(rootNode, "linkedin");
      expect(query).toBe('("Software Engineer" AND (React OR TypeScript))');
    });

    it("should build correct site limits for Google X-Ray searches", () => {
      const node: BooleanNode = {
        operator: "AND",
        terms: ["Kubernetes"],
        children: []
      };
      const query = generateBooleanQuery(node, "google-xray");
      expect(query).toContain("site:linkedin.com/in/");
    });
  });

  describe("Compensation & Payroll Calculators", () => {
    it("should calculate correct monthly CTC and basic salary fractions", () => {
      const breakup = calculateCompensationBreakup(1200000, 10, true);
      expect(breakup.monthlyCtc).toBe(100000);
      expect(breakup.basic).toBe(50000); // 50% of monthly CTC
      expect(breakup.hra).toBe(25000);  // 50% of Basic
    });

    it("should compute Old vs New tax regimes under standard deductions", () => {
      const taxCompare = calculateIncomeTaxOldVsNew(1500000, 150000, 120000);
      // New regime: standard deduction 75,000. 15L gross => 14.25L taxable
      expect(taxCompare.newRegime.taxableIncome).toBe(1425000);
      // Old regime: gross - SD - 80C - HRA => 15L - 50k - 150k - 120k = 11.8L taxable
      expect(taxCompare.oldRegime.taxableIncome).toBe(1180000);
    });
  });

  describe("SIP & Employment Date Compounding", () => {
    it("should compound monthly SIP investments correctly", () => {
      const sip = calculateSipCompounding(10000, 12, 10);
      expect(sip.investedAmount).toBe(1200000);
      expect(sip.totalValue).toBeGreaterThan(1200000);
    });

    it("should calculate business days and last working day boundaries", () => {
      const calendar = calculateLastWorkingDay("2026-07-20", 30);
      expect(calendar.totalDays).toBe(30);
      expect(calendar.businessDays).toBeLessThan(30);
      expect(calendar.lastWorkingDay).toBe("2026-08-19");
    });
  });

});
