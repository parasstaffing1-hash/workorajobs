export interface N8NConfig {
  enabled: boolean;
  webhookUrl: string;
  events: {
    job_created: boolean;
    application_status_changed: boolean;
    ats_scan_completed: boolean;
    copywriter_document_assembled: boolean;
  };
}

export interface N8NLog {
  id: string;
  timestamp: string;
  eventType: string;
  status: "success" | "failed";
  statusCode: number;
  payload: unknown;
  response: unknown;
}

interface GlobalN8n {
  config: N8NConfig;
  logs: N8NLog[];
}

declare global {
  // eslint-disable-next-line no-var
  var n8nStore: GlobalN8n | undefined;
}

if (!globalThis.n8nStore) {
  globalThis.n8nStore = {
    config: {
      enabled: false,
      webhookUrl: "",
      events: {
        job_created: false,
        application_status_changed: false,
        ats_scan_completed: false,
        copywriter_document_assembled: false,
      },
    },
    logs: [],
  };
}

export const n8nStore = globalThis.n8nStore;

export class N8nConnector {
  static async triggerEvent(eventType: string, payload: unknown) {
    try {
      const { config, logs } = n8nStore;

      if (!config.enabled) {
        return null;
      }

      // Check if event is enabled
      const isEnabled = config.events[eventType as keyof typeof config.events];
      if (!isEnabled) {
        return null;
      }

      // If webhookUrl is empty, skip dispatch but log it
      if (!config.webhookUrl) {
        const errorLog: N8NLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          eventType,
          status: "failed",
          statusCode: 0,
          payload,
          response: { error: "Webhook URL not configured" },
        };
        logs.unshift(errorLog);
        return errorLog;
      }

      const response = await fetch(config.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Workora-Automation-Event": eventType,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let responseBody: unknown = responseText;
      try {
        responseBody = JSON.parse(responseText);
      } catch {
        // Fallback to text
      }

      const logItem: N8NLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        eventType,
        status: response.ok ? "success" : "failed",
        statusCode: response.status,
        payload,
        response: responseBody,
      };

      logs.unshift(logItem);
      // Cap log history to 100 entries to prevent memory leak
      if (logs.length > 100) {
        logs.pop();
      }

      return logItem;
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "Network error";
      const errorLog: N8NLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        eventType,
        status: "failed",
        statusCode: 500,
        payload,
        response: { error: errorMsg },
      };
      n8nStore.logs.unshift(errorLog);
      if (n8nStore.logs.length > 100) {
        n8nStore.logs.pop();
      }
      return errorLog;
    }
  }
}
