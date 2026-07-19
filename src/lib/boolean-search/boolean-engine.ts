import { eq } from "drizzle-orm";

export type NodeType = "AND" | "OR" | "NOT" | "TERM";

export interface ASTNode {
  type: NodeType;
  value?: string; // Used for TERM (e.g., "React", "develop*")
  children?: ASTNode[]; // Used for AND, OR, NOT
  isQuoted?: boolean; // Indicates if the term was quoted
  hasWildcard?: boolean; // Indicates if the term contains wildcards
}

export class BooleanEngineError extends Error {
  constructor(message: string, public position?: number) {
    super(position !== undefined ? `${message} at position ${position}` : message);
    this.name = "BooleanEngineError";
  }
}

export class BooleanEngine {
  /**
   * Tokenize input string. Supports operators, parentheses, quotes, wildcards, and escape characters.
   */
  public tokenize(query: string): { type: string; value: string; position: number }[] {
    const tokens: { type: string; value: string; position: number }[] = [];
    let i = 0;

    while (i < query.length) {
      const char = query[i];

      // Skip whitespace
      if (/\s/.test(char)) {
        i++;
        continue;
      }

      // Parentheses
      if (char === "(") {
        tokens.push({ type: "LPAREN", value: "(", position: i });
        i++;
        continue;
      }
      if (char === ")") {
        tokens.push({ type: "RPAREN", value: ")", position: i });
        i++;
        continue;
      }

      // Quoted Phrases
      if (char === '"' || char === "'") {
        const quoteChar = char;
        const startPos = i;
        let value = "";
        i++; // Skip opening quote

        while (i < query.length && query[i] !== quoteChar) {
          if (query[i] === "\\") {
            // Escape character support
            if (i + 1 < query.length) {
              value += query[i + 1];
              i += 2;
            } else {
              throw new BooleanEngineError("Trailing escape character inside quotes", i);
            }
          } else {
            value += query[i];
            i++;
          }
        }

        if (i >= query.length) {
          throw new BooleanEngineError("Unclosed quote string", startPos);
        }

        i++; // Skip closing quote
        tokens.push({ type: "QUOTED_TERM", value, position: startPos });
        continue;
      }

      // Terms, Operators, and Escaped Words
      let termValue = "";
      const startPos = i;

      while (i < query.length && !/[\s()"'']/.test(query[i])) {
        if (query[i] === "\\") {
          // Escape character support for terms
          if (i + 1 < query.length) {
            termValue += query[i + 1];
            i += 2;
          } else {
            throw new BooleanEngineError("Trailing escape character in term", i);
          }
        } else {
          termValue += query[i];
          i++;
        }
      }

      const upperValue = termValue.toUpperCase();
      if (upperValue === "AND") {
        tokens.push({ type: "AND", value: "AND", position: startPos });
      } else if (upperValue === "OR") {
        tokens.push({ type: "OR", value: "OR", position: startPos });
      } else if (upperValue === "NOT") {
        tokens.push({ type: "NOT", value: "NOT", position: startPos });
      } else if (termValue.length > 0) {
        tokens.push({ type: "TERM", value: termValue, position: startPos });
      }
    }

    return tokens;
  }

  /**
   * Validate parenthesis matching and general structure of tokens
   */
  public validate(tokens: { type: string; value: string; position: number }[]) {
    if (tokens.length === 0) {
      throw new BooleanEngineError("Empty query");
    }

    const parenStack: number[] = [];
    
    // Check initial/trailing operators and consecutive operators
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const nextToken = tokens[i + 1];

      if (token.type === "LPAREN") {
        parenStack.push(token.position);
        if (nextToken && nextToken.type === "RPAREN") {
          throw new BooleanEngineError("Empty parentheses group () found", token.position);
        }
      } else if (token.type === "RPAREN") {
        if (parenStack.length === 0) {
          throw new BooleanEngineError("Unmatched closing parenthesis", token.position);
        }
        parenStack.pop();
      }

      // Check binary operator positioning
      if (token.type === "AND" || token.type === "OR") {
        // Cannot be first or last
        if (i === 0) {
          throw new BooleanEngineError(`Binary operator ${token.value} cannot start a query`, token.position);
        }
        if (i === tokens.length - 1) {
          throw new BooleanEngineError(`Trailing binary operator ${token.value}`, token.position);
        }
        
        // Cannot precede/follow LPAREN/RPAREN directly in illegal ways
        if (nextToken && (nextToken.type === "AND" || nextToken.type === "OR" || nextToken.type === "RPAREN")) {
          throw new BooleanEngineError(`Unexpected token ${nextToken.value} after ${token.value}`, nextToken.position);
        }
        
        const prevToken = tokens[i - 1];
        if (prevToken && prevToken.type === "LPAREN") {
          throw new BooleanEngineError(`Binary operator ${token.value} cannot start a sub-group`, token.position);
        }
      }

      // Check NOT positioning
      if (token.type === "NOT") {
        if (i === tokens.length - 1) {
          throw new BooleanEngineError("Trailing NOT operator", token.position);
        }
        if (nextToken && (nextToken.type === "AND" || nextToken.type === "OR" || nextToken.type === "RPAREN")) {
          throw new BooleanEngineError(`Unexpected token ${nextToken.value} after NOT`, nextToken.position);
        }
      }
    }

    if (parenStack.length > 0) {
      throw new BooleanEngineError("Unmatched opening parenthesis", parenStack[0]);
    }
  }

