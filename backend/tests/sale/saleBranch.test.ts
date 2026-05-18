import { Sale } from "../../src/domain/sales/Sale";

describe("Sale Branch Requirement", () => {
  it("should require branchId for sale creation", () => {
    expect(() => {
      new Sale({
        id: "s1",
        customerId: "c1",
        branchId: "", // invalid
        totalAmount: 100,
        saleItems: [],
      } as any);
    }).toThrow("BranchId is required");
  });
});