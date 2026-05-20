import { StockMovementType } from "../../domain/inventory/StockMovement";

export class InventoryService {
  constructor(private readonly stockRepo: any) {}

  /**
   * =========================
   * DECREASE STOCK (SALE ONLY)
   * =========================
   */
  async decreaseStock(params: {
    productId: string;
    branchId: string;
    quantity: number;
    referenceId: string; // saleId
  }) {
    const stock = await this.stockRepo.getStock(
      params.productId,
      params.branchId
    );

    if (!stock) {
      throw new Error("Stock not found");
    }

    if (stock.stock < params.quantity) {
      throw new Error("Insufficient stock");
    }

    // ONLY via movement system
    return this.stockRepo.createMovement({
      id: crypto.randomUUID(),
      productId: params.productId,
      branchId: params.branchId,
      type: StockMovementType.SALE_OUT,
      quantity: params.quantity,
      referenceId: params.referenceId,
    });
  }

  /**
   * =========================
   * INCREASE STOCK (PURCHASE/RETURN)
   * =========================
   */
  async increaseStock(params: {
    productId: string;
    branchId: string;
    quantity: number;
    referenceId: string;
  }) {
    return this.stockRepo.createMovement({
      id: crypto.randomUUID(),
      productId: params.productId,
      branchId: params.branchId,
      type: StockMovementType.PURCHASE_IN,
      quantity: params.quantity,
      referenceId: params.referenceId,
    });
  }
}