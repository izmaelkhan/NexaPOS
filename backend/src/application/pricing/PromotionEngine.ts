import { Discount } from "../../domain/pricing/Discount";
import { Coupon } from "../../domain/pricing/Coupon";

/**
 * =========================
 * PROMOTION ENGINE
 * Handles:
 * - active promotions
 * - coupon validation
 * - discount evaluation
 * - stacking rules (basic version)
 * =========================
 */
export class PromotionEngine {
  constructor(
    private readonly discountRepo: Discount[] = [],
    private readonly couponRepo: Coupon[] = []
  ) {}

  // =====================
  // ACTIVE PROMOTIONS
  // =====================
  async getActivePromotions(input?: {
    branchId?: string;
  }) {
    const now = new Date();

    const activeDiscounts = this.discountRepo.filter((d) => {
      return (
        d.isActive &&
        d.startDate <= now &&
        d.endDate >= now
      );
    });

    const activeCoupons = this.couponRepo.filter((c) => {
      return c["expiry"] > now; // safe access for simplicity
    });

    return {
      discounts: activeDiscounts,
      coupons: activeCoupons,
    };
  }

  // =====================
  // APPLY COUPON
  // =====================
  applyCoupon(coupon: Coupon, amount: number): number {
    if (!coupon) return 0;

    const discount = coupon.apply();
    return Math.max(0, amount - discount);
  }

  // =====================
  // APPLY DISCOUNT
  // =====================
  applyDiscount(discount: Discount, amount: number): number {
    if (!discount.isActive) return amount;

    return Math.max(0, discount.apply(amount));
  }

  // =====================
  // STACKING RULE (SIMPLE)
  // Manual → Coupon → Auto
  // =====================
  calculate(input: {
    subtotal: number;
    manualDiscount?: number;
    coupon?: Coupon;
    autoDiscount?: Discount;
  }) {
    let total = input.subtotal;

    const breakdown = {
      manual: 0,
      coupon: 0,
      auto: 0,
    };

    // 1. Manual discount
    if (input.manualDiscount) {
      breakdown.manual = Math.min(input.manualDiscount, total);
      total -= breakdown.manual;
    }

    // 2. Coupon
    if (input.coupon) {
      const couponDiscount = input.coupon.apply();
      breakdown.coupon = Math.min(couponDiscount, total);
      total -= breakdown.coupon;
    }

    // 3. Auto promotion
    if (input.autoDiscount) {
      const autoValue = input.autoDiscount.apply(total);
      const finalAuto = Math.min(autoValue, total);

      breakdown.auto = finalAuto;
      total -= finalAuto;
    }

    // SAFETY RULE: never negative
    total = Math.max(0, total);

    return {
      total,
      discounts: breakdown,
    };
  }
}