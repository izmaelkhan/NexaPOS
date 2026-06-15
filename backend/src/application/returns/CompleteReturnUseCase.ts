import { ReturnStatus } from "../../domain/returns/Return";
import { ReturnAuditLogger } from "../../shared/audit/ReturnAuditLogger";

export class CompleteReturnUseCase {
  constructor(
    private readonly returnRepo: any,
    private readonly stockRepo: any,
    private readonly paymentRepo: any,
    private readonly ledgerRepo: any,
    private readonly auditLogger?: any
  ) {}

  async execute(returnId: string) {
    const returnRequest = await this.returnRepo.findById(returnId);

    if (!returnRequest) {
      throw new Error("Return not found");
    }

    if (returnRequest.status !== ReturnStatus.APPROVED) {
      throw new Error("Only approved returns can be completed");
    }

    let refundAmount = 0;

    for (const item of returnRequest.items) {
      await this.stockRepo.createMovement({
        id: crypto.randomUUID(),
        productId: item.productId,
        branchId: returnRequest.branchId,
        type: "RETURN_IN",
        quantity: item.quantity,
        createdAt: new Date(),
      });

      refundAmount += item.refundAmount;
    }

    const refundPayment = {
      paymentId: crypto.randomUUID(),
      saleId: returnRequest.saleId,
      amount: -Math.abs(refundAmount),
      method: "CASH",
      state: "REFUNDED",
      createdAt: new Date(),
    };

    ReturnAuditLogger.refundIssued({
      returnId,
      saleId: returnRequest.saleId,
      refundAmount,
    });

    await this.paymentRepo.create(refundPayment);

    await this.ledgerRepo.createEntry({
      id: crypto.randomUUID(),
      saleId: returnRequest.saleId,
      type: "RETURN_REFUND",
      amount: -refundAmount,
      balanceImpact: "DEBIT",
      createdAt: new Date(),
    });

    returnRequest.complete();

    await this.returnRepo.save(returnRequest);

    this.auditLogger?.log({
      type: "RETURN_COMPLETED",
      timestamp: new Date(),
      data: {
        returnId,
        saleId: returnRequest.saleId,
        refundAmount,
      },
    });

    ReturnAuditLogger.completed({
      returnId,
      saleId: returnRequest.saleId,
      refundAmount,
    });

    return {
      success: true,
      returnId: returnRequest.id,
      status: returnRequest.status,
      refundAmount,
    };
  }
}