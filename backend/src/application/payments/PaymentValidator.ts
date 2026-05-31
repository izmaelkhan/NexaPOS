import { PaymentMethod } from "../../domain/payments/Payments";

export class PaymentValidator {
  validate(input: {
    saleId: string;
    totalAmount: number;
    payments: { method: PaymentMethod; amount: number }[];
  }) {
    const sum = input.payments.reduce(
      (a, p) => a + p.amount,
      0
    );

    if (sum !== input.totalAmount) {
      throw new Error("Payment mismatch");
    }

    const creditAmount = input.payments
      .filter(p => p.method === PaymentMethod.CREDIT)
      .reduce((a, p) => a + p.amount, 0);

    return {
      valid: true,
      total: sum,
      remaining: 0,
      creditAmount,
      requiresReceivable: creditAmount > 0,
    };
  }
}