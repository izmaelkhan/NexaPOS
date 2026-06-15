import { PaymentState } from "./PaymentState";

export enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  CREDIT = "CREDIT",
  SPLIT = "SPLIT",
  // Refund methods
  STORE_CREDIT = "STORE_CREDIT",
}

// ✅ FIX for your error
export type PaymentType = PaymentMethod;

type PaymentProps = {
  paymentId: string;
  saleId: string;
  amount: number;
  method: PaymentMethod;
  state?: PaymentState;
};

export class Payment {
  private props: PaymentProps;

  constructor(props: PaymentProps) {
    if (props.amount < 0) {
      throw new Error("Payment cannot be negative");
    }

    this.props = {
      ...props,
      state: props.state ?? PaymentState.CREATED,
    };
  }

  get paymentId() {
    return this.props.paymentId;
  }

  get saleId() {
    return this.props.saleId;
  }

  get amount() {
    return this.props.amount;
  }

  get method() {
    return this.props.method;
  }

  get state() {
    return this.props.state;
  }

  start() {
    this.props.state = PaymentState.PENDING;
  }

  complete() {
    this.props.state = PaymentState.COMPLETED;
  }

  fail() {
    this.props.state = PaymentState.FAILED;
  }

  refund() {
    this.props.state = PaymentState.REFUNDED;
  }
}