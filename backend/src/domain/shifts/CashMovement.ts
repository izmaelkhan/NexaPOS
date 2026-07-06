export enum CashMovementType {
  SALE_CASH = "SALE_CASH",
  REFUND_CASH = "REFUND_CASH",
  EXPENSE = "EXPENSE",
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT", // ✅ ADD THIS
}

type CashMovementProps = {
  id: string;
  shiftId: string;
  amount: number;
  type: CashMovementType;
  referenceId?: string;
  createdAt?: Date;
};

export class CashMovement {
  private props: CashMovementProps;

  constructor(props: CashMovementProps) {
    if (!props.shiftId) {
      throw new Error("ShiftId is required");
    }

    if (props.amount <= 0) {
      throw new Error(
        "Cash movement amount must be greater than 0"
      );
    }

    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  // =========================
  // GETTERS
  // =========================

  get id() {
    return this.props.id;
  }

  get shiftId() {
    return this.props.shiftId;
  }

  get amount() {
    return this.props.amount;
  }

  get type() {
    return this.props.type;
  }

  get referenceId() {
    return this.props.referenceId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  // =========================
  // BUSINESS RULE HELPERS
  // =========================

  isSaleCash(): boolean {
    return this.props.type === CashMovementType.SALE_CASH;
  }

  isRefundCash(): boolean {
    return this.props.type === CashMovementType.REFUND_CASH;
  }

  isExpense(): boolean {
    return this.props.type === CashMovementType.EXPENSE;
  }

  isCashIn(): boolean {
    return this.props.type === CashMovementType.CASH_IN;
  }

  isCashOut(): boolean {
    return this.props.type === CashMovementType.CASH_OUT;
  }

  // Signed impact on shift cash balance
  getSignedAmount(): number {
    switch (this.props.type) {
      case CashMovementType.SALE_CASH:
      case CashMovementType.CASH_IN:
        return this.props.amount;

      case CashMovementType.REFUND_CASH:
      case CashMovementType.EXPENSE:
      case CashMovementType.CASH_OUT:
        return -this.props.amount;

      default:
        return 0;
    }
  }
}