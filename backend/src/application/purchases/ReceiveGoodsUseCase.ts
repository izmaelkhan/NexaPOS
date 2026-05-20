import {
  PurchaseOrder,
  PurchaseOrderStatus,
} from "../../domain/purchases/PurchaseOrder";
import { PurchaseItem } from "../../domain/purchases/PurchaseItem";
import { StockService } from "../inventory/StockService";

type ReceiveGoodsInput = {
  purchaseOrder: PurchaseOrder;
  items: PurchaseItem[];
};

export class ReceiveGoodsUseCase {
  constructor(
    private readonly stockService: StockService,
    private readonly purchaseOrderRepo: any
  ) {}

  async execute(input: ReceiveGoodsInput) {
    const { purchaseOrder, items } = input;

    // =====================
    // 1. VALIDATE PURCHASE
    // =====================
    if (purchaseOrder.status !== PurchaseOrderStatus.ORDERED) {
      throw new Error("Only ORDERED purchase can be received");
    }

    if (items.length === 0) {
      throw new Error("Purchase items required");
    }

    // =====================
    // 2. STOCK INCREASE VIA SERVICE
    // =====================
    for (const item of items) {
      await this.stockService.increaseStock(
        item.productId,
        purchaseOrder.branchId,
        item.quantity
      );
    }

    // =====================
    // 3. STATUS UPDATE
    // =====================
    purchaseOrder.markAsReceived();

    await this.purchaseOrderRepo.save(purchaseOrder);

    return {
      purchaseOrderId: purchaseOrder.id,
      status: purchaseOrder.status,
      receivedItems: items.length,
    };
  }
}