import { Cart } from "../../domain/sales/Cart";

export class CartCalculator {
  constructor(
    private readonly taxRate: number = 0.0 // e.g. 0.18 for 18%
  ) {}

  // =====================
  // SUBTOTAL (before discounts)
  // =====================
  calculateSubtotal(cart: Cart): number {
    return cart.getItems().reduce((sum, item) => {
      return sum + item.getSubtotal();
    }, 0);
  }

  // =====================
  // DISCOUNT TOTAL
  // =====================
  calculateDiscount(cart: Cart): number {
    return cart.getItems().reduce((sum, item) => {
      const discount =
        item.getSubtotal() - item.getFinalTotal();
      return sum + discount;
    }, 0);
  }

  // =====================
  // TAX CALCULATION
  // =====================
  calculateTax(cart: Cart): number {
    const subtotalAfterDiscount =
      this.calculateSubtotal(cart) -
      this.calculateDiscount(cart);

    if (subtotalAfterDiscount < 0) {
      return 0;
    }

    return subtotalAfterDiscount * this.taxRate;
  }

  // =====================
  // GRAND TOTAL (FINAL PAYABLE)
  // =====================
  calculateGrandTotal(cart: Cart): number {
    const subtotal = this.calculateSubtotal(cart);
    const discount = this.calculateDiscount(cart);
    const tax = this.calculateTax(cart);

    const total = subtotal - discount + tax;

    // SAFETY RULE: never allow negative totals
    return total < 0 ? 0 : total;
  }
}