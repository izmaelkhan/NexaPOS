export class LoyaltyAccount {
  public readonly customerId: string;

  public points: number;
  public totalEarned: number;
  public totalRedeemed: number;

  // optional expiry control (days-based)
  public readonly expiryDays?: number;

  constructor(params: {
    customerId: string;
    points?: number;
    totalEarned?: number;
    totalRedeemed?: number;
    expiryDays?: number;
  }) {
    const {
      customerId,
      points = 0,
      totalEarned = 0,
      totalRedeemed = 0,
      expiryDays,
    } = params;

    if (!customerId) {
      throw new Error("CustomerId is required");
    }

    if (points < 0) {
      throw new Error("Points cannot be negative");
    }

    this.customerId = customerId;
    this.points = points;
    this.totalEarned = totalEarned;
    this.totalRedeemed = totalRedeemed;
    this.expiryDays = expiryDays;
  }

  // =====================
  // BUSINESS RULE 1: EARN POINTS
  // =====================

  earnFromSale(saleAmount: number, rate: number = 0.01) {
    if (saleAmount <= 0) {
      throw new Error("Sale amount must be positive");
    }

    if (rate <= 0 || rate > 1) {
      throw new Error("Invalid loyalty rate");
    }

    const earned = Math.floor(saleAmount * rate);

    this.points += earned;
    this.totalEarned += earned;
  }

  // =====================
  // BUSINESS RULE 2: REDEEM POINTS
  // =====================

  redeemPoints(points: number): number {
    if (points <= 0) {
      throw new Error("Points must be positive");
    }

    if (points > this.points) {
      throw new Error("Insufficient loyalty points");
    }

    this.points -= points;
    this.totalRedeemed += points;

    // conversion rule: 1 point = 1 currency unit (configurable later)
    return points;
  }

  // =====================
  // BUSINESS RULE 3: APPLY DISCOUNT
  // =====================

  calculateDiscount(pointsToUse: number, maxDiscount: number): number {
    const redeemable = Math.min(pointsToUse, this.points, maxDiscount);
    return this.redeemPoints(redeemable);
  }

  // =====================
  // OPTIONAL RULE: EXPIRY CHECK (placeholder)
  // =====================

  isExpired(): boolean {
    if (!this.expiryDays) return false;

    // Future enhancement:
    // integrate with timestamped ledger
    return false;
  }
}