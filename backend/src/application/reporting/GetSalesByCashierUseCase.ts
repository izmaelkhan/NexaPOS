export interface SalesByCashierDto {
  cashierId: string;
  cashierName?: string;
  totalSales: number;
  transactions: number;
  averageBill: number;
}

export class GetSalesByCashierUseCase {
  constructor(
    private readonly salesRepository: {
      getSalesByCashier(date: Date): Promise<
        {
          cashierId: string;
          cashierName?: string;
          totalAmount: number;
        }[]
      >;
    }
  ) {}

  async execute(date: Date = new Date()): Promise<SalesByCashierDto[]> {
    const records = await this.salesRepository.getSalesByCashier(date);
    // Group by cashier
    const map = new Map<string, { name?: string; total: number; count: number }>();
    for (const rec of records) {
      const entry = map.get(rec.cashierId) || { name: rec.cashierName, total: 0, count: 0 };
      entry.total += rec.totalAmount;
      entry.count += 1;
      map.set(rec.cashierId, entry);
    }

    const result: SalesByCashierDto[] = [];
    for (const [cashierId, data] of map.entries()) {
      result.push({
        cashierId,
        cashierName: data.name,
        totalSales: data.total,
        transactions: data.count,
        averageBill: data.count > 0 ? data.total / data.count : 0,
      });
    }

    return result;
  }
}