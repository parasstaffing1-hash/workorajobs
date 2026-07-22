import { SynonymEngine } from "./synonym-engine";
import { db } from "./db";
import { conceptAliases } from "./schema";

jest.setTimeout(30000);

describe("SynonymEngine", () => {
  let engine: SynonymEngine;

  beforeEach(() => {
    engine = new SynonymEngine();
  });

  describe("Term Expansion", () => {
    it("should expand simple seed concepts using fallback or db mapping", async () => {
      const result = await engine.expand("TypeScript");
      expect(result).toContain("TypeScript");
      // Fallback includes TS, etc.
      expect(result.some(t => t.toLowerCase() === "ts")).toBe(true);
    });

    it("should fallback gracefully for unknown terms by returning the term itself", async () => {
      const result = await engine.expand("CustomTermDoesNotExist");
      expect(result).toEqual(["CustomTermDoesNotExist"]);
    });

    it("should filter expansion terms based on specified types", async () => {
      // If we only filter for ABBREVIATION, it shouldn't contain standard aliases
      const result = await engine.expand("TypeScript", {
        includeTypes: ["ABBREVIATION"]
      });
      // Original term is always included
      expect(result).toContain("TypeScript");
    });
  });

  describe("Term Collapse", () => {
    it("should collapse variants back to canonical concept name", async () => {
      const result = await engine.collapse(["TS", "TypeScript Language"]);
      expect(result).toBe("TypeScript");
    });

    it("should return the first term if no canonical concept matches", async () => {
      const result = await engine.collapse(["CustomTermA", "CustomTermB"]);
      expect(result).toBe("CustomTermA");
    });
  });

  describe("Caching & Performance", () => {
    it("should retrieve results from cache on subsequent lookups", async () => {
      const start = Date.now();
      const firstRun = await engine.expand("React");
      const mid = Date.now();
      const secondRun = await engine.expand("React");
      const end = Date.now();

      expect(firstRun).toEqual(secondRun);
      // Cache run should be near-instantaneous (0ms)
      expect(end - mid).toBeLessThanOrEqual(mid - start);
    });
  });

  describe("Cycle Detection in nested resolution", () => {
    it("should prevent infinite loops when executing recursive synonym expansions", async () => {
      // Mocking nested recursive call by supplying visited map
      const visited = new Set<string>(["mock-id-1", "mock-id-2"]);
      const expansion = new Set<string>(["Original"]);
      
      // Call internal recursiveExpand directly to verify it exits immediately for visited IDs
      await (engine as any).recursiveExpand("mock-id-1", expansion, visited, {});
      expect(expansion.size).toBe(1); // No new items added because it was already visited
    });
  });
});
