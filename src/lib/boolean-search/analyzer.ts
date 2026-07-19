import { ASTNode, BooleanEngine } from "./boolean-engine";
import { BooleanPlatformTranslator, TargetPlatform } from "./platform-translator";

export interface AnalysisResult {
  complexityScore: number; // 0 to 100
  readabilityScore: number; // 0 to 100
  performanceScore: number; // 0 to 100
  characterCount: number;
  termCount: number;
  operatorCount: number;
  maxNestingDepth: number;
  suggestions: string[];
  issues: {
    severity: "info" | "warning" | "error";
    message: string;
    position?: number;
  }[];
}

export class BooleanSearchAnalyzer {
  private engine = new BooleanEngine();
  private translator = new BooleanPlatformTranslator();

  /**
   * Run instant analysis on raw search string.
   */
  public analyze(query: string, platform: TargetPlatform = "GENERIC_ATS"): AnalysisResult {
    const issues: AnalysisResult["issues"] = [];
    const suggestions: string[] = [];
    
    let tokens: any[] = [];
    let ast: ASTNode | null = null;
    let optimizedAst: ASTNode | null = null;

    // 1. Tokenize & Parentheses Validation
    try {
      tokens = this.engine.tokenize(query);
    } catch (err: any) {
      issues.push({
        severity: "error",
        message: `Tokenization failed: ${err.message}`,
        position: err.position,
      });
    }

    if (tokens.length > 0) {
      try {
        this.engine.validate(tokens);
      } catch (err: any) {
        issues.push({
          severity: "error",
          message: `Syntax validation failed: ${err.message}`,
          position: err.position,
        });
      }
    }

    // 2. Parse & AST Generation
    if (issues.filter(i => i.severity === "error").length === 0 && tokens.length > 0) {
      try {
        ast = this.engine.parse(tokens);
        optimizedAst = this.engine.optimize(ast);
      } catch (err: any) {
        issues.push({
          severity: "error",
          message: `Parsing failed: ${err.message}`,
          position: err.position,
        });
      }
    }

    // Calculate metrics
    const characterCount = query.length;
    const termCount = tokens.filter(t => t.type === "TERM" || t.type === "QUOTED_TERM").length;
    const operatorCount = tokens.filter(t => t.type === "AND" || t.type === "OR" || t.type === "NOT").length;
    const maxNestingDepth = ast ? this.getNestingDepth(ast) : 0;

    // Analyze specific issues & suggestions in the query tree
    if (ast && optimizedAst) {
      this.detectDuplicates(ast, issues, suggestions);
      this.detectDeadBranches(ast, issues, suggestions);
      this.detectRepeatedGroups(ast, issues, suggestions);
      this.detectDoubleNegation(ast, issues, suggestions);
      
      const originalSerialized = this.engine.serializeNode(ast);
      const optimizedSerialized = this.engine.serializeNode(optimizedAst);
      if (originalSerialized !== optimizedSerialized) {
        suggestions.push("Query can be automatically simplified and optimized.");
      }
    }

    // Check platform compatibility limits
    if (ast) {
      const translation = this.translator.translate(ast, platform);
      if (translation.limitExceeded) {
        issues.push({
          severity: "warning",
          message: `Query length (${translation.charCount} chars) exceeds target platform ${platform} limit.`,
        });
      }
      translation.warnings.forEach(w => {
        issues.push({
          severity: "warning",
          message: w,
        });
      });
    }

    // Scores Calculation
    const complexityScore = this.calculateComplexityScore(termCount, operatorCount, maxNestingDepth);
    const readabilityScore = this.calculateReadabilityScore(characterCount, maxNestingDepth, issues);
    const performanceScore = this.calculatePerformanceScore(termCount, maxNestingDepth, issues);

    return {
      complexityScore,
      readabilityScore,
      performanceScore,
      characterCount,
      termCount,
      operatorCount,
      maxNestingDepth,
      suggestions,
      issues,
    };
  }

  private getNestingDepth(node: ASTNode): number {
    if (node.type === "TERM") return 0;
    if (!node.children || node.children.length === 0) return 0;
    
    const depths = node.children.map(c => this.getNestingDepth(c));
    return 1 + Math.max(...depths);
  }

