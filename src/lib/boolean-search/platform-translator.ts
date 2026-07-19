import { ASTNode } from "./boolean-engine";

export type TargetPlatform =
  | "LINKEDIN_RECRUITER"
  | "LINKEDIN_BASIC"
  | "GOOGLE_XRAY"
  | "GITHUB"
  | "GITLAB"
  | "STACK_OVERFLOW"
  | "INDEED"
  | "NAUKRI"
  | "MONSTER"
  | "DICE"
  | "ZIPRECRUITER"
  | "CAREERBUILDER"
  | "MONSTER_GULF"
  | "FOUNDIT"
  | "INTERNAL_ATS"
  | "GENERIC_ATS";

export interface TranslationResult {
  query: string;
  warnings: string[];
  charCount: number;
  limitExceeded: boolean;
}

export class BooleanPlatformTranslator {
  /**
   * Translates a compiled ASTNode query into platform-specific syntax and checks limits.
   */
  public translate(node: ASTNode, platform: TargetPlatform): TranslationResult {
    const warnings: string[] = [];
    let query = "";

    switch (platform) {
      case "GOOGLE_XRAY":
        query = this.translateGoogleXRay(node, warnings);
        break;
      case "GITHUB":
      case "GITLAB":
        query = this.translateGitHubGitLab(node, warnings);
        break;
      case "STACK_OVERFLOW":
        query = this.translateStackOverflow(node, warnings);
        break;
      case "LINKEDIN_BASIC":
      case "LINKEDIN_RECRUITER":
        query = this.translateLinkedIn(node, warnings, platform);
        break;
      case "INDEED":
      case "ZIPRECRUITER":
      case "NAUKRI":
      case "MONSTER":
      case "DICE":
      case "CAREERBUILDER":
      case "MONSTER_GULF":
      case "FOUNDIT":
      case "INTERNAL_ATS":
      case "GENERIC_ATS":
      default:
        query = this.translateStandard(node, warnings, platform);
        break;
    }

    // Run platform limit checks
    const charCount = query.length;
    const limit = this.getPlatformCharacterLimit(platform);
    const limitExceeded = charCount > limit;

    if (limitExceeded) {
      warnings.push(
        `Character limit exceeded for ${this.getPlatformLabel(platform)}. Query length is ${charCount} (Limit is ${limit} characters).`
      );
    }

    return {
      query,
      warnings,
      charCount,
      limitExceeded,
    };
  }

  private translateGoogleXRay(node: ASTNode, warnings: string[]): string {
    const format = (n: ASTNode): string => {
      if (n.type === "TERM") {
        let val = n.value || "";
        if (n.hasWildcard) {
          warnings.push("Google X-Ray does not support character-level wildcards like develop*. Stripping wildcard.");
          val = val.replace(/\*/g, "");
        }
        return n.isQuoted ? `"${val}"` : val;
      }
      if (n.type === "NOT" && n.children) {
        const childStr = format(n.children[0]);
        // Google uses minus sign directly adjacent to excluded term: e.g. -sales
        return `-${childStr.includes(" ") ? `(${childStr})` : childStr}`;
      }
      if (n.children) {
        if (n.type === "AND") {
          // Google uses implicit space for AND
          const childrenStrs = n.children.map(format);
          return `(${childrenStrs.join(" ")})`;
        }
        if (n.type === "OR") {
          const childrenStrs = n.children.map(format);
          return `(${childrenStrs.join(" OR ")})`;
        }
      }
      return "";
    };

    // Google limits search query to 32 words / operators
    const termCount = this.countTerms(node);
    if (termCount > 32) {
      warnings.push(`Google limits search queries to 32 terms. Your query contains ${termCount} terms.`);
    }

    return format(node);
  }

  private translateGitHubGitLab(node: ASTNode, warnings: string[]): string {
    warnings.push("GitHub/GitLab search queries do not support grouping parentheses or logical OR. Flattening query.");

    const format = (n: ASTNode): string => {
      if (n.type === "TERM") {
        return n.isQuoted ? `"${n.value}"` : n.value || "";
      }
      if (n.type === "NOT" && n.children) {
        const childStr = format(n.children[0]);
        return `-${childStr}`;
      }
      if (n.children) {
        const childrenStrs = n.children.map(format);
        // Space is implicit AND. OR is not supported, we join all with space
        return childrenStrs.join(" ");
      }
      return "";
    };

    return format(node);
  }

