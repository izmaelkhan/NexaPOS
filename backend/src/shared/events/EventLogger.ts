export type EventType =
  | "CART_CREATED"
  | "CHECKOUT_STARTED"
  | "CHECKOUT_FAILED"
  | "CHECKOUT_COMPLETED";

export interface EventPayload {
  type: EventType;
  timestamp: Date;
  data?: any;
}

export class EventLogger {
  static log(event: EventPayload) {
    // later replace with DB / Kafka / Elastic
    console.log("[EVENT]", {
      type: event.type,
      timestamp: event.timestamp,
      data: event.data ?? null,
    });
  }
}