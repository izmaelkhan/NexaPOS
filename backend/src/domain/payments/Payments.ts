export enum PaymentType {
  CASH = "CASH",
  CARD = "CARD",
  SPLIT = "SPLIT",
  CREDIT = "CREDIT",
}

export class Payment {
  public readonly id: string;
  public readonly saleId: string;
  public readonly type: PaymentType;

  public readonly amount: number;
  public readonly paidAt: Date;

  constructor(params: {
    id: string;
    saleId: string;
    type: PaymentType;
    amount: number;
    paidAt?: Date;
  }) {
    const { id, saleId, type, amount, paidAt = new Date() } = params;

    // =====================
    // Validation Rules
    // =====================

    if (!id) {
      throw new Error("PaymentId is required");
    }

    if (!saleId) {
      throw new Error("SaleId is required");
    }

    if (amount <= 0) {
      throw new Error("Payment amount must be greater than 0");
    }

    if (!Object.values(PaymentType).includes(type)) {
      throw new Error("Invalid payment type");
    }

    this.id = id;
    this.saleId = saleId;
    this.type = type;
    this.amount = amount;
    this.paidAt = paidAt;
  }

  // =====================
  // DOMAIN BEHAVIORS
  // =====================

  isCash(): boolean {
    return this.type === PaymentType.CASH;
  }

  isCard(): boolean {
    return this.type === PaymentType.CARD;
  }

  isSplit(): boolean {
    return this.type === PaymentType.SPLIT;
  }

  isCredit(): boolean {
    return this.type === PaymentType.CREDIT;
  }
}