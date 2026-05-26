import { Sale, SaleStatus } from "../../domain/sales/Sale";
import { PaymentStatus } from "../../domain/payments/Payments";
import { StockMovementType } from "../../domain/inventory/StockMovement";
import { AuditLogger } from "../../shared/audit/AuditLogger";
import { AuditEventType } from "../../shared/audit/AuditEventType";

export class FinalizeSaleUseCase {
  constructor(
    private readonly saleRepo: any,
    private readonly paymentRepo: any,
    private readonly stockRepo: any,
    private readonly invoiceGenerator: any
  ) {}

  async execute(input: { saleId: string; branchId: string }) {
    const { saleId, branchId } = input;

    const sale: Sale = await this.saleRepo.findById(saleId);

    if (!sale) throw new Error("Sale not found");

    if (sale.status === SaleStatus.COMPLETED) {
      throw new Error("Sale already finalized");
    }

    // LOCK SALE
    sale.lock();

    // INVOICE
    const invoiceNumber = await this.invoiceGenerator.generate(branchId);

    AuditLogger.log({
  type: AuditEventType.SALE_FINALIZED,
  timestamp: new Date(),
  data: {
    saleId,
    invoiceNumber,
  },
});
    // PAYMENT
    const payment = await this.paymentRepo.findBySaleId(saleId);

    if (!payment) throw new Error("Payment not found");

    payment.status = PaymentStatus.COMPLETED;
    await this.paymentRepo.save(payment);

    // STOCK FINALIZATION
    for (const item of sale.items) {
      await this.stockRepo.createMovement({
        id: crypto.randomUUID(),
        productId: item.productId,
        branchId,
        type: StockMovementType.SALE_OUT,
        quantity: item.quantity,
      });
    }

    // COMPLETE SALE
    sale.complete(invoiceNumber);

    await this.saleRepo.save(sale);

    return {
      saleId: sale.id,
      invoiceNumber,
      status: sale.status,
    };
  }
}