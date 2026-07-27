import { DashboardSummaryDto, LowStockProductDto } from './DashboardSummaryDto';

export class GetDashboardSummaryUseCase {
  constructor(
    private readonly saleRepository: {
      findByDate(date: Date): Promise<
        {
          totalAmount: number;
          payments?: { amount: number; type: string }[];
        }[]
      >;
    },
    private readonly expenseRepository: {
      findByDate(date: Date): Promise<
        {
          amount: number;
        }[]
      >;
    },
    private readonly inventoryRepository: {
      getLowStock(): Promise<
        {
          productId: string;
          stock: number;
          reorderLevel: number;
          productName?: string;
        }[]
      >;
    },
    private readonly customerRepository: {
      countAll(): Promise<number>;
      countNewSince(date: Date): Promise<number>;
      countRepeatSince(date: Date): Promise<number>;
      countOutstandingCredit(): Promise<number>;
    }
  ) {}

  async execute(date: Date = new Date()): Promise<DashboardSummaryDto> {
    // Sales calculations (reuse logic from GetDailySalesReportUseCase)
    const sales = await this.saleRepository.findByDate(date);
    let totalSales = 0;
    let transactionCount = 0;
    for (const sale of sales) {
      transactionCount++;
      totalSales += sale.totalAmount;
    }
    const averageSale = transactionCount > 0 ? totalSales / transactionCount : 0;

    // Expenses
    const expenses = await this.expenseRepository.findByDate(date);
    let totalExpenses = 0;
    for (const exp of expenses) {
      totalExpenses += exp.amount;
    }

    // Low stock products
    const lowStockRaw = await this.inventoryRepository.getLowStock();
    const lowStockProducts: LowStockProductDto[] = lowStockRaw.map(item => ({
      productId: item.productId,
      productName: item.productName,
      stock: item.stock,
      reorderLevel: item.reorderLevel,
    }));

    // Profit
    const todayProfit = totalSales - totalExpenses;

    return {
      todaySales: totalSales,
      todayExpenses: totalExpenses,
      todayProfit,
      transactionCount,
      averageSale,
      lowStockProducts,
    };
  }
}