export enum RefundType {
  FULL = "FULL",
  PARTIAL = "PARTIAL",
}

export enum RefundStatus {
  INITIATED = "INITIATED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

export class Refund {
  public readonly id: string;
  public readonly saleId: string;
  public readonly type: RefundType;

  public amount: number;
  public reason: string;

  public status: RefundStatus;
  public createdAt: Date;

  constructor(params: {
    id: string;
    saleId: string;
    type: RefundType;
    amount: number;
    reason: string;
  }) {
    const { id, saleId, type, amount, reason } = params;

    if (!id) throw new Error("Refund ID required");
    if (!saleId) throw new Error("Sale ID required");
    if (amount < 0) throw new Error("Invalid refund amount");
    if (!reason) throw new Error("Refund reason required");

    this.id = id;
    this.saleId = saleId;
    this.type = type;

    this.amount = amount;
    this.reason = reason;

    this.status = RefundStatus.INITIATED;
    this.createdAt = new Date();
  }

  // =====================
  // STATE TRANSITIONS (SKELETON ONLY)
  // =====================

  approve() {
    if (this.status !== RefundStatus.INITIATED) {
      throw new Error("Only initiated refunds can be approved");
    }
    this.status = RefundStatus.APPROVED;
  }

  reject() {
    if (this.status !== RefundStatus.INITIATED) {
      throw new Error("Only initiated refunds can be rejected");
    }
    this.status = RefundStatus.REJECTED;
  }

  complete() {
    if (this.status !== RefundStatus.APPROVED) {
      throw new Error("Only approved refunds can be completed");
    }
    this.status = RefundStatus.COMPLETED;
  }
}