import { PaymentMethod } from "../../src/domain/payments/Payments";
import { SplitPayment } from "../../src/domain/payments/SplitPayment";
import { PaymentValidator } from "../../src/application/payments/PaymentValidator";
import { RefundIntegrationService } from "../../src/application/payments/RefundIntegrationService";

describe("Payment System (TDD)", () => {
  // =========================
  // MOCKS
  // =========================
  const paymentRepo = {
    findBySaleId: jest.fn(),
    create: jest.fn(),
  };

  const stockRepo = {
    createMovement: jest.fn(),
  };

  const ledgerRepo = {
    createEntry: jest.fn(),
  };

  const auditLogger = {
    log: jest.fn(),
  };

  // =========================
  // 1. SPLIT PAYMENT VALID
  // =========================
  test("split payment valid", () => {
    const split = new SplitPayment({
      saleId: "S1",
      totalAmount: 1000,
      payments: [
        { method: PaymentMethod.CASH, amount: 500 },
        { method: PaymentMethod.CARD, amount: 300 },
        { method: PaymentMethod.CREDIT, amount: 200 },
      ],
    });

    expect(split.validate()).toBe(true);
  });

  // =========================
  // 2. MISMATCH PAYMENT REJECTED
  // =========================
  test("mismatch payment rejected", () => {
    const validator = new PaymentValidator();

    expect(() =>
      validator.validate({
        saleId: "S1",
        totalAmount: 1000,
        payments: [
          { method: PaymentMethod.CASH, amount: 400 },
          { method: PaymentMethod.CARD, amount: 300 },
        ],
      })
    ).toThrow("Payment mismatch");
  });

  // =========================
  // 3. CREDIT PAYMENT HANDLED
  // =========================
  test("credit payment handled correctly", () => {
    const validator = new PaymentValidator();

    const result = validator.validate({
      saleId: "S1",
      totalAmount: 1000,
      payments: [
        { method: PaymentMethod.CREDIT, amount: 1000 },
      ],
    });

    expect(result.creditAmount).toBe(1000);
    expect(result.requiresReceivable).toBe(true);
  });

  // =========================
  // 4. REFUND REVERSES CORRECTLY
  // =========================
  test("refund reverses correctly", async () => {
const refundService =
      new RefundIntegrationService(
        paymentRepo,
        stockRepo,
        ledgerRepo,
        auditLogger
      );

    paymentRepo.findBySaleId.mockResolvedValue([
      {
        paymentId: "P1",
        saleId: "S1",
        amount: 1000,
      },
    ]);

    const result =
      await refundService.processRefund({
        saleId: "S1",
        amount: 200,
      });

    expect(result.success).toBe(true);

    expect(paymentRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: -200,
      })
    );

    expect(stockRepo.createMovement).toHaveBeenCalled();
    expect(ledgerRepo.createEntry).toHaveBeenCalled();
    expect(auditLogger.log).toHaveBeenCalled();
  });
});