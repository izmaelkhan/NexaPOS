// Import the generated Prisma client. The client is generated under the
// "generated/prisma" directory relative to the project root.
import { PrismaClient, Prisma } from "../../generated/prisma/client";

export const prisma = new PrismaClient({
  log: ["query", "error"],
  accelerateUrl: "",
});

// =====================
// Repository Interfaces
// =====================

export interface IProductRepository {
  // Define product repository methods here
}

export interface ICustomerRepository {
  // Define customer repository methods here
}

export interface ISaleRepository {
  findByDate(date: Date): Promise<
    {
      totalAmount: number;
      payments?: { amount: number; type: string }[];
    }[]
  >;
}

export interface IExpenseRepository {
  findByDate(date: Date): Promise<
    {
      amount: number;
    }[]
  >;
}

export interface IInventoryRepository {
  findAll(): Promise<
    {
      productId: string;
      productName?: string;
      stock: number;
      reorderLevel: number;
    }[]
  >;
  getLowStock(): Promise<
    {
      productId: string;
      productName?: string;
      stock: number;
      reorderLevel: number;
    }[]
  >;
  countAllProducts(): Promise<number>;
  countOutOfStock(): Promise<number>;
  getLowStockCount(): Promise<number>;
  calculateTotalValue(): Promise<number>;
}

export interface ISalesRepository {
  getTopSelling(limit: number): Promise<
    {
      product: string;
      quantity: number;
    }[]
  >;
  getSalesByCashier(date: Date): Promise<
    {
      cashierId: string;
      cashierName?: string;
      totalAmount: number;
    }[]
  >;
}

export interface IPaymentRepository {
  getAllPayments(date: Date): Promise<
    {
      amount: number;
      type: string;
    }[]
  >;
}

// =====================
// Concrete Implementations (placeholders)
// =====================

class ProductRepository implements IProductRepository {
  constructor(private db: PrismaClient) {}
}

class CustomerRepository implements ICustomerRepository {
  constructor(private db: PrismaClient) {}
}

class SaleRepository implements ISaleRepository {
  constructor(private db: PrismaClient) {}
  async findByDate(_date: Date) {
    // Placeholder implementation
    return [];
  }
}

class ExpenseRepository implements IExpenseRepository {
  constructor(private db: PrismaClient) {}
  async findByDate(_date: Date) {
    // Placeholder implementation
    return [];
  }
}

class InventoryRepository implements IInventoryRepository {
  constructor(private db: PrismaClient) {}
  async findAll() {
    // Placeholder implementation
    return [];
  }
  async getLowStock() {
    // Placeholder implementation
    return [];
  }
  async countAllProducts() {
    // Placeholder implementation
    return 0;
  }
  async countOutOfStock() {
    // Placeholder implementation
    return 0;
  }
  async getLowStockCount() {
    // Placeholder implementation
    return 0;
  }
  async calculateTotalValue() {
    // Placeholder implementation
    return 0;
  }
}

class SalesRepository implements ISalesRepository {
  constructor(private db: PrismaClient) {}
  async getTopSelling(_limit: number) {
    // Placeholder implementation
    return [];
  }
  async getSalesByCashier(_date: Date) {
    // Placeholder implementation
    return [];
  }
}

class PaymentRepository implements IPaymentRepository {
  constructor(private db: PrismaClient) {}
  async getAllPayments(_date: Date) {
    // Placeholder implementation
    return [];
  }
}

// =====================
// DI Container
// =====================

export const container = {
  prisma,

  // Use getters so `container.repositories.<repo>` returns a new instance each time.
  repositories: {
    get productRepository() {
      return new ProductRepository(prisma);
    },
    get customerRepository() {
      return new CustomerRepository(prisma);
    },
    get saleRepository() {
      return new SaleRepository(prisma);
    },
    get expenseRepository() {
      return new ExpenseRepository(prisma);
    },
    get inventoryRepository() {
      return new InventoryRepository(prisma);
    },
    get salesRepository() {
      return new SalesRepository(prisma);
    },
    get paymentRepository() {
      return new PaymentRepository(prisma);
    },
  },
};