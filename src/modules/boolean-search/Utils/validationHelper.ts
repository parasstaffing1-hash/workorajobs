export interface Token {
  type: 'operator' | 'keyword' | 'paren_open' | 'paren_close' | 'quoted' | 'modifier' | 'wildcard' | 'whitespace' | 'invalid';
  value: string;
  startIndex: number;
  endIndex: number;
}

export interface ValidationIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  suggestion: string;
  tokenIndex?: number;
  length?: number;
  ruleCategory: 'Syntax' | 'Operators' | 'Parentheses' | 'Quotes' | 'Warnings' | 'Optimization' | 'Compatibility';
}

export interface BooleanStats {
  characters: number;
  words: number;
  operators: number;
  andCount: number;
  orCount: number;
  notCount: number;
  groups: number;
  nestedGroups: number;
  quotes: number;
  wildcards: number;
  siteOperators: number;
  uniqueKeywords: number;
  duplicateKeywords: number;
}

export interface ValidationScore {
  score: number;
  syntax: number;
  readability: number;
  optimization: number;
  compatibility: number;
  maintainability: number;
}

export interface HistoryRecord {
  id: string;
  timestamp: string;
  query: string;
  score: number;
  errorsCount: number;
  warningsCount: number;
  optimizationsApplied: string[];
}

