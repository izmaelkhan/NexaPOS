import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  // =====================
  // 1. CREATE ROLES
  // =====================
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN" },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: "MANAGER" },
    update: {},
    create: { name: "MANAGER" },
  });

  const cashierRole = await prisma.role.upsert({
    where: { name: "CASHIER" },
    update: {},
    create: { name: "CASHIER" },
  });

  console.log("Roles seeded");

  // =====================
  // 2. HASH PASSWORDS
  // =====================
  const adminPassword = await bcrypt.hash("admin123", 10);
  const managerPassword = await bcrypt.hash("manager123", 10);
  const cashierPassword = await bcrypt.hash("cashier123", 10);

  // =====================
  // 3. CREATE USERS
  // =====================

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@nexapos.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@nexapos.com",
      password: adminPassword,
      roleId: adminRole.id,
    },
  });

  const managerUser = await prisma.user.upsert({
    where: { email: "manager@nexapos.com" },
    update: {},
    create: {
      name: "Store Manager",
      email: "manager@nexapos.com",
      password: managerPassword,
      roleId: managerRole.id,
    },
  });

  const cashierUser = await prisma.user.upsert({
    where: { email: "cashier@nexapos.com" },
    update: {},
    create: {
      name: "Cashier User",
      email: "cashier@nexapos.com",
      password: cashierPassword,
      roleId: cashierRole.id,
    },
  });

  console.log("Users seeded:");
  console.log(adminUser.email);
  console.log(managerUser.email);
  console.log(cashierUser.email);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });