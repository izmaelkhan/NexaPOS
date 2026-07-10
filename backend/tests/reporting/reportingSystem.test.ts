import { GetDailySalesReportUseCase } from "../../src/application/reporting/GetDailySalesReportUseCase";
import { GetDailyExpenseReportUseCase } from "../../src/application/reporting/GetDailyExpenseReportUseCase";
import { GetDailySummaryUseCase } from "../../src/application/reporting/GetDailySummaryUseCase";

describe("Reporting", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should calculate daily sales totals", async () => {

    const saleRepo = {
      findByDate: jest.fn().mockResolvedValue([
        {
          totalAmount: 1000,
          payments: [
            { amount: 1000, type: "CASH" }
          ]
        },
        {
          totalAmount: 2000,
          payments: [
            { amount: 2000, type: "CARD" }
          ]
        }
      ])
    };

    const useCase =
      new GetDailySalesReportUseCase(saleRepo);

    const report =
      await useCase.execute();

    expect(report.sales).toBe(3000);
    expect(report.transactions).toBe(2);
    expect(report.cashSales).toBe(1000);
    expect(report.cardSales).toBe(2000);

  });

  it("should calculate daily summary", async () => {

    const salesUseCase = {
      execute: jest.fn().mockResolvedValue({
        sales: 10000,
      }),
    };

    const expenseUseCase = {
      execute: jest.fn().mockResolvedValue({
        expenses: 2000,
      }),
    };

    const returnRepository = {
      getDailyRefundAmount: jest.fn().mockResolvedValue(500),
    };

    const summary =
      new GetDailySummaryUseCase(
        salesUseCase,
        expenseUseCase,
        returnRepository
      );

    const result =
      await summary.execute();

    expect(result.sales).toBe(10000);
    expect(result.refunds).toBe(500);
    expect(result.expenses).toBe(2000);
    expect(result.netBusiness).toBe(7500);

  });

});