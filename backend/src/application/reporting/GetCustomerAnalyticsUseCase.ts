export interface CustomerAnalyticsDto {
  totalCustomers: number;
  newCustomers: number;
  repeatCustomers: number;
  customersWithOutstandingCredit: number;
}

export class GetCustomerAnalyticsUseCase {
  constructor(
    private readonly customerRepository: {
      countAll(): Promise<number>;
      countNewSince(date: Date): Promise<number>;
      countRepeatSince(date: Date): Promise<number>;
      countOutstandingCredit(): Promise<number>;
    }
  ) {}

  async execute(since: Date = new Date()): Promise<CustomerAnalyticsDto> {
    const [total, newCust, repeatCust, outstanding] = await Promise.all([
      this.customerRepository.countAll(),
      this.customerRepository.countNewSince(since),
      this.customerRepository.countRepeatSince(since),
      this.customerRepository.countOutstandingCredit(),
    ]);

    return {
      totalCustomers: total,
      newCustomers: newCust,
      repeatCustomers: repeatCust,
      customersWithOutstandingCredit: outstanding,
    };
  }
}