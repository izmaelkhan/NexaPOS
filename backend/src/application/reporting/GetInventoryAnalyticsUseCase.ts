export interface InventoryAnalyticsDto {
  totalProducts: number;
  outOfStock: number;
  lowStock: number;
  inventoryValue: number;
}

export class GetInventoryAnalyticsUseCase {
  constructor(
    private readonly inventoryRepository: {
      countAllProducts(): Promise<number>;
      countOutOfStock(): Promise<number>;
      getLowStockCount(): Promise<number>;
      calculateTotalValue(): Promise<number>;
    }
  ) {}

  async execute(): Promise<InventoryAnalyticsDto> {
    const [total, outOfStock, lowStock, value] = await Promise.all([
      this.inventoryRepository.countAllProducts(),
      this.inventoryRepository.countOutOfStock(),
      this.inventoryRepository.getLowStockCount(),
      this.inventoryRepository.calculateTotalValue(),
    ]);

    return {
      totalProducts: total,
      outOfStock,
      lowStock,
      inventoryValue: value,
    };
  }
}