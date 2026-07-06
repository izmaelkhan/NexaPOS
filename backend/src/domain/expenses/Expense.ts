import { ExpenseType } from "./ExpenseType";

export class Expense {
  constructor(
    public readonly id: string,
    public readonly branchId: string,
    public readonly shiftId: string,
    public readonly amount: number,
    public readonly type: ExpenseType,
    public readonly reason: string,
    public readonly createdAt: Date = new Date()
  ) {
    if (amount <= 0) {
      throw new Error("Expense must be greater than 0");
    }
  }

  isCashExpense(): boolean {
    return this.type === ExpenseType.CASH;
  }
}