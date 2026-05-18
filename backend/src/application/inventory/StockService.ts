import { StockMovement, StockMovementType } from "../../domain/inventory/StockMovement";

interface StockMovementRepository {
  save(movement: StockMovement): Promise<void>;
}

export class StockService {
  constructor(private movementRepo: StockMovementRepository) {}

  // =====================
  // STOCK INCREASE (PURCHASE / RETURN)
  // =====================
  async increaseStock(input: {
    productId: string;
    branchId: string;
    quantity: number;
    type?: StockMovementType;
  }) {
    const movement = new StockMovement({
      id: crypto.randomUUID(),
      productId: input.productId,
      branchId: input.branchId,
      type: input.type ?? StockMovementType.IN,
      quantity: input.quantity,
    });

    await this.movementRepo.save(movement);
    return movement;
  }

  // =====================
  // STOCK DECREASE (SALE / OUT)
  // =====================
  async decreaseStock(input: {
    productId: string;
    branchId: string;
    quantity: number;
    type?: StockMovementType;
  }) {
    const movement = new StockMovement({
      id: crypto.randomUUID(),
      productId: input.productId,
      branchId: input.branchId,
      type: input.type ?? StockMovementType.SALE,
      quantity: input.quantity,
    });

    await this.movementRepo.save(movement);
    return movement;
  }

  // =====================
  // TRANSFER STOCK (OPTIONAL EXTENSION)
  // =====================
  async transferStock(input: {
    productId: string;
    fromBranchId: string;
    toBranchId: string;
    quantity: number;
  }) {
    // OUT from source
    await this.decreaseStock({
      productId: input.productId,
      branchId: input.fromBranchId,
      quantity: input.quantity,
      type: StockMovementType.OUT,
    });

    // IN to target
    await this.increaseStock({
      productId: input.productId,
      branchId: input.toBranchId,
      quantity: input.quantity,
      type: StockMovementType.IN,
    });
  }
}