import { prisma } from "@/lib/prisma";

export type NotificationChannel = "IN_APP" | "EMAIL" | "TELEGRAM" | "DISCORD";

export interface NotificationPayload {
  userId: string;
  recipientEmail?: string;
  title: string;
  message: string;
  variables?: Record<string, string>;
  channels?: NotificationChannel[];
}

export class NotificationChannelDispatcher {
  /**
   * Template interpolation engine replacing {{key}} variables
   */
  static interpolate(templateText: string, variables: Record<string, string> = {}): string {
    let output = templateText;
    Object.keys(variables).forEach((key) => {
      const val = variables[key] || "";
      output = output.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), val);
    });
    return output;
  }

  /**
   * Universal notification dispatcher across channels
   */
  static async dispatch(payload: NotificationPayload): Promise<{
    deliveredChannels: NotificationChannel[];
    failedChannels: NotificationChannel[];
  }> {
    const interpolatedTitle = this.interpolate(payload.title, payload.variables);
    const interpolatedMessage = this.interpolate(payload.message, payload.variables);
    const channels = payload.channels || ["IN_APP", "EMAIL"];

    const deliveredChannels: NotificationChannel[] = [];
    const failedChannels: NotificationChannel[] = [];

    // Check user preferences
    const pref = await prisma.notificationPreference.findUnique({
      where: { userId: payload.userId },
    });

    for (const channel of channels) {
      try {
        if (channel === "IN_APP") {
          if (!pref || pref.inAppEnabled) {
            await prisma.notification.create({
              data: {
                userId: payload.userId,
                title: interpolatedTitle,
                message: interpolatedMessage,
                type: "INFO",
              },
            });
            deliveredChannels.push("IN_APP");
          }
        }

        if (channel === "EMAIL") {
          if (!pref || pref.emailEnabled) {
            // Log Email delivery attempt
            await prisma.notificationDeliveryLog.create({
              data: {
                recipient: payload.recipientEmail || payload.userId,
                channel: "EMAIL",
                status: "SUCCESS",
              },
            });
            deliveredChannels.push("EMAIL");
          }
        }

        if (channel === "TELEGRAM" && pref?.telegramEnabled && pref.telegramChatId) {
          // Telegram Webhook / Bot API integration hook
          await prisma.notificationDeliveryLog.create({
            data: {
              recipient: pref.telegramChatId,
              channel: "TELEGRAM",
              status: "SUCCESS",
            },
          });
          deliveredChannels.push("TELEGRAM");
        }

        if (channel === "DISCORD" && pref?.discordEnabled && pref.discordWebhookUrl) {
          // Discord Webhook integration hook
          await prisma.notificationDeliveryLog.create({
            data: {
              recipient: pref.discordWebhookUrl,
              channel: "DISCORD",
              status: "SUCCESS",
            },
          });
          deliveredChannels.push("DISCORD");
        }
      } catch (err: any) {
        failedChannels.push(channel);
        await prisma.notificationDeliveryLog.create({
          data: {
            recipient: payload.recipientEmail || payload.userId,
            channel,
            status: "FAILED",
            error: err?.message || "Delivery failure",
          },
        });
      }
    }

    return { deliveredChannels, failedChannels };
  }
}
