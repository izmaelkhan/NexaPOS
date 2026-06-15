import {
  StockMovement,
  StockMovementType,
} from "./StockMovement";


export class Stock {

  public readonly productId: string;

  private _quantity: number;

  public readonly movements: StockMovement[] = [];


  constructor(
    productId: string,
    initialQuantity: number = 0
  ) {

    if (initialQuantity < 0) {
      throw new Error(
        "Stock cannot start with negative value"
      );
    }

    this.productId = productId;
    this._quantity = initialQuantity;
  }


  get quantity(): number {
    return this._quantity;
  }


  // =========================
  // STOCK IN
  // Purchase / Return
  // =========================

  addStock(
    quantity: number,
    reason?: string
  ) {

    if (quantity <= 0) {
      throw new Error(
        "Quantity must be greater than 0"
      );
    }


    this._quantity += quantity;


    this.movements.push({

      type:
        StockMovementType.PURCHASE_IN,

      quantity,

      reason,

      createdAt:
        new Date()

    } as any);
  }



  // =========================
  // RETURN STOCK
  // =========================

  restoreStock(
    quantity: number,
    reason?: string
  ) {

    if (quantity <= 0) {
      throw new Error(
        "Quantity must be greater than 0"
      );
    }


    this._quantity += quantity;


    this.movements.push({

      type:
        StockMovementType.RETURN_IN,

      quantity,

      reason,

      createdAt:
        new Date()

    } as any);
  }



  // =========================
  // STOCK OUT
  // Sale
  // =========================

  removeStock(
    quantity: number,
    reason?: string
  ) {

    if (quantity <= 0) {
      throw new Error(
        "Quantity must be greater than 0"
      );
    }


    if (
      this._quantity - quantity < 0
    ) {
      throw new Error(
        "Stock cannot go negative"
      );
    }


    this._quantity -= quantity;


    this.movements.push({

      type:
        StockMovementType.SALE_OUT,

      quantity,

      reason,

      createdAt:
        new Date()

    } as any);
  }



  // =========================
  // MANUAL ADJUSTMENT
  // =========================

  adjustStock(
    newQuantity: number,
    reason?: string
  ) {

    if (newQuantity < 0) {
      throw new Error(
        "Stock cannot be negative"
      );
    }


    this._quantity = newQuantity;


    this.movements.push({

      type:
        StockMovementType.ADJUSTMENT,

      quantity:
        newQuantity,

      reason,

      createdAt:
        new Date()

    } as any);
  }
}