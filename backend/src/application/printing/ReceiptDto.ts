export type ReceiptItemDto = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type ReceiptDto = {
  invoiceNumber: string;
  branchName: string;
  cashierName: string;

  items: ReceiptItemDto[];

  subtotal: number;
  discount: number;
  tax: number;
  total: number;

  paymentMethod: string;
};