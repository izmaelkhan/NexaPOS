export enum StockMovementType {
  PURCHASE_IN = "PURCHASE_IN",
  SALE_OUT = "SALE_OUT",
  RETURN_IN = "RETURN_IN",
  ADJUSTMENT = "ADJUSTMENT",
}

export class StockMovement {
  public readonly id: string;
  public readonly productId: string;
  public readonly branchId: string;
  public readonly type: StockMovementType;
  public readonly quantity: number;
  public readonly createdAt: Date;

  constructor(params: {
    id: string;
    productId: string;
    branchId: string;
    type: StockMovementType;
    quantity: number;
    createdAt?: Date;
  }) {
    const { id, productId, branchId, type, quantity, createdAt = new Date() } = params;

    // =====================
    // Business Rules
    // =====================

    if (!productId) {
      throw new Error("ProductId is required");
    }

    if (!branchId) {
      throw new Error("BranchId is required");
    }

    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    this.id = id;
    this.productId = productId;
    this.branchId = branchId;
    this.type = type;
    this.quantity = quantity;
    this.createdAt = createdAt;
  }

  // =====================
  // Domain Logic
  // =====================

  isInMovement(): boolean {
  return (
    this.type === StockMovementType.PURCHASE_IN ||
    this.type === StockMovementType.RETURN_IN
  );
}

isOutMovement(): boolean {
  return this.type === StockMovementType.SALE_OUT;
}

  getSignedQuantity(): number {
    // IN/RETURN => + stock
    // OUT/SALE => - stock
    return this.isInMovement() ? this.quantity : -this.quantity;
  }

  belongsToBranch(branchId: string): boolean {
    return this.branchId === branchId;
  }
  isSale(): boolean {
  return this.type === StockMovementType.SALE_OUT;
}

isReturn(): boolean {
  return this.type === StockMovementType.RETURN_IN;
}
}