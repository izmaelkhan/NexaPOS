import { GetCustomerAnalyticsUseCase } from "../../src/application/reporting/GetCustomerAnalyticsUseCase";

describe("GetCustomerAnalyticsUseCase", () => {
  const mockCustomerRepo = {
    countAll: jest.fn().mockResolvedValue(200),
    countNewSince: jest.fn().mockResolvedValue(15),
    countRepeatSince: jest.fn().mockResolvedValue(35),
    countOutstandingCredit: jest.fn().mockResolvedValue(8),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return aggregated customer analytics", async () => {
    const useCase = new GetCustomerAnalyticsUseCase(mockCustomerRepo);
    const result = await useCase.execute(new Date("2023-01-01"));
    expect(result).toEqual({
      totalCustomers: 200,
      newCustomers: 15,
      repeatCustomers: 35,
      customersWithOutstandingCredit: 8,
    });
    expect(mockCustomerRepo.countAll).toHaveBeenCalled();
    expect(mockCustomerRepo.countNewSince).toHaveBeenCalled();
    expect(mockCustomerRepo.countRepeatSince).toHaveBeenCalled();
    expect(mockCustomerRepo.countOutstandingCredit).toHaveBeenCalled();
  });
});