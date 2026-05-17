import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleGuard } from "../middleware/roleGuard";
import { RoleType } from "../../domain/identity/Roles";

const router = express.Router();

// =====================
// GET ALL SALES
// =====================
router.get("/", 
  authMiddleware,
  roleGuard([RoleType.ADMIN, RoleType.CASHIER]),
  
  (req, res) => {
  res.json({
    message: "Sales access granted",
    user: (req as any).user,
  });
});

// =====================
// CREATE SALE
// =====================
router.post("/sales", authMiddleware, (req, res) => {
  res.json({
    message: "Sale created successfully",
    user: (req as any).user,
    data: req.body,
  });
});

export default router;