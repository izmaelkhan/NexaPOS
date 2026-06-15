import { ReturnAuditLogger } from "../../shared/audit/ReturnAuditLogger";
export class CreateReturnUseCase {
  constructor(
    private readonly saleRepo: any,
    private readonly returnRepo: any
  ) {}

  async execute(input: {
    saleId: string;
    items: { productId: string; quantity: number }[];
    reason?: string;
  }) {
    const sale = await this.saleRepo.findById(input.saleId);

    if (!sale) {
      throw new Error("Sale not found");
    }

    // 7-day rule
    const days =
      (Date.now() - new Date(sale.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);

    if (days > 7) {
      throw new Error("Return window expired");
    }

    const returnItems: any[] = [];

    for (const req of input.items) {
      const soldItem = sale.items.find(
        (i: any) => i.productId === req.productId
      );

      if (!soldItem) {
        throw new Error("Invalid product");
      }

      if (req.quantity > soldItem.quantity) {
        throw new Error("Return quantity exceeds sold quantity");
      }

      returnItems.push({
        productId: req.productId,
        quantity: req.quantity,
        unitPrice: soldItem.unitPrice,
        refundAmount: req.quantity * soldItem.unitPrice,
      });
    }

    const returnRequest = {
      id: crypto.randomUUID(),
      saleId: sale.id,
      customerId: sale.customerId,
      branchId: sale.branchId,
      status: "REQUESTED",
      reason: input.reason ?? "",
      items: returnItems,
      createdAt: new Date(),
    };

    await this.returnRepo.save(returnRequest);
    ReturnAuditLogger.requested({
      returnId: returnRequest.id,
      saleId: sale.id,
      customerId: sale.customerId,
      branchId: sale.branchId,
      items: returnItems.length,
    });
    
    return {
      returnId: returnRequest.id,
      status: returnRequest.status,
      items: returnItems.length,
    };
    
  }
}