export enum PricingRuleType {
  BUY_X_GET_Y = "BUY_X_GET_Y",
  MIN_CART_AMOUNT = "MIN_CART_AMOUNT",
  CUSTOMER_DISCOUNT = "CUSTOMER_DISCOUNT",
  BRANCH_DISCOUNT = "BRANCH_DISCOUNT",
}

export class PricingRule {
  public readonly id: string;
  public readonly name: string;

  public readonly type: PricingRuleType;

  /**
   * Generic configuration payload
   * keeps rule system extensible
   */
  public readonly config: Record<string, any>;

  public isActive: boolean;

  public readonly startDate: Date;
  public readonly endDate: Date;

  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(params: {
    id: string;
    name: string;
    type: PricingRuleType;
    config: Record<string, any>;
    isActive?: boolean;
    startDate: Date;
    endDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    const {
      id,
      name,
      type,
      config,
      isActive = true,
      startDate,
      endDate,
      createdAt,
      updatedAt,
    } = params;

    // =====================
    // BASIC VALIDATION
    // =====================

    if (!name || name.trim().length === 0) {
      throw new Error("Pricing rule name is required");
    }

    if (startDate >= endDate) {
      throw new Error(
        "Pricing rule end date must be after start date"
      );
    }

    // =====================
    // RULE VALIDATION
    // =====================

    switch (type) {
      case PricingRuleType.BUY_X_GET_Y:
        this.validateBuyXGetY(config);
        break;

      case PricingRuleType.MIN_CART_AMOUNT:
        this.validateMinCart(config);
        break;

      case PricingRuleType.CUSTOMER_DISCOUNT:
        this.validateCustomerDiscount(config);
        break;

      case PricingRuleType.BRANCH_DISCOUNT:
        this.validateBranchDiscount(config);
        break;

      default:
        throw new Error("Unsupported pricing rule");
    }

    this.id = id;
    this.name = name.trim();

    this.type = type;
    this.config = config;

    this.isActive = isActive;

    this.startDate = startDate;
    this.endDate = endDate;

    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }

  // =====================================
  // RULE VALIDATORS
  // =====================================

  private validateBuyXGetY(config: Record<string, any>) {
    if (
      typeof config.buyQuantity !== "number" ||
      config.buyQuantity <= 0
    ) {
      throw new Error(
        "BUY_X_GET_Y requires valid buyQuantity"
      );
    }

    if (
      typeof config.freeQuantity !== "number" ||
      config.freeQuantity <= 0
    ) {
      throw new Error(
        "BUY_X_GET_Y requires valid freeQuantity"
      );
    }
  }

  private validateMinCart(config: Record<string, any>) {
    if (
      typeof config.minimumAmount !== "number" ||
      config.minimumAmount <= 0
    ) {
      throw new Error(
        "MIN_CART_AMOUNT requires minimumAmount"
      );
    }
  }

  private validateCustomerDiscount(
    config: Record<string, any>
  ) {
    if (!config.customerId) {
      throw new Error(
        "CUSTOMER_DISCOUNT requires customerId"
      );
    }

    if (
      typeof config.discountPercentage !== "number" ||
      config.discountPercentage <= 0 ||
      config.discountPercentage > 100
    ) {
      throw new Error(
        "Invalid customer discount percentage"
      );
    }
  }

  private validateBranchDiscount(
    config: Record<string, any>
  ) {
    if (!config.branchId) {
      throw new Error(
        "BRANCH_DISCOUNT requires branchId"
      );
    }

    if (
      typeof config.discountPercentage !== "number" ||
      config.discountPercentage <= 0 ||
      config.discountPercentage > 100
    ) {
      throw new Error(
        "Invalid branch discount percentage"
      );
    }
  }

  // =====================================
  // BUSINESS RULES
  // =====================================

  isValidNow(): boolean {
    const now = new Date();

    return (
      this.isActive &&
      now >= this.startDate &&
      now <= this.endDate
    );
  }

  activate() {
    this.isActive = true;
    this.touch();
  }

  deactivate() {
    this.isActive = false;
    this.touch();
  }

  // =====================================
  // INTERNAL
  // =====================================

  private touch() {
    this.updatedAt = new Date();
  }
}