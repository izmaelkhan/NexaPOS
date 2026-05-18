export interface PriceHistoryItem {
  price: number;
  changedAt: Date;
}

export class Product {
  public readonly id: string;
  public readonly sku: string; // IMMUTABLE
  public name: string;
  public barcode?: string;

  public price: number;
  public costPrice: number;
  public stock: number;

  public categoryId: string;

  // =====================
  // Future-ready feature
  // =====================
  public priceHistory: PriceHistoryItem[] = [];

  constructor(params: {
    id: string;
    sku: string;
    name: string;
    barcode?: string;
    price: number;
    costPrice: number;
    stock?: number;
    categoryId: string;
  }) {
    const {
      id,
      sku,
      name,
      barcode,
      price,
      costPrice,
      stock = 0,
      categoryId,
    } = params;

    // =====================
    // Business Rules
    // =====================

    if (!sku || sku.trim().length < 3) {
      throw new Error("SKU is invalid");
    }

    if (!name || name.trim().length < 2) {
      throw new Error("Product name is invalid");
    }

    if (price <= 0) {
      throw new Error("Product price must be greater than 0");
    }

    if (costPrice < 0) {
      throw new Error("Cost price cannot be negative");
    }

    if (stock < 0) {
      throw new Error("Stock cannot be negative");
    }

    // Barcode uniqueness rule (domain-level guard)
    if (barcode && barcode.trim().length < 4) {
      throw new Error("Barcode is too short");
    }

    this.id = id;
    this.sku = sku; // IMMUTABLE
    this.name = name;
    this.barcode = barcode;
    this.price = price;
    this.costPrice = costPrice;
    this.stock = stock;
    this.categoryId = categoryId;
  }

  // =====================
  // Domain Behaviors
  // =====================

  updateName(name: string) {
    if (!name || name.trim().length < 2) {
      throw new Error("Product name is invalid");
    }
    this.name = name;
  }

  updateBarcode(barcode?: string) {
    if (barcode && barcode.trim().length < 4) {
      throw new Error("Barcode is too short");
    }
    this.barcode = barcode;
  }

  updatePrice(newPrice: number) {
    if (newPrice <= 0) {
      throw new Error("Invalid price");
    }

    // =====================
    // PRICE HISTORY TRACKING
    // =====================
    this.priceHistory.push({
      price: this.price,
      changedAt: new Date(),
    });

    this.price = newPrice;
  }

  increaseStock(qty: number) {
    if (qty <= 0) throw new Error("Invalid quantity");
    this.stock += qty;
  }

  decreaseStock(qty: number) {
    if (qty <= 0) throw new Error("Invalid quantity");
    if (this.stock - qty < 0) throw new Error("Insufficient stock");

    this.stock -= qty;
  }

  isGlobalProduct(): boolean {
    return true; // explicit domain rule
  }
  getScanCode(): string {
  // barcode preferred for scanning
  // fallback to SKU if barcode missing
  return this.barcode ?? this.sku;
}
}