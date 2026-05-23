import { Cart } from "../../domain/sales/Cart";

export class CheckoutValidator {
  constructor(
    private readonly stockRepo: any,
    private readonly branchRepo: any,
    private readonly customerRepo: any
  ) {}

  // =====================
  // MAIN VALIDATION ENTRY
  // =====================
  async validate(input: {
    cart: Cart;
    branchId: string;
    customerId?: string;
    payment: {
      type: string;
      amount: number;
    };
  }) {
    const { cart, branchId, customerId, payment } = input;

    // =====================
    // 1. CART NOT EMPTY
    // =====================
    if (!cart || cart.isEmpty()) {
      throw new Error("Cart is empty");
    }

    // =====================
    // 2. BRANCH VALIDATION
    // =====================
    const branch = await this.branchRepo.findById(branchId);

    if (!branch) {
      throw new Error("Branch not found");
    }

    // =====================
    // 3. CUSTOMER VALIDATION
    // =====================
    let customer = null;

    if (customerId) {
      customer = await this.customerRepo.findById(customerId);

      if (!customer) {
        throw new Error("Customer not found");
      }

      if (customer.isBlocked()) {
        throw new Error("Blocked customer cannot checkout");
      }

      if (!customer.canCheckout()) {
        throw new Error("Customer cannot checkout");
      }
    }

    // =====================
    // 4. STOCK VALIDATION
    // =====================
    const items = cart.getItems();

    for (const item of items) {
      const stock = await this.stockRepo.getStock(
        item.productId,
        branchId
      );

      if (!stock) {
        throw new Error(`Stock not found for ${item.productId}`);
      }

      if (stock.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${item.productId}`
        );
      }
    }

    // =====================
    // 5. PAYMENT VALIDATION
    // =====================
    if (!payment) {
      throw new Error("Payment is required");
    }

    if (payment.amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    if (!payment.type) {
      throw new Error("Payment type required");
    }

    // =====================
    // VALIDATION SUCCESS
    // =====================
    return {
      valid: true,
      customer,
      branch,
    };
  }
}