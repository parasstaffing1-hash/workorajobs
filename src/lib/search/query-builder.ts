import { DatePostedFilter } from "./types";

export class SearchQueryBuilder {
  /**
   * Sanitizes user search terms for safe tsquery execution and prevents SQL injection
   */
  static prepareSearchQuery(queryText: string): string {
    if (!queryText || queryText.trim() === "") return "";
    
    return queryText
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .map((word) => `${word}:*`)
      .join(" & ");
  }

  /**
   * Converts DatePostedFilter enum to a Javascript Date threshold
   */
  static getDateThreshold(filter?: DatePostedFilter): Date | null {
    if (!filter || filter === "ANYTIME") return null;
    
    const now = new Date();
    switch (filter) {
      case "TODAY":
        now.setHours(0, 0, 0, 0);
        return now;
      case "LAST_3_DAYS":
        now.setDate(now.getDate() - 3);
        return now;
      case "LAST_7_DAYS":
        now.setDate(now.getDate() - 7);
        return now;
      case "LAST_30_DAYS":
        now.setDate(now.getDate() - 30);
        return now;
      default:
        return null;
    }
  }
}
