import { GetSalesByCashierUseCase } from "../../src/application/reporting/GetSalesByCashierUseCase";

describe("GetSalesByCashierUseCase", () => {
  const mockSalesRepo = {
    getSalesByCashier: jest.fn().mockResolvedValue([
      { cashierId: "c1", cashierName: "Alice", totalAmount: 1200 },
      { cashierId: "c1", cashierName: "Alice", totalAmount: 800 },
      { cashierId: "c2", cashierName: "Bob", totalAmount: 500 },
    ]),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should group sales by cashier and calculate totals and averages", async () => {
    const useCase = new GetSalesByCashierUseCase(mockSalesRepo);
    const result = await useCase.execute(new Date("2023-01-01"));

    expect(result).toEqual([
      {
        cashierId: "c1",
        cashierName: "Alice",
        totalSales: 2000,
        transactions: 2,
        averageBill: 1000,
      },
      {
        cashierId: "c2",
        cashierName: "Bob",
        totalSales: 500,
        transactions: 1,
        averageBill: 500,
      },
    ]);

    expect(mockSalesRepo.getSalesByCashier).toHaveBeenCalled();
  });
});