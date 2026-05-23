export class Invoice {
  public readonly invoiceNumber: string;
  public readonly createdAt: Date;

  public creditDue: number;
  public loyaltyPoints: number;
  public remainingBalance: number;

  // =====================
  // NEW DISCOUNT FIELDS
  // =====================
  public subtotal: number;
  public discount: number;
  public finalTotal: number;
  public couponCode?: string;

  constructor(params: {
    sequence: number;

    creditDue?: number;
    loyaltyPoints?: number;
    remainingBalance?: number;

    // NEW
    subtotal?: number;
    discount?: number;
    finalTotal?: number;
    couponCode?: string;
  }) {
    const {
      sequence,
      creditDue = 0,
      loyaltyPoints = 0,
      remainingBalance = 0,
      subtotal = 0,
      discount = 0,
      finalTotal = 0,
      couponCode,
    } = params;

    if (sequence <= 0) {
      throw new Error("Invalid invoice sequence");
    }

    this.invoiceNumber = this.generateInvoiceNumber(sequence);
    this.createdAt = new Date();

    this.creditDue = creditDue;
    this.loyaltyPoints = loyaltyPoints;
    this.remainingBalance = remainingBalance;

    // =====================
    // NEW ASSIGNMENTS
    // =====================
    this.subtotal = subtotal;
    this.discount = discount;
    this.finalTotal = finalTotal;
    this.couponCode = couponCode;
  }

  // =====================
  // FORMAT
  // =====================

  private generateInvoiceNumber(sequence: number): string {
    const year = new Date().getFullYear();
    const padded = String(sequence).padStart(4, "0");
    return `POS-${year}-${padded}`;
  }

  // =====================
  // UPDATE FINANCIALS
  // =====================

  updateFinancials(data: {
    creditDue: number;
    loyaltyPoints: number;
    remainingBalance: number;

    subtotal: number;
    discount: number;
    finalTotal: number;
    couponCode?: string;
  }) {
    this.creditDue = data.creditDue;
    this.loyaltyPoints = data.loyaltyPoints;
    this.remainingBalance = data.remainingBalance;

    this.subtotal = data.subtotal;
    this.discount = data.discount;
    this.finalTotal = data.finalTotal;
    this.couponCode = data.couponCode;
  }
}