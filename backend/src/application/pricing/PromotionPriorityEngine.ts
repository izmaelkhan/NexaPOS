import { Coupon } from "../../domain/pricing/Coupon";
import { Discount } from "../../domain/pricing/Discount";

type CartItem = {
  productId: string;
  price: number;
  quantity: number;
};

type PromotionInput = {
  items: CartItem[];
  subtotal: number;

  manualDiscount?: number;
  coupon?: Coupon;
  autoDiscount?: Discount;
};

export class PromotionPriorityEngine {
  calculate(input: PromotionInput) {
    const { subtotal, manualDiscount = 0, coupon, autoDiscount } = input;

    // =====================
    // 1. BASE VALIDATION
    // =====================
    if (subtotal < 0) {
      throw new Error("Invalid subtotal");
    }

    let remaining = subtotal;

    let appliedManual = 0;
    let appliedCoupon = 0;
    let appliedAuto = 0;

    // =====================
    // 2. MANUAL DISCOUNT (HIGHEST PRIORITY)
    // =====================
    if (manualDiscount > 0) {
      appliedManual = this.safeApply(remaining, manualDiscount);
      remaining -= appliedManual;
    }

    // =====================
    // 3. COUPON (SECOND PRIORITY)
    // =====================
    if (coupon) {
      if (!coupon.canApply()) {
        throw new Error("Invalid or expired coupon");
      }

      const value = coupon.apply();

      appliedCoupon = this.safeApply(remaining, value);
      remaining -= appliedCoupon;
    }

    // =====================
    // 4. AUTO PROMOTION (LOWEST PRIORITY)
    // =====================
    if (autoDiscount) {
      if (!autoDiscount.isValidNow()) {
        throw new Error("Auto promotion expired");
      }

      const value = autoDiscount.apply(remaining);

      appliedAuto = this.safeApply(remaining, value);
      remaining -= appliedAuto;
    }

    // =====================
    // 5. FINAL SAFETY CHECK
    // =====================
    if (remaining < 0) {
      throw new Error("Invalid pricing: negative total blocked");
    }

    return {
      subtotal,
      total: remaining,

      discounts: {
        manual: appliedManual,
        coupon: appliedCoupon,
        auto: appliedAuto,
      },
    };
  }

  // =====================
  // SAFE DISCOUNT APPLY
  // =====================
  private safeApply(base: number, discount: number): number {
    if (discount < 0) {
      throw new Error("Negative discount not allowed");
    }

    return Math.min(base, discount);
  }
}