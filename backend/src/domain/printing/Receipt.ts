export type ReceiptItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export class Receipt {
  constructor(
    public readonly receiptNumber: string,
    public readonly branchName: string,
    public readonly items: ReceiptItem[],
    public readonly subtotal: number,
    public readonly tax: number,
    public readonly discount: number,
    public readonly grandTotal: number,
    public readonly printedAt: Date = new Date()
  ) {}
}