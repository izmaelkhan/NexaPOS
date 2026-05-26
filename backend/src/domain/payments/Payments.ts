export enum PaymentType {
  CASH = "CASH",
  CARD = "CARD",
  SPLIT = "SPLIT",
  CREDIT = "CREDIT",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export class Payment {
  public readonly id: string;
  public readonly saleId: string;
  public readonly type: PaymentType;

  public readonly amount: number;
  public readonly paidAt: Date;

  public status: PaymentStatus;

  constructor(params: {
    id: string;
    saleId: string;
    type: PaymentType;
    amount: number;
    paidAt?: Date;
  }) {
    const { id, saleId, type, amount, paidAt = new Date() } = params;

    if (!id) throw new Error("PaymentId is required");
    if (!saleId) throw new Error("SaleId is required");
    if (amount <= 0) throw new Error("Payment amount must be greater than 0");

    if (!Object.values(PaymentType).includes(type)) {
      throw new Error("Invalid payment type");
    }

    this.id = id;
    this.saleId = saleId;
    this.type = type;
    this.amount = amount;
    this.paidAt = paidAt;

    this.status = PaymentStatus.PENDING;
  }

  isCash() {
    return this.type === PaymentType.CASH;
  }

  isCard() {
    return this.type === PaymentType.CARD;
  }

  isSplit() {
    return this.type === PaymentType.SPLIT;
  }

  isCredit() {
    return this.type === PaymentType.CREDIT;
  }
}