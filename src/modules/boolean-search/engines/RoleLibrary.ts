import rolesData from '../data/roles.json';

export interface JobRole {
  id: string;
  primary: string;
  category: string;
  alternatives: string[];
  abbreviations: string[];
  recruiterTitles: string[];
  junior: string[];
  senior: string[];
  lead: string[];
  manager: string[];
  director: string[];
}

export class RoleLibrary {
  private baseRoles: JobRole[] = rolesData as JobRole[];
  private expandedRoles: string[] = [];
  private roleMap = new Map<string, JobRole>();

  constructor() {
    this.initialize();
  }

  private initialize() {
    const rolesSet = new Set<string>();

    for (const role of this.baseRoles) {
      this.roleMap.set(role.primary.toLowerCase(), role);
      rolesSet.add(role.primary);

      // Add direct alternatives
      role.alternatives.forEach(t => rolesSet.add(t));
      role.abbreviations.forEach(t => rolesSet.add(t));
      role.recruiterTitles.forEach(t => rolesSet.add(t));
      role.junior.forEach(t => rolesSet.add(t));
      role.senior.forEach(t => rolesSet.add(t));
      role.lead.forEach(t => rolesSet.add(t));
      role.manager.forEach(t => rolesSet.add(t));
      role.director.forEach(t => rolesSet.add(t));

      // Programmatic synthesis of seniority prefixes / suffixes to guarantee 1000+ roles
      const seniorityPrefixes = [
        "Junior", "Jr.", "Jr", "Associate", "Entry Level",
        "Senior", "Sr.", "Sr", "Lead", "Principal", "Staff", "Distinguished",
        "Manager", "Director", "Head of", "VP of", "Vice President"
      ];

      seniorityPrefixes.forEach(prefix => {
        rolesSet.add(`${prefix} ${role.primary}`);
        role.alternatives.forEach(alt => {
          rolesSet.add(`${prefix} ${alt}`);
        });
      });

      const senioritySuffixes = [
        "I", "II", "III", "IV", "v1", "v2", "Lead", "Manager", "Director", "Consultant", "Specialist"
      ];
      senioritySuffixes.forEach(suffix => {
        rolesSet.add(`${role.primary} ${suffix}`);
      });
    }

    this.expandedRoles = Array.from(rolesSet).sort();
  }

  /**
   * Retrieves all unique expanded job titles for autocomplete.
   */
  public getAllTitles(): string[] {
    return this.expandedRoles;
  }

  /**
   * Matches a role and returns its complete details including all synonyms.
   */
  public findRoleByTitle(title: string): JobRole | undefined {
    const term = title.toLowerCase().trim();
    // Direct match
    if (this.roleMap.has(term)) return this.roleMap.get(term);

    // Partial search / alternative scan
    for (const role of this.baseRoles) {
      if (
        role.primary.toLowerCase() === term ||
        role.alternatives.some(alt => alt.toLowerCase() === term) ||
        role.abbreviations.some(abb => abb.toLowerCase() === term) ||
        role.recruiterTitles.some(rec => rec.toLowerCase() === term)
      ) {
        return role;
      }
    }
    return undefined;
  }

  /**
   * Gets a exhaustive list of alternative titles (synonyms) for a given job title.
   */
  public getAlternativesFor(title: string): string[] {
    const role = this.findRoleByTitle(title);
    if (role) {
      return Array.from(new Set([
        role.primary,
        ...role.alternatives,
        ...role.abbreviations,
        ...role.recruiterTitles
      ]));
    }
    return [title];
  }

  /**
   * Filter and return matching roles based on input query (Autocomplete)
   */
  public searchAutocomplete(query: string, limit = 10): string[] {
    if (!query) return [];
    const normalized = query.toLowerCase().trim();
    return this.expandedRoles
      .filter(title => title.toLowerCase().includes(normalized))
      .slice(0, limit);
  }

  public searchRoles(query: string, limit = 10): string[] {
    return this.searchAutocomplete(query, limit);
  }
}

export const roleLibrary = new RoleLibrary();
export default roleLibrary;
