import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export type WebhookEventType =
  | "JOB_CREATED"
  | "JOB_UPDATED"
  | "JOB_DELETED"
  | "APPLICATION_SUBMITTED"
  | "APPLICATION_UPDATED"
  | "INTERVIEW_SCHEDULED"
  | "OFFER_SENT";

export interface WebhookPayload {
  event: WebhookEventType;
  timestamp: string;
  data: Record<string, any>;
}

export class WebhookEngine {
  /**
   * Signs payload using HMAC SHA-256 secret
   */
  static calculateSignature(payloadString: string, secret: string): string {
    return crypto.createHmac("sha256", secret).update(payloadString).digest("hex");
  }

  /**
   * Dispatches webhook payload to target URL with HMAC signature header
   */
  static async dispatchEvent(event: WebhookEventType, data: Record<string, any>, targetUrl: string, secret?: string) {
    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };

    const payloadString = JSON.stringify(payload);
    const signature = this.calculateSignature(payloadString, secret || "workora-webhook-secret");

    try {
      const res = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Workora-Signature": signature,
          "User-Agent": "WorkoraJobs-Webhooks/1.0",
        },
        body: payloadString,
      });

      const isSuccess = res.ok || res.status === 202;

      await prisma.notificationDeliveryLog.create({
        data: {
          recipient: targetUrl,
          channel: "WEBHOOK",
          status: isSuccess ? "SUCCESS" : "FAILED",
          error: isSuccess ? undefined : `HTTP status ${res.status}`,
        },
      });

      return { success: isSuccess, statusCode: res.status };
    } catch (e: any) {
      await prisma.notificationDeliveryLog.create({
        data: {
          recipient: targetUrl,
          channel: "WEBHOOK",
          status: "FAILED",
          error: e?.message || "Webhook delivery network error",
        },
      });

      return { success: false, error: e?.message || "Delivery error" };
    }
  }
}
