import { FinancialPrecision } from "../../shared/finance/FinancialPrecision";

type CartItemSnapshot = {
  productId: string;
  price: number;
  quantity: number;
};

export class Cart {
  private items: CartItemSnapshot[] = [];
  private locked = false;

  constructor(private readonly id: string) {}

  addItem(item: CartItemSnapshot) {
  if (this.locked) {
    throw new Error("Cart is locked");
  }

  if (item.quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const existing = this.items.find(
    i => i.productId === item.productId
  );

  if (existing) {
    existing.quantity += item.quantity;
    return;
  }

  this.items.push({
    ...item,
    price: FinancialPrecision.normalize(item.price),
  });
}

  getItems(): readonly CartItemSnapshot[] {
    return this.items;
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => {
      const lineTotal =
        item.price * item.quantity;

      return FinancialPrecision.add(
        sum,
        lineTotal
      );
    }, 0);
  }

  lock() {
    this.locked = true;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
  removeItem(productId: string) {
  this.items = this.items.filter(
    item => item.productId !== productId
  );
}

updateQuantity(productId: string, quantity: number) {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const item = this.items.find(
    i => i.productId === productId
  );

  if (!item) {
    throw new Error("Item not found");
  }

  item.quantity = quantity;
}
}