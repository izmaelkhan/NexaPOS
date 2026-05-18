export class Invoice {
  public readonly invoiceNumber: string;

  constructor(params: {
    sequence: number;
    year?: number;
  }) {
    const { sequence, year = new Date().getFullYear() } = params;

    if (sequence <= 0) {
      throw new Error("Invoice sequence must be greater than 0");
    }

    if (!year) {
      throw new Error("Year is required");
    }

    this.invoiceNumber = Invoice.generateInvoiceNumber(sequence, year);
  }

  // =====================
  // STATIC GENERATOR
  // =====================
  static generateInvoiceNumber(sequence: number, year: number): string {
    const paddedSequence = sequence.toString().padStart(4, "0");

    return `POS-${year}-${paddedSequence}`;
  }

  // =====================
  // VALIDATION
  // =====================
  static isValidFormat(invoiceNumber: string): boolean {
    const regex = /^POS-\d{4}-\d{4}$/;
    return regex.test(invoiceNumber);
  }

  // =====================
  // PARSE INVOICE
  // =====================
  static parse(invoiceNumber: string): {
    prefix: string;
    year: number;
    sequence: number;
  } {
    if (!Invoice.isValidFormat(invoiceNumber)) {
      throw new Error("Invalid invoice format");
    }

    const [prefix, year, sequence] = invoiceNumber.split("-");

    return {
      prefix,
      year: Number(year),
      sequence: Number(sequence),
    };
  }
}