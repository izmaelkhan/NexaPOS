import express, { Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

import { GetDailySalesReportUseCase } from "../../application/reporting/GetDailySalesReportUseCase";
import { GetDailyExpenseReportUseCase } from "../../application/reporting/GetDailyExpenseReportUseCase";
import { GetDailySummaryUseCase } from "../../application/reporting/GetDailySummaryUseCase";
import { container } from "../../infrastructure/container";
import { GetDashboardSummaryUseCase } from "../../application/dashboard/GetDashboardSummaryUseCase";
import { GetTopSellingProductsUseCase } from "../../application/reporting/GetTopSellingProductsUseCase";
import { GetLowStockProductsUseCase } from "../../application/reporting/GetLowStockProductsUseCase";
import { GetPaymentMethodReportUseCase } from "../../application/reporting/GetPaymentMethodReportUseCase";
import { GetSalesByCashierUseCase } from "../../application/reporting/GetSalesByCashierUseCase";
import { GetCustomerAnalyticsUseCase } from "../../application/reporting/GetCustomerAnalyticsUseCase";
import { GetInventoryAnalyticsUseCase } from "../../application/reporting/GetInventoryAnalyticsUseCase";

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

// Dashboard summary
router.get('/dashboard', async (req, res) => {
  const useCase = new GetDashboardSummaryUseCase(
    container.repositories.saleRepository,
    container.repositories.expenseRepository,
    container.repositories.inventoryRepository,
    container.repositories.customerRepository
  );
  const result = await useCase.execute();
  res.json(result);
});

// Top selling products
router.get('/reports/top-products', async (req, res) => {
  const useCase = new GetTopSellingProductsUseCase(container.repositories.salesRepository);
  const result = await useCase.execute();
  res.json(result);
});

// Low stock report
router.get('/reports/low-stock', async (req, res) => {
  const useCase = new GetLowStockProductsUseCase(container.repositories.inventoryRepository);
  const result = await useCase.execute();
  res.json(result);
});

// Payment method report
router.get('/reports/payment-methods', async (req, res) => {
  const useCase = new GetPaymentMethodReportUseCase(container.repositories.paymentRepository);
  const result = await useCase.execute();
  res.json(result);
});

// Sales by cashier report
router.get('/reports/sales-by-cashier', async (req, res) => {
  const useCase = new GetSalesByCashierUseCase(container.repositories.salesRepository);
  const result = await useCase.execute();
  res.json(result);
});

// Customer analytics report
router.get('/reports/customer-analytics', async (req, res) => {
  const useCase = new GetCustomerAnalyticsUseCase(container.repositories.customerRepository);
  const result = await useCase.execute();
  res.json(result);
});

// Inventory analytics report
router.get('/reports/inventory-analytics', async (req, res) => {
  const useCase = new GetInventoryAnalyticsUseCase(container.repositories.inventoryRepository);
  const result = await useCase.execute();
  res.json(result);
});


