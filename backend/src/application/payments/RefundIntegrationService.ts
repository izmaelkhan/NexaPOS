import { PaymentMethod } from "../../domain/payments/Payments";
import { AuditLogger } from "../../shared/audit/AuditLogger";
import { AuditEventType } from "../../shared/audit/AuditEventType";

type RefundInput = {
  saleId: string;
  amount: number;
  reason?: string;
};

export class RefundIntegrationService {
  constructor(
    private readonly paymentRepo: {
      create(payment: any): Promise<void>;
      findBySaleId(saleId: string): Promise<any[]>;
    },
    private readonly stockRepo: {
      createMovement(data: any): Promise<void>;
    },
    private readonly ledgerRepo: {
      createEntry(data: any): Promise<void>;
    },
private readonly auditLogger?: { log: (event: any) => void }
  ) {}

  async processRefund(input: RefundInput) {
    const { saleId, amount, reason } = input;

    if (amount <= 0) {
      throw new Error("Refund amount must be greater than 0");
    }

    const payments = await this.paymentRepo.findBySaleId(saleId);

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    if (amount > totalPaid) {
      throw new Error("Refund exceeds paid amount");
    }

    const refundPayment = {
      paymentId: crypto.randomUUID(),
      saleId,
      amount: -Math.abs(amount),
      method: PaymentMethod.CASH,
      state: "REFUNDED",
    };

    await this.paymentRepo.create(refundPayment);

    await this.stockRepo.createMovement({
      id: crypto.randomUUID(),
      saleId,
      type: "REFUND_IN",
      quantity: amount,
      createdAt: new Date(),
    });

    await this.ledgerRepo.createEntry({
      id: crypto.randomUUID(),
      saleId,
      type: "REFUND",
      amount: -amount,
      balanceImpact: "DEBIT",
      createdAt: new Date(),
    });

    this.auditLogger?.log({
      type: AuditEventType.REFUND_ISSUED,
      timestamp: new Date(),
      data: {
        saleId,
        amount,
        reason,
      },
    });

    return {
      success: true,
      refundPayment,
    };
  }
}