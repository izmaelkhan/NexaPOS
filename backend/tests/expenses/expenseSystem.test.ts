import { Expense } from "../../src/domain/expenses/Expense";
import { CreateExpenseUseCase } from "../../src/application/expenses/CreateExpenseUseCase";

describe("Expense System", () => {

  const expenseRepository = {
    save: jest.fn(),
  };

  const cashDrawerService = {
    registerExpense: jest.fn(),
  };

  const auditLogger = {
    log: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should reject zero expense", () => {

    expect(() =>
      new Expense({
        id: "E1",
        branchId: "B1",
        shiftId: "S1",
        categoryId: "CAT1",
        amount: 0,
        description: "Tea",
        createdBy: "U1",
        createdAt: new Date(),
      })
    ).toThrow("Expense amount must be greater than zero");

  });

  it("should reduce cash drawer after expense", async () => {

    const useCase = new CreateExpenseUseCase(
      expenseRepository,
      cashDrawerService as any,
      auditLogger
    );

    await useCase.execute({
      branchId: "B1",
      shiftId: "S1",
      categoryId: "CAT1",
      amount: 500,
      description: "Tea",
      createdBy: "U1",
    });

    expect(cashDrawerService.registerExpense)
      .toHaveBeenCalled();

  });

});