export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly passwordHash: string;
  public readonly roleId: string;
  public isActive: boolean;

  constructor(params: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    roleId: string;
    isActive?: boolean;
  }) {
    const { id, name, email, passwordHash, roleId, isActive = true } = params;

    // =====================
    // Business Rules
    // =====================

    if (!email.includes("@")) {
      throw new Error("Invalid email format");
    }

    if (!passwordHash || passwordHash.length < 10) {
      throw new Error("Password must be properly hashed");
    }

    this.id = id;
    this.name = name;
    this.email = email.toLowerCase();
    this.passwordHash = passwordHash;
    this.roleId = roleId;
    this.isActive = isActive;
  }

  // =====================
  // Domain Behaviors
  // =====================

  deactivate() {
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
  }

  canLogin(): boolean {
    return this.isActive;
  }

  updateName(name: string) {
    if (!name || name.trim().length < 2) {
      throw new Error("Name too short");
    }

    (this as any).name = name;
  }
}