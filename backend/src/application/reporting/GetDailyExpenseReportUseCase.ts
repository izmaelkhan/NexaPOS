type DailyExpenseReport = {
  expenses: number;
  count: number;
};
export class GetDailyExpenseReportUseCase {
  constructor(
    private readonly expenseRepository: {
      findByDate(date: Date): Promise<
        {
          amount: number;
        }[]
      >;
    }
  ) {}

  async execute(
    date: Date = new Date()
  ): Promise<DailyExpenseReport> {
    const expenses =
      await this.expenseRepository.findByDate(date);

    let totalExpenses = 0;

    for (const expense of expenses) {
      totalExpenses += expense.amount;
    }

    return {
      expenses: totalExpenses,
      count: expenses.length,
    };
  }
}