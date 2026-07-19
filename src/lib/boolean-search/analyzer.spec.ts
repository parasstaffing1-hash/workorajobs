import { BooleanSearchAnalyzer } from "./analyzer";

describe("BooleanSearchAnalyzer", () => {
  let analyzer: BooleanSearchAnalyzer;

  beforeEach(() => {
    analyzer = new BooleanSearchAnalyzer();
  });

  it("should analyze simple valid queries without errors", () => {
    const result = analyzer.analyze("React AND TypeScript");
    
    expect(result.issues.filter(i => i.severity === "error").length).toBe(0);
    expect(result.termCount).toBe(2);
    expect(result.operatorCount).toBe(1);
    expect(result.complexityScore).toBeGreaterThan(0);
  });

  it("should flag contradictory dead branch filters", () => {
    const result = analyzer.analyze("React AND NOT React");
    
    expect(result.issues.some(i => i.message.includes("Dead branch"))).toBe(true);
    expect(result.suggestions.length).toBeGreaterThan(0);
    expect(result.performanceScore).toBeLessThan(100);
  });

  it("should detect duplicate search terms", () => {
    const result = analyzer.analyze("React AND React");
    
    expect(result.issues.some(i => i.message.includes("Duplicate search term"))).toBe(true);
  });

  it("should flag double negations", () => {
    const result = analyzer.analyze("NOT NOT React");
    
    expect(result.issues.some(i => i.message.includes("Double negation"))).toBe(true);
  });

  it("should evaluate complexity, readability, and performance scores correctly", () => {
    const result = analyzer.analyze("(React AND Node) OR (Python AND Go) NOT Java");
    
    expect(result.complexityScore).toBeGreaterThan(5);
    expect(result.readabilityScore).toBeLessThan(100);
  });
});
