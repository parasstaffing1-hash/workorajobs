import { prisma } from "@/lib/prisma";

export class WalletService {
  /**
   * Retrieves or creates user credit wallet
   */
  static async getOrCreateWallet(userId: string) {
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: { transactions: { orderBy: { createdAt: "desc" }, take: 10 } },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balanceCents: 0,
        },
        include: { transactions: true },
      });
    }

    return wallet;
  }

  /**
   * Credits promotional or referral amount to wallet
   */
  static async addCredit(userId: string, amountCents: number, description: string) {
    const wallet = await this.getOrCreateWallet(userId);

    const updated = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balanceCents: wallet.balanceCents + amountCents,
        transactions: {
          create: {
            amountCents,
            type: "CREDIT",
            description,
          },
        },
      },
      include: { transactions: { orderBy: { createdAt: "desc" }, take: 10 } },
    });

    return updated;
  }
}
