export interface PlatformFootprint {
  id: string;
  name: string;
  prefix: string;
  suffix: string;
  excludeFootprint?: string;
}

export class PlatformEngine {
  private platforms: Record<string, PlatformFootprint> = {
    linkedin: {
      id: "linkedin",
      name: "LinkedIn",
      prefix: "",
      suffix: ""
    },
    linkedin_recruiter: {
      id: "linkedin_recruiter",
      name: "LinkedIn Recruiter",
      prefix: "",
      suffix: ""
    },
    google: {
      id: "google",
      name: "Google (X-Ray)",
      prefix: "site:linkedin.com/in/ ",
      suffix: ""
    },
    github: {
      id: "github",
      name: "GitHub",
      prefix: "site:github.com \"joined on\" ",
      suffix: ""
    },
    gitlab: {
      id: "gitlab",
      name: "GitLab",
      prefix: "site:gitlab.com ",
      suffix: ""
    },
    stackoverflow: {
      id: "stackoverflow",
      name: "Stack Overflow",
      prefix: "site:stackoverflow.com/users/ ",
      suffix: ""
    },
    naukri: {
      id: "naukri",
      name: "Naukri",
      prefix: "site:resumes.naukri.com ",
      suffix: ""
    },
    indeed: {
      id: "indeed",
      name: "Indeed",
      prefix: "site:indeed.com/r/ ",
      suffix: ""
    },
    monster: {
      id: "monster",
      name: "Monster",
      prefix: "site:monster.com/profile/ ",
      suffix: ""
    },
    dice: {
      id: "dice",
      name: "Dice",
      prefix: "site:dice.com/jobs/ ",
      suffix: ""
    },
    wellfound: {
      id: "wellfound",
      name: "Wellfound (AngelList)",
      prefix: "site:wellfound.com ",
      suffix: ""
    },
    x_twitter: {
      id: "x_twitter",
      name: "X (Twitter)",
      prefix: "site:x.com ",
      suffix: ""
    }
  };

  /**
   * Generates a platform-customized query based on a base query.
   */
  public buildQuery(platformId: string, baseQuery: string): string {
    const platform = this.platforms[platformId] || this.platforms.linkedin;
    return `${platform.prefix}${baseQuery}${platform.suffix}`.trim();
  }

  /**
   * Generates searching action URLs (X-Ray Link Builder).
   */
  public generateSearchUrls(query: string) {
    const encodedQuery = encodeURIComponent(query);
    return {
      google: `https://www.google.com/search?q=${encodedQuery}`,
      bing: `https://www.bing.com/search?q=${encodedQuery}`,
      duckduckgo: `https://html.duckduckgo.com/html/?q=${encodedQuery}`,
      brave: `https://search.brave.com/search?q=${encodedQuery}`
    };
  }

  public getPlatformName(platformId: string): string {
    return this.platforms[platformId]?.name || platformId;
  }
}

export const platformEngine = new PlatformEngine();
export default platformEngine;
