import { Customer, CustomerStatus } from "../../src/domain/customers/Customer";

describe("Customer Finance System", () => {
  
  // =====================
  // 1. CREDIT LIMIT EXCEEDED
  // =====================
  test("should reject credit beyond limit", () => {
    expect(() => {
      new Customer({
        id: "c1",
        name: "John",
        phone: "1234567890",
        creditLimit: 500,
        creditBalance: 600, // exceeds limit
      });
    }).toThrow("Credit balance cannot go below");
  });

  // =====================
  // 2. PAYMENT REDUCES CREDIT
  // =====================
  test("should reduce credit after payment", () => {
    const customer = new Customer({
      id: "c1",
      name: "John",
      phone: "1234567890",
      creditLimit: 1000,
      creditBalance: 500,
    });

    customer.deductCredit(200);

    expect(customer.creditBalance).toBe(300);
  });

  // =====================
  // 3. LOYALTY POINTS ADD
  // =====================
  test("should add loyalty points correctly", () => {
    const customer = new Customer({
      id: "c1",
      name: "John",
      phone: "1234567890",
    });

    customer.addLoyaltyPoints(100);

    expect(customer.loyaltyPoints).toBe(100);
  });

  // =====================
  // 4. BLOCKED CUSTOMER CANNOT BUY
  // =====================
  test("should block customer when credit exceeds limit", () => {
    const customer = new Customer({
      id: "c1",
      name: "John",
      phone: "1234567890",
      creditLimit: 500,
      creditBalance: 0,
    });

    // force over-credit
    customer.addCredit(600);

    expect(customer.isBlocked()).toBe(true);
    expect(customer.status).toBe(CustomerStatus.BLOCKED);
  });

});