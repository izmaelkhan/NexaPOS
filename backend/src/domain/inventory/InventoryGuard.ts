export class InventoryGuard {
  static preventDirectStockUpdate(): never {
    throw new Error(
      "Direct stock update is not allowed. Use InventoryService only."
    );
  }
}