import * as jwt from "jsonwebtoken";
import { PasswordService } from "../../infrastructure/security/PasswordService";
import { RolePermissions, hasPermission } from "../../domain/identity/RolePermissions";
import { PermissionType } from "../../domain/identity/Permission";
import { RoleType } from "../../domain/identity/Roles";

// TEMP repository contracts
interface UserRepository {
  findByEmail(email: string): Promise<any>;
}

interface UserBranchRepository {
  findByUserId(userId: string): Promise<
    {
      branchId: string;
      isMain?: boolean;
    }[]
  >;
}

export class LoginUseCase {
  constructor(
    private userRepo: UserRepository,
    private userBranchRepo: UserBranchRepository
  ) {}

  async execute(input: { email: string; password: string }) {
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
    // 4. Role logic
    // =====================
    const role = user.role as RoleType;

    if (!role) {
      throw new Error("Role not found for user");
    }

    const canCreateSale = hasPermission(role, PermissionType.CREATE_SALE);

    // =====================
    // 5. Branch context (NEW)
    // =====================
    const userBranches = await this.userBranchRepo.findByUserId(user.id);

    const allowedBranches = userBranches.map((b) => ({
      branchId: b.branchId,
      isMain: b.isMain ?? false,
    }));

    const activeBranch =
      allowedBranches.find((b) => b.isMain)?.branchId ||
      allowedBranches[0]?.branchId ||
      null;

    // =====================
    // 6. Generate JWT
    // =====================
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role,
        permissions: RolePermissions[role],
        activeBranch,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    // =====================
    // 7. Response
    // =====================
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role,
        canCreateSale,
      },

      allowedBranches,
      activeBranch,
    };
  }
}