  private detectDuplicates(node: ASTNode, issues: AnalysisResult["issues"], suggestions: string[]) {
    if (node.type === "AND" || node.type === "OR") {
      const seen = new Set<string>();
      if (node.children) {
        for (const child of node.children) {
          if (child.type === "TERM") {
            const val = child.value?.toLowerCase();
            if (val) {
              if (seen.has(val)) {
                issues.push({
                  severity: "info",
                  message: `Duplicate search term "${child.value}" detected in ${node.type} group.`,
                });
                suggestions.push(`Remove redundant duplicated term "${child.value}" from the query.`);
              }
              seen.add(val);
            }
          }
          this.detectDuplicates(child, issues, suggestions);
        }
      }
    } else if (node.children) {
      node.children.forEach(c => this.detectDuplicates(c, issues, suggestions));
    }
  }

  private detectDeadBranches(node: ASTNode, issues: AnalysisResult["issues"], suggestions: string[]) {
    // Detect contradiction: A AND NOT A
    if (node.type === "AND" && node.children) {
      const positiveTerms = new Set<string>();
      const negativeTerms = new Set<string>();

      for (const child of node.children) {
        if (child.type === "TERM" && child.value) {
          positiveTerms.add(child.value.toLowerCase());
        }
        if (child.type === "NOT" && child.children && child.children[0].type === "TERM" && child.children[0].value) {
          negativeTerms.add(child.children[0].value.toLowerCase());
        }
      }

      for (const pos of positiveTerms) {
        if (negativeTerms.has(pos)) {
          issues.push({
            severity: "error",
            message: `Dead branch detected: Contradictory filters found for term "${pos}" (requires both inclusion and exclusion).`,
          });
          suggestions.push(`Remove the contradictory exclusion "NOT ${pos}" or inclusion "${pos}".`);
        }
      }
    }

    if (node.children) {
      node.children.forEach(c => this.detectDeadBranches(c, issues, suggestions));
    }
  }

  private detectRepeatedGroups(node: ASTNode, issues: AnalysisResult["issues"], suggestions: string[]) {
    if ((node.type === "AND" || node.type === "OR") && node.children) {
      const seen = new Set<string>();
      for (const child of node.children) {
        if (child.type === "AND" || child.type === "OR") {
          const key = this.engine.serializeNode(child);
          if (seen.has(key)) {
            issues.push({
              severity: "info",
              message: `Repeated sub-group detected in ${node.type} logic block.`,
            });
            suggestions.push("Remove repeated sub-group structures to optimize performance.");
          }
          seen.add(key);
        }
        this.detectRepeatedGroups(child, issues, suggestions);
      }
    } else if (node.children) {
      node.children.forEach(c => this.detectRepeatedGroups(c, issues, suggestions));
    }
  }

  private detectDoubleNegation(node: ASTNode, issues: AnalysisResult["issues"], suggestions: string[]) {
    if (node.type === "NOT" && node.children && node.children[0].type === "NOT") {
      issues.push({
        severity: "info",
        message: "Double negation (NOT NOT) detected.",
      });
      suggestions.push("Simplify double negations (NOT NOT term) directly to positive terms.");
    }
    if (node.children) {
      node.children.forEach(c => this.detectDoubleNegation(c, issues, suggestions));
    }
  }

  private calculateComplexityScore(terms: number, operators: number, depth: number): number {
    // Simple penalty calculation based on term size and nesting depth
    const score = (terms * 3) + (operators * 4) + (depth * 15);
    return Math.min(100, Math.max(5, score));
  }

  private calculateReadabilityScore(charCount: number, depth: number, issues: AnalysisResult["issues"]): number {
    let score = 100;
    
    // Penalize long lines
    if (charCount > 200) score -= 15;
    if (charCount > 500) score -= 20;

    // Penalize nesting depth
    score -= (depth * 8);

    // Penalize syntax errors
    const errorCount = issues.filter(i => i.severity === "error").length;
    score -= (errorCount * 30);

    return Math.max(10, score);
  }

  private calculatePerformanceScore(terms: number, depth: number, issues: AnalysisResult["issues"]): number {
    let score = 100;
    
    // Penalize excessive terms
    if (terms > 15) score -= 15;
    if (terms > 30) score -= 25;

    // Penalize nested levels
    score -= (depth * 5);

    // Penalize dead branches
    const hasDeadBranch = issues.some(i => i.message.includes("Dead branch"));
    if (hasDeadBranch) score -= 40;

    return Math.max(10, score);
  }
}
