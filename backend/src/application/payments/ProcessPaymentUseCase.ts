import { Payment, PaymentMethod } from "../../domain/payments/Payments";

export class ProcessPaymentUseCase {
  constructor(
    private readonly paymentRepo: any,
    private readonly validator: any
  ) {}

  async execute(input: {
    saleId: string;
    method: PaymentMethod;
    amount: number;
  }) {
    this.validator.validate(input);

    const payment = new Payment({
      paymentId: crypto.randomUUID(),
      saleId: input.saleId,
      method: input.method,
      amount: input.amount,
    });

    payment.start();

    if (input.method === PaymentMethod.CASH || input.method === PaymentMethod.CARD) {
      payment.complete();
    }

    await this.paymentRepo.save(payment);

    return payment;
  }
}