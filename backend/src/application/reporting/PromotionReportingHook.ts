export type PromotionEventType =
  | "DISCOUNT_APPLIED"
  | "COUPON_REDEEMED"
  | "PROMOTION_APPLIED";

export interface PromotionEvent {
  type: PromotionEventType;
  timestamp: Date;

  // context
  customerId?: string;
  branchId?: string;

  // financial impact
  amountBefore?: number;
  amountAfter?: number;
  discountValue?: number;

  // metadata
  couponCode?: string;
  promotionId?: string;
}

export class PromotionReportingHook {
  private events: PromotionEvent[] = [];

  /**
   * =========================
   * TRACK EVENT
   * =========================
   */
  track(event: PromotionEvent) {
    this.events.push({
      ...event,
      timestamp: new Date(),
    });
  }

  // =========================
  // DISCOUNT USAGE REPORT
  // =========================
  getDiscountUsageReport() {
    const discountEvents = this.events.filter(
      (e) => e.type === "DISCOUNT_APPLIED"
    );

    return {
      totalDiscounts: discountEvents.length,
      totalDiscountValue: discountEvents.reduce(
        (sum, e) => sum + (e.discountValue || 0),
        0
      ),
    };
  }

  // =========================
  // COUPON REDEMPTION REPORT
  // =========================
  getCouponRedemptionReport() {
    const couponEvents = this.events.filter(
      (e) => e.type === "COUPON_REDEEMED"
    );

    const usageByCode: Record<string, number> = {};

    for (const e of couponEvents) {
      if (!e.couponCode) continue;
      usageByCode[e.couponCode] =
        (usageByCode[e.couponCode] || 0) + 1;
    }

    return {
      totalCouponsRedeemed: couponEvents.length,
      usageByCode,
    };
  }

  // =========================
  // PROMOTION EFFECTIVENESS
  // =========================
  getPromotionEffectivenessReport() {
    const promoEvents = this.events.filter(
      (e) => e.type === "PROMOTION_APPLIED"
    );

    const totalBefore = promoEvents.reduce(
      (sum, e) => sum + (e.amountBefore || 0),
      0
    );

    const totalAfter = promoEvents.reduce(
      (sum, e) => sum + (e.amountAfter || 0),
      0
    );

    const totalSavings = totalBefore - totalAfter;

    return {
      totalPromotions: promoEvents.length,
      totalSavings,
      averageDiscount:
        promoEvents.length > 0
          ? totalSavings / promoEvents.length
          : 0,
    };
  }

  // =========================
  // FULL RAW EVENTS
  // =========================
  getAllEvents() {
    return this.events;
  }
}