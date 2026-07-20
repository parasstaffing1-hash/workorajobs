import { roleLibrary } from './RoleLibrary';
import { skillLibrary } from './SkillLibrary';
import { synonymEngine } from './SynonymEngine';

export interface SearchFormState {
  jobTitle: string;
  alternativeTitles: string;
  requiredSkills: string;
  optionalSkills: string;
  location: string;
  country: string;
  state: string;
  city: string;
  experience: string;
  currentCompany: string;
  pastCompany: string;
  industry: string;
  degree: string;
  certification: string;
  employmentType: string;
  workMode: string;
  language: string;
  excludeKeywords: string;
  excludeCompanies: string;
  excludeTitles: string;
  platform: string;
}

export class BooleanEngine {
  /**
   * Parses comma-separated values, preserves quotes, removes extra spaces, and wraps multi-word terms.
   */
  private parseAndWrapTerms(rawInput: string, autoExpandSynonyms = false, dictionaryType: 'roles' | 'skills' | 'none' = 'none'): string[] {
    if (!rawInput) return [];
    
    // Split by comma
    const parts = rawInput.split(',').map(p => p.trim()).filter(p => p.length > 0);
    const termsSet = new Set<string>();

    for (const part of parts) {
      // Clean quotes
      const cleanTerm = part.replace(/^["']|["']$/g, '').trim();
      if (!cleanTerm) continue;

      if (autoExpandSynonyms) {
        if (dictionaryType === 'roles') {
          const alts = roleLibrary.getAlternativesFor(cleanTerm);
          alts.forEach(alt => termsSet.add(this.formatTerm(alt)));
        } else if (dictionaryType === 'skills') {
          const alts = skillLibrary.getSynonymsFor(cleanTerm);
          alts.forEach(alt => termsSet.add(this.formatTerm(alt)));
        } else {
          const alts = synonymEngine.getSynonyms(cleanTerm);
          termsSet.add(this.formatTerm(cleanTerm));
          alts.forEach(alt => termsSet.add(this.formatTerm(alt)));
        }
      } else {
        termsSet.add(this.formatTerm(cleanTerm));
      }
    }

    return Array.from(termsSet);
  }

  /**
   * Helper to ensure multi-word phrases are quoted, but single-word terms aren't unnecessarily quoted.
   */
  private formatTerm(term: string): string {
    const trimmed = term.trim();
    if (trimmed.includes(' ') && !trimmed.startsWith('"') && !trimmed.endsWith('"')) {
      return `"${trimmed}"`;
    }
    return trimmed;
  }

  /**
   * Generates a deterministic Boolean query from the form inputs.
   */
  public generateQuery(form: SearchFormState): string {
    const andBlocks: string[] = [];
    const isFreeLinkedin = form.platform === 'linkedin';

    // 1. TITLES BLOCK
    let titleTerms: string[] = [];
    if (form.jobTitle) {
      // Auto expand synonyms if user enters a recognized title
      const expandedJobTitle = this.parseAndWrapTerms(form.jobTitle, true, 'roles');
      expandedJobTitle.forEach(t => titleTerms.push(t));
    }
    if (form.alternativeTitles) {
      const parsedAlts = this.parseAndWrapTerms(form.alternativeTitles, true, 'roles');
      parsedAlts.forEach(t => {
        if (!titleTerms.includes(t)) titleTerms.push(t);
      });
    }

    if (isFreeLinkedin) {
      titleTerms = titleTerms.slice(0, 2);
    }

    if (titleTerms.length > 0) {
      if (titleTerms.length === 1) {
        andBlocks.push(titleTerms[0]);
      } else {
        andBlocks.push(`(${titleTerms.join(' OR ')})`);
      }
    }

    // 2. SKILLS BLOCK (Required Skills)
    let requiredSkillTerms: string[] = [];
    if (form.requiredSkills) {
      const parsedSkills = this.parseAndWrapTerms(form.requiredSkills, true, 'skills');
      parsedSkills.forEach(s => requiredSkillTerms.push(s));
    }

    if (isFreeLinkedin) {
      requiredSkillTerms = requiredSkillTerms.slice(0, 1);
    }

    if (requiredSkillTerms.length > 0) {
      if (requiredSkillTerms.length === 1) {
        andBlocks.push(requiredSkillTerms[0]);
      } else {
        andBlocks.push(`(${requiredSkillTerms.join(' OR ')})`);
      }
    }

    // 3. OPTIONAL SKILLS BLOCK
    let optionalSkillTerms = this.parseAndWrapTerms(form.optionalSkills, true, 'skills');

    if (isFreeLinkedin) {
      optionalSkillTerms = optionalSkillTerms.slice(0, 1);
    }

    if (optionalSkillTerms.length > 0) {
      if (optionalSkillTerms.length === 1) {
        andBlocks.push(optionalSkillTerms[0]);
      } else {
        andBlocks.push(`(${optionalSkillTerms.join(' OR ')})`);
      }
    }

    // 4. LOCATION BLOCK (Standard LinkedIn uses dedicated filters, not keywords bar)
    let locationTerms: string[] = [];
    if (!isFreeLinkedin) {
      if (form.location) locationTerms.push(...this.parseAndWrapTerms(form.location));
      if (form.city) locationTerms.push(...this.parseAndWrapTerms(form.city));
      if (form.state) locationTerms.push(...this.parseAndWrapTerms(form.state));
      if (form.country) locationTerms.push(...this.parseAndWrapTerms(form.country));
    }

    const uniqueLocationTerms = Array.from(new Set(locationTerms));
    if (uniqueLocationTerms.length > 0) {
      if (uniqueLocationTerms.length === 1) {
        andBlocks.push(uniqueLocationTerms[0]);
      } else {
        andBlocks.push(`(${uniqueLocationTerms.join(' OR ')})`);
      }
    }

    // 5. EXPERIENCE BLOCK
    let expTerms: string[] = [];
    if (!isFreeLinkedin) {
      expTerms = this.parseAndWrapTerms(form.experience, true);
    }

    if (expTerms.length > 0) {
      if (expTerms.length === 1) {
        andBlocks.push(expTerms[0]);
      } else {
        andBlocks.push(`(${expTerms.join(' OR ')})`);
      }
    }

    // 6. COMPANIES BLOCK (Current & Past)
    let companyTerms: string[] = [];
    if (!isFreeLinkedin) {
      if (form.currentCompany) companyTerms.push(...this.parseAndWrapTerms(form.currentCompany));
      if (form.pastCompany) companyTerms.push(...this.parseAndWrapTerms(form.pastCompany));
      if (form.industry) companyTerms.push(...this.parseAndWrapTerms(form.industry));
    }

    const uniqueCompanyTerms = Array.from(new Set(companyTerms));
    if (uniqueCompanyTerms.length > 0) {
      if (uniqueCompanyTerms.length === 1) {
        andBlocks.push(uniqueCompanyTerms[0]);
      } else {
        andBlocks.push(`(${uniqueCompanyTerms.join(' OR ')})`);
      }
    }

    // 7. EDUCATION / DEGREE / CERTIFICATIONS BLOCK
    let eduTerms: string[] = [];
    if (!isFreeLinkedin) {
      if (form.degree) eduTerms.push(...this.parseAndWrapTerms(form.degree));
      if (form.certification) eduTerms.push(...this.parseAndWrapTerms(form.certification, true));
    }
    
    const uniqueEduTerms = Array.from(new Set(eduTerms));
    if (uniqueEduTerms.length > 0) {
      if (uniqueEduTerms.length === 1) {
        andBlocks.push(uniqueEduTerms[0]);
      } else {
        andBlocks.push(`(${uniqueEduTerms.join(' OR ')})`);
      }
    }

    // 8. ADDITIONAL ATTR BLOCK (Work Mode, Employment Type, Language)
    let attrTerms: string[] = [];
    if (!isFreeLinkedin) {
      if (form.workMode) attrTerms.push(...this.parseAndWrapTerms(form.workMode, true));
      if (form.employmentType) attrTerms.push(...this.parseAndWrapTerms(form.employmentType, true));
      if (form.language) attrTerms.push(...this.parseAndWrapTerms(form.language));
    }

    const uniqueAttrTerms = Array.from(new Set(attrTerms));
    if (uniqueAttrTerms.length > 0) {
      if (uniqueAttrTerms.length === 1) {
        andBlocks.push(uniqueAttrTerms[0]);
      } else {
        andBlocks.push(`(${uniqueAttrTerms.join(' OR ')})`);
      }
    }

    // COMBINE MAIN AND BLOCKS
    let baseQuery = andBlocks.join(' AND ');

    // 9. NOT (EXCLUSIONS) BLOCK
    const notTerms: string[] = [];
    if (form.excludeTitles) notTerms.push(...this.parseAndWrapTerms(form.excludeTitles));
    if (form.excludeCompanies) notTerms.push(...this.parseAndWrapTerms(form.excludeCompanies));
    if (form.excludeKeywords) notTerms.push(...this.parseAndWrapTerms(form.excludeKeywords));

    let uniqueNotTerms = Array.from(new Set(notTerms));
    if (isFreeLinkedin) {
      uniqueNotTerms = uniqueNotTerms.slice(0, 1);
    }
    if (uniqueNotTerms.length > 0) {
      if (form.platform === 'linkedin' || form.platform === 'linkedin_recruiter') {
        // LinkedIn optimization: conjoin flat NOTs with explicit 'AND NOT' to comply with LinkedIn search parser rules
        if (baseQuery) {
          const notBlock = uniqueNotTerms.map(t => `AND NOT ${t}`).join(' ');
          baseQuery = `${baseQuery} ${notBlock}`;
        } else {
          const notBlock = uniqueNotTerms.map((t, idx) => idx === 0 ? `NOT ${t}` : `AND NOT ${t}`).join(' ');
          baseQuery = notBlock;
        }
      } else {
        const notBlock = uniqueNotTerms.length === 1 ? uniqueNotTerms[0] : `(${uniqueNotTerms.join(' OR ')})`;
        if (baseQuery) {
          baseQuery = `${baseQuery} NOT ${notBlock}`;
        } else {
          baseQuery = `NOT ${notBlock}`;
        }
      }
    }

    if (form.platform === 'linkedin' || form.platform === 'linkedin_recruiter') {
      return makeLinkedInCompliant(baseQuery);
    }

    return baseQuery;
  }
}

/**
 * Formats a search string to be strictly compliant with LinkedIn's proprietary Boolean search requirements.
 * Ensures that operators (AND, OR, NOT) are always uppercase outside of quotes and parentheses are fully balanced.
 */
export function makeLinkedInCompliant(query: string): string {
  if (!query) return '';

  // 1. Split query into quoted and unquoted segments to protect quoted strings
  const segments: { text: string; isQuoted: boolean }[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < query.length; i++) {
    const char = query[i];
    if (char === '"' || char === "'") {
      if (!inQuotes) {
        if (current) {
          segments.push({ text: current, isQuoted: false });
          current = '';
        }
        inQuotes = true;
        quoteChar = char;
        current += char;
      } else if (char === quoteChar) {
        current += char;
        segments.push({ text: current, isQuoted: true });
        current = '';
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      current += char;
    }
  }

  if (current) {
    segments.push({ text: current, isQuoted: inQuotes });
  }

  // 2. Format unquoted segments to enforce uppercase operators (AND, OR, NOT)
  const processedQuery = segments.map(seg => {
    if (seg.isQuoted) {
      return seg.text;
    } else {
      let t = seg.text;
      // Replace case-insensitive and, or, not with uppercase, ensuring they are whole words
      t = t.replace(/\band\b/gi, 'AND');
      t = t.replace(/\bor\b/gi, 'OR');
      t = t.replace(/\bnot\b/gi, 'NOT');
      return t;
    }
  }).join('');

  // 3. Balance parentheses, only counting parenthesization outside of quotes
  let balanced = '';
  let parenDepth = 0;
  
  // Re-split the processed query to handle any modified quote positions
  const finalSegments: { text: string; isQuoted: boolean }[] = [];
  let currentFinal = '';
  let inQuotesFinal = false;
  let quoteCharFinal = '';

  for (let i = 0; i < processedQuery.length; i++) {
    const char = processedQuery[i];
    if (char === '"' || char === "'") {
      if (!inQuotesFinal) {
        if (currentFinal) {
          finalSegments.push({ text: currentFinal, isQuoted: false });
          currentFinal = '';
        }
        inQuotesFinal = true;
        quoteCharFinal = char;
        currentFinal += char;
      } else if (char === quoteCharFinal) {
        currentFinal += char;
        finalSegments.push({ text: currentFinal, isQuoted: true });
        currentFinal = '';
        inQuotesFinal = false;
      } else {
        currentFinal += char;
      }
    } else {
      currentFinal += char;
    }
  }

  if (currentFinal) {
    finalSegments.push({ text: currentFinal, isQuoted: inQuotesFinal });
  }

  for (const seg of finalSegments) {
    if (seg.isQuoted) {
      balanced += seg.text;
    } else {
      for (let i = 0; i < seg.text.length; i++) {
        const char = seg.text[i];
        if (char === '(') {
          parenDepth++;
          balanced += char;
        } else if (char === ')') {
          if (parenDepth > 0) {
            parenDepth--;
            balanced += char;
          } else {
            // Discard unmatched closing parenthesis
          }
        } else {
          balanced += char;
        }
      }
    }
  }

  // Append any missing closing parentheses to guarantee balance
  while (parenDepth > 0) {
    balanced += ')';
    parenDepth--;
  }

  return balanced;
}

export const booleanEngine = new BooleanEngine();
export default booleanEngine;
