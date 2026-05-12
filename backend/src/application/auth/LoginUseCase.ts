import * as jwt from "jsonwebtoken";
import { PasswordService } from "../../infrastructure/security/PasswordService";
import { RolePermissions, hasPermission } from "../../domain/identity/RolePermissions";
import { PermissionType } from "../../domain/identity/Permission";

// TEMP interface (replace with repository later)
interface UserRepository {
  findByEmail(email: string): Promise<any>;
}

export class LoginUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(input: {
    email: string;
    password: string;
  }) {
    const { email, password } = input;

    // =====================
    // 1. Find user
    // =====================
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // =====================
    // 2. Check active
    // =====================
    if (!user.isActive) {
      throw new Error("User is inactive");
    }

    // =====================
    // 3. Verify password
    // =====================
    const isValid = await PasswordService.comparePassword(
      password,
      user.passwordHash
    );

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    // =====================
    // 4. Role check (basic RBAC example)
    // =====================
    const role = user.role; // assume RoleType string

    const canCreateSale = hasPermission(role, PermissionType.CREATE_SALE);

    // =====================
    // 5. Generate token
    // =====================
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        permissions: RolePermissions[role],
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        canCreateSale,
      },
    };
  }
}