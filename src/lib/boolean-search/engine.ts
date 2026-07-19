import { BooleanEngine, ASTNode } from "./boolean-engine";
import { SynonymEngine } from "./synonym-engine";

export interface SearchNode {
  type: "OPERATOR" | "TERM";
  value: string;
  children?: SearchNode[];
}

export class BooleanSearchEngine {
  private baseEngine = new BooleanEngine();
  private synonymEngine = new SynonymEngine();

  /**
   * Tokenize a boolean query string.
   * Handles AND, OR, NOT, parentheses, and quoted phrases.
   */
  public tokenize(query: string): string[] {
    try {
      const tokens = this.baseEngine.tokenize(query);
      return tokens.map(t => t.type === "QUOTED_TERM" ? `"${t.value}"` : t.value);
    } catch {
      // Fallback
      return query.split(/\s+/).filter(Boolean);
    }
  }

  /**
   * Parse boolean tokens into a tree representation (AST)
   */
  public parse(tokens: string[]): SearchNode {
    const tokenObjects = tokens.map((val, idx) => {
      const isQuoted = val.startsWith('"') && val.endsWith('"');
      const cleanVal = isQuoted ? val.slice(1, -1) : val;
      const upper = cleanVal.toUpperCase();
      let type = "TERM";
      if (val === "(") type = "LPAREN";
      else if (val === ")") type = "RPAREN";
      else if (upper === "AND") type = "AND";
      else if (upper === "OR") type = "OR";
      else if (upper === "NOT") type = "NOT";
      else if (isQuoted) type = "QUOTED_TERM";
      
      return { type, value: cleanVal, position: idx };
    });

    const ast = this.baseEngine.parse(tokenObjects);
    const optimized = this.baseEngine.optimize(ast);

    const mapNode = (node: ASTNode): SearchNode => {
      if (node.type === "TERM") {
        const val = node.isQuoted ? `"${node.value}"` : (node.value || "");
        return { type: "TERM", value: val };
      }
      return {
        type: "OPERATOR",
        value: node.type,
        children: node.children ? node.children.map(mapNode) : [],
      };
    };

    return mapNode(optimized);
  }

  /**
   * Expand a search term by querying database synonyms and aliases
   */
  public async expandTerm(term: string): Promise<string> {
    const cleanTerm = term.replace(/^["']|["']$/g, "").trim();
    if (!cleanTerm) return term;

    const expanded = await this.synonymEngine.expand(cleanTerm);
    const termArray = expanded.map(t => `"${t}"`);
    if (termArray.length === 1) {
      return termArray[0];
    }

    return `(${termArray.join(" OR ")})`;
  }

  /**
   * Recursively walk the parsed AST and expand all terms using synonyms
   */
  public async expandQueryTree(node: SearchNode): Promise<string> {
    if (node.type === "TERM") {
      return await this.expandTerm(node.value);
    }

    if (node.type === "OPERATOR") {
      if (node.value === "NOT" && node.children) {
        const childVal = await this.expandQueryTree(node.children[0]);
        return `NOT ${childVal}`;
      }

      if (node.children && node.children.length === 2) {
        const leftVal = await this.expandQueryTree(node.children[0]);
        const rightVal = await this.expandQueryTree(node.children[1]);
        
        // Retain grouping structures for operator precedence
        return `(${leftVal} ${node.value} ${rightVal})`;
      }
    }

    return node.value;
  }

  /**
   * Public Entrypoint: Parse and expand a query string using taxonomy synonyms
   */
  public async expandQuery(query: string): Promise<string> {
    try {
      const tokens = this.tokenize(query);
      if (tokens.length === 0) return "";
      
      const ast = this.parse(tokens);
      let expanded = await this.expandQueryTree(ast);
      
      // Clean up top-level redundant parenthesized wraps
      if (expanded.startsWith("(") && expanded.endsWith(")")) {
        // verify it's a single outer wrap
        let depth = 0;
        let redundant = true;
        for (let i = 0; i < expanded.length - 1; i++) {
          if (expanded[i] === "(") depth++;
          if (expanded[i] === ")") depth--;
          if (depth === 0) {
            redundant = false;
            break;
          }
        }
        if (redundant) {
          expanded = expanded.slice(1, -1);
        }
      }
      
      return expanded;
    } catch (error: any) {
      // In case of syntactic parsing errors, fallback
      console.warn("AST parsing failed, falling back to literal expansion:", error.message);
      return query;
    }
  }
}
