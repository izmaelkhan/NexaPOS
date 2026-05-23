import { Cart } from "../../domain/sales/Cart";
import { Sale, SaleStatus } from "../../domain/sales/Sale";
import { Invoice } from "../../domain/sales/Invoice";
import { Payment, PaymentType } from "../../domain/payments/Payments";
import { StockMovementType } from "../../domain/inventory/StockMovement";
import { EventLogger } from "../../shared/events/EventLogger";

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

    // =====================
    // CHECKOUT START EVENT
    // =====================
    EventLogger.log({
      type: "CHECKOUT_STARTED",
      timestamp: new Date(),
      data: { customerId, branchId },
    });

    return await this.runTransaction(async () => {
      try {
        // =====================
        // CART VALIDATION
        // =====================
        const items = cart.getItems();

        if (cart.isEmpty()) {
          throw new Error("Cart is empty");
        }

        const total = cart.getTotal();

        // =====================
        // CUSTOMER VALIDATION
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
        }

        // =====================
        // STOCK VALIDATION
        // =====================
        for (const item of items) {
          const stock = await this.stockRepo.getStock(
            item.productId,
            branchId
          );

          if (!stock || stock.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${item.productId}`);
          }
        }

        // =====================
        // CREATE SALE
        // =====================
        const sale = new Sale({
          id: crypto.randomUUID(),
          branchId,
          customerId,
          total,
          status: SaleStatus.PENDING,
        });

        await this.saleRepo.save(sale);

        // =====================
        // PAYMENT VALIDATION
        // =====================
        if (payment.amount < total) {
          throw new Error("Payment insufficient");
        }

        if (payment.amount > total) {
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
        // INVOICE GENERATION
        // =====================
        const sequence =
          await this.invoiceSequenceRepo.getNextSequence(branchId);

        const creditDue =
          customerId && payment.amount < total ? total - payment.amount : 0;

        const loyaltyPoints = customerId ? Math.floor(total * 0.01) : 0;

        const remainingBalance =
          customer ? customer.creditBalance : 0;

        const invoice = new Invoice({
          sequence,
          creditDue,
          loyaltyPoints,
          remainingBalance,
        });

        // =====================
        // STOCK MOVEMENTS
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
        // SUCCESS EVENT
        // =====================
        EventLogger.log({
          type: "CHECKOUT_COMPLETED",
          timestamp: new Date(),
          data: {
            saleId: sale.id,
            customerId,
            total,
          },
        });

        // =====================
        // RETURN RESULT
        // =====================
        return {
          sale,
          payment: paymentEntity,
          invoiceNumber: invoice.invoiceNumber,
          total,
        };
      } catch (error: any) {
        // =====================
        // FAILURE EVENT
        // =====================
        EventLogger.log({
          type: "CHECKOUT_FAILED",
          timestamp: new Date(),
          data: {
            customerId,
            branchId,
            error: error.message,
          },
        });

        throw error;
      }
    });
  }

  // =========================
  // TRANSACTION WRAPPER
  // =========================
  private async runTransaction<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      throw error; // real DB rollback later
    }
  }
}