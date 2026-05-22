import { Customer } from "../../domain/customers/Customer";

export class ReceiveCustomerPaymentUseCase {
  constructor(
    private readonly customerRepo: {
      findById(id: string): Promise<Customer | null>;
      save(customer: Customer): Promise<void>;
    },
    private readonly receiptRepo?: {
      save(data: any): Promise<void>;
    }
  ) {}

  // =====================
  // EXECUTE PAYMENT FLOW
  // =====================

  async execute(input: {
    customerId: string;
    amount: number;
    paymentMethod: "CASH" | "CARD" | "BANK";
  }) {
    const { customerId, amount, paymentMethod } = input;

    // =====================
    // 1. VALIDATION
    // =====================

    if (amount <= 0) {
      throw new Error("Payment amount must be greater than 0");
    }

    const customer = await this.customerRepo.findById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    // =====================
    // 2. CREDIT REDUCTION
    // =====================

    customer.deductCredit(amount);

    await this.customerRepo.save(customer);

    // =====================
    // 3. RECEIPT GENERATION
    // =====================

    const receipt = {
      id: crypto.randomUUID(),
      customerId: customer.id,
      amount,
      paymentMethod,
      remainingCredit: customer.creditBalance,
      createdAt: new Date(),
    };

    if (this.receiptRepo) {
      await this.receiptRepo.save(receipt);
    }

    // =====================
    // 4. RETURN RESPONSE
    // =====================

    return {
      message: "Payment received successfully",
      receipt,
    };
  }
}