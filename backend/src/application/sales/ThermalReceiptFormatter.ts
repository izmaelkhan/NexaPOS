type ReceiptItem = {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

type ReceiptData = {
  storeName: string;
  branch: string;
  invoiceNumber: string;
  cashier: string;
  dateTime: string;

  items: ReceiptItem[];

  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;

  paymentMethod: string;
};

export class ThermalReceiptFormatter {
  // =====================
  // 58MM FORMAT
  // =====================
  format58mm(data: ReceiptData): string {
    const width = 32;

    const lines: string[] = [];

    lines.push(this.center(data.storeName, width));
    lines.push(this.center(data.branch, width));

    lines.push("-".repeat(width));

    lines.push(this.row("Invoice", data.invoiceNumber, width));
    lines.push(this.row("Cashier", data.cashier, width));
    lines.push(this.row("Date", data.dateTime, width));

    lines.push("-".repeat(width));

    // ITEMS
    for (const item of data.items) {
      const itemName = this.truncate(item.name, width);

      lines.push(itemName);

      lines.push(
        this.row(
          `${item.quantity} x ${item.unitPrice}`,
          item.total.toFixed(2),
          width
        )
      );
    }

    lines.push("-".repeat(width));

    lines.push(
      this.row("Subtotal", data.subtotal.toFixed(2), width)
    );

    lines.push(
      this.row("Tax", data.tax.toFixed(2), width)
    );

    lines.push(
      this.row("Discount", data.discount.toFixed(2), width)
    );

    lines.push("-".repeat(width));

    lines.push(
      this.row("TOTAL", data.grandTotal.toFixed(2), width)
    );

    lines.push(
      this.row("Payment", data.paymentMethod, width)
    );

    lines.push("-".repeat(width));

    lines.push(this.center("THANK YOU", width));

    return lines.join("\n");
  }

  // =====================
  // 80MM FORMAT
  // =====================
  format80mm(data: ReceiptData): string {
    const width = 48;

    const lines: string[] = [];

    lines.push(this.center(data.storeName, width));
    lines.push(this.center(data.branch, width));

    lines.push("=".repeat(width));

    lines.push(this.row("Invoice", data.invoiceNumber, width));
    lines.push(this.row("Cashier", data.cashier, width));
    lines.push(this.row("Date", data.dateTime, width));

    lines.push("=".repeat(width));

    lines.push(
      this.columns(
        ["Item", "Qty", "Price", "Total"],
        [22, 6, 8, 10]
      )
    );

    lines.push("-".repeat(width));

    for (const item of data.items) {
      lines.push(
        this.columns(
          [
            this.truncate(item.name, 22),
            String(item.quantity),
            item.unitPrice.toFixed(2),
            item.total.toFixed(2),
          ],
          [22, 6, 8, 10]
        )
      );
    }

    lines.push("-".repeat(width));

    lines.push(
      this.row("Subtotal", data.subtotal.toFixed(2), width)
    );

    lines.push(
      this.row("Tax", data.tax.toFixed(2), width)
    );

    lines.push(
      this.row("Discount", data.discount.toFixed(2), width)
    );

    lines.push("=".repeat(width));

    lines.push(
      this.row("GRAND TOTAL", data.grandTotal.toFixed(2), width)
    );

    lines.push(
      this.row("Payment", data.paymentMethod, width)
    );

    lines.push("=".repeat(width));

    lines.push(this.center("THANK YOU VISIT AGAIN", width));

    return lines.join("\n");
  }

  // =====================
  // ALIGNMENT HELPERS
  // =====================

  private row(
    left: string,
    right: string,
    width: number
  ): string {
    const space = width - left.length - right.length;

    return left + " ".repeat(Math.max(space, 1)) + right;
  }

  private center(text: string, width: number): string {
    const padding = Math.floor((width - text.length) / 2);

    return " ".repeat(Math.max(padding, 0)) + text;
  }

  private truncate(text: string, max: number): string {
    if (text.length <= max) {
      return text;
    }

    return text.slice(0, max - 3) + "...";
  }

  private columns(
    values: string[],
    widths: number[]
  ): string {
    return values
      .map((v, i) =>
        this.padRight(v, widths[i])
      )
      .join("");
  }

  private padRight(value: string, width: number): string {
    return value.padEnd(width, " ");
  }
}