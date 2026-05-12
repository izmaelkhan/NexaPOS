export type StockMovementType = "IN" | "OUT" | "ADJUST";

export class StockMovement {
  constructor(
    public readonly type: StockMovementType,
    public readonly quantity: number,
    public readonly reason?: string,
    public readonly createdAt: Date = new Date()
  ) {
    if (quantity <= 0) {
      throw new Error("Stock movement quantity must be greater than 0");
    }
  }
}

export class Stock {
  public readonly productId: string;
  private _quantity: number;

  public readonly movements: StockMovement[] = [];

  constructor(productId: string, initialQuantity: number = 0) {
    if (initialQuantity < 0) {
      throw new Error("Stock cannot start with negative value");
    }

    this.productId = productId;
    this._quantity = initialQuantity;
  }

  get quantity(): number {
    return this._quantity;
  }

  // =========================
  // Core Business Rule:
  // Stock never goes negative
  // =========================

  addStock(quantity: number, reason?: string) {
    const movement = new StockMovement("IN", quantity, reason);

    this._quantity += quantity;
    this.movements.push(movement);
  }

  removeStock(quantity: number, reason?: string) {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    if (this._quantity - quantity < 0) {
      throw new Error("Stock cannot go negative");
    }

    const movement = new StockMovement("OUT", quantity, reason);

    this._quantity -= quantity;
    this.movements.push(movement);
  }

  adjustStock(newQuantity: number, reason?: string) {
    if (newQuantity < 0) {
      throw new Error("Stock cannot be negative");
    }

    const diff = newQuantity - this._quantity;

    const movement = new StockMovement("ADJUST", diff, reason);

    this._quantity = newQuantity;
    this.movements.push(movement);
  }
}