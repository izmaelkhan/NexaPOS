import { AuditEventType } from "./AuditEventType";

export class AuditLogger {
  static log(event: {
    type: AuditEventType | string;
    timestamp: Date;
    data?: any;
  }) {
    console.log("[AUDIT EVENT]", {
      type: event.type,
      timestamp: event.timestamp,
      data: event.data,
    });
  }
}