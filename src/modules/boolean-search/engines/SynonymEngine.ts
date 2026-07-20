import synonymsData from '../data/synonyms.json';

export class SynonymEngine {
  private synonyms: Record<string, string[]> = synonymsData;

  /**
   * Retrieves mapped synonyms for a given key, matching case-insensitively.
   */
  public getSynonyms(key: string): string[] {
    const normalized = key.toLowerCase().trim().replace(/[\s-_]+/g, '_');
    
    // Check direct matching in database
    if (this.synonyms[normalized]) {
      return this.synonyms[normalized];
    }

    // Secondary scan of values to see if we can find a matching group
    for (const group of Object.values(this.synonyms)) {
      if (group.some(val => val.toLowerCase() === key.toLowerCase().trim())) {
        return group;
      }
    }

    return [];
  }

  /**
   * Resolves a collection of strings, replacing or appending their synonyms from our local dictionaries.
   */
  public resolveTermsWithSynonyms(terms: string[]): string[] {
    const resolvedSet = new Set<string>();

    for (const term of terms) {
      resolvedSet.add(term);
      const matches = this.getSynonyms(term);
      for (const match of matches) {
        resolvedSet.add(match);
      }
    }

    return Array.from(resolvedSet);
  }
}

export const synonymEngine = new SynonymEngine();
