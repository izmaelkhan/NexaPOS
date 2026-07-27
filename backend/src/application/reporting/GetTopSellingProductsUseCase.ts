export interface TopSellingProductDto {
  product: string;
  quantity: number;
}

export class GetTopSellingProductsUseCase {
  constructor(
    private readonly salesRepository: {
      getTopSelling(limit: number): Promise<
        {
          product: string;
          quantity: number;
        }[]
      >;
    }
  ) {}

  async execute(limit: number = 10): Promise<TopSellingProductDto[]> {
    const topProducts = await this.salesRepository.getTopSelling(limit);
    // Ensure the shape matches the DTO
    return topProducts.map(p => ({
      product: p.product,
      quantity: p.quantity,
    }));
  }
}