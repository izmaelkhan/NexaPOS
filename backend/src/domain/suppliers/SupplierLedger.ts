export enum SupplierLedgerType {
  PURCHASE = "PURCHASE",
  PAYMENT = "PAYMENT",
}

export class SupplierLedger {
  public readonly id: string;
  public readonly supplierId: string;
  public readonly type: SupplierLedgerType;
  public readonly amount: number;
  public readonly createdAt: Date;

  constructor(params: {
    id: string;
    supplierId: string;
    type: SupplierLedgerType;
    amount: number;
    createdAt?: Date;
  }) {
    const {
      id,
      supplierId,
      type,
      amount,
      createdAt = new Date(),
    } = params;

    // =====================
    // VALIDATION RULES
    // =====================

    if (!supplierId) {
      throw new Error("SupplierId is required");
    }

    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    if (
      type !== SupplierLedgerType.PURCHASE &&
      type !== SupplierLedgerType.PAYMENT
    ) {
      throw new Error("Invalid ledger type");
    }

    this.id = id;
    this.supplierId = supplierId;
    this.type = type;
    this.amount = amount;
    this.createdAt = createdAt;
  }

  // =====================
  // DOMAIN LOGIC
  // =====================

  isPurchase(): boolean {
    return this.type === SupplierLedgerType.PURCHASE;
  }

  isPayment(): boolean {
    return this.type === SupplierLedgerType.PAYMENT;
  }

  getSignedAmount(): number {
    // PURCHASE = increases payable (+)
    // PAYMENT = decreases payable (-)
    return this.isPurchase() ? this.amount : -this.amount;
  }
}