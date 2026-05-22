import { Customer } from "../../domain/customers/Customer";

export class AccountsReceivableService {
  constructor(
    private readonly customerRepo: {
      findById(id: string): Promise<Customer | null>;
      save(customer: Customer): Promise<void>;
    }
  ) {}

  // =====================
  // ADD CREDIT
  // =====================

  async addCredit(customerId: string, amount: number): Promise<void> {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    const customer = await this.customerRepo.findById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    // FIX: use correct domain method
    customer.addCredit(amount);

    await this.customerRepo.save(customer);
  }

  // =====================
  // REDUCE CREDIT
  // =====================

  async reduceCredit(customerId: string, amount: number): Promise<void> {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    const customer = await this.customerRepo.findById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    // FIX: use correct domain method
    customer.deductCredit(amount);

    await this.customerRepo.save(customer);
  }

  // =====================
  // OUTSTANDING BALANCE
  // =====================

  async getOutstanding(customerId: string): Promise<number> {
    const customer = await this.customerRepo.findById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer.creditBalance;
  }
}