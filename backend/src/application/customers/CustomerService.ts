import { Customer } from "../../domain/customers/Customer";

type CustomerRepository = {
  findById(id: string): Promise<Customer | null>;
  save(customer: Customer): Promise<void>;
};

export class CustomerService {
  constructor(
    private readonly customerRepo: CustomerRepository
  ) {}

  // =====================================
  // GET CUSTOMER
  // =====================================

  async getCustomer(customerId: string): Promise<Customer> {
    const customer =
      await this.customerRepo.findById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer;
  }

  // =====================================
  // ADD CUSTOMER CREDIT
  // =====================================

  async addCredit(
    customerId: string,
    amount: number
  ): Promise<void> {
    const customer =
      await this.getCustomer(customerId);

    customer.addCredit(amount);

    await this.customerRepo.save(customer);
  }

  // =====================================
  // REDUCE CUSTOMER CREDIT
  // =====================================

  async reduceCredit(
    customerId: string,
    amount: number
  ): Promise<void> {
    const customer =
      await this.getCustomer(customerId);

    customer.deductCredit(amount);

    await this.customerRepo.save(customer);
  }

  // =====================================
  // LOYALTY EARN
  // =====================================

  async earnLoyalty(
    customerId: string,
    saleAmount: number
  ): Promise<void> {
    const customer =
      await this.getCustomer(customerId);

    customer.earnLoyaltyFromSale(saleAmount);

    await this.customerRepo.save(customer);
  }

  // =====================================
  // LOYALTY REDEEM
  // =====================================

  async redeemLoyalty(
    customerId: string,
    points: number
  ): Promise<void> {
    const customer =
      await this.getCustomer(customerId);

    customer.redeemLoyalty(points);

    await this.customerRepo.save(customer);
  }

  // =====================================
  // OUTSTANDING CREDIT
  // =====================================

  async getOutstanding(
    customerId: string
  ): Promise<number> {
    const customer =
      await this.getCustomer(customerId);

    return customer.creditBalance;
  }

  // =====================================
  // CUSTOMER STATUS
  // =====================================

  async isBlocked(
    customerId: string
  ): Promise<boolean> {
    const customer =
      await this.getCustomer(customerId);

    return customer.isBlocked();
  }
}