export enum CustomerStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export class Customer {
  public readonly id: string;
  public readonly name: string;
  public readonly phone: string;
  public readonly email?: string;

  /**
   * IMPORTANT:
   * No public manual editing allowed
   */
  private _loyaltyPoints: number;
  private _creditBalance: number;

  public readonly creditLimit: number;

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

    if (creditBalance > creditLimit) {
      throw new Error(
        "Credit balance cannot go below credit limit"
      );
    }

    this.id = id;
    this.name = name.trim();
    this.phone = phone.trim();
    this.email = email;

    this._loyaltyPoints = loyaltyPoints;
    this._creditBalance = creditBalance;

    this.creditLimit = creditLimit;
    this.status = status;

    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();

    this.evaluateBlocking();
  }

  // =====================================
  // SAFE READ-ONLY ACCESS
  // =====================================

  get loyaltyPoints(): number {
    return this._loyaltyPoints;
  }

  get creditBalance(): number {
    return this._creditBalance;
  }

  // =====================================
  // LOYALTY RULES
  // loyalty ONLY per transaction
  // =====================================

  earnLoyaltyFromSale(saleAmount: number) {
    if (saleAmount <= 0) {
      throw new Error("Invalid sale amount");
    }

    const earnedPoints = Math.floor(saleAmount * 0.01);

    this._loyaltyPoints += earnedPoints;

    this.touch();
  }

  redeemLoyalty(points: number) {
    if (points <= 0) {
      throw new Error("Invalid loyalty points");
    }

    if (points > this._loyaltyPoints) {
      throw new Error("Insufficient loyalty points");
    }

    this._loyaltyPoints -= points;

    this.touch();
  }

  // =====================================
  // CREDIT RULES
  // credit ONLY customer-based
  // =====================================

  addCredit(amount: number) {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    this._creditBalance += amount;

    this.evaluateBlocking();
    this.touch();
  }

  deductCredit(amount: number) {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    this._creditBalance -= amount;

    if (this._creditBalance < 0) {
      this._creditBalance = 0;
    }

    this.evaluateBlocking();
    this.touch();
  }

  // =====================================
  // SECURITY LOCK
  // =====================================

  updateBalanceManually(): never {
    throw new Error(
      "Manual balance editing is prohibited"
    );
  }

  updateLoyaltyManually(): never {
    throw new Error(
      "Manual loyalty editing is prohibited"
    );
  }

  // =====================================
  // STATUS RULES
  // =====================================

  isBlocked(): boolean {
    return this.status === CustomerStatus.BLOCKED;
  }

  canCheckout(): boolean {
    return this.status === CustomerStatus.ACTIVE;
  }

  private evaluateBlocking() {
    if (this._creditBalance > this.creditLimit) {
      this.status = CustomerStatus.BLOCKED;
    } else {
      this.status = CustomerStatus.ACTIVE;
    }
  }

  private touch() {
    this.updatedAt = new Date();
  }
}