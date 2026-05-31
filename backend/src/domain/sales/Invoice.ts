import { FinancialPrecision } from "../../shared/finance/FinancialPrecision";

export class Invoice {
  public readonly invoiceNumber: string;
  public readonly saleId: string;
  public readonly branchId: string;

  public readonly items: readonly any[];
  public readonly pricing: {
    subtotal: number;
    tax: number;
    discount: number;
    grandTotal: number;
  };

  public readonly customer?: any;

  constructor(props: {
    invoiceNumber: string;
    saleId: string;
    branchId: string;
    items: any[];
    pricing: any;
    customer?: any;
  }) {
    this.invoiceNumber = props.invoiceNumber;
    this.saleId = props.saleId;
    this.branchId = props.branchId;

    // IMMUTABLE SNAPSHOT
    this.items = Object.freeze(
      props.items.map((i) => Object.freeze({ ...i }))
    );

    this.pricing = Object.freeze({
      subtotal: FinancialPrecision.normalize(
        props.pricing.subtotal
      ),
      tax: FinancialPrecision.normalize(
        props.pricing.tax
      ),
      discount: FinancialPrecision.normalize(
        props.pricing.discount
      ),
      grandTotal: FinancialPrecision.normalize(
        props.pricing.grandTotal
      ),
    });

    this.customer = props.customer
      ? Object.freeze({ ...props.customer })
      : undefined;
  // IMPORTANT
  Object.freeze(this);
    }
  
}