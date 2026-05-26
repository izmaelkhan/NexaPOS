import { Sale, SaleStatus } from "../../domain/sales/Sale";
import { StockMovementType } from "../../domain/inventory/StockMovement";
import { AuditLogger } from "../../shared/audit/AuditLogger";
import { AuditEventType } from "../../shared/audit/AuditEventType";

export class CancelSaleUseCase {
  constructor(
    private readonly saleRepo: any,
    private readonly stockRepo: any,
    private readonly auditRepo: any
  ) {}

  async execute(input: {
    saleId: string;
    reason: string;
    userId?: string;
  }) {
    const { saleId, reason, userId } = input;

    // =====================
    // 1. FETCH SALE
    // =====================
    const sale: Sale = await this.saleRepo.findById(saleId);

    if (!sale) {
      throw new Error("Sale not found");
    }

    // =====================
    // 2. COMPLETED SALE RESTRICTION
    // =====================
    if (sale.status === SaleStatus.COMPLETED) {
      throw new Error("Completed sale cannot be cancelled");
    }

    if (sale.status === SaleStatus.CANCELLED) {
      throw new Error("Sale already cancelled");
    }

    // =====================
    // 3. STOCK RESTORE
    // =====================
    const items = (sale as any).items || [];

    for (const item of items) {
      await this.stockRepo.createMovement({
        id: crypto.randomUUID(),
        productId: item.productId,
        branchId: sale.branchId,
        type: StockMovementType.RETURN_IN, // reverse movement
        quantity: item.quantity,
      });
    }

    // =====================
    // 4. CANCEL SALE
    // =====================
    sale.cancel();

    await this.saleRepo.save(sale);

    AuditLogger.log({
  type: AuditEventType.SALE_CANCELLED,
  timestamp: new Date(),
  data: {
    saleId,
    reason: "USER_CANCELLED",
  },
});
    // =====================
    // 5. AUDIT LOG (MANDATORY)
    // =====================
    await this.auditRepo.create({
      id: crypto.randomUUID(),
      action: "SALE_CANCELLED",
      entity: "SALE",
      entityId: saleId,
      reason,
      userId: userId || null,
      timestamp: new Date(),
    });

    // =====================
    // 6. RESPONSE
    // =====================
    return {
      saleId,
      status: sale.status,
      message: "Sale cancelled successfully",
    };
  }
}