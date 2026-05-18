export class CartItem {
  public readonly productId: string;
  public readonly price: number; // snapshot (immutable)
  public quantity: number;

  constructor(params: {
    productId: string;
    price: number;
    quantity: number;
  }) {
    const { productId, price, quantity } = params;

    if (!productId) {
      throw new Error("ProductId is required");
    }

    if (price <= 0) {
      throw new Error("Price must be greater than 0");
    }

    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    this.productId = productId;
    this.price = price; // snapshot locked
    this.quantity = quantity;
  }

  updateQuantity(quantity: number) {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    this.quantity = quantity;
  }

  getTotal(): number {
    return this.price * this.quantity;
  }
}