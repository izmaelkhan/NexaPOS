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
    total?: number;
    status?: SaleStatus;
  }) {
    const {
      id,
      branchId,
      customerId,
      total = 0,
      status = SaleStatus.DRAFT,
    } = params;

    if (!id) throw new Error("SaleId is required");
    if (!branchId) throw new Error("BranchId is required");
    if (total < 0) throw new Error("Total cannot be negative");

    this.id = id;
    this.branchId = branchId;
    this.customerId = customerId;
    this.total = total;
    this.status = status;
  }

  // =========================
  // STATE TRANSITIONS (CORE)
  // =========================

  submitForPayment() {
    if (this.status !== SaleStatus.DRAFT) {
      throw new Error("Only DRAFT sales can be submitted for payment");
    }

    this.status = SaleStatus.PENDING;
  }

  markAsPaid() {
    if (this.status !== SaleStatus.PENDING) {
      throw new Error("Only PENDING sales can be marked as paid");
    }

    this.status = SaleStatus.PAID;
  }

  complete() {
    if (this.status !== SaleStatus.PAID) {
      throw new Error("Only PAID sales can be completed");
    }

    this.status = SaleStatus.COMPLETED;
  }

  cancel() {
    if (this.status === SaleStatus.COMPLETED) {
      throw new Error("Completed sales cannot be cancelled");
    }

    if (this.status === SaleStatus.CANCELLED) {
      throw new Error("Sale is already cancelled");
    }

    this.status = SaleStatus.CANCELLED;
  }

  // =========================
  // BUSINESS HELPERS
  // =========================

  isDraft(): boolean {
    return this.status === SaleStatus.DRAFT;
  }

  isPending(): boolean {
    return this.status === SaleStatus.PENDING;
  }

  isPaid(): boolean {
    return this.status === SaleStatus.PAID;
  }

  isCompleted(): boolean {
    return this.status === SaleStatus.COMPLETED;
  }

  isCancelled(): boolean {
    return this.status === SaleStatus.CANCELLED;
  }

  belongsToBranch(branchId: string): boolean {
    return this.branchId === branchId;
  }

  updateTotal(total: number) {
    if (total < 0) {
      throw new Error("Total cannot be negative");
    }

    if (this.status !== SaleStatus.DRAFT) {
      throw new Error("Cannot update total after checkout started");
    }

    this.total = total;
  }
}