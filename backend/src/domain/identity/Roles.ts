export enum RoleType {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  CASHIER = "CASHIER",
}

export class Role {
  public readonly id: string;
  public readonly name: RoleType;

  constructor(params: {
    id: string;
    name: RoleType;
  }) {
    const { id, name } = params;

    // =====================
    // Business Rules
    // =====================

    if (!Object.values(RoleType).includes(name)) {
      throw new Error("Invalid role type");
    }

    this.id = id;
    this.name = name;
  }

  isAdmin(): boolean {
    return this.name === RoleType.ADMIN;
  }

  isManager(): boolean {
    return this.name === RoleType.MANAGER;
  }

  isCashier(): boolean {
    return this.name === RoleType.CASHIER;
  }
}