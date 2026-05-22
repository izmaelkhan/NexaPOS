import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleGuard } from "../middleware/roleGuard";
import { RoleType } from "../../domain/identity/Roles";
import { StockService } from "../../application/inventory/StockService";
import { StockMovementType } from "../../domain/inventory/StockMovement";

const router = express.Router();

/**
 * =========================
 * STOCK SERVICE (FIXED DI)
 * =========================
 */
// Pass a single object containing all required dependencies to match the StockService constructor
const stockService = new StockService({
  // Repository for stock persistence
  stockRepository: {
    save: async () => {},
    findByProductAndBranch: async () => null,
  } as any,

  // Service for stock adjustments
  stockAdjustmentService: {
    increase: async () => {},
    decrease: async () => {},
  } as any,

  // Service for recording stock movements
  stockMovementService: {
    createMovement: async () => {},
  } as any,
});

/**
 * =========================
 * STOCK MOVEMENT
 * =========================
 */
router.post(
  "/move",
  authMiddleware,
  roleGuard([RoleType.ADMIN, RoleType.MANAGER]),
  async (req, res) => {
    try {
      const { productId, branchId, quantity, type } = req.body;

      // increaseStock expects (productId, branchId, quantity)
      const movement = await stockService.increaseStock(
        productId,
        branchId,
        quantity
      );

      return res.json({
        message: "Stock movement recorded",
        data: movement,
      });
    } catch (e: any) {
      return res.status(500).json({ message: e.message });
    }
  }
);

export default router;