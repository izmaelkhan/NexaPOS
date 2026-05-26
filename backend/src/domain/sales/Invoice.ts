export type InvoiceItemSnapshot = {
  productId: string;
  productName: string;
  sku: string;

  unitPrice: number;
  quantity: number;

  discount: number;
  finalPrice: number;
};

export type CustomerSnapshot = {
  customerId: string;
  name: string;
  phone?: string;
  type?: string;
};

export type PricingSnapshot = {
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
};

export class Invoice {
  public readonly invoiceNumber: string;
  public readonly saleId: string;
  public readonly branchId: string;
  public readonly issuedAt: Date;

  public readonly items: ReadonlyArray<InvoiceItemSnapshot>;
  public readonly customer?: Readonly<CustomerSnapshot>;
  public readonly pricing: Readonly<PricingSnapshot>;

  constructor(params: {
    invoiceNumber: string;
    saleId: string;
    branchId: string;
    items: InvoiceItemSnapshot[];
    pricing: PricingSnapshot;
    customer?: CustomerSnapshot;
    issuedAt?: Date;
  }) {
    const {
      invoiceNumber,
      saleId,
      branchId,
      items,
      pricing,
      customer,
      issuedAt = new Date(),
    } = params;

    if (!invoiceNumber) throw new Error("Invoice number required");
    if (!saleId) throw new Error("Sale ID required");
    if (!branchId) throw new Error("Branch ID required");

    this.invoiceNumber = invoiceNumber;
    this.saleId = saleId;
    this.branchId = branchId;
    this.issuedAt = issuedAt;

    this.items = Object.freeze([...items]);
    this.pricing = Object.freeze({ ...pricing });

    if (customer) {
      this.customer = Object.freeze({ ...customer });
    }

    Object.freeze(this);
  }
}