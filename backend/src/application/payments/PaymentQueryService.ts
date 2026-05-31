export class PaymentQueryService {
  constructor(private readonly paymentRepo: any) {}

  async getBySaleId(saleId: string) {
    const payments = await this.paymentRepo.findBySaleId(saleId);

    const totalPaid = payments.reduce(
      (sum: number, p: any) => sum + p.amount,
      0
    );

    return {
      saleId,
      payments,
      totalPaid,
    };
  }
}