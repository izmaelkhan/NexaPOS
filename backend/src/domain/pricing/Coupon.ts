export class Coupon {
  public readonly code: string;
  public readonly expiry: Date;
  public readonly usageLimit: number;
  public readonly appliedDiscount: number;

  private usedCount: number = 0;

  constructor(params: {
    code: string;
    expiry: Date;
    usageLimit: number;
    appliedDiscount: number;
  }) {
    const {
      code,
      expiry,
      usageLimit,
      appliedDiscount,
    } = params;

    if (!code) {
      throw new Error("Coupon code required");
    }

    if (usageLimit <= 0) {
      throw new Error("Usage limit must be positive");
    }

    if (appliedDiscount <= 0) {
      throw new Error("Discount must be positive");
    }

    this.code = code;
    this.expiry = expiry;
    this.usageLimit = usageLimit;
    this.appliedDiscount = appliedDiscount;
  }

  // =====================
  // VALIDATION
  // =====================
  canApply(): boolean {
    return (
      this.usedCount < this.usageLimit &&
      this.expiry > new Date()
    );
  }

  // =====================
  // APPLY COUPON
  // =====================
  apply(): number {
    if (this.expiry <= new Date()) {
      throw new Error("Coupon expired");
    }

    if (this.usedCount >= this.usageLimit) {
      throw new Error("Coupon usage limit exceeded");
    }

    this.usedCount++;

    return this.appliedDiscount;
  }
}