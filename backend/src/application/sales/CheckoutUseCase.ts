import { Cart } from "../../domain/sales/Cart";
import { Sale, SaleStatus } from "../../domain/sales/Sale";
import { Invoice } from "../../domain/sales/Invoice";
import { Payment, PaymentType } from "../../domain/payments/Payments";
import { StockMovementType } from "../../domain/inventory/StockMovement";

type CheckoutInput = {
  cart: Cart;
  branchId: string;
  customerId?: string;
  payment: {
    type: PaymentType;
    amount: number;
  };
};

export class CheckoutUseCase {
  constructor(
    private readonly stockRepo: any,
    private readonly saleRepo: any,
    private readonly paymentRepo: any,
    private readonly invoiceSequenceRepo: any,
    private readonly customerRepo: any
  ) {}

  async execute(input: CheckoutInput) {
    const { cart, branchId, customerId, payment } = input;

    return await this.runTransaction(async () => {

      // =====================
      // 1. CART VALIDATION
      // =====================
      const items = cart.getItems();

      if (items.length === 0) {
        throw new Error("Cart is empty");
      }

      const subtotal = cart.getTotal();

      // =====================
      // 2. CUSTOMER VALIDATION
      // =====================
      let customer: any = null;

      if (customerId) {
        customer = await this.customerRepo.findById(customerId);

        if (!customer) {
          throw new Error("Customer not found");
        }

        if (customer.isBlocked()) {
          throw new Error("Blocked customer cannot checkout");
        }
      }

      // =====================
      // 3. STOCK VALIDATION
      // =====================
      for (const item of items) {
        const stock = await this.stockRepo.getStock(
          item.productId,
          branchId
        );

        if (!stock || stock.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${item.productId}`
          );
        }
      }

      // =====================
      // 4. CREATE SALE
      // =====================
      const sale = new Sale({
        id: crypto.randomUUID(),
        branchId,
        customerId,
        total: subtotal,
        status: SaleStatus.PENDING,
      });

      await this.saleRepo.save(sale);

      // =====================
      // 5. PAYMENT VALIDATION
      // =====================
      if (payment.amount < subtotal) {
        throw new Error("Payment insufficient");
      }

      if (payment.amount > subtotal) {
        throw new Error("Payment exceeds total");
      }

      const paymentEntity = new Payment({
        id: crypto.randomUUID(),
        saleId: sale.id,
        type: payment.type,
        amount: payment.amount,
      });

      await this.paymentRepo.save(paymentEntity);

      sale.markAsPaid();

      // =====================
      // 6. INVOICE SEQUENCE
      // =====================
      const sequence =
        await this.invoiceSequenceRepo.getNextSequence(branchId);

      const creditDue =
        customerId && payment.amount < subtotal
          ? subtotal - payment.amount
          : 0;

      const loyaltyPoints = customerId
        ? Math.floor(subtotal * 0.01)
        : 0;

      const remainingBalance = customer
        ? customer.creditBalance
        : 0;

      // =====================
      // 7. INVOICE CREATION (FINAL STRUCTURE)
      // =====================
      const invoice = new Invoice({
        sequence,

        creditDue,
        loyaltyPoints,
        remainingBalance,

        subtotal,
        discount: 0,
        finalTotal: subtotal,
        couponCode: undefined,
      });

      // =====================
      // 8. STOCK MOVEMENTS
      // =====================
      for (const item of items) {
        await this.stockRepo.createMovement({
          id: crypto.randomUUID(),
          productId: item.productId,
          branchId,
          type: StockMovementType.SALE_OUT,
          quantity: item.quantity,
        });
      }

      // =====================
      // 9. RESPONSE
      // =====================
      return {
        sale,
        payment: paymentEntity,

        invoiceNumber: invoice.invoiceNumber,

        subtotal,
        total: subtotal,

        creditDue,
        loyaltyPoints,
        remainingBalance,

        discount: 0,
        couponCode: undefined,
      };
    });
  }

  // =========================
  // TRANSACTION WRAPPER
  // =========================
  private async runTransaction<T>(
    fn: () => Promise<T>
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      throw error;
    }
  }
}