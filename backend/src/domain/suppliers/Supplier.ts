export class Supplier {
  public readonly id: string;
  public name: string;
  public phone: string;
  public address: string;
  public balance: number; // payable amount (we owe supplier)

  constructor(params: {
    id: string;
    name: string;
    phone: string;
    address: string;
    balance?: number;
  }) {
    const {
      id,
      name,
      phone,
      address,
      balance = 0,
    } = params;

    // =====================
    // Business Rules
    // =====================

    if (!id) {
      throw new Error("Supplier id is required");
    }

    if (!name || name.trim().length < 2) {
      throw new Error("Supplier name is invalid");
    }

    if (!phone || phone.trim().length < 7) {
      throw new Error("Supplier phone is invalid");
    }

    if (!address || address.trim().length < 5) {
      throw new Error("Supplier address is invalid");
    }

    // supplier can have credit → positive payable allowed
    // negative means overpayment (not allowed in this model)
    if (balance < 0) {
      throw new Error("Supplier balance cannot be negative");
    }

    this.id = id;
    this.name = name;
    this.phone = phone;
    this.address = address;
    this.balance = balance;
  }

  // =====================
  // Domain Behaviors
  // =====================

  addPayable(amount: number) {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    this.balance += amount;
  }

  pay(amount: number) {
    if (amount <= 0) {
      throw new Error("Payment amount must be greater than 0");
    }

    if (amount > this.balance) {
      throw new Error("Payment exceeds supplier payable balance");
    }

    this.balance -= amount;
  }

  hasPendingBalance(): boolean {
    return this.balance > 0;
  }
}