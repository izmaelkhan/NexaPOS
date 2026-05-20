import { EventBus } from "../../infrastructure/events/EventBus";
import { PurchaseEventType } from "../../domain/events/PurchaseEvents";

// =====================
// PURCHASE CREATED
// =====================
export function emitPurchaseCreated(payload: any) {
  EventBus.publish({
    type: PurchaseEventType.PURCHASE_CREATED,
    timestamp: new Date(),
    payload,
  });
}

// =====================
// GOODS RECEIVED
// =====================
export function emitGoodsReceived(payload: any) {
  EventBus.publish({
    type: PurchaseEventType.GOODS_RECEIVED,
    timestamp: new Date(),
    payload,
  });
}

// =====================
// SUPPLIER PAID
// =====================
export function emitSupplierPaid(payload: any) {
  EventBus.publish({
    type: PurchaseEventType.SUPPLIER_PAID,
    timestamp: new Date(),
    payload,
  });
}