export class BranchStock {
  public readonly productId: string;
  public readonly branchId: string;
  public stock: number;

  constructor(params: {
    productId: string;
    branchId: string;
    stock?: number;
  }) {
    const { productId, branchId, stock = 0 } = params;

    // =====================
    // Business Rules
    // =====================

    if (!productId) {
      throw new Error("ProductId is required");
    }

    if (!branchId) {
      throw new Error("BranchId is required");
    }

    if (stock < 0) {
      throw new Error("Stock cannot be negative");
    }

    this.productId = productId;
    this.branchId = branchId;
    this.stock = stock;
  }

  // =====================
  // Domain Behaviors
  // =====================

  increaseStock(quantity: number) {
    if (quantity <= 0) {
      throw new Error("Increase quantity must be greater than 0");
    }

    this.stock += quantity;
  }

  decreaseStock(quantity: number) {
    if (quantity <= 0) {
      throw new Error("Decrease quantity must be greater than 0");
    }

    if (this.stock - quantity < 0) {
      throw new Error("Insufficient stock in this branch");
    }

    this.stock -= quantity;
  }

  setStock(stock: number) {
    if (stock < 0) {
      throw new Error("Stock cannot be negative");
    }

    this.stock = stock;
  }

  belongsToBranch(branchId: string): boolean {
    return this.branchId === branchId;
  }

  isOutOfStock(): boolean {
    return this.stock === 0;
  }
}