export class AuditLogger {
  static log(event: {
    type: string;
    timestamp: Date;
    data?: any;
  }): void {
    console.log("[AUDIT EVENT]", {
      type: event.type,
      timestamp: event.timestamp,
      data: event.data,
    });
  }
}