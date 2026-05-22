export class Invoice {
  public readonly invoiceNumber: string;
  public readonly createdAt: Date;

  public creditDue: number;
  public loyaltyPoints: number;
  public remainingBalance: number;

  constructor(params: {
    sequence: number;
    creditDue?: number;
    loyaltyPoints?: number;
    remainingBalance?: number;
  }) {
    const {
      sequence,
      creditDue = 0,
      loyaltyPoints = 0,
      remainingBalance = 0,
    } = params;

    if (sequence <= 0) {
      throw new Error("Invalid invoice sequence");
    }

    this.invoiceNumber = this.generateInvoiceNumber(sequence);
    this.createdAt = new Date();

    this.creditDue = creditDue;
    this.loyaltyPoints = loyaltyPoints;
    this.remainingBalance = remainingBalance;
  }

  // =====================
  // INVOICE FORMAT
  // =====================

  private generateInvoiceNumber(sequence: number): string {
    const year = new Date().getFullYear();
    const padded = String(sequence).padStart(4, "0");

    return `POS-${year}-${padded}`;
  }

  // =====================
  // UPDATE FINANCIAL INFO
  // =====================

  updateFinancials(data: {
    creditDue: number;
    loyaltyPoints: number;
    remainingBalance: number;
  }) {
    this.creditDue = data.creditDue;
    this.loyaltyPoints = data.loyaltyPoints;
    this.remainingBalance = data.remainingBalance;
  }
}