export class BranchStock {
  public readonly id: string;
  public readonly productId: string;
  public readonly branchId: string;
  private _stock: number;

  constructor(params: {
    id: string;
    productId: string;
    branchId: string;
    stock?: number;
  }) {
    const { id, productId, branchId, stock = 0 } = params;

    if (!productId) {
      throw new Error("ProductId is required");
    }

    if (!branchId) {
      throw new Error("BranchId is required");
    }

    if (stock < 0) {
      throw new Error("Stock cannot be negative");
    }

    this.id = id;
    this.productId = productId;
    this.branchId = branchId;
    this._stock = stock;
  }

  get stock(): number {
    return this._stock;
  }

  // =====================
  // ONLY apply movement
  // =====================
  applyMovement(quantity: number) {
    const nextStock = this._stock + quantity;

    if (nextStock < 0) {
      throw new Error("Insufficient stock");
    }

    this._stock = nextStock;
  }

  // =====================
  // strict branch check
  // =====================
  belongsToBranch(branchId: string): boolean {
    return this.branchId === branchId;
  }
}