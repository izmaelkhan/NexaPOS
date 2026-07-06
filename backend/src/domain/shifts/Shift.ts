export enum ShiftStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

type ShiftProps = {
  id: string;
  userId: string;
  branchId: string;

  openingCash: number;
  closingCash?: number;
  expectedCash?: number;
  difference?: number;

  status?: ShiftStatus;

  openedAt: Date;
  closedAt?: Date;
};

export class Shift {
  private props: ShiftProps;


  constructor(props: ShiftProps) {
    if (props.openingCash < 0) {
      throw new Error(
        "Opening cash cannot be negative"
      );
    }

    this.props = {
      ...props,
      status:
        props.status ??
        ShiftStatus.OPEN,

      expectedCash:
        props.expectedCash ?? 0,

      difference:
        props.difference ?? 0,
    };
  }


  // =========================
  // GETTERS
  // =========================

  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get branchId() {
    return this.props.branchId;
  }

  get openingCash() {
    return this.props.openingCash;
  }

  get closingCash() {
    return this.props.closingCash;
  }

  get expectedCash() {
    return this.props.expectedCash;
  }

  get difference() {
    return this.props.difference;
  }

  get status() {
    return this.props.status;
  }

  get openedAt() {
    return this.props.openedAt;
  }

  get closedAt() {
    return this.props.closedAt;
  }


  // =========================
  // BUSINESS RULES
  // =========================


  /**
   * Close shift
   * OPEN -> CLOSED only
   */
  close(params: {
  closingCash: number;
  expectedCash: number;
}) {
  if (this.props.status === ShiftStatus.CLOSED) {
    throw new Error("Closed shift cannot be modified");
  }

  if (params.closingCash < 0) {
    throw new Error("Closing cash cannot be negative");
  }

  this.props.closingCash = params.closingCash;
  this.props.expectedCash = params.expectedCash;

  // ✅ DOMAIN CALCULATES DIFFERENCE ITSELF
  this.props.difference =
    params.closingCash - params.expectedCash;

  this.props.status = ShiftStatus.CLOSED;
  this.props.closedAt = new Date();
}


  /**
   * Add expected cash
   * Used during sales calculation
   */
  addExpectedCash(amount: number) {

    if (
      this.props.status ===
      ShiftStatus.CLOSED
    ) {
      throw new Error(
        "Cannot update closed shift"
      );
    }


    if (amount < 0) {
      throw new Error(
        "Amount cannot be negative"
      );
    }


    this.props.expectedCash =
      (this.props.expectedCash ?? 0)
      + amount;
  }



  /**
   * Check shift availability
   * Repository level rule:
   *
   * One user can have only one OPEN shift
   */
  static canOpenNewShift(
    existingShift?: Shift
  ): boolean {

    if (!existingShift) {
      return true;
    }


    return (
      existingShift.status !==
      ShiftStatus.OPEN
    );
  }

  addExpense(amount: number) {
  if (this.props.status === ShiftStatus.CLOSED) {
    throw new Error("Cannot modify closed shift");
  }

  if (amount <= 0) {
    throw new Error("Invalid expense amount");
  }

  this.props.expectedCash =
    (this.props.expectedCash ?? 0) - amount;
}
}