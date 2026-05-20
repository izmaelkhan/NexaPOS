import { EventBus } from "../../infrastructure/events/EventBus";
import { PurchaseEventType } from "../../domain/events/PurchaseEvents";

// Simple reporting hook (can later be DB, Kafka, etc.)
EventBus.subscribe((event) => {
  switch (event.type) {
    case PurchaseEventType.PURCHASE_CREATED:
      console.log("[REPORT] Purchase Created:", event.payload);
      break;

    case PurchaseEventType.GOODS_RECEIVED:
      console.log("[REPORT] Goods Received:", event.payload);
      break;

    case PurchaseEventType.SUPPLIER_PAID:
      console.log("[REPORT] Supplier Paid:", event.payload);
      break;
  }
});