// -------------------------------------------------------------
// 1. TOKENIZER ENGINE
// -------------------------------------------------------------
export function tokenizeBoolean(query: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const len = query.length;

  while (i < len) {
    const char = query[i];

    // Invisible unicode spaces or zero-width characters
    if (char === '\u200B' || char === '\uFEFF' || char === '\u200C' || char === '\u200D') {
      tokens.push({ type: 'invalid', value: char, startIndex: i, endIndex: i + 1 });
      i++;
      continue;
    }

    // Whitespace
    if (/\s/.test(char)) {
      const start = i;
      let val = '';
      while (i < len && /\s/.test(query[i])) {
        val += query[i];
        i++;
      }
      tokens.push({ type: 'whitespace', value: val, startIndex: start, endIndex: i });
      continue;
    }

    // Parentheses
    if (char === '(') {
      tokens.push({ type: 'paren_open', value: '(', startIndex: i, endIndex: i + 1 });
      i++;
      continue;
    }
    if (char === ')') {
      tokens.push({ type: 'paren_close', value: ')', startIndex: i, endIndex: i + 1 });
      i++;
      continue;
    }

    // Quotes
    if (char === '"' || char === '“' || char === '”' || char === '`' || char === '’' || char === '\'') {
      const start = i;
      let val = char;
      const quoteChar = char;
      i++;
      let foundClose = false;
      while (i < len) {
        const nextChar = query[i];
        val += nextChar;
        i++;
        if (nextChar === quoteChar || 
            (quoteChar === '“' && nextChar === '”') || 
            (quoteChar === '”' && nextChar === '“')) {
          foundClose = true;
          break;
        }
      }
      tokens.push({
        type: 'quoted',
        value: val,
        startIndex: start,
        endIndex: i
      });
      continue;
    }

    const subStr = query.slice(i);

    // Modifier operators: site:, filetype:, intitle:, inurl:
    const modifierRegex = /^(site|filetype|intitle|inurl)\s*(:)\s*([^\s()"]+)/i;
    const modMatch = subStr.match(modifierRegex);
    if (modMatch) {
      const fullVal = modMatch[0];
      tokens.push({
        type: 'modifier',
        value: fullVal,
        startIndex: i,
        endIndex: i + fullVal.length
      });
      i += fullVal.length;
      continue;
    }

    // Wildcards (standalone or part of word)
    if (char === '*') {
      tokens.push({ type: 'wildcard', value: '*', startIndex: i, endIndex: i + 1 });
      i++;
      continue;
    }

    // General Words / Keywords / Operators
    const wordRegex = /^[^\s()",“`’']+/;
    const wordMatch = subStr.match(wordRegex);
    if (wordMatch) {
      const val = wordMatch[0];
      const upperVal = val.toUpperCase();
      let type: Token['type'] = 'keyword';

      if (upperVal === 'AND' || upperVal === 'OR' || upperVal === 'NOT') {
        type = 'operator';
      } else if (val.includes('*')) {
        type = 'wildcard';
      }

      tokens.push({
        type,
        value: val,
        startIndex: i,
        endIndex: i + val.length
      });
      i += val.length;
      continue;
    }

    // Fallback invalid character
    tokens.push({
      type: 'invalid',
      value: char,
      startIndex: i,
      endIndex: i + 1
    });
    i++;
  }

  return tokens;
}

// -------------------------------------------------------------
// 2. PARSER & TREE GENERATOR
// -------------------------------------------------------------
export interface TreeGroupNode {
  id: string;
  type: 'Group';
  children: TreeNode[];
  openToken?: Token;
  closeToken?: Token;
  closed: boolean;
  operatorType?: 'AND' | 'OR' | 'NOT' | 'Mixed';
}

export interface TreeLeafNode {
  id: string;
  type: 'Keyword' | 'Quoted' | 'Operator' | 'Modifier' | 'Wildcard' | 'Error';
  value: string;
  token: Token;
}

export type TreeNode = TreeGroupNode | TreeLeafNode;

export function buildBooleanTree(tokens: Token[]): TreeNode[] {
  const root: TreeNode[] = [];
  const stack: TreeNode[][] = [root];
  const parenStack: TreeGroupNode[] = [];

  const nonWhitespace = tokens.filter(t => t.type !== 'whitespace');

  for (const token of nonWhitespace) {
    if (token.type === 'paren_open') {
      const newGroup: TreeGroupNode = {
        id: `tree-group-${token.startIndex}`,
        type: 'Group',
        children: [],
        openToken: token,
        closed: false
      };
      stack[stack.length - 1].push(newGroup);
      stack.push(newGroup.children);
      parenStack.push(newGroup);
    } else if (token.type === 'paren_close') {
      if (stack.length > 1) {
        stack.pop();
        const group = parenStack.pop();
        if (group) {
          group.closeToken = token;
          group.closed = true;
          // Analyze children operator types
          const ops = group.children.filter((c): c is TreeLeafNode => c.type === 'Operator');
          if (ops.length > 0) {
            const firstOp = ops[0].value.toUpperCase();
            const allSame = ops.every(o => o.value.toUpperCase() === firstOp);
            group.operatorType = allSame ? (firstOp as any) : 'Mixed';
          }
        }
      } else {
        root.push({
          id: `unmatched-close-${token.startIndex}`,
          type: 'Error',
          value: ')',
          token
        });
      }
    } else {
      let leafType: TreeLeafNode['type'] = 'Keyword';
      if (token.type === 'operator') leafType = 'Operator';
      else if (token.type === 'quoted') leafType = 'Quoted';
      else if (token.type === 'modifier') leafType = 'Modifier';
      else if (token.type === 'wildcard') leafType = 'Wildcard';
      else if (token.type === 'invalid') leafType = 'Error';

      stack[stack.length - 1].push({
        id: `tree-leaf-${token.startIndex}`,
        type: leafType,
        value: token.value,
        token
      });
    }
  }

  // Handle unclosed groups
  while (parenStack.length > 0) {
    const group = parenStack.pop();
    if (group) {
      group.closed = false;
    }
  }

  return root;
}

// -------------------------------------------------------------
// 3. VALIDATION ENGINE (30+ RULES)
// -------------------------------------------------------------
export function validateBooleanQuery(query: string, tokens: Token[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!query.trim()) return [];

  const nonWhitespace = tokens.filter(t => t.type !== 'whitespace');

  // Rule 1 & 2: Missing opening & closing parentheses / Parentheses Balance
  let openCount = 0;
  let closeCount = 0;
  let parenDepth = 0;
  let hasCrossedParens = false;

  for (let idx = 0; idx < tokens.length; idx++) {
    const t = tokens[idx];
    if (t.type === 'paren_open') {
      openCount++;
      parenDepth++;
    } else if (t.type === 'paren_close') {
      closeCount++;
      parenDepth--;
      if (parenDepth < 0) {
        hasCrossedParens = true;
      }
    }
  }

  if (openCount < closeCount) {
    issues.push({
      id: 'missing-open-paren',
      type: 'error',
      message: `Unmatched closing parenthesis. Found ${closeCount} ')' vs ${openCount} '('.`,
      suggestion: 'You have too many closing brackets. Add missing opening parentheses or delete extra closing ones.',
      ruleCategory: 'Parentheses'
    });
  } else if (openCount > closeCount) {
    issues.push({
      id: 'missing-close-paren',
      type: 'error',
      message: `Unclosed opening parenthesis. Found ${openCount} '(' vs ${closeCount} ')'.`,
      suggestion: 'All opening brackets must be closed. Add a closing parenthesis ")" at the end of your grouping.',
      ruleCategory: 'Parentheses'
    });
  }

  if (hasCrossedParens) {
    issues.push({
      id: 'crossed-parentheses',
      type: 'error',
      message: 'Improperly balanced parentheses sequence.',
      suggestion: 'A closing bracket ")" was typed before an opening bracket "(". Rearrange parenthesis nesting flow.',
      ruleCategory: 'Parentheses'
    });
  }

  // Rule 3, 4, 5: Double Operator checks
  for (let idx = 0; idx < nonWhitespace.length - 1; idx++) {
    const curr = nonWhitespace[idx];
    const next = nonWhitespace[idx + 1];

    if (curr.type === 'operator' && next.type === 'operator') {
      const curVal = curr.value.toUpperCase();
      const nextVal = next.value.toUpperCase();

      if (curVal === nextVal) {
        issues.push({
          id: `double-${curVal.toLowerCase()}-${curr.startIndex}`,
          type: 'error',
          message: `Consecutive duplicate operator "${curr.value} ${next.value}" found.`,
          suggestion: `Remove one of the duplicate logical operators. Double logical operators cause parser failure.`,
          tokenIndex: curr.startIndex,
          length: next.endIndex - curr.startIndex,
          ruleCategory: 'Operators'
        });
      } else if ((curVal === 'AND' && nextVal === 'OR') || (curVal === 'OR' && nextVal === 'AND')) {
        // Rule 6 & 7: AND OR together / OR AND together
        issues.push({
          id: `consecutive-mixed-${curr.startIndex}`,
          type: 'error',
          message: `Conflicting operators together: "${curr.value} ${next.value}".`,
          suggestion: 'Logical operators cannot be written directly back-to-back. Remove one or separate with keywords.',
          tokenIndex: curr.startIndex,
          length: next.endIndex - curr.startIndex,
          ruleCategory: 'Operators'
        });
      }
    }
  }

  // Rule 8 & 9: Operator at beginning / end
  if (nonWhitespace.length > 0) {
    const first = nonWhitespace[0];
    const last = nonWhitespace[nonWhitespace.length - 1];

    if (first.type === 'operator') {
      const firstVal = first.value.toUpperCase();
      if (firstVal === 'AND' || firstVal === 'OR') {
        issues.push({
          id: 'operator-at-beginning',
          type: 'error',
          message: `Query starts with leading operator "${first.value}".`,
          suggestion: 'Remove the logical operator from the very beginning. Search strings must start with search terms.',
          tokenIndex: first.startIndex,
          length: first.value.length,
          ruleCategory: 'Operators'
        });
      }
    }

    if (last.type === 'operator') {
      issues.push({
        id: 'operator-at-end',
        type: 'error',
        message: `Query ends with trailing operator "${last.value}".`,
        suggestion: 'Remove the operator from the end. Queries cannot end with active logical gates.',
        tokenIndex: last.startIndex,
        length: last.value.length,
        ruleCategory: 'Operators'
      });
    }
  }

  // Rule 10, 11, 12: Quotation mark checks
  const rawQuoteCount = (query.match(/"/g) || []).length;
  const curlyOpenCount = (query.match(/“/g) || []).length;
  const curlyCloseCount = (query.match(/”/g) || []).length;
  const singleQuoteCount = (query.match(/'/g) || []).length;

  if (rawQuoteCount % 2 !== 0) {
    issues.push({
      id: 'unclosed-quotes',
      type: 'error',
      message: 'Unclosed double quotation marks (").',
      suggestion: 'Every open quotation mark must have a matching partner. Close your exact phrase search group.',
      ruleCategory: 'Quotes'
    });
  }

  if (curlyOpenCount > 0 || curlyCloseCount > 0) {
    issues.push({
      id: 'smart-quotes-warning',
      type: 'warning',
      message: 'Smart / Curly quotes detected (“ or ”).',
      suggestion: 'Engines only recognize straight quotes ("). Smart quotes copied from Word/Mac will break query bounds.',
      ruleCategory: 'Quotes'
    });
  }

  if (singleQuoteCount > 0) {
    issues.push({
      id: 'single-quotes-warning',
      type: 'warning',
      message: 'Single quotes used instead of double quotes.',
      suggestion: 'Recruiting portals require standard double quotes (") for exact phrase searches. Single quotes (\') might be ignored.',
      ruleCategory: 'Quotes'
    });
  }

  // Token-specific issues
  for (let idx = 0; idx < tokens.length; idx++) {
    const t = tokens[idx];

    // Rule 12: Nested quotes inside quoted string
    if (t.type === 'quoted') {
      const innerStr = t.value.slice(1, -1);
      if (innerStr.includes('"') || innerStr.includes('“') || innerStr.includes('”')) {
        issues.push({
          id: `nested-quotes-${t.startIndex}`,
          type: 'error',
          message: 'Nested quotation marks found inside exact phrase.',
          suggestion: 'Sourcing engines do not support nested quotes. Simplify your exact phrase block.',
          tokenIndex: t.startIndex,
          length: t.value.length,
          ruleCategory: 'Quotes'
        });
      }
      // Rule 18: Empty quotes
      if (!innerStr.trim()) {
        issues.push({
          id: `empty-quotes-${t.startIndex}`,
          type: 'warning',
          message: 'Empty or blank exact-phrase quotes found.',
          suggestion: 'Remove empty double quotes "" to prevent engine confusion.',
          tokenIndex: t.startIndex,
          length: t.value.length,
          ruleCategory: 'Quotes'
        });
      }
    }

    // Rule 13: Multiple consecutive spaces outside quotes
    if (t.type === 'whitespace' && t.value.length > 1) {
      issues.push({
        id: `multiple-spaces-${t.startIndex}`,
        type: 'info',
        message: 'Redundant consecutive spaces found.',
        suggestion: 'Clean up extra spacing. Sourcing platforms interpret excessive spaces as distinct terms or compile errors.',
        tokenIndex: t.startIndex,
        length: t.value.length,
        ruleCategory: 'Warnings'
      });
    }

    // Rule 15: Invalid Characters
    if (t.type === 'invalid') {
      // Check if invisible unicode
      if (t.value === '\u200B' || t.value === '\u00A0' || t.value === '\uFEFF' || t.value === '\u200C') {
        issues.push({
          id: `invisible-unicode-${t.startIndex}`,
          type: 'error',
          message: 'Invisible Unicode / Zero-width space character detected.',
          suggestion: 'Remove invisible characters. They often cause direct, unexplained failures in search engines.',
          tokenIndex: t.startIndex,
          length: 1,
          ruleCategory: 'Warnings'
        });
      } else {
        issues.push({
          id: `invalid-char-${t.startIndex}`,
          type: 'warning',
          message: `Unrecognized character symbol "${t.value}".`,
          suggestion: `Symbols like ${t.value} are stripped by most engines. Use alphanumeric words or standard operators.`,
          tokenIndex: t.startIndex,
          length: t.value.length,
          ruleCategory: 'Warnings'
        });
      }
    }

    // Rule 20: Improper wildcards placement
    if (t.type === 'wildcard') {
      if (t.value === '*') {
        issues.push({
          id: `standalone-wildcard-${t.startIndex}`,
          type: 'warning',
          message: 'Standalone asterisk "*" wildcard.',
          suggestion: 'Standalone asterisks can cause massive spam or are completely ignored. Use wildcards as suffix (e.g. recruit*).',
          tokenIndex: t.startIndex,
          length: 1,
          ruleCategory: 'Warnings'
        });
      } else {
        // e.g. *developer, de**veloper, dev*er
        if (t.value.startsWith('*')) {
          issues.push({
            id: `leading-wildcard-${t.startIndex}`,
            type: 'error',
            message: `Leading wildcard "${t.value}" is unsupported.`,
            suggestion: 'Search portals only support wildcards at the end of word roots (e.g., develop* rather than *veloper).',
            tokenIndex: t.startIndex,
            length: t.value.length,
            ruleCategory: 'Warnings'
          });
        }
        if (t.value.includes('**')) {
          issues.push({
            id: `consecutive-wildcards-${t.startIndex}`,
            type: 'error',
            message: `Double asterisk wildcard "${t.value}".`,
            suggestion: 'Use a single wildcard character at the end of the root term (e.g., direct*).',
            tokenIndex: t.startIndex,
            length: t.value.length,
            ruleCategory: 'Warnings'
          });
        }
        const rootWord = t.value.replace(/\*/g, '');
        if (rootWord.length < 3) {
          issues.push({
            id: `short-wildcard-${t.startIndex}`,
            type: 'warning',
            message: `Short wildcard root term: "${t.value}".`,
            suggestion: 'Wildcard roots should be at least 3 characters long (e.g. dev*) to prevent extremely noisy matching.',
            tokenIndex: t.startIndex,
            length: t.value.length,
            ruleCategory: 'Warnings'
          });
        }
      }
    }

    // Rule 27-30: Invalid modifiers syntax (site, filetype, etc.)
    if (t.type === 'modifier') {
      const parts = t.value.split(':');
      const op = parts[0];
      const val = parts.slice(1).join(':');

      if (t.value.includes(' :') || t.value.includes(': ')) {
        issues.push({
          id: `space-modifier-${t.startIndex}`,
          type: 'error',
          message: `Spacing around modifier colon in "${t.value}".`,
          suggestion: `Remove spaces between colon (e.g., "site:linkedin.com" instead of "site: linkedin.com").`,
          tokenIndex: t.startIndex,
          length: t.value.length,
          ruleCategory: 'Syntax'
        });
      }

      if (op.toLowerCase() === 'filetype') {
        const ext = val.toLowerCase();
        if (!['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'rtf', 'txt'].includes(ext)) {
          issues.push({
            id: `invalid-filetype-${t.startIndex}`,
            type: 'warning',
            message: `Uncommon or invalid file type extension "${val}".`,
            suggestion: 'Sourcing search filters usually support standard document formats: pdf, doc, docx, txt.',
            tokenIndex: t.startIndex,
            length: t.value.length,
            ruleCategory: 'Syntax'
          });
        }
      }

      if (op.toLowerCase() === 'site') {
        if (!val.includes('.') || val.length < 4) {
          issues.push({
            id: `invalid-site-${t.startIndex}`,
            type: 'warning',
            message: `Suspicious site domain filter: "${val}".`,
            suggestion: 'Ensure the domain contains a valid TLD suffix (e.g., site:linkedin.com or site:github.com).',
            tokenIndex: t.startIndex,
            length: t.value.length,
            ruleCategory: 'Syntax'
          });
        }
      }
    }
  }

  // Bracket nesting rule detections (Empty brackets, Casing)
  for (let idx = 0; idx < nonWhitespace.length - 1; idx++) {
    const curr = nonWhitespace[idx];
    const next = nonWhitespace[idx + 1];

    // Rule 17: Empty parenthesis ( )
    if (curr.type === 'paren_open' && next.type === 'paren_close') {
      issues.push({
        id: `empty-paren-${curr.startIndex}`,
        type: 'error',
        message: 'Empty parenthesis block "()" detected.',
        suggestion: 'Remove empty bracket blocks or add valid keyword search arguments inside.',
        tokenIndex: curr.startIndex,
        length: next.endIndex - curr.startIndex,
        ruleCategory: 'Parentheses'
      });
    }

    // Bracket with dangling operator inside e.g. ( AND Java) or (Java OR)
    if (curr.type === 'paren_open' && next.type === 'operator') {
      issues.push({
        id: `dangling-op-open-paren-${next.startIndex}`,
        type: 'error',
        message: `Dangling operator "${next.value}" immediately following open bracket.`,
        suggestion: 'Delete the redundant operator from the beginning of the parenthesis group.',
        tokenIndex: next.startIndex,
        length: next.value.length,
        ruleCategory: 'Operators'
      });
    }

    if (curr.type === 'operator' && next.type === 'paren_close') {
      issues.push({
        id: `dangling-op-close-paren-${curr.startIndex}`,
        type: 'error',
        message: `Dangling operator "${curr.value}" before closing bracket.`,
        suggestion: 'Delete the trailing operator from the end of the parenthesis group.',
        tokenIndex: curr.startIndex,
        length: curr.value.length,
        ruleCategory: 'Operators'
      });
    }
  }

  // Rule 21: Lowercase operators logic (and, or, not)
  const lowercaseMatches = query.match(/\b(and|or|not)\b/g);
  if (lowercaseMatches && lowercaseMatches.length > 0) {
    const distinct = Array.from(new Set(lowercaseMatches));
    issues.push({
      id: 'lowercase-operators',
      type: 'warning',
      message: `Lowercase logical operators: ${distinct.map(o => `"${o}"`).join(', ')}.`,
      suggestion: 'Engines require fully CAPITALIZED operators (AND, OR, NOT). Lowercase operators are searched as literals.',
      ruleCategory: 'Syntax'
    });
  }

  // Duplicate checks & Group parsing optimizations
  const keywords = nonWhitespace.filter(t => t.type === 'keyword' || t.type === 'quoted').map(t => {
    return t.type === 'quoted' ? t.value.slice(1, -1).toLowerCase().trim() : t.value.toLowerCase().trim();
  });

  // Rule 14: Duplicate overall keywords count
  const wordCounts: Record<string, number> = {};
  for (const kw of keywords) {
    if (kw) {
      wordCounts[kw] = (wordCounts[kw] || 0) + 1;
    }
  }

  const duplicates = Object.keys(wordCounts).filter(k => wordCounts[k] > 1);
  if (duplicates.length > 0) {
    issues.push({
      id: 'duplicate-keywords',
      type: 'info',
      message: `Duplicate search keywords found: ${duplicates.map(d => `"${d}"`).join(', ')}.`,
      suggestion: 'Remove redundant terms. Keeping search strings concise reduces platform computation caps.',
      ruleCategory: 'Optimization'
    });
  }

  // Rule 16: Duplicate parenthesis groups
  const groupTexts: string[] = [];
  let parenDepth2 = 0;
  let activeGroupStart = -1;

  for (let idx = 0; idx < tokens.length; idx++) {
    const t = tokens[idx];
    if (t.type === 'paren_open') {
      if (parenDepth2 === 0) activeGroupStart = t.startIndex;
      parenDepth2++;
    } else if (t.type === 'paren_close') {
      parenDepth2--;
      if (parenDepth2 === 0 && activeGroupStart !== -1) {
        const grpStr = query.substring(activeGroupStart, t.endIndex).trim();
        groupTexts.push(grpStr.toLowerCase());
      }
    }
  }

  const groupCounts: Record<string, number> = {};
  for (const grp of groupTexts) {
    groupCounts[grp] = (groupCounts[grp] || 0) + 1;
  }
  const duplicateGroups = Object.keys(groupCounts).filter(g => groupCounts[g] > 1);
  if (duplicateGroups.length > 0) {
    issues.push({
      id: 'duplicate-groups',
      type: 'warning',
      message: 'Redundant duplicate parenthesis groups found.',
      suggestion: 'Optimize your query by deleting repeating bracket parameters.',
      ruleCategory: 'Optimization'
    });
  }

  // Rule 25: Repeated exclusions (NOT Manager NOT Director NOT Lead)
  const notIndices: number[] = [];
  for (let idx = 0; idx < nonWhitespace.length; idx++) {
    if (nonWhitespace[idx].type === 'operator' && nonWhitespace[idx].value.toUpperCase() === 'NOT') {
      notIndices.push(idx);
    }
  }
  
  if (notIndices.length >= 3) {
    // Check if consecutive NOT clauses exist
    let sequence = 0;
    for (let idx = 0; idx < notIndices.length - 1; idx++) {
      if (notIndices[idx + 1] - notIndices[idx] <= 3) {
        sequence++;
      }
    }
    if (sequence >= 2) {
      issues.push({
        id: 'repeated-exclusions',
        type: 'info',
        message: 'Repeated sequential "NOT" exclusions found.',
        suggestion: 'Optimize clarity by nesting exclusions inside a single NOT clause: e.g., NOT (Manager OR Director OR Lead).',
        ruleCategory: 'Optimization'
      });
    }
  }

  return issues;
}

// -------------------------------------------------------------
// 4. STATS ENGINE
// -------------------------------------------------------------
export function calculateBooleanStats(query: string, tokens: Token[]): BooleanStats {
  const nonWhitespace = tokens.filter(t => t.type !== 'whitespace');

  const chars = query.length;
  const words = nonWhitespace.filter(t => t.type === 'keyword' || t.type === 'quoted' || t.type === 'wildcard').length;
  const operators = nonWhitespace.filter(t => t.type === 'operator').length;

  let andCount = 0;
  let orCount = 0;
  let notCount = 0;
  for (const t of nonWhitespace) {
    if (t.type === 'operator') {
      const up = t.value.toUpperCase();
      if (up === 'AND') andCount++;
      else if (up === 'OR') orCount++;
      else if (up === 'NOT') notCount++;
    }
  }

  // Count groups and nesting level
  let groups = 0;
  let maxNesting = 0;
  let currentNesting = 0;

  for (const t of nonWhitespace) {
    if (t.type === 'paren_open') {
      groups++;
      currentNesting++;
      if (currentNesting > maxNesting) maxNesting = currentNesting;
    } else if (t.type === 'paren_close') {
      currentNesting = Math.max(0, currentNesting - 1);
    }
  }

  const quotesCount = nonWhitespace.filter(t => t.type === 'quoted').length;
  const wildcardsCount = nonWhitespace.filter(t => t.type === 'wildcard').length;
  const siteOperators = nonWhitespace.filter(t => t.type === 'modifier').length;

  // Keyword counts & duplicates
  const kwList = nonWhitespace.filter(t => t.type === 'keyword' || t.type === 'quoted').map(t => {
    return t.type === 'quoted' ? t.value.slice(1, -1).toLowerCase().trim() : t.value.toLowerCase().trim();
  }).filter(Boolean);

  const distinctKws = new Set(kwList);
  const uniqueKeywords = distinctKws.size;
  const duplicateKeywords = Math.max(0, kwList.length - uniqueKeywords);

  return {
    characters: chars,
    words,
    operators,
    andCount,
    orCount,
    notCount,
    groups,
    nestedGroups: Math.max(0, maxNesting - 1),
    quotes: quotesCount,
    wildcards: wildcardsCount,
    siteOperators,
    uniqueKeywords,
    duplicateKeywords
  };
}

// -------------------------------------------------------------
// 5. BOOLEAN SCORING ENGINE (0-100)
// -------------------------------------------------------------
export function computeValidationScore(stats: BooleanStats, issues: ValidationIssue[]): ValidationScore {
  let syntaxScore = 100;
  let readabilityScore = 100;
  let optimizationScore = 100;
  let compatibilityScore = 100;
  let maintainabilityScore = 100;

  for (const issue of issues) {
    if (issue.type === 'error') {
      syntaxScore -= 18;
      optimizationScore -= 5;
      maintainabilityScore -= 8;
    } else if (issue.type === 'warning') {
      syntaxScore -= 6;
      readabilityScore -= 4;
      compatibilityScore -= 8;
    } else if (issue.type === 'info') {
      optimizationScore -= 6;
      readabilityScore -= 4;
      maintainabilityScore -= 4;
    }
  }

  // Length penalty
  if (stats.characters > 2000) {
    readabilityScore -= 15;
    maintainabilityScore -= 10;
  } else if (stats.characters > 1000) {
    readabilityScore -= 8;
  }

  // Nesting depth penalty
  if (stats.nestedGroups > 3) {
    readabilityScore -= 12;
    maintainabilityScore -= 8;
  } else if (stats.nestedGroups > 1) {
    readabilityScore -= 4;
  }

  // Duplicate keywords/groups penalty
  if (stats.duplicateKeywords > 0) {
    optimizationScore -= Math.min(15, stats.duplicateKeywords * 3);
  }

  // Constrain scores between 0 and 100
  syntaxScore = Math.max(0, Math.min(100, syntaxScore));
  readabilityScore = Math.max(0, Math.min(100, readabilityScore));
  optimizationScore = Math.max(0, Math.min(100, optimizationScore));
  compatibilityScore = Math.max(0, Math.min(100, compatibilityScore));
  maintainabilityScore = Math.max(0, Math.min(100, maintainabilityScore));

  const finalScore = Math.round(
    syntaxScore * 0.35 +
    readabilityScore * 0.20 +
    optimizationScore * 0.20 +
    compatibilityScore * 0.15 +
    maintainabilityScore * 0.10
  );

  return {
    score: Math.max(0, Math.min(100, finalScore)),
    syntax: syntaxScore,
    readability: readabilityScore,
    optimization: optimizationScore,
    compatibility: compatibilityScore,
    maintainability: maintainabilityScore
  };
}

// -------------------------------------------------------------
// 6. SEARCH COMPLEXITY INDICATOR
// -------------------------------------------------------------
export function getSearchComplexity(stats: BooleanStats): { level: 'Low' | 'Medium' | 'High' | 'Very High' | 'Enterprise'; color: string; desc: string } {
  const score = stats.words + stats.operators * 1.5 + stats.groups * 2 + stats.nestedGroups * 4;

  if (score < 8) {
    return {
      level: 'Low',
      color: 'text-emerald-500 bg-emerald-500/10',
      desc: 'Simple search. Ideal for single-platform sourcing or basic filters.'
    };
  } else if (score < 18) {
    return {
      level: 'Medium',
      color: 'text-sky-500 bg-sky-500/10',
      desc: 'Standard professional search string. Balanced readability and selectivity.'
    };
  } else if (score < 35) {
    return {
      level: 'High',
      color: 'text-indigo-500 bg-indigo-500/10',
      desc: 'Highly structured query. Targets precise professional synonyms and skills.'
    };
  } else if (score < 65) {
    return {
      level: 'Very High',
      color: 'text-amber-500 bg-amber-500/10',
      desc: 'Complex multi-branch profile query. Built for advanced candidate targeting.'
    };
  } else {
    return {
      level: 'Enterprise',
      color: 'text-rose-500 bg-rose-500/10',
      desc: 'Full-scope sourcing matrix. Harnesses extensive synonyms, location maps, and exclusions.'
    };
  }
}

// -------------------------------------------------------------
// 7. SEARCH BREADTH / SPECIFICITY ANALYSIS
// -------------------------------------------------------------
export function analyzeSearchQuality(stats: BooleanStats): { breadth: 'Too Broad' | 'Broad' | 'Balanced' | 'Specific' | 'Very Specific' | 'Likely Too Narrow'; color: string; feedback: string } {
  const kw = stats.words;
  const or = stats.orCount;
  const and = stats.andCount;
  const not = stats.notCount;

  if (kw === 0) {
    return {
      breadth: 'Too Broad',
      color: 'text-red-500 border-red-500/20 bg-red-500/5',
      feedback: 'Empty search criteria. Provide search terms to execute query.'
    };
  }

  // Extreme narrow case
  if (and > 6 && or === 0) {
    return {
      breadth: 'Likely Too Narrow',
      color: 'text-red-500 border-red-500/20 bg-red-500/5',
      feedback: 'Highly restrictive AND sequence. Likely to yield zero results. Add synonyms using OR.'
    };
  }

  const index = or - and + not * 0.5;

  if (index > 15) {
    return {
      breadth: 'Too Broad',
      color: 'text-red-400 border-red-400/20 bg-red-400/5',
      feedback: 'Massive synonym pools. Risk of extremely noisy candidate lists.'
    };
  } else if (index > 6) {
    return {
      breadth: 'Broad',
      color: 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5',
      feedback: 'Inclusive terms. Good for exploratory search, but expects manual screening.'
    };
  } else if (index >= -1 && index <= 5) {
    return {
      breadth: 'Balanced',
      color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
      feedback: 'Optimal balance of roles and target keywords. High probability of relevant matches.'
    };
  } else if (index >= -5 && index < -1) {
    return {
      breadth: 'Specific',
      color: 'text-indigo-500 border-indigo-500/20 bg-indigo-500/5',
      feedback: 'Highly targeted roles and skills. Focuses on exact profile specifications.'
    };
  } else {
    return {
      breadth: 'Very Specific',
      color: 'text-fuchsia-500 border-fuchsia-500/20 bg-fuchsia-500/5',
      feedback: 'Niche profiles. Best for surgical targeting of uncommon passive skillsets.'
    };
  }
}

// -------------------------------------------------------------
// 8. ESTIMATED RESULTS METRICS
// -------------------------------------------------------------
export function getSearchEstimation(stats: BooleanStats) {
  const kw = stats.words;
  const or = stats.orCount;
  const and = stats.andCount;

  if (kw === 0) {
    return { specificity: 0, zeroRisk: 100, manyRisk: 0 };
  }

  // Calculate specificity percentage (0-100)
  // Higher ANDs increases specificity, Higher ORs reduces it
  let spec = 20 + and * 12 - or * 3;
  spec = Math.max(5, Math.min(98, spec));

  // Risk of Zero Results (0-100)
  let zeroRisk = and * 15 - or * 4;
  if (stats.characters > 1500) zeroRisk += 15;
  zeroRisk = Math.max(0, Math.min(95, zeroRisk));

  // Risk of Too Many Results (0-100)
  let manyRisk = or * 15 - and * 10;
  if (stats.characters < 50) manyRisk += 30;
  manyRisk = Math.max(0, Math.min(95, manyRisk));

  return {
    specificity: Math.round(spec),
    zeroRisk: Math.round(zeroRisk),
    manyRisk: Math.round(manyRisk)
  };
}

// -------------------------------------------------------------
// 9. COMPATIBILITY ENGINE
// -------------------------------------------------------------
export interface CompatibilityState {
  name: string;
  status: 'Supported' | 'Partially Supported' | 'Unsupported';
  notes: string;
}

export function getPlatformCompatibility(stats: BooleanStats, query: string, tokens: Token[]): CompatibilityState[] {
  const platforms = [
    'Google', 'LinkedIn', 'LinkedIn Recruiter', 'GitHub', 'GitLab', 
    'Stack Overflow', 'Indeed', 'Naukri', 'Monster', 'Dice', 
    'Wellfound', 'Xing', 'CareerBuilder'
  ];

  const hasModifiers = tokens.some(t => t.type === 'modifier');
  const hasWildcards = tokens.some(t => t.type === 'wildcard');
  const hasSmartQuotes = query.includes('“') || query.includes('”');
  const len = query.length;

  return platforms.map(plat => {
    let status: 'Supported' | 'Partially Supported' | 'Unsupported' = 'Supported';
    let notes = 'Full syntactic compatibility verified.';

    if (hasSmartQuotes) {
      status = 'Unsupported';
      notes = 'Curly quotes completely break query evaluation.';
      return { name: plat, status, notes };
    }

    switch (plat) {
      case 'Google':
        if (len > 2000 || stats.words > 32) {
          status = 'Partially Supported';
          notes = 'Search term count exceeds Google\'s 32-word cap. Terms past 32 are ignored.';
        } else if (stats.notCount > 0 && query.includes('NOT ')) {
          status = 'Partially Supported';
          notes = 'Requires "-" character prefix instead of the "NOT" operator keyword.';
        } else {
          notes = 'Supports modifier strings like "site:" and "filetype:".';
        }
        break;

      case 'LinkedIn':
        if (hasModifiers) {
          status = 'Unsupported';
          notes = 'Site/filetype modifier blocks are ignored or crash standard search bar.';
        } else if (len > 2000) {
          status = 'Partially Supported';
          notes = 'Approaching character limit cap of 2000. Large lists may fail.';
        } else if (hasWildcards) {
          status = 'Partially Supported';
          notes = 'Wildcard root expansion is poorly supported or skipped.';
        }
        break;

      case 'LinkedIn Recruiter':
        if (hasModifiers) {
          status = 'Unsupported';
          notes = 'Sourcing modifier filters are not supported in profile keyword panels.';
        } else if (len > 8000) {
          status = 'Partially Supported';
          notes = 'Extremely long. Exceeds recruiter text inputs limits.';
        }
        break;

      case 'GitHub':
        if (hasModifiers && !query.includes('site:github.com')) {
          status = 'Unsupported';
          notes = 'Only github-specific code modifiers are valid in search.';
        } else if (stats.groups > 2) {
          status = 'Partially Supported';
          notes = 'Heavy parenthesized trees can lead to parser limits.';
        }
        break;

      case 'Indeed':
      case 'Monster':
      case 'CareerBuilder':
        if (hasModifiers) {
          status = 'Unsupported';
          notes = 'Site crawling syntax is invalid on native boards.';
        }
        break;

      case 'Dice':
        if (hasModifiers) {
          status = 'Unsupported';
          notes = 'Modifiers are ignored. Only standard keyword boolean is active.';
        } else if (hasWildcards) {
          notes = 'Fully supports suffix wildcards (e.g. recruit*).';
        }
        break;

      case 'Wellfound':
        if (stats.groups > 0 || stats.orCount > 0) {
          status = 'Unsupported';
          notes = 'Does not support parentheses or OR operators. Only tags-based query.';
        }
        break;

      default:
        if (hasModifiers) {
          status = 'Unsupported';
          notes = 'Site modifiers are generally exclusive to web search engines.';
        }
        break;
    }

    return { name: plat, status, notes };
  });
}

// -------------------------------------------------------------
// 10. FORMATTER ENGINE (BEAUTIFY, COMPRESS, NORMALIZE, SORT)
// -------------------------------------------------------------
export function formatBooleanQuery(query: string, action: 'beautify' | 'compress' | 'normalize' | 'removeSpaces' | 'sortKeywords'): string {
  if (!query.trim()) return '';

  let cleaned = query;

  // Casing of operators
  cleaned = cleaned.replace(/\b(and)\b/g, 'AND');
  cleaned = cleaned.replace(/\b(or)\b/g, 'OR');
  cleaned = cleaned.replace(/\b(not)\b/g, 'NOT');

  // Straight quotes
  cleaned = cleaned.replace(/[“”]/g, '"');
  cleaned = cleaned.replace(/[‘’']/g, '\'');

  if (action === 'compress') {
    // Single line, minified spacing
    return cleaned.replace(/\s+/g, ' ')
                  .replace(/\s*\(\s*/g, '(')
                  .replace(/\s*\)\s*/g, ')')
                  .trim();
  }

  if (action === 'removeSpaces') {
    // Just remove extra spaces outside quotes
    const tokens = tokenizeBoolean(cleaned);
    return tokens.map(t => {
      if (t.type === 'whitespace') return ' ';
      return t.value;
    }).join('').replace(/\s*\(\s*/g, ' (').replace(/\s*\)\s*/g, ') ').replace(/\s+/g, ' ').trim();
  }

  if (action === 'normalize') {
    const tokens = tokenizeBoolean(cleaned);
    let output = '';
    for (const t of tokens) {
      if (t.type === 'operator') {
        output += t.value.toUpperCase();
      } else if (t.type === 'whitespace') {
        output += ' ';
      } else {
        output += t.value;
      }
    }
    return output.replace(/\s+/g, ' ').trim();
  }

  if (action === 'sortKeywords') {
    // Inside parenthesis (A OR B OR C) - Sort keywords alphabetically
    // We can find matching parenthesized groups and sort items split by OR/AND
    // Let's implement a clean regex replacement for any OR blocks
    const tokens = tokenizeBoolean(cleaned);
    const tree = buildBooleanTree(tokens);

    const sortGroupNode = (node: TreeNode): string => {
      if (node.type === 'Group') {
        if (node.operatorType === 'OR' || node.operatorType === 'AND') {
          // It's a homogenous group (Java OR Kotlin OR C#)
          const kids = node.children.filter(c => c.type !== 'Operator');
          const sortedKidsStr = kids.map(k => sortGroupNode(k)).sort((a, b) => a.localeCompare(b));
          const op = node.operatorType;
          return `(${sortedKidsStr.join(` ${op} `)})`;
        } else {
          // Mixed group
          const inner = node.children.map(c => sortGroupNode(c)).join(' ');
          return `(${inner})`;
        }
      } else if (node.type === 'Operator') {
        return node.value.toUpperCase();
      } else {
        return node.value;
      }
    };

    const sortedOutput = tree.map(n => sortGroupNode(n)).join(' ');
    return sortedOutput.replace(/\s+/g, ' ').trim();
  }

  if (action === 'beautify') {
    // Beautiful tree formatting
    const tokens = tokenizeBoolean(cleaned);
    const tree = buildBooleanTree(tokens);

    const formatNode = (nodes: TreeNode[], depth: number): string => {
      const indent = '  '.repeat(depth);
      const parts: string[] = [];

      for (let idx = 0; idx < nodes.length; idx++) {
        const node = nodes[idx];

        if (node.type === 'Group') {
          const innerStr = formatNode(node.children, depth + 1);
          if (innerStr.includes('\n') || innerStr.length > 50) {
            parts.push(`\n${indent}(\n${innerStr}\n${indent})`);
          } else {
            parts.push(`(${innerStr.trim()})`);
          }
        } else if (node.type === 'Operator') {
          const op = node.value.toUpperCase();
          if (op === 'NOT') {
            parts.push(` ${op} `);
          } else {
            parts.push(`\n${indent}${op} `);
          }
        } else {
          parts.push(node.value);
        }
      }

      return parts.join('').replace(/\s+/g, ' ').replace(/\n\s*\n/g, '\n').trim();
    };

    // Recurse root level
    const output = formatNode(tree, 0);
    return output;
  }

  return cleaned;
}

// -------------------------------------------------------------
// 11. ONE-CLICK AUTO-FIX ENGINE
// -------------------------------------------------------------
export function applyAutoFix(query: string, tokens: Token[]): { fixedQuery: string; applied: string[] } {
  const applied: string[] = [];
  if (!query.trim()) return { fixedQuery: '', applied: [] };

  let fixed = query;

  // 1. Invisible unicode characters
  const oldInvisible = fixed;
  fixed = fixed.replace(/[\u200B\uFEFF\u200C\u200D\u00A0]/g, ' ');
  if (oldInvisible !== fixed) {
    applied.push('Removed invisible Unicode characters');
  }

  // 2. Smart quotes substitution
  const oldQuotes = fixed;
  fixed = fixed.replace(/[“”]/g, '"').replace(/[‘’']/g, '\'');
  if (oldQuotes !== fixed) {
    applied.push('Substituted smart quotes with straight quotes');
  }

  // 3. Close quotation marks
  const quotesCount = (fixed.match(/"/g) || []).length;
  if (quotesCount % 2 !== 0) {
    fixed = fixed.trim() + '"';
    applied.push('Closed unclosed quotation marks');
  }

  // 4. Capitalize logical operators
  const oldCaps = fixed;
  fixed = fixed.replace(/\b(and)\b/g, 'AND')
               .replace(/\b(or)\b/g, 'OR')
               .replace(/\b(not)\b/g, 'NOT');
  if (oldCaps !== fixed) {
    applied.push('Capitalized lowercase operators (AND, OR, NOT)');
  }

  // 5. Parentheses balances
  let openBrackets = 0;
  let closedBrackets = 0;
  for (const char of fixed) {
    if (char === '(') openBrackets++;
    if (char === ')') closedBrackets++;
  }
  if (openBrackets > closedBrackets) {
    fixed = fixed.trim() + ')'.repeat(openBrackets - closedBrackets);
    applied.push(`Added ${openBrackets - closedBrackets} missing closing parentheses`);
  } else if (closedBrackets > openBrackets) {
    // Prepend missing open parens
    fixed = '('.repeat(closedBrackets - openBrackets) + fixed.trim();
    applied.push(`Added ${closedBrackets - openBrackets} missing opening parentheses`);
  }

  // 6. Remove empty parentheses or double operators
  const oldCleaning = fixed;
  fixed = fixed.replace(/\(\s*\)/g, '')
               .replace(/AND\s+AND/gi, 'AND')
               .replace(/OR\s+OR/gi, 'OR')
               .replace(/NOT\s+NOT/gi, 'NOT')
               .replace(/AND\s+OR/gi, 'AND')
               .replace(/OR\s+AND/gi, 'OR');
  
  if (oldCleaning !== fixed) {
    applied.push('Cleaned double operators & empty groups');
  }

  // 7. Remove leading/trailing operators inside parentheses
  fixed = fixed.replace(/\(\s*(AND|OR|NOT)\s+/gi, '(')
               .replace(/\s+(AND|OR|NOT)\s*\)/gi, ')')
               .replace(/^\s*(AND|OR|NOT)\s+/gi, '')
               .replace(/\s+(AND|OR|NOT)\s*$/gi, '');

  // 8. Trim multiple spaces outside quotes
  const freshTokens = tokenizeBoolean(fixed);
  const reSpace = freshTokens.map(t => {
    if (t.type === 'whitespace') return ' ';
    return t.value;
  }).join('').replace(/\s+/g, ' ').trim();

  if (reSpace !== fixed) {
    fixed = reSpace;
    applied.push('Normalized excess whitespaces');
  }

  // 9. Remove duplicates (synonyms) in homogenous OR groups, e.g. (Java OR Java)
  const dedupedTokens = tokenizeBoolean(fixed);
  const tree = buildBooleanTree(dedupedTokens);

  const cleanNodes = (nodes: TreeNode[]): string => {
    const parts: string[] = [];
    for (const n of nodes) {
      if (n.type === 'Group') {
        if (n.operatorType === 'OR' || n.operatorType === 'AND') {
          const uniqueChildren: string[] = [];
          const childrenStr = n.children.filter(c => c.type !== 'Operator').map(c => cleanNodes([c]));
          for (const s of childrenStr) {
            if (!uniqueChildren.includes(s) && s.trim()) {
              uniqueChildren.push(s);
            }
          }
          if (uniqueChildren.length !== childrenStr.length) {
            applied.push('Deduplicated synonyms in OR/AND gates');
          }
          parts.push(`(${uniqueChildren.join(` ${n.operatorType} `)})`);
        } else {
          parts.push(`(${cleanNodes(n.children)})`);
        }
      } else {
        parts.push(n.value);
      }
    }
    return parts.join(' ').replace(/\s+/g, ' ').trim();
  };

  const finalStr = cleanNodes(tree);
  if (finalStr && finalStr !== fixed) {
    fixed = finalStr;
  }

  return {
    fixedQuery: fixed,
    applied
  };
}

// -------------------------------------------------------------
// 12. PARSED QUERY TREE EXPORTER
// -------------------------------------------------------------
export function exportQuery(query: string, format: string, name: string): { content: string; mime: string; ext: string } {
  let content = '';
  let mime = 'text/plain';
  let ext = 'txt';

  const titleClean = name.replace(/\s+/g, '-').toLowerCase();

  switch (format) {
    case 'json':
      const stats = calculateBooleanStats(query, tokenizeBoolean(query));
      content = JSON.stringify({
        title: name,
        query,
        stats,
        lastUpdated: new Date().toISOString()
      }, null, 2);
      mime = 'application/json';
      ext = 'json';
      break;

    case 'csv':
      content = `Title,Query,Timestamp\n"${name.replace(/"/g, '""')}","${query.replace(/"/g, '""')}","${new Date().toISOString()}"`;
      mime = 'text/csv';
      ext = 'csv';
      break;

    case 'markdown':
      content = `# Sourcing Blueprint: ${name}\n\n` +
        `## Compiled Search Query\n\n` +
        `\`\`\`text\n${query}\n\`\`\`\n\n` +
        `*Generated on ${new Date().toLocaleDateString()} via Workora Sourcing Suite.*`;
      mime = 'text/markdown';
      ext = 'md';
      break;

    case 'html':
      content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Sourcing Blueprint - ${name}</title>
  <style>
    body { font-family: sans-serif; padding: 40px; background: #f8fafc; color: #1e293b; }
    .card { background: white; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 800px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    h1 { color: #4f46e5; margin-top: 0; font-size: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
    .query { background: #0f172a; color: #38bdf8; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 14px; white-space: pre-wrap; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Sourcing Blueprint: ${name}</h1>
    <p>Use this validated query directly inside your talent acquisition pipelines.</p>
    <div class="query">${query}</div>
  </div>
</body>
</html>`;
      mime = 'text/html';
      ext = 'html';
      break;

    default:
      content = `WORKORA SEARCH BLUEPRINT: ${name}\n` +
        `========================================\n` +
        `Timestamp: ${new Date().toISOString()}\n\n` +
        `Query string:\n${query}\n`;
      mime = 'text/plain';
      ext = 'txt';
      break;
  }

  return { content, mime, ext };
}
