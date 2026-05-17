import express from "express";
import { LoginController } from "../auth/login.controller";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl";
import { LoginUseCase } from "../../application/auth/LoginUseCase";

const router = express.Router();

// DI setup
const userRepo = new UserRepositoryImpl();
const loginUseCase = new LoginUseCase(userRepo);
const controller = new LoginController(loginUseCase);

// route binding
router.post("/login", controller.handle);

export default router;