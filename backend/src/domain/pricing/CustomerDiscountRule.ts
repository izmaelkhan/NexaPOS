export enum CustomerDiscountType {
  VIP = "VIP",
  LOYALTY = "LOYALTY",
  WHOLESALE = "WHOLESALE",
}

export class CustomerDiscountRule {
  public readonly id: string;

  /**
   * WHICH CUSTOMER GROUP
   */
  public readonly type: CustomerDiscountType;

  /**
   * OPTIONAL DIRECT CUSTOMER TARGET
   */
  public readonly customerId?: string;

  /**
   * OPTIONAL LOYALTY TIER
   * Example:
   * GOLD / SILVER / PLATINUM
   */
  public readonly loyaltyTier?: string;

  /**
   * DISCOUNT %
   */
  public readonly discountPercentage: number;

  public isActive: boolean;

  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(params: {
    id: string;
    type: CustomerDiscountType;

    customerId?: string;
    loyaltyTier?: string;

    discountPercentage: number;

    isActive?: boolean;

    createdAt?: Date;
    updatedAt?: Date;
  }) {
    const {
      id,
      type,
      customerId,
      loyaltyTier,
      discountPercentage,
      isActive = true,
      createdAt,
      updatedAt,
    } = params;

    // =====================
    // VALIDATION
    // =====================

    if (discountPercentage <= 0) {
      throw new Error(
        "Discount percentage must be positive"
      );
    }

    if (discountPercentage > 100) {
      throw new Error(
        "Discount percentage cannot exceed 100"
      );
    }

    this.id = id;

    this.type = type;

    this.customerId = customerId;
    this.loyaltyTier = loyaltyTier;

    this.discountPercentage = discountPercentage;

    this.isActive = isActive;

    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }

  // =====================
  // MATCH CUSTOMER
  // =====================

  appliesTo(params: {
    customerId?: string;
    loyaltyTier?: string;
  }): boolean {
    if (!this.isActive) {
      return false;
    }

    // DIRECT CUSTOMER TARGET
    if (
      this.customerId &&
      this.customerId !== params.customerId
    ) {
      return false;
    }

    // LOYALTY TIER TARGET
    if (
      this.loyaltyTier &&
      this.loyaltyTier !== params.loyaltyTier
    ) {
      return false;
    }

    return true;
  }

  // =====================
  // APPLY DISCOUNT
  // =====================

  calculate(amount: number): number {
    if (amount <= 0) {
      throw new Error("Invalid amount");
    }

    return (
      amount * this.discountPercentage
    ) / 100;
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

  private touch() {
    this.updatedAt = new Date();
  }
}