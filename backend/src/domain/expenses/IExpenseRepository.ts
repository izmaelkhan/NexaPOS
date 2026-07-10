import { Expense } from "./Expense";

export interface IExpenseRepository {
  /**
   * Save a new expense
   */
  save(expense: Expense): Promise<void>;

  /**
   * Find expense by ID
   */
  findById(id: string): Promise<Expense | null>;

  /**
   * Get all expenses for a shift
   */
  findByShift(shiftId: string): Promise<Expense[]>;

  /**
   * Get expenses created on a specific date
   */
  findByDate(date: Date): Promise<Expense[]>;

  /**
   * Get all expenses
   */
  findAll(): Promise<Expense[]>;
}