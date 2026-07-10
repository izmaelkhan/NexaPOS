export class Expense {
  public readonly id: string;
  public readonly branchId: string;
  public readonly shiftId: string;
  public readonly categoryId: string;
  public readonly amount: number;
  public readonly description: string;
  public readonly createdBy: string;
  public readonly createdAt: Date;

  private saved = false;

  constructor(params: {
    id: string;
    branchId: string;
    shiftId: string;
    categoryId: string;
    amount: number;
    description: string;
    createdBy: string;
    createdAt?: Date;
  }) {
    if (!params.branchId) {
      throw new Error("Branch is required");
    }

    if (!params.shiftId) {
      throw new Error("Shift is required");
    }

    if (!params.categoryId) {
      throw new Error("Category is required");
    }

    if (!params.createdBy) {
      throw new Error("CreatedBy is required");
    }

    if (params.amount <= 0) {
      throw new Error("Expense amount must be greater than zero");
    }

    this.id = params.id;
    this.branchId = params.branchId;
    this.shiftId = params.shiftId;
    this.categoryId = params.categoryId;
    this.amount = params.amount;
    this.description = params.description;
    this.createdBy = params.createdBy;
    this.createdAt = params.createdAt ?? new Date();
  }

  // =====================================
  // MARK AS SAVED (Repository calls this)
  // =====================================

  markAsSaved(): void {
    this.saved = true;
    Object.freeze(this);
  }

  // =====================================
  // STATE
  // =====================================

  get isSaved(): boolean {
    return this.saved;
  }
}