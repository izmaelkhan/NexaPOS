import crypto from "crypto";

import { Expense } from "../../domain/expenses/Expense";
import { AuditEventType } from "../../shared/audit/AuditEventType";
import { CashDrawerService } from "../shifts/CashDrawerService";

type CreateExpenseInput = {
  branchId: string;
  shiftId: string;
  categoryId: string;
  amount: number;
  description: string;
  createdBy: string;
};

export class CreateExpenseUseCase {
  constructor(
  private readonly expenseRepository: {
    save(expense: Expense): Promise<void>;
  },

  private readonly cashDrawerService: CashDrawerService,

  private readonly auditLogger?: {
    log(event: any): void;
  }
) {}

  async execute(input: CreateExpenseInput) {
    // =====================================
    // VALIDATION
    // =====================================

    if (!input.branchId) {
      throw new Error("Branch is required");
    }

    if (!input.shiftId) {
      throw new Error("Shift is required");
    }

    if (!input.categoryId) {
      throw new Error("Category is required");
    }

    if (!input.createdBy) {
      throw new Error("CreatedBy is required");
    }

    if (input.amount <= 0) {
      throw new Error("Expense amount must be greater than zero");
    }

    // =====================================
    // CREATE EXPENSE
    // =====================================

    const expense = new Expense({
      id: crypto.randomUUID(),
      branchId: input.branchId,
      shiftId: input.shiftId,
      categoryId: input.categoryId,
      amount: input.amount,
      description: input.description,
      createdBy: input.createdBy,
      createdAt: new Date(),
    });

    // =====================================
    // SAVE EXPENSE
    // =====================================

    await this.expenseRepository.save(expense);

    expense.markAsSaved();

    // =====================================
    // REDUCE CASH DRAWER
    // =====================================

    await this.cashDrawerService.registerExpense({
  shiftId: input.shiftId,
  amount: input.amount,
  expenseId: expense.id,
  description: input.description,
});

    // =====================================
    // AUDIT EVENT
    // =====================================

    this.auditLogger?.log({
      type: AuditEventType.EXPENSE_CREATED,
      timestamp: new Date(),
      data: {
        expenseId: expense.id,
        branchId: expense.branchId,
        shiftId: expense.shiftId,
        categoryId: expense.categoryId,
        amount: expense.amount,
        createdBy: expense.createdBy,
      },
    });

    return {
      success: true,
      expense,
    };
  }
}