export enum PurchaseOrderStatus {
  DRAFT = "DRAFT",
  ORDERED = "ORDERED",
  RECEIVED = "RECEIVED",
  CLOSED = "CLOSED",
}

export class PurchaseOrder {
  public readonly id: string;
  public readonly supplierId: string;
  public readonly branchId: string;

  public status: PurchaseOrderStatus;
  public totalCost: number;

  constructor(params: {
    id: string;
    supplierId: string;
    branchId: string;
    status?: PurchaseOrderStatus;
    totalCost?: number;
  }) {
    const {
      id,
      supplierId,
      branchId,
      status = PurchaseOrderStatus.DRAFT,
      totalCost = 0,
    } = params;

    // =====================
    // VALIDATION RULES
    // =====================

    if (!id) {
      throw new Error("PurchaseOrder id is required");
    }

    if (!supplierId) {
      throw new Error("SupplierId is required");
    }

    if (!branchId) {
      throw new Error("BranchId is required");
    }

    if (totalCost < 0) {
      throw new Error("Total cost cannot be negative");
    }

    this.id = id;
    this.supplierId = supplierId;
    this.branchId = branchId;
    this.status = status;
    this.totalCost = totalCost;
  }

  // =====================
  // BUSINESS BEHAVIORS
  // =====================

  addCost(amount: number) {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    if (this.status !== PurchaseOrderStatus.DRAFT) {
      throw new Error("Cannot modify non-draft purchase order");
    }

    this.totalCost += amount;
  }

  markAsOrdered() {
    if (this.status !== PurchaseOrderStatus.DRAFT) {
      throw new Error("Only DRAFT orders can be ordered");
    }

    if (this.totalCost <= 0) {
      throw new Error("Purchase order must have cost before ordering");
    }

    this.status = PurchaseOrderStatus.ORDERED;
  }

  markAsReceived() {
    if (this.status !== PurchaseOrderStatus.ORDERED) {
      throw new Error("Only ORDERED orders can be received");
    }

    this.status = PurchaseOrderStatus.RECEIVED;
  }

  close() {
    if (this.status !== PurchaseOrderStatus.RECEIVED) {
      throw new Error("Only RECEIVED orders can be closed");
    }

    this.status = PurchaseOrderStatus.CLOSED;
  }

  // =====================
  // HELPERS
  // =====================

  isDraft(): boolean {
    return this.status === PurchaseOrderStatus.DRAFT;
  }

  isOrdered(): boolean {
    return this.status === PurchaseOrderStatus.ORDERED;
  }

  isReceived(): boolean {
    return this.status === PurchaseOrderStatus.RECEIVED;
  }

  isClosed(): boolean {
    return this.status === PurchaseOrderStatus.CLOSED;
  }

  canBeEdited(): boolean {
    return this.status === PurchaseOrderStatus.DRAFT;
  }
}