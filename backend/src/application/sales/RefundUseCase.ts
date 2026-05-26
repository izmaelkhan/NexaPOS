import { Refund, RefundType } from "../../domain/sales/Refund";

export class RefundUseCase {
  constructor(
    private readonly saleRepo: any,
    private readonly refundRepo: any
  ) {}

  async execute(input: {
    saleId: string;
    type: RefundType;
    amount: number;
    reason: string;
  }) {
    const { saleId, type, amount, reason } = input;

    // =====================
    // 1. FETCH SALE
    // =====================
    const sale = await this.saleRepo.findById(saleId);

    if (!sale) {
      throw new Error("Sale not found");
    }

    // =====================
    // 2. CREATE REFUND OBJECT (NO PROCESSING YET)
    // =====================
    const refund = new Refund({
      id: crypto.randomUUID(),
      saleId,
      type,
      amount,
      reason,
    });

    // =====================
    // 3. SAVE REFUND (PERSIST ONLY)
    // =====================
    await this.refundRepo.save(refund);

    return {
      refundId: refund.id,
      status: refund.status,
      type: refund.type,
    };
  }
}