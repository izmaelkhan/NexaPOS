export enum PurchaseEventType {
  PURCHASE_CREATED = "PurchaseCreated",
  GOODS_RECEIVED = "GoodsReceived",
  SUPPLIER_PAID = "SupplierPaid",
}

export interface DomainEvent<T = any> {
  type: PurchaseEventType;
  timestamp: Date;
  payload: T;
}