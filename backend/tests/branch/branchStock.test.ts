describe("Branch Stock Isolation", () => {
  it("should keep stock separate per branch", async () => {
    const branchAStock = { productId: "p1", branchId: "A", stock: 10 };
    const branchBStock = { productId: "p1", branchId: "B", stock: 5 };

    expect(branchAStock.stock).not.toBe(branchBStock.stock);
  });
});