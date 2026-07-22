export class PiiRedactor {
  private static sensitiveKeys = [
    "password",
    "passwordHash",
    "token",
    "accessToken",
    "refreshToken",
    "secret",
    "creditCard",
    "ssn",
    "apiKey",
  ];

  /**
   * Redacts sensitive keys from objects before logging
   */
  static redactObject(data: Record<string, any>): Record<string, any> {
    if (!data || typeof data !== "object") return data;

    const redacted = { ...data };

    Object.keys(redacted).forEach((key) => {
      if (this.sensitiveKeys.some((sk) => key.toLowerCase().includes(sk.toLowerCase()))) {
        redacted[key] = "[REDACTED]";
      } else if (typeof redacted[key] === "object" && redacted[key] !== null) {
        redacted[key] = this.redactObject(redacted[key]);
      }
    });

    return redacted;
  }

  /**
   * Redacts emails or phone numbers from plain text strings
   */
  static redactString(text: string): string {
    return text
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED_EMAIL]")
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, "[REDACTED_PHONE]");
  }
}
