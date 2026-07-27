export interface LowStockProductReportDto {
  productId: string;
  productName?: string;
  stock: number;
  reorderLevel: number;
}

export class GetLowStockProductsUseCase {
  constructor(
    private readonly inventoryRepository: {
      findAll(): Promise<
        {
          productId: string;
          productName?: string;
          stock: number;
          reorderLevel: number;
        }[]
      >;
    }
  ) {}

  async execute(): Promise<LowStockProductReportDto[]> {
    const allProducts = await this.inventoryRepository.findAll();
    const lowStock = allProducts.filter(
      p => p.stock <= p.reorderLevel
    );
    return lowStock.map(p => ({
      productId: p.productId,
      productName: p.productName,
      stock: p.stock,
      reorderLevel: p.reorderLevel,
    }));
  }
}