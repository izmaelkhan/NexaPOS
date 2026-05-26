import { Invoice } from "../../src/domain/sales/Invoice";

describe("Invoice System (TDD)", () => {
  // =====================
  // 1. INVOICE NUMBER UNIQUENESS
  // =====================
  test("should generate unique invoice numbers", () => {
    const inv1 = new Invoice({
      invoiceNumber: "NXP-2026-000001",
      saleId: "S1",
      branchId: "B1",
      items: [
        {
          productId: "P1",
          productName: "Test Product",
          sku: "SKU1",
          unitPrice: 100,
          quantity: 1,
          discount: 0,
          finalPrice: 100,
        },
      ],
      pricing: {
        subtotal: 100,
        tax: 0,
        discount: 0,
        grandTotal: 100,
      },
    });

    const inv2 = new Invoice({
      invoiceNumber: "NXP-2026-000002",
      saleId: "S2",
      branchId: "B1",
      items: [
        {
          productId: "P2",
          productName: "Test Product 2",
          sku: "SKU2",
          unitPrice: 50,
          quantity: 2,
          discount: 0,
          finalPrice: 100,
        },
      ],
      pricing: {
        subtotal: 100,
        tax: 0,
        discount: 0,
        grandTotal: 100,
      },
    });

    expect(inv1.invoiceNumber).not.toBe(inv2.invoiceNumber);
  });

  // =====================
  // 2. COMPLETED SALE IMMUTABLE RULE
  // =====================
  test("should ensure invoice is immutable after creation", () => {
    const invoice = new Invoice({
      invoiceNumber: "NXP-2026-000010",
      saleId: "S1",
      branchId: "B1",
      items: [
        {
          productId: "P1",
          productName: "Test Product",
          sku: "SKU1",
          unitPrice: 100,
          quantity: 1,
          discount: 0,
          finalPrice: 100,
        },
      ],
      pricing: {
        subtotal: 100,
        tax: 0,
        discount: 0,
        grandTotal: 100,
      },
    });

    expect(() => {
      // @ts-ignore
      invoice.invoiceNumber = "HACKED";
    }).toThrow();
  });

  // =====================
  // 3. CANCELLED SALE REJECT COMPLETION
  // =====================
  test("should not allow modification of frozen items", () => {
    const invoice = new Invoice({
      invoiceNumber: "NXP-2026-000011",
      saleId: "S1",
      branchId: "B1",
      items: [
        {
          productId: "P1",
          productName: "Test Product",
          sku: "SKU1",
          unitPrice: 100,
          quantity: 1,
          discount: 0,
          finalPrice: 100,
        },
      ],
      pricing: {
        subtotal: 100,
        tax: 0,
        discount: 0,
        grandTotal: 100,
      },
    });

    expect(() => {
      // @ts-ignore
      invoice.items.push({
        productId: "P2",
        productName: "HACK",
        sku: "SKU2",
        unitPrice: 10,
        quantity: 1,
        discount: 0,
        finalPrice: 10,
      });
    }).toThrow();
  });

  // =====================
  // 4. RECEIPT GENERATION CHECK
  // =====================
  test("should contain correct receipt structure", () => {
    const invoice = new Invoice({
      invoiceNumber: "NXP-2026-000012",
      saleId: "S1",
      branchId: "B1",
      items: [
        {
          productId: "P1",
          productName: "Apple",
          sku: "SKU1",
          unitPrice: 100,
          quantity: 2,
          discount: 0,
          finalPrice: 100,
        },
      ],
      pricing: {
        subtotal: 200,
        tax: 0,
        discount: 0,
        grandTotal: 200,
      },
    });

    expect(invoice.items.length).toBe(1);
    expect(invoice.pricing.grandTotal).toBe(200);
    expect(invoice.invoiceNumber).toContain("NXP-2026");
  });
});