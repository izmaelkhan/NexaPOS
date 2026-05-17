// Import the generated Prisma client. The client is generated under the
// "generated/prisma" directory relative to the project root.
import { PrismaClient, Prisma } from "../../generated/prisma/client";

export const prisma = new PrismaClient({
  log: ['query', 'error'],
} as Prisma.PrismaClientOptions);
// =====================
// Repositories (interfaces → implementations)
// =====================

// Example interfaces (you will create implementations later)
export interface IProductRepository {
  // define later methods
}

export interface ICustomerRepository {
  // define later methods
}

// =====================
// Concrete implementations (placeholders)
// =====================

class ProductRepository implements IProductRepository {
  constructor(private db: PrismaClient) {}
}

class CustomerRepository implements ICustomerRepository {
  constructor(private db: PrismaClient) {}
}

// =====================
// DI Container
// =====================

export const container = {
  prisma,

  // Use getters so `container.repositories.productRepository` returns an instance
  // and the underlying `ProductRepository` constructor receives the required PrismaClient.
  repositories: {
    get productRepository() {
      return new ProductRepository(prisma);
    },
    get customerRepository() {
      return new CustomerRepository(prisma);
    },
  },
};