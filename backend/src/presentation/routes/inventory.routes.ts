import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleGuard } from "../middleware/roleGuard";
import { StockService } from "../../application/inventory/StockService";
import { StockMovementType } from "../../domain/inventory/StockMovement";
import { RoleType } from "../../domain/identity/Roles";


const router = express.Router();

const stockService = new StockService({
  save: async (movement) => {
    // TEMP: replace with repository later
    console.log("movement saved:", movement);
  },
});

/**
 * =========================
 * STOCK MOVEMENT
 * /inventory/move
 * =========================
 */
router.post(
  "/move",
  authMiddleware,
  roleGuard([RoleType.ADMIN, RoleType.MANAGER]),
  async (req, res) => {
    const { productId, branchId, quantity, type } = req.body;

    const movement = await stockService.increaseStock({
      productId,
      branchId,
      quantity,
      type: type || StockMovementType.IN,
    });

    res.json({
      message: "Stock movement recorded",
      data: movement,
    });
  }
);

export default router;