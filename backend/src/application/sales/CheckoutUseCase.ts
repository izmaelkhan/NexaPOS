import { Cart } from "../../domain/sales/Cart";
import { Sale, SaleStatus } from "../../domain/sales/Sale";
import { Payment, PaymentType } from "../../domain/payments/Payments";
import { StockMovementType } from "../../domain/inventory/StockMovement";
import { EventLogger } from "../../shared/events/EventLogger";
import { AuditLogger } from "../../shared/audit/AuditLogger";
import { AuditEventType } from "../../shared/audit/AuditEventType";

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
    private readonly customerRepo: any,
    private readonly invoiceNumberGenerator: {
      generate(branchId: string): Promise<string>;
    }
  ) {}

  async execute(input: CheckoutInput) {
    const { cart, branchId, customerId, payment } = input;

    EventLogger.log({
      type: "CHECKOUT_STARTED",
      timestamp: new Date(),
      data: { customerId, branchId },
    });

    const items = cart.getItems();

    if (items.length === 0) {
      throw new Error("Cart is empty");
    }

    const total = cart.getTotal();

    let customer = null;

    if (customerId) {
      customer = await this.customerRepo.findById(customerId);
    }

    for (const item of items) {
      const stock = await this.stockRepo.getStock(item.productId, branchId);

      if (!stock || stock.stock < item.quantity) {
        throw new Error("Insufficient stock");
      }
    }

    const sale = new Sale({
      id: crypto.randomUUID(),
      branchId,
      customerId,
      total,
      status: SaleStatus.PENDING,
    });

    await this.saleRepo.save(sale);

    const paymentEntity = new Payment({
      id: crypto.randomUUID(),
      saleId: sale.id,
      type: payment.type,
      amount: payment.amount,
    });

    await this.paymentRepo.save(paymentEntity);

    sale.markAsPaid();

    const invoiceNumber = await this.invoiceNumberGenerator.generate(branchId);

    for (const item of items) {
      await this.stockRepo.createMovement({
        id: crypto.randomUUID(),
        productId: item.productId,
        branchId,
        type: StockMovementType.SALE_OUT,
        quantity: item.quantity,
      });
    }

    AuditLogger.log({
  type: AuditEventType.INVOICE_GENERATED,
  timestamp: new Date(),
  data: {
    invoiceNumber,
    saleId: sale.id,
    branchId,
  },
});

    EventLogger.log({
      type: "CHECKOUT_COMPLETED",
      timestamp: new Date(),
      data: { saleId: sale.id, invoiceNumber, total },
    });

    return {
      sale,
      payment: paymentEntity,
      invoiceNumber,
      total,
    };
  }
}