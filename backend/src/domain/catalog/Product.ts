export class Product {
  public readonly id: string;
  public readonly name: string;
  public readonly sku: string;
  public readonly barcode?: string;

  public readonly price: number;
  public readonly costPrice: number;
  public stock: number;

  public readonly categoryId: string;

  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(params: {
    id: string;
    name: string;
    sku: string;
    barcode?: string;
    price: number;
    costPrice: number;
    stock?: number;
    categoryId: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    const { id, name, sku, barcode, price, costPrice, stock = 0, categoryId, createdAt, updatedAt } = params;

    // =====================
    // Business Rules
    // =====================

    if (price <= 0) {
      throw new Error("Product price must be greater than 0");
    }

    if (costPrice < 0) {
      throw new Error("Cost price cannot be negative");
    }

    if (stock < 0) {
      throw new Error("Stock cannot be less than 0");
    }

    this.id = id;
    this.name = name;
    this.sku = sku;
    this.barcode = barcode;

    this.price = price;
    this.costPrice = costPrice;
    this.stock = stock;

    this.categoryId = categoryId;

    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }

  // =====================
  // Domain Behaviors
  // =====================

  increaseStock(qty: number) {
    if (qty <= 0) throw new Error("Invalid stock increment");
    this.stock += qty;
    this.touch();
  }

  decreaseStock(qty: number) {
    if (qty <= 0) throw new Error("Invalid stock decrement");
    if (this.stock - qty < 0) throw new Error("Insufficient stock");

    this.stock -= qty;
    this.touch();
  }

  updatePrice(newPrice: number) {
    if (newPrice <= 0) throw new Error("Price must be greater than 0");
    (this as any).price = newPrice;
    this.touch();
  }

  private touch() {
    this.updatedAt = new Date();
  }
}