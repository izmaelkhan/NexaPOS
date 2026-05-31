import { SplitPayment } from "../../domain/payments/SplitPayment";
import { Payment } from "../../domain/payments/Payments";

export class SplitPaymentUseCase {
  constructor(
    private readonly paymentRepo: any,
    private readonly validator: any
  ) {}

  async execute(input: {
    saleId: string;
    totalAmount: number;
    payments: { method: any; amount: number }[];
  }) {
    const split = new SplitPayment(input);

    split.validate();

    const results = [];

    for (const p of input.payments) {
      const payment = new Payment({
        paymentId: crypto.randomUUID(),
        saleId: input.saleId,
        method: p.method,
        amount: p.amount,
      });

      payment.start();
      payment.complete();

      await this.paymentRepo.save(payment);

      results.push(payment);
    }

    return {
      saleId: input.saleId,
      payments: results,
      total: input.totalAmount,
    };
  }
}