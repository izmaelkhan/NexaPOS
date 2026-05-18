import { Product } from "../../src/domain/catalog/Product";

describe("Product Domain", () => {

  test("should reject invalid price (price <= 0)", () => {
    expect(() => {
      new Product({
        id: "1",
        name: "Test Product",
        sku: "SKU-1",
        price: 0,
        costPrice: 10,
        stock: 5,
        categoryId: "cat-1"
      });
    }).toThrow("Product price must be greater than 0");
  });

  test("should reject negative stock", () => {
    expect(() => {
      new Product({
        id: "1",
        name: "Test Product",
        sku: "SKU-1",
        price: 100,
        costPrice: 50,
        stock: -5,
        categoryId: "cat-1"
      });
    }).toThrow("Stock cannot be negative");
  });

  test("should allow valid product creation", () => {
    const product = new Product({
      id: "1",
      name: "Valid Product",
      sku: "SKU-1",
      price: 100,
      costPrice: 50,
      stock: 10,
      categoryId: "cat-1"
    });

    expect(product.price).toBe(100);
    expect(product.stock).toBe(10);
  });

});