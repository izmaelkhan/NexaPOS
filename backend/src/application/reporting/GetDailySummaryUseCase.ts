type DailySummaryReport = {
  sales: number;
  refunds: number;
  expenses: number;
  netBusiness: number;
};

export class GetDailySummaryUseCase {
  constructor(
    private readonly salesReportUseCase: {
      execute(date?: Date): Promise<{
        sales: number;
      }>;
    },

    private readonly expenseReportUseCase: {
      execute(date?: Date): Promise<{
        expenses: number;
      }>;
    },

    private readonly returnRepository: {
      getDailyRefundAmount(date: Date): Promise<number>;
    }
  ) {}

  async execute(
    date: Date = new Date()
  ): Promise<DailySummaryReport> {
    const salesReport =
      await this.salesReportUseCase.execute(date);

    const expenseReport =
      await this.expenseReportUseCase.execute(date);

    const refunds =
      await this.returnRepository.getDailyRefundAmount(date);

    const netBusiness =
      salesReport.sales -
      refunds -
      expenseReport.expenses;

    return {
      sales: salesReport.sales,
      refunds,
      expenses: expenseReport.expenses,
      netBusiness,
    };
  }
}