  private translateStackOverflow(node: ASTNode, warnings: string[]): string {
    const format = (n: ASTNode): string => {
      if (n.type === "TERM") {
        const val = n.value || "";
        // Tag format if it matches common technology name
        if (["react", "typescript", "javascript", "python", "docker", "postgres", "aws"].includes(val.toLowerCase())) {
          return `[${val.toLowerCase()}]`;
        }
        return n.isQuoted ? `"${val}"` : val;
      }
      if (n.type === "NOT" && n.children) {
        return `-${format(n.children[0])}`;
      }
      if (n.children) {
        const childrenStrs = n.children.map(format);
        if (n.type === "AND") {
          return childrenStrs.join(" ");
        }
        if (n.type === "OR") {
          warnings.push("Stack Overflow search bar does not support explicit OR. Joining terms with space.");
          return childrenStrs.join(" ");
        }
      }
      return "";
    };

    return format(node);
  }

  private translateLinkedIn(node: ASTNode, warnings: string[], platform: TargetPlatform): string {
    const format = (n: ASTNode): string => {
      if (n.type === "TERM") {
        let val = n.value || "";
        if (n.hasWildcard) {
          warnings.push("LinkedIn does not support wildcards (*). Stripping wildcard from search term.");
          val = val.replace(/\*/g, "");
        }
        return n.isQuoted ? `"${val}"` : val;
      }
      if (n.type === "NOT" && n.children) {
        const childStr = format(n.children[0]);
        const needsParens = childStr.includes(" ");
        return `NOT ${needsParens ? `(${childStr})` : childStr}`;
      }
      if (n.children) {
        const op = ` ${n.type} `;
        const childrenStrs = n.children.map(child => {
          const childStr = format(child);
          const needsParens = child.type === "AND" || child.type === "OR";
          return needsParens ? `(${childStr})` : childStr;
        });
        return childrenStrs.join(op);
      }
      return "";
    };

    return format(node);
  }

  private translateStandard(node: ASTNode, warnings: string[], platform: TargetPlatform): string {
    const format = (n: ASTNode): string => {
      if (n.type === "TERM") {
        return n.isQuoted ? `"${n.value}"` : n.value || "";
      }
      if (n.type === "NOT" && n.children) {
        const childStr = format(n.children[0]);
        const needsParens = childStr.includes(" ");
        return `NOT ${needsParens ? `(${childStr})` : childStr}`;
      }
      if (n.children) {
        const op = ` ${n.type} `;
        const childrenStrs = n.children.map(child => {
          const childStr = format(child);
          const needsParens = child.type === "AND" || child.type === "OR";
          return needsParens ? `(${childStr})` : childStr;
        });
        return childrenStrs.join(op);
      }
      return "";
    };

    return format(node);
  }

  /**
   * Helper to count terms/words in AST
   */
  private countTerms(node: ASTNode): number {
    if (node.type === "TERM") return 1;
    if (node.children) {
      return node.children.reduce((acc, child) => acc + this.countTerms(child), 0);
    }
    return 0;
  }

  private getPlatformCharacterLimit(platform: TargetPlatform): number {
    switch (platform) {
      case "LINKEDIN_BASIC":
        return 500;
      case "LINKEDIN_RECRUITER":
        return 1000;
      case "GITHUB":
      case "GITLAB":
        return 256;
      case "STACK_OVERFLOW":
        return 240;
      case "INDEED":
        return 512;
      case "ZIPRECRUITER":
        return 500;
      case "GOOGLE_XRAY":
        return 2048;
      case "NAUKRI":
      case "MONSTER":
      case "DICE":
      case "CAREERBUILDER":
      case "MONSTER_GULF":
      case "FOUNDIT":
        return 1000;
      case "INTERNAL_ATS":
      case "GENERIC_ATS":
      default:
        return 4000;
    }
  }

  private getPlatformLabel(platform: TargetPlatform): string {
    const labels: Record<TargetPlatform, string> = {
      LINKEDIN_RECRUITER: "LinkedIn Recruiter",
      LINKEDIN_BASIC: "LinkedIn Basic",
      GOOGLE_XRAY: "Google X-Ray",
      GITHUB: "GitHub",
      GITLAB: "GitLab",
      STACK_OVERFLOW: "Stack Overflow",
      INDEED: "Indeed",
      NAUKRI: "Naukri",
      MONSTER: "Monster",
      DICE: "Dice",
      ZIPRECRUITER: "ZipRecruiter",
      CAREERBUILDER: "CareerBuilder",
      MONSTER_GULF: "Monster Gulf",
      FOUNDIT: "Foundit",
      INTERNAL_ATS: "Internal ATS",
      GENERIC_ATS: "Generic ATS",
    };
    return labels[platform] || platform;
  }
}
