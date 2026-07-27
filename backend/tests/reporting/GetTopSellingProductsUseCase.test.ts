import { GetTopSellingProductsUseCase } from "../../src/application/reporting/GetTopSellingProductsUseCase";

describe("GetTopSellingProductsUseCase", () => {
  const mockSalesRepo = {
    getTopSelling: jest.fn().mockResolvedValue([
      { product: "Milk", quantity: 120 },
      { product: "Bread", quantity: 95 },
    ]),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return top‑selling products in the expected DTO shape", async () => {
    const useCase = new GetTopSellingProductsUseCase(mockSalesRepo);
    const result = await useCase.execute(5);
    expect(result).toEqual([
      { product: "Milk", quantity: 120 },
      { product: "Bread", quantity: 95 },
    ]);
    expect(mockSalesRepo.getTopSelling).toHaveBeenCalledWith(5);
  });
});