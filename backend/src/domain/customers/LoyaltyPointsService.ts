import { LoyaltyAccount } from "./LoyaltyAccount";
import { SaleStatus } from "../sales/Sale";

export enum LoyaltyEventType {
  CASH_SALE = "CASH_SALE",
  CREDIT_SALE = "CREDIT_SALE",
  RETURN = "RETURN",
}

export class LoyaltyPointsService {
  constructor(
    private readonly rate: number = 0.01 // 1% default
  ) {}

  // =====================
  // MAIN ENTRY POINT
  // =====================

  applyEvent(input: {
    loyaltyAccount: LoyaltyAccount;
    eventType: LoyaltyEventType;
    amount: number;
    saleStatus?: SaleStatus;
  }) {
    const { loyaltyAccount, eventType, amount, saleStatus } = input;

    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    // =====================
    // CASH SALE → IMMEDIATE POINTS
    // =====================
    if (eventType === LoyaltyEventType.CASH_SALE) {
      loyaltyAccount.earnFromSale(amount, this.rate);
      return;
    }

    // =====================
    // CREDIT SALE → ONLY AFTER PAYMENT (PAID STATUS)
    // =====================
    if (eventType === LoyaltyEventType.CREDIT_SALE) {
      if (saleStatus !== SaleStatus.PAID) {
        // no points until payment is completed
        return;
      }

      loyaltyAccount.earnFromSale(amount, this.rate);
      return;
    }

    // =====================
    // RETURN → DEDUCT POINTS
    // =====================
    if (eventType === LoyaltyEventType.RETURN) {
      const pointsToDeduct = Math.floor(amount * this.rate);

      if (loyaltyAccount.points < pointsToDeduct) {
        loyaltyAccount.points = 0;
        return;
      }

      loyaltyAccount.points -= pointsToDeduct;
      return;
    }

    throw new Error("Invalid loyalty event type");
  }
}