import { CheckoutUseCase } from "../../src/application/sales/CheckoutUseCase";
import { Cart } from "../../src/domain/sales/Cart";
import { PaymentType } from "../../src/domain/payments/Payments";

describe("Checkout Stability (TDD)", () => {
  let checkoutUseCase: CheckoutUseCase;

  const mockStockRepo = {
    getStock: jest.fn(),
    createMovement: jest.fn(),
  };

  const mockSaleRepo = {
    save: jest.fn(),
  };

  const mockPaymentRepo = {
    save: jest.fn(),
  };

  const mockInvoiceRepo = {
    getNextSequence: jest.fn().mockResolvedValue(1),
  };

  const mockCustomerRepo = {
    findById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    checkoutUseCase = new CheckoutUseCase(
      mockStockRepo,
      mockSaleRepo,
      mockPaymentRepo,
      mockInvoiceRepo,
      mockCustomerRepo
    );
  });

  // =====================
  // 1. EMPTY CART REJECT
  // =====================
  test("should reject empty cart", async () => {
    const cart = new Cart("c1");

    await expect(
      checkoutUseCase.execute({
        cart,
        branchId: "b1",
        payment: {
          type: PaymentType.CASH,
          amount: 100,
        },
      })
    ).rejects.toThrow("Cart is empty");
  });

  // =====================
  // 2. DUPLICATE CHECKOUT REJECT
  // =====================
  test("should reject duplicate checkout on locked cart", async () => {
    const cart = new Cart("c1");

    cart.addItem({
      productId: "p1",
      price: 100,
      quantity: 1,
    });

    // simulate first checkout lock
    cart.lock();

    await expect(
      checkoutUseCase.execute({
        cart,
        branchId: "b1",
        payment: {
          type: PaymentType.CASH,
          amount: 100,
        },
      })
    ).rejects.toThrow();
  });

  // =====================
  // 3. PAYMENT FAILURE = ROLLBACK
  // =====================
  test("should rollback on payment failure", async () => {
    const cart = new Cart("c1");

    cart.addItem({
      productId: "p1",
      price: 100,
      quantity: 2,
    });

    mockStockRepo.getStock.mockResolvedValue({
      stock: 10,
    });

    mockPaymentRepo.save.mockImplementation(() => {
      throw new Error("Payment DB failure");
    });

    await expect(
      checkoutUseCase.execute({
        cart,
        branchId: "b1",
        payment: {
          type: PaymentType.CASH,
          amount: 200,
        },
      })
    ).rejects.toThrow("Payment DB failure");

    // ensure sale was not committed
    expect(mockSaleRepo.save).toHaveBeenCalled();
  });

  // =====================
  // 4. QUANTITY VALIDATION
  // =====================
  test("should validate quantity correctly", () => {
    const cart = new Cart("c1");

    expect(() => {
      cart.addItem({
        productId: "p1",
        price: 100,
        quantity: 0,
      });
    }).toThrow("Quantity must be greater than 0");
  });

  // =====================
  // 5. TOTAL CALCULATION ACCURACY
  // =====================
  test("should calculate total accurately", () => {
    const cart = new Cart("c1");

    cart.addItem({
      productId: "p1",
      price: 100,
      quantity: 2,
    });

    cart.addItem({
      productId: "p2",
      price: 50,
      quantity: 1,
    });

    expect(cart.getTotal()).toBe(250);
  });
});