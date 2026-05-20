import { StockMovementType } from "../../domain/inventory/StockMovement";

export class StockService {
  constructor(private readonly stockRepo: any) {}

  async increaseStock(productId: string, branchId: string, quantity: number) {
    if (quantity <= 0) throw new Error("Invalid quantity");

    return this.stockRepo.createMovement({
      id: crypto.randomUUID(),
      productId,
      branchId,
      type: StockMovementType.PURCHASE_IN,
      quantity,
    });
  }

  async decreaseStock(productId: string, branchId: string, quantity: number) {
    if (quantity <= 0) throw new Error("Invalid quantity");

    return this.stockRepo.createMovement({
      id: crypto.randomUUID(),
      productId,
      branchId,
      type: StockMovementType.SALE_OUT,
      quantity,
    });
  }
}