import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleGuard } from "../middleware/roleGuard";

import { ReceiveGoodsUseCase } from "../../application/purchases/ReceiveGoodsUseCase";
import { StockService } from "../../application/inventory/StockService";
import { RoleType } from "../../domain/identity/Roles";

const router = express.Router();

// =====================
// DEPENDENCIES (TEMP DI)
// =====================

const stockRepo = {
  createMovement: async () => {},
  getStock: async () => null,
};

const stockService = new StockService(stockRepo);

const purchaseOrderRepo = {
  save: async (data: any) => data,
};

const receiveGoodsUseCase = new ReceiveGoodsUseCase(
  stockService,
  purchaseOrderRepo
);

// =====================
// POST /purchase/create
// =====================
router.post(
  "/create",
  authMiddleware,
  roleGuard([RoleType.ADMIN, RoleType.MANAGER]),
  async (req, res) => {
    try {
      const { supplierId, branchId, items } = req.body;

      // NOTE: creation logic assumed in service layer (not shown here)
      res.json({
        message: "Purchase created",
        data: {
          supplierId,
          branchId,
          items,
          status: "DRAFT",
        },
      });
    } catch (err: any) {
      res.status(400).json({
        message: err.message,
      });
    }
  }
);

// =====================
// POST /purchase/receive
// =====================
router.post(
  "/receive",
  authMiddleware,
  roleGuard([RoleType.ADMIN, RoleType.MANAGER]),
  async (req, res) => {
    try {
      const { purchaseOrder, items } = req.body;

      const result = await receiveGoodsUseCase.execute({
        purchaseOrder,
        items,
      });

      res.json({
        message: "Goods received successfully",
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({
        message: err.message,
      });
    }
  }
);

// =====================
// POST /supplier/payment
// =====================
router.post(
  "/supplier/payment",
  authMiddleware,
  roleGuard([RoleType.ADMIN]),
  async (req, res) => {
    try {
      const { supplierId, amount } = req.body;

      // NOTE: Payment use case assumed (not shown earlier)
      res.json({
        message: "Supplier payment recorded",
        data: {
          supplierId,
          amount,
          status: "SETTLED_OR_PARTIAL",
        },
      });
    } catch (err: any) {
      res.status(400).json({
        message: err.message,
      });
    }
  }
);

export default router;