  /**
   * Parse token array into an AST with Operator Precedence: NOT > AND > OR
   */
  public parse(tokens: { type: string; value: string; position: number }[]): ASTNode {
    this.validate(tokens);
    let index = 0;

    const parseExpr = (): ASTNode => {
      let node = parseAndExpr();

      while (index < tokens.length && tokens[index].type === "OR") {
        index++; // Consume OR
        const rightNode = parseAndExpr();
        node = {
          type: "OR",
          children: [node, rightNode],
        };
      }

      return node;
    };

    const parseAndExpr = (): ASTNode => {
      let node = parsePrimaryExpr();

      while (index < tokens.length && tokens[index].type === "AND") {
        index++; // Consume AND
        const rightNode = parsePrimaryExpr();
        node = {
          type: "AND",
          children: [node, rightNode],
        };
      }

      return node;
    };

    const parsePrimaryExpr = (): ASTNode => {
      if (index >= tokens.length) {
        throw new BooleanEngineError("Unexpected end of expression");
      }

      const token = tokens[index];

      if (token.type === "NOT") {
        index++; // Consume NOT
        const childNode = parsePrimaryExpr();
        return {
          type: "NOT",
          children: [childNode],
        };
      }

      if (token.type === "LPAREN") {
        index++; // Consume (
        const node = parseExpr();
        if (index >= tokens.length || tokens[index].type !== "RPAREN") {
          throw new BooleanEngineError("Missing closing parenthesis", token.position);
        }
        index++; // Consume )
        return node;
      }

      if (token.type === "TERM" || token.type === "QUOTED_TERM") {
        index++;
        return {
          type: "TERM",
          value: token.value,
          isQuoted: token.type === "QUOTED_TERM",
          hasWildcard: token.value.includes("*"),
        };
      }

      throw new BooleanEngineError(`Unexpected token type ${token.type}`, token.position);
    };

    const result = parseExpr();
    if (index < tokens.length) {
      throw new BooleanEngineError(`Unexpected token "${tokens[index].value}" without operator`, tokens[index].position);
    }
    return result;
  }

  /**
   * Serialize an ASTNode to a deterministic string to facilitate duplicate detection
   */
  public serializeNode(node: ASTNode): string {
    if (node.type === "TERM") {
      return `TERM:${node.isQuoted ? 'Q' : 'U'}:${node.value}`;
    }
    if (node.type === "NOT" && node.children) {
      return `NOT(${this.serializeNode(node.children[0])})`;
    }
    if (node.children) {
      // Sort children to ensure deterministic duplicate checking for commutative operators (AND, OR)
      const childrenStrings = node.children.map(c => this.serializeNode(c)).sort();
      return `${node.type}(${childrenStrings.join(",")})`;
    }
    return "";
  }

