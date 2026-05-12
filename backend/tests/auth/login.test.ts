import { LoginUseCase } from "../../src/application/auth/LoginUseCase";
import { PasswordService } from "../../src/infrastructure/security/PasswordService";

// =====================
// Mock Repository
// =====================
const mockUserRepo = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
};

// =====================
// Test Setup
// =====================
const loginUseCase = new LoginUseCase(mockUserRepo as any);

describe("Login UseCase", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // =====================
  // 1. Wrong password reject
  // =====================
  test("should reject wrong password", async () => {
    const user = {
      id: "1",
      email: "test@example.com",
      passwordHash: await PasswordService.hashPassword("correct123"),
      role: "CASHIER",
      isActive: true,
    };

    mockUserRepo.findByEmail.mockResolvedValue(user);

    await expect(
      loginUseCase.execute({
        email: "test@example.com",
        password: "wrongpassword",
      })
    ).rejects.toThrow("Invalid credentials");
  });

  // =====================
  // 2. Inactive user reject
  // =====================
  test("should reject inactive user", async () => {
    const user = {
      id: "1",
      email: "test@example.com",
      passwordHash: await PasswordService.hashPassword("correct123"),
      role: "CASHIER",
      isActive: false,
    };

    mockUserRepo.findByEmail.mockResolvedValue(user);

    await expect(
      loginUseCase.execute({
        email: "test@example.com",
        password: "correct123",
      })
    ).rejects.toThrow("User is inactive");
  });

  // =====================
  // 3. Valid login success
  // =====================
  test("should login successfully with valid credentials", async () => {
    const user = {
      id: "1",
      email: "test@example.com",
      passwordHash: await PasswordService.hashPassword("correct123"),
      role: "CASHIER",
      isActive: true,
    };

    mockUserRepo.findByEmail.mockResolvedValue(user);

    const result = await loginUseCase.execute({
      email: "test@example.com",
      password: "correct123",
    });

    expect(result).toHaveProperty("token");
    expect(result.user.email).toBe("test@example.com");
    expect(result.user.canCreateSale).toBeDefined();
  });
});