export interface ValidationError {
  type: 'error' | 'warning';
  message: string;
  suggestion?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  score: number;
}

export class ValidationEngine {
  /**
   * Performs analysis of a Boolean query string.
   */
  public validate(query: string): ValidationResult {
    const errors: ValidationError[] = [];
    let score = 100;

    if (!query || query.trim() === '') {
      return {
        isValid: false,
        errors: [{ type: 'error', message: 'The generated search query is completely empty.' }],
        score: 0
      };
    }

    // 1. Balanced Parentheses
    let openParens = 0;
    for (let i = 0; i < query.length; i++) {
      if (query[i] === '(') openParens++;
      if (query[i] === ')') openParens--;
    }
    if (openParens !== 0) {
      errors.push({
        type: 'error',
        message: 'Unbalanced parentheses detected.',
        suggestion: 'Ensure every opening bracket "(" has a corresponding closing bracket ")".'
      });
      score -= 30;
    }

    // 2. Balanced Quotes
    let doubleQuotes = 0;
    for (let i = 0; i < query.length; i++) {
      if (query[i] === '"') doubleQuotes++;
    }
    if (doubleQuotes % 2 !== 0) {
      errors.push({
        type: 'error',
        message: 'Unbalanced quotation marks.',
        suggestion: 'Double quotes must be paired (e.g. "React Developer").'
      });
      score -= 25;
    }

    // 3. Curly Quotes check (extremely common issue when copying from Word/Mac)
    if (/[“”‘’]/.test(query)) {
      errors.push({
        type: 'warning',
        message: 'Smart/curly quotation marks detected.',
        suggestion: 'Replace with standard straight quotes (") to prevent platform errors.'
      });
      score -= 10;
    }

    // 4. Duplicate Operators (AND AND, OR OR, etc.)
    if (/\b(AND|OR|NOT)\s+(AND|OR|NOT)\b/i.test(query)) {
      errors.push({
        type: 'error',
        message: 'Duplicate or consecutive operators.',
        suggestion: 'Remove adjacent operators like "AND AND" or "AND OR".'
      });
      score -= 20;
    }

    // 5. Empty Groups
    if (/\(\s*\)/.test(query)) {
      errors.push({
        type: 'warning',
        message: 'Empty keyword group "()" detected.',
        suggestion: 'Remove the empty parentheses or populate with terms.'
      });
      score -= 15;
    }

    // 6. Leading Operators
    const trimmedQuery = query.trim();
    if (/^(AND|OR|NOT)\b/i.test(trimmedQuery)) {
      errors.push({
        type: 'error',
        message: 'Query starts with a search operator.',
        suggestion: 'Remove leading operators (e.g. "AND ...") from your query.'
      });
      score -= 15;
    }

    // 7. Trailing Operators
    if (/\b(AND|OR|NOT)$/i.test(trimmedQuery)) {
      errors.push({
        type: 'error',
        message: 'Query ends with a trailing operator.',
        suggestion: 'Remove trailing connectors like "AND" or "OR" at the end.'
      });
      score -= 15;
    }

    // 8. Duplicate Keywords
    // Extract keywords within quotes and single words
    const wordsAndPhrases: string[] = [];
    const quoteRegex = /"([^"]+)"/g;
    let match;
    let strippedQuery = query;

    while ((match = quoteRegex.exec(query)) !== null) {
      wordsAndPhrases.push(match[1].toLowerCase().trim());
    }
    // Remove quoted phrases to scan single words
    strippedQuery = strippedQuery.replace(/"[^"]+"/g, '');
    const singleWords = strippedQuery.match(/\b[a-zA-Z0-9+#-]+\b/g) || [];
    singleWords.forEach(w => {
      const lower = w.toLowerCase();
      if (!['and', 'or', 'not', 'site', 'inurl', 'intitle', 'filetype'].includes(lower)) {
        wordsAndPhrases.push(lower);
      }
    });

    const duplicates = wordsAndPhrases.filter((item, index) => wordsAndPhrases.indexOf(item) !== index);
    if (duplicates.length > 0) {
      const uniqueDupes = Array.from(new Set(duplicates));
      errors.push({
        type: 'warning',
        message: `Duplicate keywords found: ${uniqueDupes.slice(0, 3).map(k => `"${k}"`).join(', ')}.`,
        suggestion: 'Consolidate duplicates into single terms or nested groups.'
      });
      score -= Math.min(uniqueDupes.length * 5, 20);
    }

    // 9. Readability & Length Check
    if (query.length > 1000) {
      errors.push({
        type: 'warning',
        message: 'Query length is extremely long (>1000 chars).',
        suggestion: 'Some engines truncate queries. Consider focusing your search fields.'
      });
      score -= 10;
    }

    // Ensure score is bounded between 0 and 100
    score = Math.max(0, Math.min(100, score));

    return {
      isValid: errors.filter(e => e.type === 'error').length === 0,
      errors,
      score
    };
  }
}

export const validationEngine = new ValidationEngine();
export default validationEngine;
