import { AuditEventType } from "./AuditEventType";

type AuditEvent = {
  type: AuditEventType;
  timestamp: Date;
  data?: any;
};

export class AuditLogger {
  static log(event: AuditEvent) {
    // For now: console log (later DB / Kafka / Elastic)
    console.log("[AUDIT]", {
      ...event,
      timestamp: event.timestamp.toISOString(),
    });
  }
}