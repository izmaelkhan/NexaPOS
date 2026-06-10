import { IPrinter } from "../../domain/printing/IPrinter";
import { ReceiptDto } from "./ReceiptDto";
import { ReceiptFormatter, ReceiptFormat } from "./ReceiptFormatter";
import { AuditLogger } from "../../shared/audit/AuditLogger";
import { AuditEventType } from "../../shared/audit/AuditEventType";

type QueueItem = {
  id: string;
  invoiceId: string;
  receipt: ReceiptDto;
  format: ReceiptFormat;
  retries: number;
};

export class PrintQueue {
  private queue: QueueItem[] = [];
  private processing = false;
  private processedIds = new Set<string>();

  constructor(private readonly printer: IPrinter) {}

  // =====================
  // ENQUEUE (FIFO)
  // =====================
  enqueue(item: Omit<QueueItem, "retries">) {
    // DUPLICATE PREVENTION
    if (this.processedIds.has(item.id)) {
      return;
    }

    this.queue.push({ ...item, retries: 0 });
  }

  // =====================
  // PROCESS QUEUE
  // =====================
  async process(): Promise<void> {
    if (this.processing) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift()!;
      await this.processItem(item);
    }

    this.processing = false;
  }

  // =====================
  // SINGLE ITEM PROCESS
  // =====================
  private async processItem(item: QueueItem): Promise<void> {
    try {
      const connected = await this.printer.isConnected();

      if (!connected) {
        throw new Error("Printer offline");
      }

      const formatted = ReceiptFormatter.format(
        item.receipt,
        item.format
      );

      await this.printer.print(formatted);

      this.processedIds.add(item.id);

      AuditLogger.log({
        type: AuditEventType.PAYMENT_COMPLETED,
        timestamp: new Date(),
        data: {
          invoiceId: item.invoiceId,
          status: "PRINTED",
        },
      });
    } catch (error) {
      item.retries += 1;

      // =====================
      // RETRY LOGIC
      // =====================
      if (item.retries < 3) {
        this.queue.push(item); // retry back to queue
      } else {
        AuditLogger.log({
          type: AuditEventType.PAYMENT_FAILED,
          timestamp: new Date(),
          data: {
            invoiceId: item.invoiceId,
            error: (error as Error).message,
          },
        });
      }
    }
  }
}