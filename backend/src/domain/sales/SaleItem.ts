export class SaleItem {
  public readonly productId: string;

  // =====================
  // SNAPSHOT FIELDS (IMMUTABLE)
  // =====================
  public readonly productName: string;
  public readonly sku: string;
  public readonly unitPrice: number;

  // =====================
  // QUANTITY
  // =====================
  public quantity: number;

  // =====================
  // DISCOUNT SNAPSHOT
  // =====================
  public readonly discountAmount: number;

  constructor(params: {
    productId: string;
    productName: string;
    sku: string;
    unitPrice: number;
    quantity: number;
    discountAmount?: number;
  }) {
    const {
      productId,
      productName,
      sku,
      unitPrice,
      quantity,
      discountAmount = 0,
    } = params;

    // =====================
    // VALIDATION
    // =====================
    if (!productId) throw new Error("ProductId required");

    if (!productName || productName.trim().length === 0) {
      throw new Error("Product name required");
    }

    if (!sku || sku.trim().length === 0) {
      throw new Error("SKU required");
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

    const finalPrice = unitPrice - discountAmount;

    if (finalPrice < 0) {
      throw new Error("Final price cannot be negative");
    }

    this.productId = productId;
    this.productName = productName;
    this.sku = sku;
    this.unitPrice = unitPrice;

    this.quantity = quantity;
    this.discountAmount = discountAmount;
  }

  // =====================
  // QUANTITY UPDATE
  // =====================
  increase(quantity: number) {
    if (quantity <= 0) {
      throw new Error("Invalid quantity");
    }

    this.quantity += quantity;
  }

  // =====================
  // SUBTOTAL (ORIGINAL)
  // =====================
  getSubtotal(): number {
    return this.unitPrice * this.quantity;
  }

  // =====================
  // FINAL TOTAL (AFTER DISCOUNT)
  // =====================
  getTotal(): number {
    const finalUnitPrice = this.unitPrice - this.discountAmount;
    return finalUnitPrice * this.quantity;
  }
}