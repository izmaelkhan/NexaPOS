import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { LoginUseCase } from "../../src/application/auth/LoginUseCase";
import { RoleType } from "../../src/domain/identity/Roles";

describe("LoginUseCase", () => {
  const mockPassword = "admin123";
  let hashedPassword: string;

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash(mockPassword, 10);
  });

  const mockUser = {
    id: "user-1",
    name: "Admin",
    email: "admin@nexapos.com",
    passwordHash: "",
    role: RoleType.ADMIN,
    isActive: true,
  };

  // =====================
  // Mock Repos (IMPORTANT FIX)
  // =====================
  const createUseCase = (userRepoMock: any) => {
    const userBranchRepoMock = {
      findByUserId: jest.fn().mockResolvedValue([
        { branchId: "B1", isMain: true },
      ]),
    };

    return new LoginUseCase(userRepoMock, userBranchRepoMock);
  };

  // =====================
  // 1. DB user fetch test
  // =====================
  it("should fetch user from repository", async () => {
    const userRepo = {
      findByEmail: jest.fn().mockResolvedValue({
        ...mockUser,
        passwordHash: hashedPassword,
      }),
    };

    const useCase = createUseCase(userRepo);

    await useCase.execute({
      email: mockUser.email,
      password: mockPassword,
    });

    expect(userRepo.findByEmail).toHaveBeenCalledWith(mockUser.email);
  });

  // =====================
  // 2. valid JWT test
  // =====================
  it("should return valid JWT token", async () => {
    const userRepo = {
      findByEmail: jest.fn().mockResolvedValue({
        ...mockUser,
        passwordHash: hashedPassword,
      }),
    };

    const useCase = createUseCase(userRepo);

    const result = await useCase.execute({
      email: mockUser.email,
      password: mockPassword,
    });

    expect(result.token).toBeDefined();

    const decoded = jwt.verify(
      result.token,
      process.env.JWT_SECRET || "secret"
    ) as any;

    expect(decoded.email).toBe(mockUser.email);
    expect(decoded.role).toBe(RoleType.ADMIN);
  });

  // =====================
  // 3. invalid password test
  // =====================
  it("should throw error for invalid password", async () => {
    const userRepo = {
      findByEmail: jest.fn().mockResolvedValue({
        ...mockUser,
        passwordHash: hashedPassword,
      }),
    };

    const useCase = createUseCase(userRepo);

    await expect(
      useCase.execute({
        email: mockUser.email,
        password: "wrongpassword",
      })
    ).rejects.toThrow("Invalid credentials");
  });

  // =====================
  // 4. missing user test
  // =====================
  it("should throw error when user not found", async () => {
    const userRepo = {
      findByEmail: jest.fn().mockResolvedValue(null),
    };

    const useCase = createUseCase(userRepo);

    await expect(
      useCase.execute({
        email: "missing@nexapos.com",
        password: "123456",
      })
    ).rejects.toThrow("Invalid credentials");
  });
});