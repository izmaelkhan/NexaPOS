export class ReturnItem {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly refundAmount: number
  ) {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    if (refundAmount < 0) {
      throw new Error("Refund cannot be negative");
    }
  }
}