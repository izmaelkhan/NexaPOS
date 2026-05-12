import {PrismaClient} from "@prisma/client";

// =====================
// Prisma instance
// =====================
const prisma = new PrismaClient();

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

  repositories: {
    productRepository: new ProductRepository(prisma),
    customerRepository: new CustomerRepository(prisma),
  },
};