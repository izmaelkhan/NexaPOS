import { Payment, PaymentType } from "../../domain/payments/Payments";
import { Sale, SaleStatus } from "../../domain/sales/Sale";

export class PaymentService {
  constructor(
    private readonly paymentRepo: any,
    private readonly saleRepo: any,
    private readonly auditLogger?: {
      log(data:any):void;}
  ) {}

  /**
   * =========================
   * PROCESS PAYMENT
   * =========================
   */
  async processPayment(params: {
    sale: Sale;
    payments: {
      type: PaymentType;
      amount: number;
    }[];
  }) {
    const { sale, payments } = params;

    if (!payments || payments.length === 0) {
      throw new Error("No payment provided");
    }

    let totalPaid = 0;

    const paymentEntities: Payment[] = [];

    // =========================
    // HANDLE MULTIPLE PAYMENTS (SPLIT SUPPORT)
    // =========================
    for (const p of payments) {
      const payment = new Payment({
        id: crypto.randomUUID(),
        saleId: sale.id,
        type: p.type,
        amount: p.amount,
      });

      paymentEntities.push(payment);
      totalPaid += p.amount;
    }

    // =========================
    // VALIDATION AGAINST SALE TOTAL
    // =========================
    if (totalPaid < sale.total) {
      // CREDIT RULE
      const hasCredit = payments.some(
        (p) => p.type === PaymentType.CREDIT
      );

      if (!hasCredit) {
        throw new Error("Insufficient payment amount");
      }

      sale.status = SaleStatus.PENDING;
    }

    if (totalPaid > sale.total) {
      throw new Error("Payment exceeds sale total");
    }

    // =========================
    // STATUS RULES
    // =========================
    const hasCredit = payments.some(
      (p) => p.type === PaymentType.CREDIT
    );

    if (hasCredit) {
      sale.status = SaleStatus.PENDING;
    } else {
      sale.status = SaleStatus.PAID;
    }

    // =========================
    // TYPE-SPECIFIC RULES
    // =========================

    const hasCashOrCard = payments.every(
      (p) =>
        p.type === PaymentType.CASH ||
        p.type === PaymentType.CARD
    );

    if (hasCashOrCard && totalPaid === sale.total) {
      sale.status = SaleStatus.PAID;
    }

    // =========================
    // PERSIST DATA
    // =========================
    for (const payment of paymentEntities) {
      await this.paymentRepo.save(payment);
    }

    await this.saleRepo.update(sale);

    return {
      sale,
      payments: paymentEntities,
      totalPaid,
    };
  }
}