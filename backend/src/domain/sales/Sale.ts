export class Sale {
  public readonly id: string;
  public readonly branchId: string;
  public readonly customerId?: string;
  public readonly totalAmount: number;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(params: {
    id: string;
    branchId: string;
    customerId?: string;
    totalAmount: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    const {
      id,
      branchId,
      customerId,
      totalAmount,
      createdAt = new Date(),
      updatedAt = new Date(),
    } = params;

    // =====================
    // Business Rules
    // =====================

    if (!branchId) {
      throw new Error("BranchId is required for every sale");
    }

    if (totalAmount < 0) {
      throw new Error("Total amount cannot be negative");
    }

    this.id = id;
    this.branchId = branchId;
    this.customerId = customerId;
    this.totalAmount = totalAmount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // =====================
  // Domain Logic
  // =====================

  isForBranch(branchId: string): boolean {
    return this.branchId === branchId;
  }

  updateTotalAmount(amount: number) {
    if (amount < 0) {
      throw new Error("Total amount cannot be negative");
    }

    (this as any).totalAmount = amount;
  }
}