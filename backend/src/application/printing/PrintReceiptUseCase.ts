import { IPrinter } from "../../domain/printing/IPrinter";
import { ReceiptDto } from "./ReceiptDto";
import {
  ReceiptFormatter,
  ReceiptFormat,
} from "./ReceiptFormatter";
import { PrinterHealthService } from "./PrinterHealthService";
import { AuditLogger } from "../../shared/audit/AuditLogger";
import { AuditEventType } from "../../shared/audit/AuditEventType";

type PrintReceiptInput = {
  invoiceId: string;
  format?: ReceiptFormat;
};

export class PrintReceiptUseCase {
  constructor(
  private readonly invoiceRepo: {
    findById(id: string): Promise<any>;
  },
  private readonly printer: IPrinter,
  private readonly auditLogger: typeof AuditLogger = AuditLogger
) {}

  async execute(input: PrintReceiptInput): Promise<void> {
  try {
    const invoice = await this.invoiceRepo.findById(input.invoiceId);

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const connected = await this.printer.isConnected();

    if (!connected) {
      this.auditLogger.log({
        type: AuditEventType.PRINTER_FAILURE,
        timestamp: new Date(),
        data: { invoiceId: input.invoiceId },
      });

      throw new Error("Printer not connected");
    }

    const receipt: ReceiptDto = {
      invoiceNumber: invoice.invoiceNumber,
      branchName: invoice.branchName,
      cashierName: invoice.cashierName,
      items: invoice.items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.quantity * item.unitPrice,
      })),
      subtotal: invoice.pricing.subtotal,
      discount: invoice.pricing.discount,
      tax: invoice.pricing.tax,
      total: invoice.pricing.grandTotal,
      paymentMethod: invoice.paymentMethod,
    };

    const receiptText = ReceiptFormatter.format(
      receipt,
      input.format ?? ReceiptFormat.MM58
    );

    await this.printer.print(receiptText);

    // =========================
    // SUCCESS AUDIT
    // =========================
    this.auditLogger.log({
      type: AuditEventType.RECEIPT_PRINTED,
      timestamp: new Date(),
      data: {
        invoiceId: input.invoiceId,
        invoiceNumber: invoice.invoiceNumber,
      },
    });
  } catch (error: any) {
    this.auditLogger.log({
      type: AuditEventType.PRINT_JOB_FAILED,
      timestamp: new Date(),
      data: {
        invoiceId: input.invoiceId,
        error: error.message,
      },
    });

    throw error;
  }
}
}