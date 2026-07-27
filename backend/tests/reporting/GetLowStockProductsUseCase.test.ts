import { GetLowStockProductsUseCase } from "../../src/application/reporting/GetLowStockProductsUseCase";

describe("GetLowStockProductsUseCase", () => {
  const mockInventoryRepo = {
    findAll: jest.fn().mockResolvedValue([
      { productId: "p1", productName: "Item 1", stock: 2, reorderLevel: 5 },
      { productId: "p2", productName: "Item 2", stock: 6, reorderLevel: 3 },
      { productId: "p3", stock: 0, reorderLevel: 1 },
    ]),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should filter products where stock <= reorderLevel", async () => {
    const useCase = new GetLowStockProductsUseCase(mockInventoryRepo);
    const result = await useCase.execute();

    expect(result).toEqual([
      {
        productId: "p1",
        productName: "Item 1",
        stock: 2,
        reorderLevel: 5,
      },
      {
        productId: "p3",
        productName: undefined,
        stock: 0,
        reorderLevel: 1,
      },
    ]);
    expect(mockInventoryRepo.findAll).toHaveBeenCalled();
  });
});