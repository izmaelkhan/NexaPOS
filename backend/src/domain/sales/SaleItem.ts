export class SaleItem {
  public readonly productId: string;

  /**
   * ORIGINAL PRICE SNAPSHOT (NEVER CHANGE)
   */
  public readonly unitPrice: number;

  public readonly quantity: number;

  /**
   * DISCOUNT APPLIED ON THIS ITEM
   */
  public readonly discountAmount: number;

  /**
   * FINAL PRICE AFTER DISCOUNT
   */
  public readonly finalPrice: number;

  constructor(params: {
    productId: string;
    unitPrice: number;
    quantity: number;
    discountAmount?: number;
  }) {
    const {
      productId,
      unitPrice,
      quantity,
      discountAmount = 0,
    } = params;

    // =====================
    // VALIDATION
    // =====================

    if (!productId) {
      throw new Error("ProductId is required");
    }

    if (unitPrice <= 0) {
      throw new Error("Unit price must be greater than 0");
    }

    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    if (discountAmount < 0) {
      throw new Error("Discount cannot be negative");
    }

    const maxAllowedDiscount = unitPrice * quantity;

    if (discountAmount > maxAllowedDiscount) {
      throw new Error("Discount exceeds item total value");
    }

    this.productId = productId;

    // 🔒 SNAPSHOT (IMMUTABLE)
    this.unitPrice = unitPrice;

    this.quantity = quantity;

    this.discountAmount = discountAmount;

    // =====================
    // FINAL PRICE CALCULATION
    // =====================
    const total = unitPrice * quantity;

    this.finalPrice = total - discountAmount;
  }

  // =====================
  // TOTAL HELPERS
  // =====================

  getTotal(): number {
    return this.unitPrice * this.quantity;
  }

  getNetTotal(): number {
    return this.finalPrice;
  }
}