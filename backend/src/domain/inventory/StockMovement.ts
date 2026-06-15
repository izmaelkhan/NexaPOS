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
    if (!params.productId) {
      throw new Error("ProductId is required");
    }

    if (!params.branchId) {
      throw new Error("BranchId is required");
    }

    if (params.quantity <= 0) {
      throw new Error(
        "Quantity must be greater than 0"
      );
    }

    this.id = params.id;
    this.productId = params.productId;
    this.branchId = params.branchId;
    this.type = params.type;
    this.quantity = params.quantity;
    this.createdAt =
      params.createdAt ?? new Date();
  }


  // =========================
  // STOCK DIRECTION
  // =========================

  isInMovement(): boolean {
    return (
      this.type === StockMovementType.PURCHASE_IN ||
      this.type === StockMovementType.RETURN_IN
    );
  }


  isOutMovement(): boolean {
    return (
      this.type === StockMovementType.SALE_OUT
    );
  }


  getSignedQuantity(): number {
    return this.isInMovement()
      ? this.quantity
      : -this.quantity;
  }


  // =========================
  // HELPERS
  // =========================

  isReturn(): boolean {
    return (
      this.type === StockMovementType.RETURN_IN
    );
  }


  isSale(): boolean {
    return (
      this.type === StockMovementType.SALE_OUT
    );
  }


  belongsToBranch(
    branchId: string
  ): boolean {
    return this.branchId === branchId;
  }
}