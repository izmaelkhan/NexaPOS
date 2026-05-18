import { CartItem } from "./CartItem";

export class Cart {
  private items: CartItem[] = [];

  constructor(public readonly id: string) {
    if (!id) {
      throw new Error("CartId is required");
    }
  }

  /**
   * =========================
   * ADD ITEM
   * =========================
   */
  addItem(item: CartItem) {
    const existing = this.items.find(i => i.productId === item.productId);

    if (existing) {
      existing.updateQuantity(existing.quantity + item.quantity);
      return;
    }

    this.items.push(item);
  }

  /**
   * =========================
   * REMOVE ITEM
   * =========================
   */
  removeItem(productId: string) {
    this.items = this.items.filter(i => i.productId !== productId);
  }

  /**
   * =========================
   * UPDATE QUANTITY
   * =========================
   */
  updateQuantity(productId: string, quantity: number) {
    const item = this.items.find(i => i.productId === productId);

    if (!item) {
      throw new Error("Item not found in cart");
    }

    item.updateQuantity(quantity);
  }

  /**
   * =========================
   * GET ITEMS
   * =========================
   */
  getItems(): CartItem[] {
    return [...this.items];
  }

  /**
   * =========================
   * TOTAL CALCULATION
   * =========================
   */
  getTotal(): number {
    return this.items.reduce((sum, item) => {
      return sum + item.getTotal();
    }, 0);
  }

  /**
   * =========================
   * CLEAR CART
   * =========================
   */
  clear() {
    this.items = [];
  }

  /**
   * =========================
   * ITEM COUNT
   * =========================
   */
  getItemCount(): number {
    return this.items.length;
  }
}