type DailySalesReport = {
  sales: number;
  transactions: number;
  cashSales: number;
  cardSales: number;
};

export class GetDailySalesReportUseCase {
  constructor(
    private readonly saleRepository: {
      findByDate(date: Date): Promise<
        {
          totalAmount: number;
          payments?: {
            amount: number;
            type: string;
          }[];
        }[]
      >;
    }
  ) {}

  async execute(date: Date = new Date()): Promise<DailySalesReport> {
    const sales = await this.saleRepository.findByDate(date);

    let totalSales = 0;
    let transactions = 0;
    let cashSales = 0;
    let cardSales = 0;

    for (const sale of sales) {
      transactions++;
      totalSales += sale.totalAmount;

      if (!sale.payments) {
        continue;
      }

      for (const payment of sale.payments) {
        switch (payment.type.toUpperCase()) {
          case "CASH":
            cashSales += payment.amount;
            break;

          case "CARD":
            cardSales += payment.amount;
            break;

          default:
            break;
        }
      }
    }

    return {
      sales: totalSales,
      transactions,
      cashSales,
      cardSales,
    };
  }
}