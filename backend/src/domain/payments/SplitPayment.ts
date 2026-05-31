import { PaymentMethod } from "./Payments";

export type SplitPaymentItem = {
  method: PaymentMethod;
  amount: number;
};

type SplitPaymentProps = {
  saleId: string;
  totalAmount: number;
  payments: SplitPaymentItem[];
};

export class SplitPayment {
  private props: SplitPaymentProps;

  constructor(props: SplitPaymentProps) {
    this.validate(props);
    this.props = props;
  }

  public validate(props: SplitPaymentProps = this.props): boolean {
    if (!props.payments || props.payments.length === 0) {
      throw new Error("Split payment must have at least one payment method");
    }

    const sum = props.payments.reduce(
      (a, p) => a + p.amount,
      0
    );

    if (sum !== props.totalAmount) {
      throw new Error(
        `Split payment mismatch: expected ${props.totalAmount}, got ${sum}`
      );
    }

    return true;
  }
}