export enum SaleStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  PAID = "PAID",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export class Sale {
  public readonly id: string;
  public readonly branchId: string;
  public readonly customerId?: string;

  public total: number;
  public status: SaleStatus;

  public items: {
    productId: string;
    quantity: number;
  }[];

  public invoiceNumber?: string;

  private locked: boolean = false;

  constructor(params: {
    id: string;
    branchId: string;
    customerId?: string;
    total: number;
    status?: SaleStatus;
    items?: { productId: string; quantity: number }[];
  }) {
    const {
      id,
      branchId,
      customerId,
      total,
      status = SaleStatus.DRAFT,
      items = [],
    } = params;

    if (!branchId) throw new Error("BranchId is required");
    if (total < 0) throw new Error("Sale total cannot be negative");

    this.id = id;
    this.branchId = branchId;
    this.customerId = customerId;

    this.total = total;
    this.status = status;
    this.items = items;
  }

  // =====================
  // LOCK (PREVENT MODIFICATION)
  // =====================
  lock() {
    if (this.locked) {
      throw new Error("Sale already locked");
    }

    this.locked = true;
  }

  // =====================
  // STATUS: PENDING
  // =====================
  markAsPending() {
    this.ensureNotFinal();

    if (this.status !== SaleStatus.DRAFT) {
      throw new Error("Only DRAFT can become PENDING");
    }

    this.status = SaleStatus.PENDING;
  }

  // =====================
  // STATUS: PAID
  // =====================
  markAsPaid() {
    this.ensureNotFinal();

    if (
      this.status !== SaleStatus.PENDING &&
      this.status !== SaleStatus.DRAFT
    ) {
      throw new Error("Only DRAFT or PENDING can become PAID");
    }

    this.status = SaleStatus.PAID;
  }

  // =====================
  // STATUS: COMPLETED (IMMUTABLE)
  // =====================
  complete(invoiceNumber: string) {
    if (this.status === SaleStatus.CANCELLED) {
      throw new Error("Cancelled sale cannot be completed");
    }

    if (this.status === SaleStatus.COMPLETED) {
      throw new Error("Sale already completed");
    }

    if (this.status !== SaleStatus.PAID) {
      throw new Error("Only PAID sale can be completed");
    }

    this.status = SaleStatus.COMPLETED;
    this.invoiceNumber = invoiceNumber;

    // IMMUTABLE LOCK
    Object.freeze(this);
  }

  // =====================
  // CANCEL
  // =====================
  cancel() {
    if (this.status === SaleStatus.COMPLETED) {
      throw new Error("Completed sale cannot be cancelled");
    }

    if (this.status === SaleStatus.REFUNDED) {
      throw new Error("Refunded sale cannot be cancelled");
    }

    this.status = SaleStatus.CANCELLED;
  }

  // =====================
  // REFUND
  // =====================
  refund() {
    if (this.status !== SaleStatus.COMPLETED) {
      throw new Error("Only completed sales can be refunded");
    }

    this.status = SaleStatus.REFUNDED;
  }

  // =====================
  // RULE GUARD
  // =====================
  private ensureNotFinal() {
    if (
      this.status === SaleStatus.COMPLETED ||
      this.status === SaleStatus.CANCELLED ||
      this.status === SaleStatus.REFUNDED
    ) {
      throw new Error(`Cannot modify ${this.status} sale`);
    }
  }

  // =====================
  // HELPERS
  // =====================
  isFinal(): boolean {
    return (
      this.status === SaleStatus.COMPLETED ||
      this.status === SaleStatus.CANCELLED ||
      this.status === SaleStatus.REFUNDED
    );
  }
}