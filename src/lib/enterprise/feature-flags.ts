import { prisma } from "@/lib/prisma";

export class FeatureFlagEngine {
  /**
   * Evaluates if a feature flag is active for a specific user and role
   */
  static async isFeatureEnabled(flagKey: string, userId?: string, userRole?: string): Promise<boolean> {
    const flag = await prisma.featureFlag.findUnique({
      where: { key: flagKey },
    });

    if (!flag || !flag.isEnabled) return false;

    // Direct User Override
    if (userId && flag.targetUserIds.includes(userId)) {
      return true;
    }

    // Role Override
    if (userRole && flag.targetRoles.includes(userRole)) {
      return true;
    }

    // Percentage Rollout Evaluation
    if (flag.rolloutPercent >= 100) return true;
    if (flag.rolloutPercent <= 0) return false;

    if (userId) {
      const hash = Array.from(userId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return hash % 100 < flag.rolloutPercent;
    }

    return true;
  }

  /**
   * Admin updates feature flag rollout
   */
  static async setFeatureFlag(data: {
    key: string;
    isEnabled: boolean;
    description?: string;
    rolloutPercent?: number;
    targetUserIds?: string[];
    targetRoles?: string[];
  }) {
    return prisma.featureFlag.upsert({
      where: { key: data.key },
      create: {
        key: data.key,
        description: data.description,
        isEnabled: data.isEnabled,
        rolloutPercent: data.rolloutPercent ?? 100,
        targetUserIds: data.targetUserIds || [],
        targetRoles: data.targetRoles || [],
      },
      update: {
        description: data.description,
        isEnabled: data.isEnabled,
        rolloutPercent: data.rolloutPercent ?? 100,
        targetUserIds: data.targetUserIds,
        targetRoles: data.targetRoles,
      },
    });
  }
}
