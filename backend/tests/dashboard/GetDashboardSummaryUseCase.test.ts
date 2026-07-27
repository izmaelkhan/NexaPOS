import { GetDashboardSummaryUseCase } from "../../src/application/dashboard/GetDashboardSummaryUseCase";

describe("GetDashboardSummaryUseCase", () => {
  const mockSaleRepo = {
    findByDate: jest.fn().mockResolvedValue([
      { totalAmount: 1500, payments: [{ amount: 1500, type: "CASH" }] },
      { totalAmount: 2500, payments: [{ amount: 2500, type: "CARD" }] },
    ]),
  };

  const mockExpenseRepo = {
    findByDate: jest.fn().mockResolvedValue([
      { amount: 800 },
      { amount: 400 },
    ]),
  };

  const mockInventoryRepo = {
    getLowStock: jest.fn().mockResolvedValue([
      {
        productId: "p1",
        productName: "Product 1",
        stock: 2,
        reorderLevel: 5,
      },
      {
        productId: "p2",
        productName: "Product 2",
        stock: 1,
        reorderLevel: 3,
      },
    ]),
  };

  const mockCustomerRepo = {
    countAll: jest.fn().mockResolvedValue(100),
    countNewSince: jest.fn().mockResolvedValue(10),
    countRepeatSince: jest.fn().mockResolvedValue(20),
    countOutstandingCredit: jest.fn().mockResolvedValue(5),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should correctly aggregate dashboard summary data", async () => {
    const useCase = new GetDashboardSummaryUseCase(
      mockSaleRepo,
      mockExpenseRepo,
      mockInventoryRepo,
      mockCustomerRepo
    );

    const result = await useCase.execute(new Date("2023-01-01"));

    // Sales
    expect(result.todaySales).toBe(4000);
    expect(result.transactionCount).toBe(2);
    expect(result.averageSale).toBe(2000);

    // Expenses
    expect(result.todayExpenses).toBe(1200);

    // Profit
    expect(result.todayProfit).toBe(2800);

    // Low stock
    expect(result.lowStockProducts).toEqual([
      {
        productId: "p1",
        productName: "Product 1",
        stock: 2,
        reorderLevel: 5,
      },
      {
        productId: "p2",
        productName: "Product 2",
        stock: 1,
        reorderLevel: 3,
      },
    ]);
  });
});