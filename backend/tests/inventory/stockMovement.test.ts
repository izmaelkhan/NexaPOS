import { BranchStock } from "../../src/domain/inventory/BranchStock";
import {
  StockMovement,
  StockMovementType,
} from "../../src/domain/inventory/StockMovement";

describe("Inventory Engine", () => {
  // =====================
  // 1. stock increase via purchase
  // =====================
  test("should increase stock via purchase", () => {
    const stock = new BranchStock({
      id: "bs-1",
      productId: "p-1",
      branchId: "b-1",
      stock: 10,
    });

    const movement = new StockMovement({
      id: "m-1",
      productId: "p-1",
      branchId: "b-1",
      type: StockMovementType.IN,
      quantity: 5,
    });

    stock.applyMovement(movement.getSignedQuantity());

    expect(stock.stock).toBe(15);
  });

  // =====================
  // 2. stock decrease via sale
  // =====================
  test("should decrease stock via sale", () => {
    const stock = new BranchStock({
      id: "bs-2",
      productId: "p-1",
      branchId: "b-1",
      stock: 20,
    });

    const movement = new StockMovement({
      id: "m-2",
      productId: "p-1",
      branchId: "b-1",
      type: StockMovementType.SALE,
      quantity: 7,
    });

    stock.applyMovement(movement.getSignedQuantity());

    expect(stock.stock).toBe(13);
  });

  // =====================
  // 3. invalid negative stock blocked
  // =====================
  test("should block negative stock", () => {
    const stock = new BranchStock({
      id: "bs-3",
      productId: "p-1",
      branchId: "b-1",
      stock: 3,
    });

    const movement = new StockMovement({
      id: "m-3",
      productId: "p-1",
      branchId: "b-1",
      type: StockMovementType.SALE,
      quantity: 10,
    });

    expect(() => {
      stock.applyMovement(movement.getSignedQuantity());
    }).toThrow("Insufficient stock");
  });

  // =====================
  // 4. branch isolation test
  // =====================
  test("branch A stock should not affect branch B", () => {
    const branchA = new BranchStock({
      id: "bs-a",
      productId: "p-1",
      branchId: "branch-a",
      stock: 10,
    });

    const branchB = new BranchStock({
      id: "bs-b",
      productId: "p-1",
      branchId: "branch-b",
      stock: 30,
    });

    const movement = new StockMovement({
      id: "m-4",
      productId: "p-1",
      branchId: "branch-a",
      type: StockMovementType.SALE,
      quantity: 4,
    });

    branchA.applyMovement(movement.getSignedQuantity());

    expect(branchA.stock).toBe(6);
    expect(branchB.stock).toBe(30);
  });
});