  /**
   * Optimizes the AST:
   * 1. Eliminates double negations (NOT NOT A -> A)
   * 2. Flattens nested associative operators (A AND (B AND C) -> A AND B AND C)
   * 3. Removes duplicates from AND/OR groups
   * 4. Simplifies single-child operator groups
   */
  public optimize(node: ASTNode): ASTNode {
    // base case for terms
    if (node.type === "TERM") {
      return node;
    }

    // Optimize children first
    let optimizedChildren = node.children ? node.children.map(child => this.optimize(child)) : [];

    // 1. Double Negation Elimination
    if (node.type === "NOT") {
      const child = optimizedChildren[0];
      if (child.type === "NOT" && child.children) {
        return child.children[0];
      }
      return { ...node, children: [child] };
    }

    // 2. Flatten associative nested groups (e.g. (A AND B) AND C -> A AND B AND C)
    if (node.type === "AND" || node.type === "OR") {
      const flattened: ASTNode[] = [];
      for (const child of optimizedChildren) {
        if (child.type === node.type && child.children) {
          flattened.push(...child.children);
        } else {
          flattened.push(child);
        }
      }
      optimizedChildren = flattened;
    }

    // 3. Remove duplicates under AND/OR
    if (node.type === "AND" || node.type === "OR") {
      const seen = new Set<string>();
      const uniqueChildren: ASTNode[] = [];
      for (const child of optimizedChildren) {
        const key = this.serializeNode(child);
        if (!seen.has(key)) {
          seen.add(key);
          uniqueChildren.push(child);
        }
      }
      optimizedChildren = uniqueChildren;
    }

    // 4. Simplify single-child groups (e.g. (A) -> A)
    if ((node.type === "AND" || node.type === "OR") && optimizedChildren.length === 1) {
      return optimizedChildren[0];
    }

    return {
      ...node,
      children: optimizedChildren,
    };
  }

  /**
   * Formats AST into a pretty-printed query string with clean nesting structure
   */
  public prettyPrint(node: ASTNode, indentLevel = 0): string {
    const indent = "  ".repeat(indentLevel);
    
    if (node.type === "TERM") {
      const displayVal = node.isQuoted ? `"${node.value}"` : node.value;
      return `${indent}${displayVal}`;
    }

    if (node.type === "NOT" && node.children) {
      const childStr = this.prettyPrint(node.children[0], 0).trim();
      return `${indent}NOT ${childStr}`;
    }

    if (node.children) {
      const op = node.type;
      const childStrings = node.children.map(child => this.prettyPrint(child, indentLevel + 1));
      
      return `${indent}(\n${childStrings.join(`\n${indent}${op}\n`)}\n${indent})`;
    }

    return "";
  }

  /**
   * Formats AST into a standard single-line minimized boolean query string
   */
  public stringify(node: ASTNode): string {
    if (node.type === "TERM") {
      return node.isQuoted ? `"${node.value}"` : node.value || "";
    }
    if (node.type === "NOT" && node.children) {
      const child = node.children[0];
      const childStr = this.stringify(child);
      const needsParens = child.type === "AND" || child.type === "OR";
      return `NOT ${needsParens ? `(${childStr})` : childStr}`;
    }
    if (node.children) {
      const op = ` ${node.type} `;
      const childrenStrings = node.children.map(child => {
        const childStr = this.stringify(child);
        // Add parenthesis to children with lower precedence
        const needsParens = 
          (node.type === "AND" && child.type === "OR") || 
          (node.type === "OR" && (child.type === "AND" || child.type === "OR" && child !== node)); // preserve structural groupings if explicit
        return needsParens ? `(${childStr})` : childStr;
      });
      return childrenStrings.join(op);
    }
    return "";
  }
}
