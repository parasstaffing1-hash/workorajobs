import { prisma } from "@/lib/prisma";

export class InvoicingEngine {
  /**
   * Generates a tax-compliant invoice for subscription or purchase
   */
  static async createInvoice(data: {
    userId: string;
    subscriptionId?: string;
    items: Array<{ description: string; amountCents: number; quantity?: number }>;
    discountCents?: number;
    countryCode?: string;
  }) {
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const subtotalCents = data.items.reduce((acc, item) => acc + item.amountCents * (item.quantity || 1), 0);
    const discountCents = data.discountCents || 0;
    const taxableSubtotal = Math.max(0, subtotalCents - discountCents);

    // Calculate tax rate
    let taxPercentage = 0;
    if (data.countryCode) {
      const taxRate = await prisma.taxRate.findUnique({ where: { countryCode: data.countryCode } });
      if (taxRate && taxRate.isActive) {
        taxPercentage = taxRate.percentage;
      }
    }

    const taxCents = Math.round((taxableSubtotal * taxPercentage) / 100);
    const totalCents = taxableSubtotal + taxCents;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        userId: data.userId,
        subscriptionId: data.subscriptionId,
        amountSubtotalCents: subtotalCents,
        amountDiscountCents: discountCents,
        amountTaxCents: taxCents,
        amountTotalCents: totalCents,
        status: "PAID",
        pdfUrl: `/api/v1/billing/invoices/${invoiceNumber}/pdf`,
        items: {
          create: data.items.map((item) => ({
            description: item.description,
            amountCents: item.amountCents,
            quantity: item.quantity || 1,
          })),
        },
      },
      include: { items: true },
    });

    return invoice;
  }
}
