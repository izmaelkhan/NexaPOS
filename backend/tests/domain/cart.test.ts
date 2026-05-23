import { Cart } from "../../src/domain/sales/Cart";

describe("Cart Aggregate", () => {

  // =====================
  // 1. ADD ITEM
  // =====================
  test("should add item correctly", () => {
    const cart = new Cart("C1");

    cart.addItem({
      productId: "P1",
      price: 100,
      quantity: 2,
    });

    expect(cart.getItems().length).toBe(1);
    expect(cart.getTotal()).toBe(200);
  });

  // =====================
  // 2. INCREASE SAME PRODUCT
  // =====================
  test("should increase quantity if product exists", () => {
    const cart = new Cart("C1");

    cart.addItem({
      productId: "P1",
      price: 100,
      quantity: 2,
    });

    cart.addItem({
      productId: "P1",
      price: 100,
      quantity: 3,
    });

    expect(cart.getItems()[0].quantity).toBe(5);
  });

  // =====================
  // 3. REMOVE ITEM
  // =====================
  test("should remove item", () => {
    const cart = new Cart("C1");

    cart.addItem({
      productId: "P1",
      price: 100,
      quantity: 2,
    });

    cart.removeItem("P1");

    expect(cart.getItems().length).toBe(0);
  });

  // =====================
  // 4. UPDATE QUANTITY
  // =====================
  test("should update quantity", () => {
    const cart = new Cart("C1");

    cart.addItem({
      productId: "P1",
      price: 100,
      quantity: 2,
    });

    cart.updateQuantity("P1", 10);

    expect(cart.getItems()[0].quantity).toBe(10);
  });

  // =====================
  // 5. TOTAL CALCULATION
  // =====================
  test("should calculate total correctly", () => {
    const cart = new Cart("C1");

    cart.addItem({ productId: "P1", price: 100, quantity: 2 });
    cart.addItem({ productId: "P2", price: 50, quantity: 1 });

    expect(cart.getTotal()).toBe(250);
  });

  // =====================
  // 6. VALIDATION
  // =====================
  test("should reject invalid quantity", () => {
    const cart = new Cart("C1");

    expect(() =>
      cart.addItem({
        productId: "P1",
        price: 100,
        quantity: 0,
      })
    ).toThrow("Quantity must be greater than 0");
  });

});