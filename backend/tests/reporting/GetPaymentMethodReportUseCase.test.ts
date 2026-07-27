import { GetPaymentMethodReportUseCase } from "../../src/application/reporting/GetPaymentMethodReportUseCase";

describe("GetPaymentMethodReportUseCase", () => {
  const mockPaymentRepo = {
    getAllPayments: jest.fn().mockResolvedValue([
      { amount: 5000, type: "CASH" },
      { amount: 3000, type: "CARD" },
      { amount: 2000, type: "CASH" },
      { amount: 1500, type: "CREDIT" },
    ]),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should aggregate payment amounts by method (case‑insensitive)", async () => {
    const useCase = new GetPaymentMethodReportUseCase(mockPaymentRepo);
    const result = await useCase.execute(new Date("2023-01-01"));
    expect(result).toEqual({
      cash: 7000,   // 5000 + 2000
      card: 3000,
      credit: 1500,
    });
    expect(mockPaymentRepo.getAllPayments).toHaveBeenCalled();
  });
});