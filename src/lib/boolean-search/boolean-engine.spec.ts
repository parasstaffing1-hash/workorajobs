import { BooleanEngine, BooleanEngineError } from "./boolean-engine";

describe("BooleanEngine", () => {
  let engine: BooleanEngine;

  beforeEach(() => {
    engine = new BooleanEngine();
  });

  describe("Tokenization", () => {
    it("should tokenize simple terms and operators", () => {
      const tokens = engine.tokenize("React AND TypeScript OR NOT Angular");
      expect(tokens.map((t) => t.value)).toEqual([
        "React",
        "AND",
        "TypeScript",
        "OR",
        "NOT",
        "Angular",
      ]);
      expect(tokens.map((t) => t.type)).toEqual([
        "TERM",
        "AND",
        "TERM",
        "OR",
        "NOT",
        "TERM",
      ]);
    });

    it("should handle parentheses", () => {
      const tokens = engine.tokenize("(React AND Node)");
      expect(tokens.map((t) => t.value)).toEqual(["(", "React", "AND", "Node", ")"]);
      expect(tokens.map((t) => t.type)).toEqual([
        "LPAREN",
        "TERM",
        "AND",
        "TERM",
        "RPAREN",
      ]);
    });

    it("should handle quoted phrases", () => {
      const tokens = engine.tokenize('"Software Engineer" OR \'Product Manager\'');
      expect(tokens.map((t) => t.value)).toEqual([
        "Software Engineer",
        "OR",
        "Product Manager",
      ]);
      expect(tokens.map((t) => t.type)).toEqual(["QUOTED_TERM", "OR", "QUOTED_TERM"]);
    });

    it("should support escape characters", () => {
      const tokens = engine.tokenize('React\\* AND "Software \\"Engineer\\""');
      expect(tokens.map((t) => t.value)).toEqual([
        "React*",
        "AND",
        'Software "Engineer"',
      ]);
    });
  });

  describe("Syntax Validation", () => {
    it("should throw error for unbalanced parentheses", () => {
      expect(() => engine.validate(engine.tokenize('("Software Engineer"'))).toThrow();
      
      const tokens = engine.tokenize("(A AND B");
      expect(() => engine.validate(tokens)).toThrow(BooleanEngineError);
    });

    it("should throw error for empty parentheses", () => {
      const tokens = engine.tokenize("A AND ()");
      expect(() => engine.validate(tokens)).toThrow("Empty parentheses group");
    });

    it("should throw error for illegal consecutive binary operators", () => {
      const tokens = engine.tokenize("A AND AND B");
      expect(() => engine.validate(tokens)).toThrow();
    });

    it("should throw error for trailing operators", () => {
      const tokens = engine.tokenize("A AND B OR");
      expect(() => engine.validate(tokens)).toThrow();
    });
  });

  describe("Operator Precedence & Parsing", () => {
    it("should respect precedence: NOT > AND > OR", () => {
      const tokens = engine.tokenize("A OR B AND NOT C");
      const ast = engine.parse(tokens);

      // Expected structure: OR(A, AND(B, NOT(C)))
      expect(ast.type).toBe("OR");
      expect(ast.children![0].value).toBe("A");
      expect(ast.children![1].type).toBe("AND");
      expect(ast.children![1].children![0].value).toBe("B");
      expect(ast.children![1].children![1].type).toBe("NOT");
      expect(ast.children![1].children![1].children![0].value).toBe("C");
    });
  });

  describe("AST Optimization & Simplification", () => {
    it("should eliminate double negation", () => {
      const tokens = engine.tokenize("NOT NOT React");
      const ast = engine.parse(tokens);
      const optimized = engine.optimize(ast);

      expect(optimized.type).toBe("TERM");
      expect(optimized.value).toBe("React");
    });

    it("should flatten nested groups of the same operator", () => {
      const tokens = engine.tokenize("A AND (B AND C)");
      const ast = engine.parse(tokens);
      const optimized = engine.optimize(ast);

      expect(optimized.type).toBe("AND");
      expect(optimized.children!.length).toBe(3);
      expect(optimized.children!.map((c) => c.value)).toEqual(["A", "B", "C"]);
    });

    it("should deduplicate identical terms in AND/OR groups", () => {
      const tokens = engine.tokenize("React AND TypeScript AND React");
      const ast = engine.parse(tokens);
      const optimized = engine.optimize(ast);

      expect(optimized.type).toBe("AND");
      expect(optimized.children!.length).toBe(2);
      expect(optimized.children!.map((c) => c.value)).toEqual(["React", "TypeScript"]);
    });

    it("should simplify single-child operator groups", () => {
      const tokens = engine.tokenize("(React)");
      const ast = engine.parse(tokens);
      const optimized = engine.optimize(ast);

      expect(optimized.type).toBe("TERM");
      expect(optimized.value).toBe("React");
    });
  });

  describe("Stringification & Pretty Printing", () => {
    it("should stringify AST back to clean boolean query string", () => {
      const tokens = engine.tokenize("(React OR Next.js) AND (TypeScript OR JavaScript)");
      const ast = engine.parse(tokens);
      const optimized = engine.optimize(ast);
      const result = engine.stringify(optimized);

      expect(result).toBe("(React OR Next.js) AND (TypeScript OR JavaScript)");
    });
  });
});
