export type ReceiptItem = {
  productId: string;
  name?: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type PaymentMethod = "CASH" | "CARD" | "CREDIT" | "SPLIT";

export class Receipt {
  public readonly storeName: string;
  public readonly invoiceNumber: string;
  public readonly items: ReceiptItem[];
  public readonly total: number;
  public readonly paymentMethod: PaymentMethod;

  constructor(params: {
    storeName: string;
    invoiceNumber: string;
    items: ReceiptItem[];
    total: number;
    paymentMethod: PaymentMethod;
  }) {
    const { storeName, invoiceNumber, items, total, paymentMethod } = params;

    // =====================
    // VALIDATION RULES
    // =====================

    if (!storeName || storeName.trim().length < 2) {
      throw new Error("Invalid store name");
    }

    if (!invoiceNumber) {
      throw new Error("Invoice number is required");
    }

    if (!items || items.length === 0) {
      throw new Error("Receipt must contain items");
    }

    if (total < 0) {
      throw new Error("Total cannot be negative");
    }

    this.storeName = storeName;
    this.invoiceNumber = invoiceNumber;
    this.items = items;
    this.total = total;
    this.paymentMethod = paymentMethod;
  }

  // =====================
  // DOMAIN HELPERS
  // =====================

  getItemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  isCashPayment(): boolean {
    return this.paymentMethod === "CASH";
  }

  isCardPayment(): boolean {
    return this.paymentMethod === "CARD";
  }
}