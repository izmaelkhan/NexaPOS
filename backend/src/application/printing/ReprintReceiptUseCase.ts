import { IPrinter } from "../../domain/printing/IPrinter";
import { ReceiptFormatter, ReceiptFormat } from "./ReceiptFormatter";
import { AuditLogger } from "../../shared/audit/AuditLogger";
import { AuditEventType } from "../../shared/audit/AuditEventType";

type ReprintInput = {
  invoiceId: string;
  format?: ReceiptFormat;
};

export class ReprintReceiptUseCase {
  constructor(
    private readonly invoiceRepo: {
      findById(id: string): Promise<any>;
    },
    private readonly printer: IPrinter
  ) {}

  async execute(input: ReprintInput): Promise<void> {
    // =====================
    // LOAD INVOICE
    // =====================
    const invoice = await this.invoiceRepo.findById(input.invoiceId);

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // =====================
    // PRINTER CHECK
    // =====================
    const connected = await this.printer.isConnected();

    if (!connected) {
      throw new Error("Printer not connected");
    }

    // =====================
    // FORMAT RECEIPT
    // =====================
    const receiptText = ReceiptFormatter.format(
      {
        invoiceNumber: invoice.invoiceNumber,
        branchName: invoice.branchName,
        cashierName: invoice.cashierName,
        items: invoice.items,
        subtotal: invoice.pricing.subtotal,
        discount: invoice.pricing.discount,
        tax: invoice.pricing.tax,
        total: invoice.pricing.grandTotal,
        paymentMethod: invoice.paymentMethod,
      },
      input.format ?? ReceiptFormat.MM58
    );

    // =====================
    // PRINT
    // =====================
    await this.printer.print(receiptText);

    // =====================
    // AUDIT LOG (REPRINT TRACKING)
    // =====================
    AuditLogger.log({
  type: AuditEventType.RECEIPT_REPRINTED,
  timestamp: new Date(),
  data: {
    invoiceId: input.invoiceId,
    invoiceNumber: invoice.invoiceNumber,
  },
});
    
  }
}