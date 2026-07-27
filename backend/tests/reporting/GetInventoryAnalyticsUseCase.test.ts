import { GetInventoryAnalyticsUseCase } from "../../src/application/reporting/GetInventoryAnalyticsUseCase";

describe("GetInventoryAnalyticsUseCase", () => {
  const mockInventoryRepo = {
    countAllProducts: jest.fn().mockResolvedValue(150),
    countOutOfStock: jest.fn().mockResolvedValue(10),
    getLowStockCount: jest.fn().mockResolvedValue(25),
    calculateTotalValue: jest.fn().mockResolvedValue(75000),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return inventory analytics data", async () => {
    const useCase = new GetInventoryAnalyticsUseCase(mockInventoryRepo);
    const result = await useCase.execute();
    expect(result).toEqual({
      totalProducts: 150,
      outOfStock: 10,
      lowStock: 25,
      inventoryValue: 75000,
    });
    expect(mockInventoryRepo.countAllProducts).toHaveBeenCalled();
    expect(mockInventoryRepo.countOutOfStock).toHaveBeenCalled();
    expect(mockInventoryRepo.getLowStockCount).toHaveBeenCalled();
    expect(mockInventoryRepo.calculateTotalValue).toHaveBeenCalled();
  });
});