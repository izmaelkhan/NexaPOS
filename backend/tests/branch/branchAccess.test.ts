import { RoleType } from "../../src/domain/identity/Roles";
import { UserBranchAccess } from "../../src/domain/identity/UserBranchAccess";

describe("Branch Access Control", () => {
  it("should block user from unauthorized branch", () => {
    const access = new UserBranchAccess({
      userId: "u1",
      branchId: "B1",
      role: RoleType.CASHIER,
    });

    const result = access.canAccessBranch("B2");

    expect(result).toBe(false);
  });

  it("should allow admin to access any branch", () => {
    const access = new UserBranchAccess({
      userId: "admin",
      branchId: "B1",
      role: RoleType.ADMIN,
    });

    expect(access.canAccessBranch("B99")).toBe(true);
  });
});