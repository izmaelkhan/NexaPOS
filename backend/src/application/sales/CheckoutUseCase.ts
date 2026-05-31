import { Cart } from "../../domain/sales/Cart";
import { Sale, SaleStatus } from "../../domain/sales/Sale";
import { Payment, PaymentMethod } from "../../domain/payments/Payments";
import { StockMovementType } from "../../domain/inventory/StockMovement";
import { EventLogger } from "../../shared/events/EventLogger";
import { AuditLogger } from "../../shared/audit/AuditLogger";
import { AuditEventType } from "../../shared/audit/AuditEventType";
import { FinancialPrecision } from "../../shared/finance/FinancialPrecision";

type CheckoutInput = {
  cart: Cart;
  branchId: string;
  customerId?: string;
  payment: {
    type: PaymentMethod;
    amount: number;
  };
};

export class CheckoutUseCase {
  constructor(
    private readonly stockRepo: any,
    private readonly saleRepo: any,
    private readonly paymentRepo: any,
    private readonly customerRepo: any,
    private readonly invoiceNumberGenerator: {
      generate(branchId: string): Promise<string>;
    }
  ) {}

  async execute(input: CheckoutInput) {
    const { cart, branchId, customerId, payment } = input;

    const items = cart.getItems();

    if (!items.length) {
      throw new Error("Cart is empty");
    }

    // =========================
    // PARALLEL STOCK CHECK (FAST)
    // =========================
    const stockResults = await Promise.all(
      items.map((item) =>
        this.stockRepo.getStock(item.productId, branchId)
      )
    );

    stockResults.forEach((stock, i) => {
      if (!stock || stock.stock < items[i].quantity) {
        throw new Error(`Insufficient stock for ${items[i].productId}`);
      }
    });

    const total = FinancialPrecision.normalize(cart.getTotal());

    const sale = new Sale({
      id: crypto.randomUUID(),
      branchId,
      customerId,
      total,
      status: SaleStatus.PENDING,
    });

    await this.saleRepo.save(sale);

    const paymentEntity = new Payment({
      paymentId: crypto.randomUUID(),
      saleId: sale.id,
      method: payment.type,
      amount: FinancialPrecision.normalize(payment.amount),
    });

    paymentEntity.start();

    let customer = null;

    if (customerId) {
      customer = await this.customerRepo.findById(customerId);
    }

    // =========================
    // CREDIT HANDLING (NON-BLOCKING READY)
    // =========================
    const paymentTasks: Promise<any>[] = [];

    if (payment.type === PaymentMethod.CREDIT) {
      if (!customer) {
        throw new Error("Customer required for CREDIT payment");
      }

      paymentTasks.push(
        this.customerRepo.addBalance(customer.id, payment.amount),
        this.customerRepo.createReceivable({
          customerId: customer.id,
          saleId: sale.id,
          amount: payment.amount,
          createdAt: new Date(),
        })
      );
    } else {
      paymentEntity.complete();
    }

    paymentTasks.push(this.paymentRepo.save(paymentEntity));

    await Promise.all(paymentTasks);

    sale.markAsPaid();

    const invoiceNumber = await this.invoiceNumberGenerator.generate(branchId);

    // =========================
    // PARALLEL STOCK MOVEMENTS (CRITICAL FIX)
    // =========================
    await Promise.all(
      items.map((item) =>
        this.stockRepo.createMovement({
          id: crypto.randomUUID(),
          productId: item.productId,
          branchId,
          type: StockMovementType.SALE_OUT,
          quantity: item.quantity,
        })
      )
    );

    // =========================
    // FIRE AND FORGET LOGGING (NO BLOCKING)
    // =========================
    setImmediate(() => {
      AuditLogger.log({
        type: AuditEventType.INVOICE_GENERATED,
        timestamp: new Date(),
        data: {
          invoiceNumber,
          saleId: sale.id,
          branchId,
          total,
        },
      });

      EventLogger.log({
        type: "CHECKOUT_COMPLETED",
        timestamp: new Date(),
        data: { saleId: sale.id, invoiceNumber, total },
      });
    });

    return {
      sale,
      payment: paymentEntity,
      invoiceNumber,
      total,
    };
  }
}