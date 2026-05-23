import { CartItem } from "./CartItem";
import { CartStatus } from "./CartStatus";
import { EventLogger } from "../../shared/events/EventLogger";

type AddItemInput = {
  productId: string;
  price: number;
  quantity: number;
};

export class Cart {
  private items: CartItem[] = [];
  private status: CartStatus = CartStatus.ACTIVE;

  constructor(public readonly customerId: string) {
  EventLogger.log({
    type: "CART_CREATED",
    timestamp: new Date(),
    data: { customerId },
  });
}

  // =====================
  // ADD ITEM (MERGE LOGIC)
  // =====================
  addItem(input: AddItemInput) {
    this.ensureActive();

    if (input.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    const existing = this.items.find(
      (i) => i.productId === input.productId
    );

    if (existing) {
      existing.increase(input.quantity);
    } else {
      this.items.push(
        new CartItem(
          input.productId,
          input.price,
          input.quantity
        )
      );
    }
  }

  // =====================
  // REMOVE ITEM
  // =====================
  removeItem(productId: string) {
    this.ensureActive();

    this.items = this.items.filter(
      (i) => i.productId !== productId
    );
  }

  // =====================
  // UPDATE QUANTITY
  // =====================
  updateQuantity(productId: string, quantity: number) {
    this.ensureActive();

    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    const item = this.items.find(
      (i) => i.productId === productId
    );

    if (!item) {
      throw new Error("Item not found");
    }

    item.quantity = quantity;
  }

  // =====================
  // TOTAL
  // =====================
  getTotal(): number {
    return this.items.reduce(
      (sum, item) => sum + item.getSubtotal(),
      0
    );
  }

  getItems(): readonly CartItem[] {
    return [...this.items];
  }

  // =====================
  // EMPTY CHECK
  // =====================
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // =====================
  // LOCK SYSTEM
  // =====================
  lock() {
    this.status = CartStatus.LOCKED;
  }

  isLocked(): boolean {
    return this.status === CartStatus.LOCKED;
  }

  // =====================
  // GUARD
  // =====================
  private ensureActive() {
    if (this.isLocked()) {
      throw new Error("Cart is locked");
    }
  }
}