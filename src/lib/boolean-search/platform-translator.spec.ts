import { BooleanPlatformTranslator } from "./platform-translator";
import { BooleanEngine } from "./boolean-engine";

describe("BooleanPlatformTranslator", () => {
  let translator: BooleanPlatformTranslator;
  let engine: BooleanEngine;

  beforeEach(() => {
    translator = new BooleanPlatformTranslator();
    engine = new BooleanEngine();
  });

  it("should translate Google X-Ray queries with space-separated AND and minus NOT", () => {
    const tokens = engine.tokenize("(React AND TypeScript) AND NOT Angular");
    const ast = engine.parse(tokens);
    const result = translator.translate(ast, "GOOGLE_XRAY");

    expect(result.query).toContain("React TypeScript");
    expect(result.query).toContain("-Angular");
    expect(result.limitExceeded).toBe(false);
  });

  it("should generate warnings for wildcards in Google X-Ray translation", () => {
    const tokens = engine.tokenize("develop*");
    const ast = engine.parse(tokens);
    const result = translator.translate(ast, "GOOGLE_XRAY");

    expect(result.warnings.some(w => w.includes("wildcards"))).toBe(true);
    expect(result.query).toBe("develop");
  });

  it("should flatten groupings and warn for GitHub / GitLab", () => {
    const tokens = engine.tokenize("(React OR Angular) AND TypeScript");
    const ast = engine.parse(tokens);
    const result = translator.translate(ast, "GITHUB");

    expect(result.query).not.toContain("(");
    expect(result.query).not.toContain(")");
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("should convert technologies to tag syntax in Stack Overflow translation", () => {
    const tokens = engine.tokenize("React AND TypeScript");
    const ast = engine.parse(tokens);
    const result = translator.translate(ast, "STACK_OVERFLOW");

    expect(result.query).toBe("[react] [typescript]");
  });

  it("should validate and report character limits for LinkedIn Basic", () => {
    // Generate a long query to trigger limit warning
    const longQuery = Array(60).fill("React").join(" OR ");
    const tokens = engine.tokenize(longQuery);
    const ast = engine.parse(tokens);
    const result = translator.translate(ast, "LINKEDIN_BASIC");

    expect(result.limitExceeded).toBe(true);
    expect(result.warnings.some(w => w.includes("Character limit exceeded"))).toBe(true);
  });
});
