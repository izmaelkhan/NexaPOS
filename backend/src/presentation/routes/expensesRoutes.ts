import express, { Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

import { CreateExpenseUseCase } from "../../application/expenses/CreateExpenseUseCase";

const router = express.Router();

// Replace these with your actual implementations
const expenseRepository: any = {};
const cashDrawerService: any = {};
const auditLogger: any = {};

const createExpenseUseCase = new CreateExpenseUseCase(
  expenseRepository,
  cashDrawerService,
  auditLogger
);

/**
 * POST /expenses
 */
router.post(
  "/",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const expense = await createExpenseUseCase.execute(req.body);

      return res.status(201).json({
        message: "Expense created successfully",
        data: expense,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
);

/**
 * GET /expenses
 */
router.get(
  "/",
  authMiddleware,
  async (_req: Request, res: Response) => {
    try {
      const expenses = await expenseRepository.findAll();

      return res.json({
        data: expenses,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
);

export default router;