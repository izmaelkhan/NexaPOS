export enum SaleStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  PAID = "PAID",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export class Sale {
  public readonly id: string;
  public readonly branchId: string;
  public readonly customerId?: string;

  public total: number;
  public status: SaleStatus;

  constructor(params: {
    id: string;
    branchId: string;
    customerId?: string;
    total: number;
    status?: SaleStatus;
  }) {
    const {
      id,
      branchId,
      customerId,
      total,
      status = SaleStatus.DRAFT,
    } = params;

    // =====================
    // VALIDATION
    // =====================

    if (!branchId) {
      throw new Error("BranchId is required");
    }

    if (total < 0) {
      throw new Error("Sale total cannot be negative");
    }

    this.id = id;
    this.branchId = branchId;
    this.customerId = customerId;
    this.total = total;
    this.status = status;
  }

  // =====================
  // STATUS TRANSITIONS
  // =====================

  markAsPending() {
    if (this.status !== SaleStatus.DRAFT) {
      throw new Error("Only DRAFT sale can become PENDING");
    }

    this.status = SaleStatus.PENDING;
  }

  markAsPaid() {
    if (
      this.status !== SaleStatus.PENDING &&
      this.status !== SaleStatus.DRAFT
    ) {
      throw new Error("Only pending/draft sale can be paid");
    }

    this.status = SaleStatus.PAID;
  }

  complete() {
    if (this.status !== SaleStatus.PAID) {
      throw new Error("Only PAID sale can be completed");
    }

    this.status = SaleStatus.COMPLETED;
  }

  cancel() {
    if (this.status === SaleStatus.COMPLETED) {
      throw new Error("Completed sale cannot be cancelled");
    }

    this.status = SaleStatus.CANCELLED;
  }

  // =====================
  // HELPERS
  // =====================

  isPaid(): boolean {
    return this.status === SaleStatus.PAID;
  }

  isPending(): boolean {
    return this.status === SaleStatus.PENDING;
  }

  isCancelled(): boolean {
    return this.status === SaleStatus.CANCELLED;
  }
}