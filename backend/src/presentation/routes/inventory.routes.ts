import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { RoleType } from "../../domain/identity/Roles";
import {roleGuard} from "../middleware/roleGuard";

const router = express.Router();

// =====================
// GET INVENTORY
// =====================
router.get("/", 
  authMiddleware, 
  roleGuard([RoleType.ADMIN, RoleType.MANAGER]),
  (req, res) => {
  res.json({
    message: "Inventory access granted",
    user: (req as any).user,
  });
});

// =====================
// UPDATE STOCK (example)
// =====================
router.put("/inventory/:productId", authMiddleware, (req, res) => {
  const { productId } = req.params;

  res.json({
    message: "Inventory updated successfully",
    productId,
    updatedBy: (req as any).user,
    data: req.body,
  });
});

export default router;