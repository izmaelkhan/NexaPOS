export type DailyDashboardDto = {
  /**
   * Total sales for today
   */
  todaySales: number;

  /**
   * Total expenses for today
   */
  expenses: number;

  /**
   * Number of completed transactions
   */
  transactions: number;

  /**
   * Estimated profit
   * Formula:
   * Sales - Expenses - Refunds
   */
  profitEstimate: number;

  /**
   * Products below minimum stock level
   */
  lowStockCount: number;
};