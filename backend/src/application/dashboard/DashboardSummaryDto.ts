export interface LowStockProductDto {
  productId: string;
  productName?: string;
  stock: number;
  reorderLevel: number;
}

export interface DashboardSummaryDto {
  todaySales: number;
  todayExpenses: number;
  todayProfit: number;
  transactionCount: number;
  averageSale: number;
  lowStockProducts: LowStockProductDto[];
}
