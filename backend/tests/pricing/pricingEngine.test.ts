import {Discount,DiscountType,} from "../../src/domain/pricing/Discount";

import { Coupon } from "../../src/domain/pricing/Coupon";

import { PromotionPriorityEngine }
from "../../src/application/pricing/PromotionPriorityEngine";

describe("Pricing Engine", () => {

  // =====================
  // 1. VALID COUPON APPLY
  // =====================
  test("should apply valid coupon", () => {

    const coupon = new Coupon({
      code: "SAVE10",
      expiry: new Date(Date.now() + 100000),
      usageLimit: 10,
      appliedDiscount: 100,
    });

    expect(coupon.canApply()).toBe(true);

    const value = coupon.apply();

    expect(value).toBe(100);
  });

  // =====================
  // 2. EXPIRED COUPON REJECT
  // =====================
  test("should reject expired coupon", () => {

    const coupon = new Coupon({
      code: "OLD",
      expiry: new Date(Date.now() - 100000),
      usageLimit: 10,
      appliedDiscount: 100,
    });

    expect(() => {
      coupon.apply();
    }).toThrow("Coupon expired");
  });

  // =====================
  // 3. PERCENTAGE CALCULATION
  // =====================
  test("should calculate percentage discount correctly", () => {

    const discount = new Discount({
      id: "d1",
      name: "10% OFF",
      type: DiscountType.PERCENTAGE,
      value: 10,
      startDate: new Date(Date.now() - 1000),
      endDate: new Date(Date.now() + 100000),
    });

    const result = discount.apply(1000);

    expect(result).toBe(100);
  });

  // =====================
  // 4. TOTAL NEVER BELOW ZERO
  // =====================
  test("should never allow negative totals", () => {

    const engine = new PromotionPriorityEngine();

    const result = engine.calculate({
      items: [],
      subtotal: 500,
      manualDiscount: 1000,
    });

    expect(result.total).toBe(0);
  });

  // =====================
  // 5. STACKING RULES
  // =====================
  test("should apply priority stacking correctly", () => {

    const coupon = new Coupon({
      code: "SAVE50",
      expiry: new Date(Date.now() + 100000),
      usageLimit: 10,
      appliedDiscount: 50,
    });

    const autoPromo = new Discount({
      id: "promo-1",
      name: "Auto Promo",
      type: DiscountType.FIXED,
      value: 100,
      startDate: new Date(Date.now() - 1000),
      endDate: new Date(Date.now() + 100000),
    });

    const engine = new PromotionPriorityEngine();

    const result = engine.calculate({
      items: [],
      subtotal: 1000,

      manualDiscount: 200,
      coupon,
      autoDiscount: autoPromo,
    });

    // ORDER:
    // 1000
    // -200 manual
    // =800
    // -50 coupon
    // =750
    // -100 auto
    // =650

    expect(result.total).toBe(650);

    expect(result.discounts.manual).toBe(200);
    expect(result.discounts.coupon).toBe(50);
    expect(result.discounts.auto).toBe(100);
  });

});