export class CartItem {
  public readonly productId: string;

  // ORIGINAL PRICE SNAPSHOT
  public readonly price: number;

  public quantity: number;

  // FINAL PRICE AFTER DISCOUNT
  public finalPrice: number;

  constructor(
    productId: string,
    price: number,
    quantity: number,
    finalPrice?: number
  ) {
    // =====================
    // PRODUCT VALIDATION
    // =====================
    if (!productId || productId.trim().length === 0) {
      throw new Error("Product ID required");
    }

    // =====================
    // PRICE SNAPSHOT REQUIRED
    // =====================
    if (price <= 0) {
      throw new Error("Invalid price");
    }

    // =====================
    // QUANTITY VALIDATION
    // =====================
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    const resolvedFinalPrice = finalPrice ?? price;

    // =====================
    // FINAL PRICE RULE
    // =====================
    if (resolvedFinalPrice < 0) {
      throw new Error("Final price cannot be negative");
    }

    this.productId = productId;
    this.price = price;
    this.quantity = quantity;
    this.finalPrice = resolvedFinalPrice;
  }

  // =====================
  // INCREASE QUANTITY
  // =====================
  increase(quantity: number) {
    if (quantity <= 0) {
      throw new Error("Invalid quantity increment");
    }

    this.quantity += quantity;
  }

  // =====================
  // UPDATE FINAL PRICE
  // =====================
  applyDiscount(discountAmount: number) {
    if (discountAmount < 0) {
      throw new Error("Invalid discount");
    }

    const discountedPrice = this.price - discountAmount;

    if (discountedPrice < 0) {
      throw new Error("Final price cannot be negative");
    }

    this.finalPrice = discountedPrice;
  }

  // =====================
  // ORIGINAL SUBTOTAL
  // =====================
  getSubtotal(): number {
    return this.price * this.quantity;
  }

  // =====================
  // FINAL TOTAL
  // =====================
  getFinalTotal(): number {
    return this.finalPrice * this.quantity;
  }
}