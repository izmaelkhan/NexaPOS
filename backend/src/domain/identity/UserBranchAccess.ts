import { RoleType } from "./Roles";

export class UserBranchAccess {
  public readonly userId: string;
  public readonly branchId: string;
  public readonly role: RoleType;

  constructor(params: {
    userId: string;
    branchId: string;
    role: RoleType;
  }) {
    const { userId, branchId, role } = params;

    if (!userId) {
      throw new Error("UserId is required");
    }

    if (!branchId) {
      throw new Error("BranchId is required");
    }

    this.userId = userId;
    this.branchId = branchId;
    this.role = role;
  }

  // =====================
  // Role Rules
  // =====================

  canAccessBranch(targetBranchId: string): boolean {
    // ADMIN → all branches
    if (this.role === RoleType.ADMIN) {
      return true;
    }

    // MANAGER → assigned branch only
    if (this.role === RoleType.MANAGER) {
      return this.branchId === targetBranchId;
    }

    // CASHIER → single branch only
    if (this.role === RoleType.CASHIER) {
      return this.branchId === targetBranchId;
    }

    return false;
  }

  isAdmin(): boolean {
    return this.role === RoleType.ADMIN;
  }

  isManager(): boolean {
    return this.role === RoleType.MANAGER;
  }

  isCashier(): boolean {
    return this.role === RoleType.CASHIER;
  }
}