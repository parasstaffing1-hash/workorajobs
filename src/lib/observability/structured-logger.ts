/**
 * ============================================================================
 * ENTERPRISE STRUCTURED LOGGER & OBSERVABILITY MODULE
 * Provides JSON-formatted structured logging with automatic PII sanitization,
 * trace IDs, error stacks, and context metadata.
 * ============================================================================
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface LogContext {
  userId?: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  action?: string;
  requestId?: string;
  traceId?: string;
  durationMs?: number;
  statusCode?: number;
  [key: string]: any;
}

/**
 * Sanitizes sensitive field values (passwords, tokens, secret keys) before logging
 */
function sanitizeContext(ctx: LogContext): LogContext {
  const sanitized: LogContext = {};
  const sensitiveKeys = ["password", "token", "secret", "authorization", "cookie", "ssn", "creditcard"];

  for (const [key, val] of Object.entries(ctx)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
      sanitized[key] = "[REDACTED]";
    } else if (key === "email" && typeof val === "string") {
      // Partially mask email: j***n@example.com
      const parts = val.split("@");
      if (parts.length === 2 && parts[0].length > 2) {
        sanitized[key] = `${parts[0][0]}***${parts[0].slice(-1)}@${parts[1]}`;
      } else {
        sanitized[key] = val;
      }
    } else {
      sanitized[key] = val;
    }
  }

  return sanitized;
}

export class StructuredLogger {
  private static serviceName = "workorajobs-auth";

  private static formatEntry(level: LogLevel, message: string, context: LogContext = {}, err?: Error) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      environment: process.env.NODE_ENV || "development",
      level,
      message,
      context: sanitizeContext(context),
      ...(err
        ? {
            error: {
              name: err.name,
              message: err.message,
              stack: err.stack,
            },
          }
        : {}),
    });
  }

  static info(message: string, context?: LogContext) {
    console.log(this.formatEntry("info", message, context));
  }

  static warn(message: string, context?: LogContext) {
    console.warn(this.formatEntry("warn", message, context));
  }

  static error(message: string, err?: Error, context?: LogContext) {
    console.error(this.formatEntry("error", message, context, err));
  }

  static fatal(message: string, err?: Error, context?: LogContext) {
    console.error(this.formatEntry("fatal", message, context, err));
  }

  static audit(action: string, context: LogContext) {
    console.log(
      this.formatEntry("info", `[AUDIT] ${action}`, {
        ...context,
        auditEvent: true,
        action,
      })
    );
  }
}
