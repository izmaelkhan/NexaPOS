export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

export class Discount {
  public readonly id: string;

  public readonly name: string;

  public readonly type: DiscountType;

  public readonly value: number;

  public isActive: boolean;

  public readonly startDate: Date;
  public readonly endDate: Date;

  /**
   * NULL = GLOBAL PROMOTION
   * VALUE = BRANCH SPECIFIC
   */
  public readonly branchId?: string;

  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(params: {
    id: string;
    name: string;
    type: DiscountType;
    value: number;
    isActive?: boolean;
    startDate: Date;
    endDate: Date;

    // NEW
    branchId?: string;

    createdAt?: Date;
    updatedAt?: Date;
  }) {
    const {
      id,
      name,
      type,
      value,
      isActive = true,
      startDate,
      endDate,
      branchId,
      createdAt,
      updatedAt,
    } = params;

    // =====================
    // VALIDATION
    // =====================

    if (!name || name.trim().length === 0) {
      throw new Error("Discount name required");
    }

    if (value <= 0) {
      throw new Error("Discount value must be positive");
    }

    if (
      type === DiscountType.PERCENTAGE &&
      value > 100
    ) {
      throw new Error(
        "Percentage discount cannot exceed 100"
      );
    }

    if (endDate <= startDate) {
      throw new Error(
        "Discount endDate must be after startDate"
      );
    }

    this.id = id;
    this.name = name.trim();

    this.type = type;
    this.value = value;

    this.isActive = isActive;

    this.startDate = startDate;
    this.endDate = endDate;

    // =====================
    // NEW FIELD
    // =====================
    this.branchId = branchId;

    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }

  // =====================
  // VALIDATION
  // =====================

  isValidNow(): boolean {
    const now = new Date();

    return (
      this.isActive &&
      now >= this.startDate &&
      now <= this.endDate
    );
  }

  // =====================
  // BRANCH RULE
  // =====================

  appliesToBranch(branchId: string): boolean {
    // GLOBAL PROMOTION
    if (!this.branchId) {
      return true;
    }

    // BRANCH SPECIFIC
    return this.branchId === branchId;
  }

  // =====================
  // APPLY DISCOUNT
  // =====================

  apply(amount: number): number {
    if (amount <= 0) {
      throw new Error("Invalid amount");
    }

    if (!this.isValidNow()) {
      throw new Error("Discount inactive");
    }

    if (this.type === DiscountType.PERCENTAGE) {
      return (amount * this.value) / 100;
    }

    return this.value;
  }

  // =====================
  // STATE CONTROL
  // =====================

  activate() {
    this.isActive = true;
    this.touch();
  }

  deactivate() {
    this.isActive = false;
    this.touch();
  }

  // =====================
  // INTERNAL
  // =====================

  private touch() {
    this.updatedAt = new Date();
  }
}