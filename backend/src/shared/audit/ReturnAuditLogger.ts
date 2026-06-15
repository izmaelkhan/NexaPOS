import { AuditLogger } from "./AuditLogger";
import { AuditEventType } from "./AuditEventType";

export class ReturnAuditLogger {
  static requested(data: any) {
    AuditLogger.log({
      type: AuditEventType.RETURN_REQUESTED,
      timestamp: new Date(),
      data,
    });
  }

  static approved(data: any) {
    AuditLogger.log({
      type: AuditEventType.RETURN_APPROVED,
      timestamp: new Date(),
      data,
    });
  }

  static completed(data: any) {
    AuditLogger.log({
      type: AuditEventType.RETURN_COMPLETED,
      timestamp: new Date(),
      data,
    });
  }

  static refundIssued(data: any) {
    AuditLogger.log({
      type: AuditEventType.REFUND_ISSUED,
      timestamp: new Date(),
      data,
    });
  }
}