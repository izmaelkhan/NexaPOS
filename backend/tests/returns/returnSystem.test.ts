import { CreateReturnUseCase } from "../../src/application/returns/CreateReturnUseCase";
import { ApproveReturnUseCase } from "../../src/application/returns/ApproveReturnUseCase";
import { CompleteReturnUseCase } from "../../src/application/returns/CompleteReturnUseCase";
import { ReturnStatus } from "../../src/domain/returns/Return";

describe("Return System (TDD)", () => {
  const mockSaleRepo = {
    findById: jest.fn(),
  };

  const mockReturnRepo = {
    findById: jest.fn(),
    save: jest.fn(),
  };

  const mockStockRepo = {
    createMovement: jest.fn(),
  };

  const mockPaymentRepo = {
    create: jest.fn(),
  };

  const mockLedgerRepo = {
    createEntry: jest.fn(),
  };

  const mockAuditLogger = {
    log: jest.fn(),
  };

  // =========================
  // 1. VALID RETURN ACCEPTED
  // =========================
  it("should accept valid return request", async () => {
    mockSaleRepo.findById.mockResolvedValue({
      id: "S1",
      branchId: "B1",
      items: [
        { productId: "P1", quantity: 2, unitPrice: 100, refundAmount: 200 },
      ],
      createdAt: new Date(),
    });

    const useCase = new CreateReturnUseCase(mockSaleRepo, mockReturnRepo);

    const result = await useCase.execute({
      saleId: "S1",
      items: [{ productId: "P1", quantity: 1 }],
      reason: "damaged",
    });

    expect(result.returnId).toBeDefined();
  });

  // =========================
  // 2. EXCESS QUANTITY REJECTED
  // =========================
  it("should reject excess quantity", async () => {
    mockSaleRepo.findById.mockResolvedValue({
      id: "S1",
      items: [{ productId: "P1", quantity: 2 }],
    });

    const useCase = new CreateReturnUseCase(mockSaleRepo, mockReturnRepo);

    await expect(
      useCase.execute({
        saleId: "S1",
        items: [{ productId: "P1", quantity: 10 }],
      })
    ).rejects.toThrow("Return quantity exceeds sold quantity");
  });

  // =========================
  // 3. EXPIRED RETURN REJECTED
  // =========================
  it("should reject expired return", async () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 10);

    mockSaleRepo.findById.mockResolvedValue({
      id: "S1",
      createdAt: oldDate,
      items: [{ productId: "P1", quantity: 2 }],
    });

    const useCase = new CreateReturnUseCase(mockSaleRepo, mockReturnRepo);

    await expect(
      useCase.execute({
        saleId: "S1",
        items: [{ productId: "P1", quantity: 1 }],
      })
    ).rejects.toThrow("Return window expired");
  });

  // =========================
  // 4. STOCK RESTORED ON COMPLETION
  // =========================
  it("should restore stock on completion", async () => {
    mockReturnRepo.findById.mockResolvedValue({
      id: "R1",
      saleId: "S1",
      branchId: "B1",
      status: ReturnStatus.APPROVED,
      items: [
        { productId: "P1", quantity: 2, refundAmount: 200 },
      ],
      complete: jest.fn(),
    });

    const useCase = new CompleteReturnUseCase(
      mockReturnRepo,
      mockStockRepo,
      mockPaymentRepo,
      mockLedgerRepo,
      mockAuditLogger
    );

    await useCase.execute("R1");

    expect(mockStockRepo.createMovement).toHaveBeenCalled();
  });

  // =========================
  // 5. REFUND CREATED
  // =========================
  it("should create refund on completion", async () => {
    mockReturnRepo.findById.mockResolvedValue({
      id: "R2",
      saleId: "S1",
      branchId: "B1",
      status: ReturnStatus.APPROVED,
      items: [
        { productId: "P1", quantity: 1, refundAmount: 100 },
      ],
      complete: jest.fn(),
    });

    const useCase = new CompleteReturnUseCase(
      mockReturnRepo,
      mockStockRepo,
      mockPaymentRepo,
      mockLedgerRepo,
      mockAuditLogger
    );

    await useCase.execute("R2");

    expect(mockPaymentRepo.create).toHaveBeenCalled();
  });
});