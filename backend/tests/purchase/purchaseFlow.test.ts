import { Supplier } from "../../src/domain/suppliers/Supplier";
import {
  PurchaseOrder,
  PurchaseOrderStatus,
} from "../../src/domain/purchases/PurchaseOrder";
import { PurchaseItem } from "../../src/domain/purchases/PurchaseItem";
import { ReceiveGoodsUseCase } from "../../src/application/purchases/ReceiveGoodsUseCase";
import { StockService } from "../../src/application/inventory/StockService";

describe("Purchase Flow", () => {
  // =====================
  // MOCK REPOSITORIES
  // =====================

  const stockRepo = {
    createMovement: jest.fn(),
    getStock: jest.fn(),
    save: jest.fn(),
    findByProductAndBranch: jest.fn(),
  };

  const purchaseOrderRepo = {
    save: jest.fn(),
  };

  // =====================
  // REAL SERVICE
  // =====================

  const stockService = new StockService(stockRepo);

  // =====================
  // TEST DATA
  // =====================

  const supplier = new Supplier({
    id: "supplier-1",
    name: "ABC Supplier",
    phone: "03123456789",
    address: "Rawalpindi",
    balance: 0,
  });

  const items: PurchaseItem[] = [
    new PurchaseItem({
      productId: "product-1",
      quantity: 5,
      costPrice: 1000,
    }),
  ];

  // =====================
  // FACTORY
  // =====================

  const createPurchaseOrder = () =>
    new PurchaseOrder({
      id: crypto.randomUUID(),
      supplierId: supplier.id,
      branchId: "branch-1",
      totalCost: 5000,
      status: PurchaseOrderStatus.ORDERED,
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =====================
  // 1. PURCHASE INCREASES STOCK
  // =====================

  it("should increase stock on purchase receive", async () => {
    const purchaseOrder = createPurchaseOrder();

    const useCase = new ReceiveGoodsUseCase(
      stockService,
      purchaseOrderRepo
    );

    await useCase.execute({
      purchaseOrder,
      items,
    });

    expect(stockRepo.createMovement).toHaveBeenCalledTimes(1);

    expect(stockRepo.createMovement).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: "product-1",
        branchId: "branch-1",
        quantity: 5,
      })
    );
  });

  // =====================
  // 2. SUPPLIER BALANCE INCREASES
  // =====================

  it("should increase supplier payable balance", () => {
    supplier.addPayable(5000);

    expect(supplier.balance).toBe(5000);
  });

  // =====================
  // 3. RECEIVE GOODS UPDATES INVENTORY
  // =====================

  it("should mark purchase order as RECEIVED", async () => {
    const purchaseOrder = createPurchaseOrder();

    const useCase = new ReceiveGoodsUseCase(
      stockService,
      purchaseOrderRepo
    );

    await useCase.execute({
      purchaseOrder,
      items,
    });

    expect(purchaseOrder.status).toBe(
      PurchaseOrderStatus.RECEIVED
    );

    expect(purchaseOrderRepo.save).toHaveBeenCalled();
  });

  // =====================
  // 4. INVALID SUPPLIER REJECT
  // =====================

  it("should reject invalid supplier", () => {
    expect(() => {
      new Supplier({
        id: "supplier-invalid",
        name: "",
        phone: "",
        address: "",
        balance: -100,
      });
    }).toThrow();
  });
});