import express from "express";
import { LoginController } from "../auth/login.controller";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl";
import { LoginUseCase } from "../../application/auth/LoginUseCase";

// (NEW) branch repo placeholder (create real later)
class UserBranchRepositoryImpl {
  async findByUserId(userId: string) {
    return [
      {
        branchId: "b1",
        isMain: true,
      },
    ];
  }
}

const router = express.Router();

// =====================
// DI setup
// =====================
const userRepo = new UserRepositoryImpl();
const userBranchRepo = new UserBranchRepositoryImpl();

const loginUseCase = new LoginUseCase(userRepo, userBranchRepo);

// ⚠️ IMPORTANT: controller should accept usecase
const controller = new LoginController(loginUseCase);

// route binding
router.post("/login", controller.handle);

export default router;