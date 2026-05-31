import { CheckoutUseCase } from "../../src/application/sales/CheckoutUseCase";
import { Cart } from "../../src/domain/sales/Cart";
import { CartItem } from "../../src/domain/sales/CartItem";
import { PaymentMethod } from "../../src/domain/payments/Payments";

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

  const mockCustomerRepo = {
    findById: jest.fn(),
  };

  // ✅ ONLY generator needed now
  const mockInvoiceNumberGenerator = {
    generate: jest.fn().mockResolvedValue("POS-2026-000001"),
  };

  const useCase = new CheckoutUseCase(
    mockStockRepo,
    mockSaleRepo,
    mockPaymentRepo,
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
        type: PaymentMethod.CASH,
        amount: 200,
      },
    });

    expect(result.sale).toBeDefined();
    expect(result.total).toBe(200);

    expect(result.invoiceNumber).toBe("POS-2026-000001");
  });
});