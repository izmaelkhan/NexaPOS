import { prisma } from "../database/prismaClient";
import { IUserRepository } from "../../domain/identity/IUserRepository";
import { User } from "../../domain/identity/User";
import { UserMapper } from "../mappers/UserMapper";

export class UserRepositoryImpl implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
    },
  });

  if (!user) return null;

  return UserMapper.toDomain(user);
}

  async findById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      role: true,
    },
  });

  if (!user) return null;

  return UserMapper.toDomain(user);
}

  async save(user: User): Promise<void> {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        email: user.email,
        password: user.passwordHash,
        roleId: user.roleId,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.passwordHash,
        roleId: user.roleId,
      },
    });
  }
}