export enum ExpenseCategoryType {
  ELECTRICITY = "ELECTRICITY",
  INTERNET = "INTERNET",
  TRANSPORT = "TRANSPORT",
  TEA = "TEA",
  CLEANING = "CLEANING",
  SALARY = "SALARY",
  RENT = "RENT",
  MISCELLANEOUS = "MISCELLANEOUS",
}

export class ExpenseCategory {
  constructor(
    public readonly id: string,
    public readonly name: ExpenseCategoryType
  ) {}

  static defaultCategories(): ExpenseCategory[] {
    return [
      new ExpenseCategory("CAT-001", ExpenseCategoryType.ELECTRICITY),
      new ExpenseCategory("CAT-002", ExpenseCategoryType.INTERNET),
      new ExpenseCategory("CAT-003", ExpenseCategoryType.TRANSPORT),
      new ExpenseCategory("CAT-004", ExpenseCategoryType.TEA),
      new ExpenseCategory("CAT-005", ExpenseCategoryType.CLEANING),
      new ExpenseCategory("CAT-006", ExpenseCategoryType.SALARY),
      new ExpenseCategory("CAT-007", ExpenseCategoryType.RENT),
      new ExpenseCategory("CAT-008", ExpenseCategoryType.MISCELLANEOUS),
    ];
  }

  static exists(category: ExpenseCategoryType): boolean {
    return Object.values(ExpenseCategoryType).includes(category);
  }
}