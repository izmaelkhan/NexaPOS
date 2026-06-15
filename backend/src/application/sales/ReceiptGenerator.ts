import { Sale } from "../../domain/sales/Sale";
import { Payment } from "../../domain/payments/Payments"; 
import { AuditLogger } from "../../shared/audit/AuditLogger";
import { AuditEventType } from "../../shared/audit/AuditEventType";

export class ReceiptGenerator {
  generate(input: {
    sale: Sale;
    payment: Payment;
    branchName?: string;
    cashierName?: string;
  }) {
    const { sale, payment, branchName = "STORE", cashierName = "SYSTEM" } = input;

    // =====================
    // ITEMS (SAFE SNAPSHOT)
    // =====================
    const items = sale.items.map((item: any) => {
      const unitPrice = item.unitPrice ?? sale.total / sale.items.length;

      const discount = item.discount ?? 0;

      const lineTotal = (unitPrice - discount) * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        discount,
        lineTotal,
      };
    });

    // =====================
    // FINANCIALS
    // =====================
    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const discount = items.reduce((sum, i) => sum + i.discount * i.quantity, 0);
    const tax = 0; // extend later
    const grandTotal = subtotal - discount + tax;

    const dateTime = new Date().toISOString();

     AuditLogger.log({
    type: AuditEventType.RECEIPT_PRINTED,
    timestamp: new Date(),
    data: {
      saleId: sale.id,
      invoiceNumber: sale.invoiceNumber,
    },
  });
    // =====================
    // 1. JSON RECEIPT (API)
    // =====================
    const jsonReceipt = {
      header: {
        storeName: branchName,
        branch: sale.branchId,
        invoiceNumber: sale.invoiceNumber,
        cashier: cashierName,
        dateTime,
      },

      items,

      summary: {
        subtotal,
        tax,
        discount,
        grandTotal,
      },

      payment: {
        method: payment.method,
        paidAmount: payment.amount,
        status: payment.state,
      },

      footer: {
        message: "Thank you for your purchase!",
      },
    };

    // =====================
    // 2. THERMAL PRINTER FORMAT
    // =====================
    const thermalReceipt = this.generateThermalReceipt({
      branchName,
      sale,
      items,
      subtotal,
      tax,
      discount,
      grandTotal,
      payment,
      cashierName,
      dateTime,
    });

    // =====================
    // 3. PRINTABLE OBJECT (UI / PDF)
    // =====================
    const printableReceipt = {
      title: "RECEIPT",
      store: branchName,
      branch: sale.branchId,
      invoice: sale.invoiceNumber,
      cashier: cashierName,
      dateTime,
      items,
      summary: {
        subtotal,
        tax,
        discount,
        grandTotal,
      },
      payment,
      footer: "Thank you for your purchase!",
    };

    return {
      jsonReceipt,
      thermalReceipt,
      printableReceipt,
    };
  }

  // =====================
  // THERMAL FORMAT
  // =====================
  private generateThermalReceipt(input: any): string {
    const {
      branchName,
      sale,
      items,
      subtotal,
      tax,
      discount,
      grandTotal,
      payment,
      cashierName,
      dateTime,
    } = input;

    const lines: string[] = [];

    lines.push("************************");
    lines.push(`        ${branchName}`);
    lines.push("************************");
    lines.push(`Branch: ${sale.branchId}`);
    lines.push(`Invoice: ${sale.invoiceNumber}`);
    lines.push(`Cashier: ${cashierName}`);
    lines.push(`Date: ${dateTime}`);
    lines.push("------------------------");

    lines.push("ITEMS:");

    for (const item of items) {
      lines.push(
        `${item.productId} x${item.quantity} @${item.unitPrice} = ${item.lineTotal}`
      );
    }

    lines.push("------------------------");
    lines.push(`Subtotal: ${subtotal}`);
    lines.push(`Tax: ${tax}`);
    lines.push(`Discount: ${discount}`);
    lines.push(`TOTAL: ${grandTotal}`);
    lines.push("------------------------");

    lines.push(`Payment: ${payment.method}`);
    lines.push(`Status: ${payment.state}`);
    lines.push("------------------------");

    lines.push("   THANK YOU VISIT AGAIN   ");
    lines.push("************************");

    return lines.join("\n");
  }
   
  
}