import { Customer } from "../../domain/customers/Customer";

export class CustomerReportingService {
  constructor(
    private readonly customerRepo: {
      findAll(): Promise<Customer[]>;
    }
  ) {}

  // =====================
  // 1. OUTSTANDING REPORT
  // =====================
  async getOutstandingReport() {
    const customers = await this.customerRepo.findAll();

    return customers
      .filter((c) => c.creditBalance > 0)
      .map((c) => ({
        customerId: c.id,
        name: c.name,
        phone: c.phone,
        creditBalance: c.creditBalance,
        status: c.status,
      }))
      .sort((a, b) => b.creditBalance - a.creditBalance);
  }

  // =====================
  // 2. TOP CREDIT CUSTOMERS
  // =====================
  async getTopCreditCustomers(limit = 10) {
    const customers = await this.customerRepo.findAll();

    return customers
      .filter((c) => c.creditBalance > 0)
      .sort((a, b) => b.creditBalance - a.creditBalance)
      .slice(0, limit)
      .map((c) => ({
        customerId: c.id,
        name: c.name,
        creditBalance: c.creditBalance,
      }));
  }

  // =====================
  // 3. LOYALTY USAGE REPORT
  // =====================
  async getLoyaltyUsageReport() {
    const customers = await this.customerRepo.findAll();

    const totalPointsIssued = customers.reduce(
      (sum, c) => sum + c.loyaltyPoints,
      0
    );

    const activeCustomers = customers.filter(
      (c) => c.loyaltyPoints > 0
    ).length;

    const avgPoints =
      customers.length > 0
        ? totalPointsIssued / customers.length
        : 0;

    return {
      totalPointsIssued,
      activeCustomers,
      averagePointsPerCustomer: avgPoints,
    };
  }
}