import express, { Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

import { GetDailySalesReportUseCase } from "../../application/reporting/GetDailySalesReportUseCase";
import { GetDailyExpenseReportUseCase } from "../../application/reporting/GetDailyExpenseReportUseCase";
import { GetDailySummaryUseCase } from "../../application/reporting/GetDailySummaryUseCase";

// Replace with your actual repositories/use cases
const saleRepository: any = {};
const expenseRepository: any = {};
const returnRepository: any = {};

const salesReportUseCase =
  new GetDailySalesReportUseCase(saleRepository);

const expenseReportUseCase =
  new GetDailyExpenseReportUseCase(expenseRepository);

const summaryUseCase =
  new GetDailySummaryUseCase(
    salesReportUseCase,
    expenseReportUseCase,
    returnRepository
  );

const router = express.Router();

/**
 * GET /reports/daily-sales
 */
router.get(
  "/daily-sales",
  authMiddleware,
  async (_req: Request, res: Response) => {
    try {
      const report = await salesReportUseCase.execute();

      res.json({
        data: report,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/**
 * GET /reports/daily-expenses
 */
router.get(
  "/daily-expenses",
  authMiddleware,
  async (_req: Request, res: Response) => {
    try {
      const report =
        await expenseReportUseCase.execute();

      res.json({
        data: report,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/**
 * GET /reports/daily-summary
 */
router.get(
  "/daily-summary",
  authMiddleware,
  async (_req: Request, res: Response) => {
    try {
      const report =
        await summaryUseCase.execute();

      res.json({
        data: report,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

export default router;