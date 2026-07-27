export interface PaymentMethodReportDto {
  [method: string]: number;
}

export class GetPaymentMethodReportUseCase {
  constructor(
    private readonly paymentRepository: {
      getAllPayments(date: Date): Promise<
        {
          amount: number;
          type: string;
        }[]
      >;
    }
  ) {}

  async execute(date: Date = new Date()): Promise<PaymentMethodReportDto> {
    const payments = await this.paymentRepository.getAllPayments(date);
    const report: PaymentMethodReportDto = {};

    for (const p of payments) {
      const key = p.type.toLowerCase();
      report[key] = (report[key] ?? 0) + p.amount;
    }

    return report;
  }
}