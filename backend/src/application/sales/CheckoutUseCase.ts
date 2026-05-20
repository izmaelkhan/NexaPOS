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
    private readonly invoiceSequenceRepo: any
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

      const total = cart.getTotal();

      // =====================
      // 2. STOCK VALIDATION
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
      // 3. CREATE SALE
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
      // 4. PAYMENT VALIDATION
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
      // 5. INVOICE GENERATION
      // =====================
      const sequence =
        await this.invoiceSequenceRepo.getNextSequence(branchId);

      const invoice = new Invoice({
        sequence,
      });

      // =====================
      // 6. STOCK MOVEMENTS
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
      // 7. RETURN RESULT
      // =====================
      return {
        sale,
        payment: paymentEntity,
        invoiceNumber: invoice.invoiceNumber,
        total,
      };
    });
  }

  /**
   * =========================
   * SIMPLE TRANSACTION WRAPPER
   * (replace with Prisma $transaction in infra layer)
   * =========================
   */
  private async runTransaction<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      // IMPORTANT: here real infra would rollback DB transaction
      // for now we just rethrow
      throw error;
    }
  }
}