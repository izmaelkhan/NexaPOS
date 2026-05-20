export class PurchaseItem {
  public readonly productId: string;
  public quantity: number;
  public readonly costPrice: number; // snapshot at purchase time

  constructor(params: {
    productId: string;
    quantity: number;
    costPrice: number;
  }) {
    const { productId, quantity, costPrice } = params;

    // =====================
    // Business Rules
    // =====================

    if (!productId) {
      throw new Error("ProductId is required");
    }

    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    if (costPrice <= 0) {
      throw new Error("Cost price must be greater than 0");
    }

    this.productId = productId;
    this.quantity = quantity;
    this.costPrice = costPrice;
  }

  // =====================
  // Domain Helpers
  // =====================

  getTotalCost(): number {
    return this.quantity * this.costPrice;
  }

  updateQuantity(quantity: number) {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    this.quantity = quantity;
  }
}