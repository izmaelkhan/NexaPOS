import { CheckoutUseCase } from "../../src/application/sales/CheckoutUseCase";
import { Cart } from "../../src/domain/sales/Cart";
import { CartItem } from "../../src/domain/sales/CartItem";
import { PaymentType } from "../../src/domain/payments/Payments";

describe("Checkout Flow", () => {
  const mockStockRepo = {
    getStock: jest.fn().mockResolvedValue({ stock: 10 }),
    createMovement: jest.fn(),
  };

  const mockSaleRepo = {
    save: jest.fn(),
    update: jest.fn(),
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

  // ✅ FIX: invoice generator mock (REQUIRED)
  const mockInvoiceNumberGenerator = {
    generate: jest.fn().mockResolvedValue("POS-2026-000001"),
  };

  const useCase = new CheckoutUseCase(
    mockStockRepo,
    mockSaleRepo,
    mockPaymentRepo,
    mockInvoiceRepo,
    mockCustomerRepo,
    mockInvoiceNumberGenerator
  );

  it("should complete checkout successfully (cart → sale)", async () => {
    const cart = new Cart("cart-1");

    cart.addItem(
      new CartItem("p1", 100, 2)
    );

    const result = await useCase.execute({
      cart,
      branchId: "b1",
      payment: {
        type: PaymentType.CASH,
        amount: 200,
      },
    });

    expect(result.sale).toBeDefined();
    expect(result.total).toBe(200);

    // ✅ FIX: invoiceNumber is directly returned now
    expect(result.invoiceNumber).toContain("POS-");
    expect(result.invoiceNumber).toBe("POS-2026-000001");
  });
});