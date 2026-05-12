export class Customer {
  public readonly id: string;
  public readonly name: string;
  public readonly phone: string;
  public readonly email?: string;

  public loyaltyPoints: number;
  public creditBalance: number;

  public readonly createdAt: Date;
  public updatedAt: Date;

  // business rule constraint (can be adjusted per business policy)
  private readonly creditLimit: number = -500;

  constructor(params: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    loyaltyPoints?: number;
    creditBalance?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    const {
      id,
      name,
      phone,
      email,
      loyaltyPoints = 0,
      creditBalance = 0,
      createdAt,
      updatedAt,
    } = params;

    if (!name || name.trim().length === 0) {
      throw new Error("Customer name cannot be empty");
    }

    if (!phone || phone.trim().length < 10) {
      throw new Error("Invalid phone number");
    }

    if (creditBalance < this.creditLimit) {
      throw new Error(`Credit balance cannot go below ${this.creditLimit}`);
    }

    this.id = id;
    this.name = name.trim();
    this.phone = phone.trim();
    this.email = email;

    this.loyaltyPoints = loyaltyPoints;
    this.creditBalance = creditBalance;

    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }

  addLoyaltyPoints(points: number) {
    if (points <= 0) throw new Error("Points must be positive");
    this.loyaltyPoints += points;
    this.touch();
  }

  deductCredit(amount: number) {
    if (amount <= 0) throw new Error("Amount must be positive");

    const newBalance = this.creditBalance - amount;

    if (newBalance < this.creditLimit) {
      throw new Error("Credit limit exceeded");
    }

    this.creditBalance = newBalance;
    this.touch();
  }

  addCredit(amount: number) {
    if (amount <= 0) throw new Error("Amount must be positive");
    this.creditBalance += amount;
    this.touch();
  }

  private touch() {
    this.updatedAt = new Date();
  }
}