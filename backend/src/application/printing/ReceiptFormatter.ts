import { ReceiptDto } from "./ReceiptDto";

export enum ReceiptFormat {
  MM58 = "58MM",
  MM80 = "80MM",
}

export class ReceiptFormatter {
  // =========================
  // MAIN FORMATTER
  // =========================
  static format(
    receipt: ReceiptDto,
    format: ReceiptFormat
  ): string {
    switch (format) {
      case ReceiptFormat.MM80:
        return this.format80mm(receipt);

      case ReceiptFormat.MM58:
      default:
        return this.format58mm(receipt);
    }
  }

  // =========================
  // 58MM THERMAL FORMAT
  // =========================
  private static format58mm(
    receipt: ReceiptDto
  ): string {
    const lines: string[] = [];

    lines.push("NexaPOS");
    lines.push("----------------");

    receipt.items.forEach((item) => {
      lines.push(
        `${item.productName} ${item.quantity} x ${item.unitPrice}`
      );
    });

    lines.push("");
    lines.push("----------------");
    lines.push(`Subtotal: ${receipt.subtotal}`);
    lines.push(`Discount: ${receipt.discount}`);
    lines.push(`Tax: ${receipt.tax}`);
    lines.push(`Total: ${receipt.total}`);
    lines.push("");
    lines.push(`Payment: ${receipt.paymentMethod}`);
    lines.push(`Invoice: ${receipt.invoiceNumber}`);

    return lines.join("\n");
  }

  // =========================
  // 80MM THERMAL FORMAT
  // =========================
  private static format80mm(
    receipt: ReceiptDto
  ): string {
    const lines: string[] = [];

    lines.push(
      "========================================"
    );
    lines.push("              NexaPOS");
    lines.push(
      "========================================"
    );

    lines.push(`Invoice : ${receipt.invoiceNumber}`);
    lines.push(`Branch  : ${receipt.branchName}`);
    lines.push(`Cashier : ${receipt.cashierName}`);

    lines.push(
      "----------------------------------------"
    );

    lines.push(
      "Item                Qty   Price   Total"
    );

    lines.push(
      "----------------------------------------"
    );

    receipt.items.forEach((item) => {
      lines.push(
        `${item.productName.padEnd(18)} ${String(
          item.quantity
        ).padStart(3)} ${String(
          item.unitPrice
        ).padStart(7)} ${String(
          item.lineTotal
        ).padStart(7)}`
      );
    });

    lines.push(
      "----------------------------------------"
    );

    lines.push(
      `Subtotal : ${receipt.subtotal}`
    );
    lines.push(
      `Discount : ${receipt.discount}`
    );
    lines.push(
      `Tax      : ${receipt.tax}`
    );
    lines.push(
      `Total    : ${receipt.total}`
    );

    lines.push(
      "----------------------------------------"
    );

    lines.push(
      `Payment Method : ${receipt.paymentMethod}`
    );

    lines.push(
      "========================================"
    );
    lines.push("      Thank You For Shopping");
    lines.push(
      "========================================"
    );

    return lines.join("\n");
  }
}