import { ReturnItem } from "./ReturnItem";

export enum ReturnStatus {
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

type ReturnProps = {
  id: string;
  saleId: string;
  customerId: string;
  branchId: string;
  status?: ReturnStatus;
  reason: string;
  items: ReturnItem[];
  createdAt: Date;
};

export class Return {
  private props: ReturnProps;

  constructor(props: ReturnProps) {
    this.props = {
      ...props,
      status: props.status ?? ReturnStatus.REQUESTED,
    };
  }

  get id() {
    return this.props.id;
  }

  get saleId() {
    return this.props.saleId;
  }

  get customerId() {
    return this.props.customerId;
  }

  get branchId() {
    return this.props.branchId;
  }

  get status() {
    return this.props.status;
  }

  get reason() {
    return this.props.reason;
  }

  get items() {
    return Object.freeze([...this.props.items]);
  }

  get createdAt() {
    return this.props.createdAt;
  }

  approve() {
    if (this.props.status !== ReturnStatus.REQUESTED) {
      throw new Error("Only requested returns can be approved");
    }
    this.props.status = ReturnStatus.APPROVED;
  }

  reject() {
    if (this.props.status === ReturnStatus.COMPLETED) {
      throw new Error("Completed return cannot be rejected");
    }
    this.props.status = ReturnStatus.REJECTED;
  }

  complete() {
    if (this.props.status !== ReturnStatus.APPROVED) {
      throw new Error("Only approved returns can be completed");
    }
    this.props.status = ReturnStatus.COMPLETED;
  }
}