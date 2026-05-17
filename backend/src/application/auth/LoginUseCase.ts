import * as jwt from "jsonwebtoken";
import { PasswordService } from "../../infrastructure/security/PasswordService";
import { RolePermissions, hasPermission } from "../../domain/identity/RolePermissions";
import { PermissionType } from "../../domain/identity/Permission";
import { RoleType } from "../../domain/identity/Roles";

interface UserRepository {
  findByEmail(email: string): Promise<any>;
}

export class LoginUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(input: { email: string; password: string }) {
    const { email, password } = input;

    const user = await this.userRepo.findByEmail(email);

    if (!user) throw new Error("Invalid credentials");

    if (!user.isActive) throw new Error("User is inactive");

    const isValid = await PasswordService.comparePassword(
      password,
      user.passwordHash
    );

    if (!isValid) throw new Error("Invalid credentials");

    // ✅ FIXED: direct role usage
    const role = user.role as RoleType;

    const canCreateSale = hasPermission(role, PermissionType.CREATE_SALE);

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role,
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
        role,
        canCreateSale,
      },
    };
  }
}