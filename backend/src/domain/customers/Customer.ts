export enum CustomerStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export class Customer {
  public readonly id: string;
  public readonly name: string;
  public readonly phone: string;
  public readonly email?: string;

  private _loyaltyPoints: number;
  public creditBalance: number;
  public creditLimit: number;

  public status: CustomerStatus;

  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(params: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    loyaltyPoints?: number;
    creditBalance?: number;
    creditLimit?: number;
    status?: CustomerStatus;
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
      creditLimit = 0,
      status = CustomerStatus.ACTIVE,
      createdAt,
      updatedAt,
    } = params;

    if (!name || name.trim().length === 0) {
      throw new Error("Customer name cannot be empty");
    }

    if (!phone || phone.trim().length < 10) {
      throw new Error("Invalid phone number");
    }

    this.id = id;
    this.name = name.trim();
    this.phone = phone.trim();
    this.email = email;

    this._loyaltyPoints = loyaltyPoints;
    this.creditLimit = creditLimit;

    // ✅ IMPORTANT: validate at creation (THIS FIXES YOUR ERROR)
    if (creditBalance > creditLimit) {
      throw new Error("Credit balance cannot go below");
    }

    this.creditBalance = creditBalance;
    this.status = status;

    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();

    this.evaluateBlocking();
  }

  // =====================
  // LOYALTY
  // =====================
  addLoyaltyPoints(points: number) {
    if (points <= 0) throw new Error("Points must be positive");

    this._loyaltyPoints += points;
    this.touch();
  }

  get loyaltyPoints(): number {
    return this._loyaltyPoints;
  }

  // =====================
  // CREDIT
  // =====================
  addCredit(amount: number) {
    if (amount <= 0) throw new Error("Amount must be positive");

    this.creditBalance += amount;

    this.evaluateBlocking();
    this.touch();
  }

  deductCredit(amount: number) {
    if (amount <= 0) throw new Error("Amount must be positive");

    this.creditBalance -= amount;

    if (this.creditBalance < 0) {
      this.creditBalance = 0;
    }

    this.evaluateBlocking();
    this.touch();
  }

  // =====================
  // RULES
  // =====================
  isBlocked(): boolean {
    return this.status === CustomerStatus.BLOCKED;
  }

  private evaluateBlocking() {
    if (this.creditBalance > this.creditLimit) {
      this.status = CustomerStatus.BLOCKED;
    } else {
      this.status = CustomerStatus.ACTIVE;
    }
  }

  private touch() {
    this.updatedAt = new Date();
  }
}