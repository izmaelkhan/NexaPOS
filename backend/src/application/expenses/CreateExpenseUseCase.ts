import { ExpenseType } from "../../domain/expenses/ExpenseType";
import { Expense } from "../../domain/expenses/Expense";

export class CreateExpenseUseCase {
  constructor(
    private readonly expenseRepo: {
      save(expense: Expense): Promise<void>;
    },

    private readonly shiftRepo: {
      addExpenseToShift(
        shiftId: string,
        amount: number
      ): Promise<void>;
    },

    private readonly cashDrawerService: {
      removeCash(amount: number, reason?: string): Promise<void>;
    }
  ) {}

  async execute(input: {
    id: string;
    branchId: string;
    shiftId: string;
    amount: number;
    type: ExpenseType;
    reason: string;
  }) {
    // =========================
    // CREATE EXPENSE
    // =========================
    const expense = new Expense(
      input.id,
      input.branchId,
      input.shiftId,
      input.amount,
      input.type,
      input.reason
    );

    // =========================
    // SHIFT RECORD
    // =========================
    await this.shiftRepo.addExpenseToShift(
      input.shiftId,
      input.amount
    );

    // =========================
    // CASH DRAWER IMPACT
    // =========================
    if (expense.isCashExpense()) {
      await this.cashDrawerService.removeCash(
        input.amount,
        input.reason
      );
    }

    // =========================
    // SAVE EXPENSE
    // =========================
    await this.expenseRepo.save(expense);

    return {
      success: true,
      expenseId: expense.id,
    };
  }
}